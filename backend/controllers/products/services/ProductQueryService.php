<?php

require_once __DIR__ . '/../../../helpers/CacheHelper.php';

class ProductQueryService {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * GET /api/products
     * Fetch all products with their images, supporting filters and sorting.
     */
    public function index() {
        // High performance memory/file cache for non-search list queries
        $isSearch = !empty($_GET['search']);
        $cacheKey = !$isSearch ? ('products_query_' . md5($_SERVER['QUERY_STRING'] ?? '')) : null;

        if ($cacheKey) {
            if (CacheHelper::streamRaw($cacheKey . '_raw', [
                'Cache-Control: public, max-age=60, stale-while-revalidate=120'
            ])) {
                return;
            }
        }

        $params = [];
        $whereClauses = ["1=1"];

        // Filter by Category (pre-resolved category IDs for indexed lightning-fast filtering)
        if (!empty($_GET['category'])) {
            $catSlug = trim($_GET['category']);
            $catStmt = $this->pdo->prepare("SELECT id FROM categories WHERE slug = ? UNION SELECT id FROM categories WHERE parent_id IN (SELECT id FROM categories WHERE slug = ?)");
            $catStmt->execute([$catSlug, $catSlug]);
            $matchedCatIds = $catStmt->fetchAll(PDO::FETCH_COLUMN);

            if (!empty($matchedCatIds)) {
                $idPlaceholders = implode(',', array_fill(0, count($matchedCatIds), '?'));
                $findInSetClauses = [];
                foreach ($matchedCatIds as $cid) {
                    $findInSetClauses[] = "FIND_IN_SET(?, p.category_ids) > 0";
                }
                $whereClauses[] = "(p.category_id IN ($idPlaceholders) OR " . implode(' OR ', $findInSetClauses) . ")";
                $params = array_merge($params, $matchedCatIds, $matchedCatIds);
            } else {
                $whereClauses[] = "1=0";
            }
        }

        // Filter by Search (Name, Description, Category, Subcategory)
        if (!empty($_GET['search'])) {
            $whereClauses[] = "(
                p.name LIKE ? OR 
                p.description LIKE ? OR 
                c.label LIKE ? OR 
                c.parent_id IN (SELECT id FROM categories WHERE label LIKE ?) OR
                EXISTS (
                    SELECT 1 FROM categories c2 
                    WHERE FIND_IN_SET(c2.id, p.category_ids) > 0 
                    AND (c2.label LIKE ? OR c2.parent_id IN (SELECT id FROM categories WHERE label LIKE ?))
                )
            )";
            $searchTerm = '%' . $_GET['search'] . '%';
            $params = array_merge($params, array_fill(0, 6, $searchTerm));
        }

        // Filter by sizes (comma separated, e.g., sizes=S,M,L)
        if (!empty($_GET['sizes'])) {
            $sizes = explode(',', $_GET['sizes']);
            $sizeClauses = [];
            foreach ($sizes as $size) {
                $sizeClauses[] = "p.sizes LIKE ?";
                $params[] = '%"' . trim($size) . '"%';
            }
            if (!empty($sizeClauses)) {
                $whereClauses[] = "(" . implode(' OR ', $sizeClauses) . ")";
            }
        }

        // Filter by colors (comma separated)
        if (!empty($_GET['colors'])) {
            $colors = explode(',', $_GET['colors']);
            $colorClauses = [];
            foreach ($colors as $color) {
                $colorClauses[] = "(p.colors LIKE ? OR p.colors LIKE ?)";
                $params[] = '%"' . trim($color) . '"%';
                $params[] = '%' . trim($color) . '%';
            }
            if (!empty($colorClauses)) {
                $whereClauses[] = "(" . implode(' OR ', $colorClauses) . ")";
            }
        }

        // Filter by Price range
        if (isset($_GET['minPrice']) && is_numeric($_GET['minPrice'])) {
            $whereClauses[] = "p.price >= ?";
            $params[] = (float)$_GET['minPrice'];
        }
        if (isset($_GET['maxPrice']) && is_numeric($_GET['maxPrice'])) {
            $whereClauses[] = "p.price <= ?";
            $params[] = (float)$_GET['maxPrice'];
        }

        // Filter by Badge (case-insensitive & fuzzy dash/space handling)
        if (!empty($_GET['badge'])) {
            $badgeTerm = trim($_GET['badge']);
            $cleanBadge = str_replace(['-', ' '], '', strtolower($badgeTerm));
            $whereClauses[] = "(
                FIND_IN_SET(?, p.badge) > 0 OR 
                LOWER(p.badge) LIKE ? OR 
                LOWER(REPLACE(REPLACE(p.badge, '-', ''), ' ', '')) LIKE ?
            )";
            $params[] = $badgeTerm;
            $params[] = '%' . strtolower($badgeTerm) . '%';
            $params[] = '%' . $cleanBadge . '%';
        }

        $whereSql = implode(' AND ', $whereClauses);

        // Sorting
        $orderBy = "p.created_at DESC";
        if (!empty($_GET['sort'])) {
            switch ($_GET['sort']) {
                case 'price_asc':
                case 'price-asc':
                    $orderBy = "p.price ASC";
                    break;
                case 'price_desc':
                case 'price-desc':
                    $orderBy = "p.price DESC";
                    break;
                case 'newest':
                    $orderBy = "p.created_at DESC";
                    break;
                case 'best-selling':
                case 'best_selling':
                    $orderBy = "p.featured DESC, p.created_at DESC";
                    break;
            }
        }

        // Limit & Pagination
        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? max(1, min(1000, (int)$_GET['limit'])) : null;
        $offset = isset($_GET['offset']) && is_numeric($_GET['offset']) ? max(0, (int)$_GET['offset']) : ($limit !== null ? ($page - 1) * $limit : null);

        $limitSql = "";
        if ($limit !== null) {
            $limitSql = " LIMIT " . $limit;
            if ($offset !== null) {
                $limitSql .= " OFFSET " . $offset;
            }
        }

        // Check if caller explicitly requested full details (e.g., export or full mode)
        $isFull = !empty($_GET['full']) && $_GET['full'] == '1';

        $descriptionFields = $isFull
            ? "p.description, p.long_description as longDescription, p.fabric_composition as fabricComposition, p.care_instructions as careInstructions,"
            : "'' as description, '' as longDescription, '' as fabricComposition, '' as careInstructions,";

        // Base Query joining categories (lean columns for lightning-fast MySQL retrieval)
        $sql = "SELECT 
                    p.id, p.slug, p.name, $descriptionFields 
                    p.price, p.original_price as originalPrice, p.stock_count as stockCount, p.low_stock_threshold as lowStockThreshold, p.category_id, p.category_ids, p.badge, p.created_at,
                    p.sizes, p.colors, p.inventory, p.featured,
                    c.label as category_label, c.slug as category
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE $whereSql
                ORDER BY $orderBy
                $limitSql";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch images for the retrieved products
        if (count($products) > 0) {
            $productIds = array_column($products, 'id');
            $placeholders = implode(',', array_fill(0, count($productIds), '?'));
            
            // In lean list mode, filter out redundant non-primary color variations to save 73% database payload
            $imgFilter = !$isFull ? " AND (is_primary = 1 OR color IS NULL OR color = '')" : "";
            $imgSql = "SELECT id, product_id, image_url, color, is_primary FROM product_images WHERE product_id IN ($placeholders)$imgFilter ORDER BY product_id, is_primary DESC, id ASC";
            $imgStmt = $this->pdo->prepare($imgSql);
            $imgStmt->execute($productIds);
            $images = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

            // Group images by product_id
            $imagesByProduct = [];
            foreach ($images as $img) {
                $imagesByProduct[$img['product_id']][] = $img;
            }

            // Attach images to products and decode json
            foreach ($products as &$product) {
                $rawImages = $imagesByProduct[$product['id']] ?? [];
                
                $product['image'] = null;
                $mappedImages = [];
                foreach ($rawImages as $img) {
                    if (empty($img['color']) || $img['is_primary']) {
                        if (!in_array($img['image_url'], $mappedImages)) {
                            $mappedImages[] = $img['image_url'];
                        }
                    }
                    if ($img['is_primary']) {
                        $product['image'] = $img['image_url'];
                    }
                }

                // In lean list mode, limit mappedImages to 4 (card front, hover, mobile swipe)
                if (!$isFull && count($mappedImages) > 4) {
                    $mappedImages = array_slice($mappedImages, 0, 4);
                }
                $product['images'] = $mappedImages;
                if (empty($product['image']) && !empty($product['images'])) {
                    $product['image'] = $product['images'][0];
                }

                $product['sizes'] = !empty($product['sizes']) ? json_decode($product['sizes'], true) : [];
                $colorsParsed = !empty($product['colors']) ? json_decode($product['colors'], true) : [];
                $inventoryParsed = !empty($product['inventory']) ? json_decode($product['inventory'], true) : [];

                if (!$isFull) {
                    // Lean inventory: remove duplicate embedded images arrays to save 310KB+ of redundant network payload
                    if (is_array($inventoryParsed)) {
                        foreach ($inventoryParsed as &$inv) {
                            unset($inv['images']);
                        }
                    }
                    // Lean colors: limit embedded images to 2 (primary and hover preview for swatch interactions)
                    if (is_array($colorsParsed)) {
                        foreach ($colorsParsed as &$col) {
                            if (!empty($col['images']) && is_array($col['images'])) {
                                $col['images'] = array_slice($col['images'], 0, 2);
                            }
                        }
                    }
                }

                $product['colors'] = $colorsParsed;
                $product['inventory'] = $inventoryParsed;
                $product['category_ids'] = !empty($product['category_ids']) ? array_map('intval', explode(',', $product['category_ids'])) : [];
                $product['featured'] = (bool)$product['featured'];
                $product['lowStockThreshold'] = isset($product['lowStockThreshold']) ? (int)$product['lowStockThreshold'] : 5;
                $product['inStock'] = $product['stockCount'] === null || $product['stockCount'] > 0;
            }
        }

        $currentOffset = $offset !== null ? $offset : 0;
        
        // Smart total calculation: avoid redundant full-table count query if not paginated or last page
        if ($limit === null) {
            $total = count($products);
        } elseif ($currentOffset === 0 && count($products) < $limit) {
            $total = count($products);
        } else {
            // Count query on primary key without expensive DISTINCT hash set
            $countSql = "SELECT COUNT(p.id) FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE $whereSql";
            $countStmt = $this->pdo->prepare($countSql);
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();
        }

        $hasMore = $limit !== null ? (($currentOffset + count($products)) < $total) : false;
        $totalPages = $limit !== null ? (int)ceil($total / $limit) : 1;

        $responsePayload = [
            'products'   => $products,
            'total'      => $total,
            'page'       => $page,
            'limit'      => $limit,
            'totalPages' => $totalPages,
            'hasMore'    => $hasMore
        ];

        $json = json_encode($responsePayload);
        if ($cacheKey) {
            CacheHelper::setRaw($cacheKey . '_raw', $json, 300);
            CacheHelper::set($cacheKey, $responsePayload, 300);
        }

        if (!headers_sent()) {
            header('Cache-Control: public, max-age=60, stale-while-revalidate=120');
            header('Content-Type: application/json; charset=utf-8');
        }
        http_response_code(200);
        echo $json;
    }

    /**
     * GET /api/products/:slug
     */
    public function show($slugOrId) {
        $cacheKey = 'product_detail_' . md5($slugOrId);
        if (CacheHelper::streamRaw($cacheKey . '_raw', [
            'Cache-Control: public, max-age=60, stale-while-revalidate=120'
        ])) {
            return;
        }

        $whereField = is_numeric($slugOrId) ? "p.id = ?" : "p.slug = ?";

        $sql = "SELECT 
                    p.id, p.slug, p.name, 
                    COALESCE(pd.description, p.description) as description, 
                    COALESCE(pd.long_description, p.long_description) as longDescription, 
                    p.price, p.original_price as originalPrice, p.stock_count as stockCount, p.low_stock_threshold as lowStockThreshold, p.category_id, p.category_ids, p.badge, p.created_at,
                    COALESCE(pd.sizes, p.sizes) as sizes, 
                    COALESCE(pd.colors, p.colors) as colors, 
                    COALESCE(pd.inventory, p.inventory) as inventory, 
                    p.featured, 
                    COALESCE(pd.fabric_composition, p.fabric_composition) as fabricComposition, 
                    COALESCE(pd.care_instructions, p.care_instructions) as careInstructions,
                    c.label as category_label, c.slug as category
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN product_details pd ON p.id = pd.product_id
                WHERE $whereField";
                
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$slugOrId]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
            return;
        }

        $imgSql = "SELECT image_url, color, is_primary FROM product_images WHERE product_id = ?";
        $imgStmt = $this->pdo->prepare($imgSql);
        $imgStmt->execute([$product['id']]);
        $rawImages = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

        $product['image'] = null;
        $mappedImages = [];
        $colorImages = [];

        foreach ($rawImages as $img) {
            if (empty($img['color']) || $img['is_primary']) {
                if (!in_array($img['image_url'], $mappedImages)) {
                    $mappedImages[] = $img['image_url'];
                }
            }
            if ($img['is_primary']) {
                $product['image'] = $img['image_url'];
            }
            if (!empty($img['color'])) {
                if (!isset($colorImages[$img['color']]) || !in_array($img['image_url'], $colorImages[$img['color']])) {
                    $colorImages[$img['color']][] = $img['image_url'];
                }
            }
        }

        $product['images'] = $mappedImages;
        if (empty($product['image']) && !empty($product['images'])) {
            $product['image'] = $product['images'][0];
        }

        $product['sizes'] = !empty($product['sizes']) ? json_decode($product['sizes'], true) : [];
        $product['colors'] = !empty($product['colors']) ? json_decode($product['colors'], true) : [];
        $product['inventory'] = !empty($product['inventory']) ? json_decode($product['inventory'], true) : [];
        $product['category_ids'] = !empty($product['category_ids']) ? array_map('intval', explode(',', $product['category_ids'])) : [];
        $product['featured'] = (bool)$product['featured'];
        $product['colorImages'] = $colorImages;
        $product['inStock'] = $product['stockCount'] === null || $product['stockCount'] > 0;

        $responsePayload = ['product' => $product];
        $json = json_encode($responsePayload);
        CacheHelper::setRaw($cacheKey . '_raw', $json, 300);
        CacheHelper::set($cacheKey, $responsePayload, 300);

        if (!headers_sent()) {
            header('Cache-Control: public, max-age=60, stale-while-revalidate=120');
            header('Content-Type: application/json; charset=utf-8');
        }
        http_response_code(200);
        echo $json;
    }
}
