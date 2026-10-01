<?php

require_once __DIR__ . '/ProductImageService.php';
require_once __DIR__ . '/ProductInventoryService.php';
require_once __DIR__ . '/../../../helpers/PushNotificationHelper.php';
require_once __DIR__ . '/../../../helpers/CacheHelper.php';

class ProductMutationService {
    private $pdo;
    private $imageService;
    private $inventoryService;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->imageService = new ProductImageService($pdo);
        $this->inventoryService = new ProductInventoryService($pdo);
    }

    /**
     * POST /api/products
     * Admin protected endpoint to create a new product and upload images to Cloudinary.
     */
    public function create() {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            $data = $_POST;
        }

        if (empty($data['name']) || empty($data['slug']) || !isset($data['price'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: name, slug, price']);
            return;
        }

        try {
            list($categoryId, $categoryIdsStr) = $this->resolveCategories($data);

            // Ensure unique slug for create
            $data['slug'] = $this->generateUniqueSlug($data['slug']);

            // Process and upload base64 images
            $this->imageService->processPayloadImages($data);

            // Calculate total stock
            $stockCount = $this->inventoryService->calculateStockCount($data);

            $this->pdo->beginTransaction();
            $sql = "INSERT INTO products (slug, name, description, long_description, price, original_price, stock_count, low_stock_threshold, category_id, category_ids, badge, sizes, colors, inventory, featured, fabric_composition, care_instructions) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                $data['slug'],
                $data['name'],
                $data['description'] ?? null,
                $data['longDescription'] ?? null,
                $data['price'],
                $data['originalPrice'] ?? null,
                $stockCount,
                $data['lowStockThreshold'] ?? 5,
                $categoryId,
                $categoryIdsStr,
                $data['badge'] ?? null,
                isset($data['sizes']) ? json_encode($data['sizes']) : null,
                isset($data['colors']) ? json_encode($data['colors']) : null,
                isset($data['inventory']) ? json_encode($data['inventory']) : null,
                $data['featured'] ?? 0,
                $data['fabricComposition'] ?? null,
                $data['careInstructions'] ?? null
            ]);

            $productId = $this->pdo->lastInsertId();

            // Insert into product_details table
            $pdStmt = $this->pdo->prepare("
                INSERT INTO product_details (product_id, description, long_description, sizes, colors, inventory, fabric_composition, care_instructions)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    description = VALUES(description),
                    long_description = VALUES(long_description),
                    sizes = VALUES(sizes),
                    colors = VALUES(colors),
                    inventory = VALUES(inventory),
                    fabric_composition = VALUES(fabric_composition),
                    care_instructions = VALUES(care_instructions)
            ");
            $pdStmt->execute([
                $productId,
                $data['description'] ?? null,
                $data['longDescription'] ?? null,
                isset($data['sizes']) ? json_encode($data['sizes']) : null,
                isset($data['colors']) ? json_encode($data['colors']) : null,
                isset($data['inventory']) ? json_encode($data['inventory']) : null,
                $data['fabricComposition'] ?? null,
                $data['careInstructions'] ?? null
            ]);

            // Sync images in product_images table
            $this->imageService->syncProductImages($productId, $data, false);

            $this->pdo->commit();
            CacheHelper::invalidate('products_');
            CacheHelper::invalidate('product_');

            // Trigger Notification
            try {
                $notifTitle = "New Product Added! ✦";
                $notifMsg = "Check out our latest addition: " . $data['name'] . ". Get yours now!";
                $notifType = "product";
                $notifLink = "/product/" . $data['slug'];
                $notifStmt = $this->pdo->prepare("INSERT INTO notifications (title, message, type, link) VALUES (?, ?, ?, ?)");
                $notifStmt->execute([$notifTitle, $notifMsg, $notifType, $notifLink]);

                // Broadcast Web Push Notification
                PushNotificationHelper::send($notifTitle, $notifMsg, $notifLink);
            } catch (\Exception $ne) {
                error_log("Failed to insert or send notification for new product: " . $ne->getMessage());
            }

            http_response_code(201);
            echo json_encode(['message' => 'Product created successfully', 'product_id' => $productId]);
        } catch (\Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            error_log("Failed to create product: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'error' => 'Failed to create product',
                'details' => $e->getMessage(),
                'received_data' => $data
            ]);
        }
    }

    /**
     * PUT /api/products/:id
     * Admin protected endpoint to update product.
     */
    public function update($id) {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            $data = $_POST;
        }

        if (empty($data['name']) || empty($data['slug']) || !isset($data['price'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: name, slug, price']);
            return;
        }

        $oldProduct = null;
        try {
            $stmtOld = $this->pdo->prepare("SELECT name, price, original_price, slug FROM products WHERE id = ?");
            $stmtOld->execute([$id]);
            $oldProduct = $stmtOld->fetch(PDO::FETCH_ASSOC);
        } catch (\Exception $e) {
            error_log("Failed to fetch old product details: " . $e->getMessage());
        }

        try {
            list($categoryId, $categoryIdsStr) = $this->resolveCategories($data);

            // Ensure unique slug for update (excluding current product)
            $data['slug'] = $this->generateUniqueSlug($data['slug'], $id);

            // Process and upload base64 images
            $this->imageService->processPayloadImages($data);

            // Calculate total stock
            $stockCount = $this->inventoryService->calculateStockCount($data);

            $this->pdo->beginTransaction();
            $sql = "UPDATE products SET slug = ?, name = ?, description = ?, long_description = ?, price = ?, original_price = ?, stock_count = ?, low_stock_threshold = ?, category_id = ?, category_ids = ?, badge = ?, sizes = ?, colors = ?, inventory = ?, featured = ?, fabric_composition = ?, care_instructions = ? WHERE id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                $data['slug'],
                $data['name'],
                $data['description'] ?? null,
                $data['longDescription'] ?? null,
                $data['price'],
                $data['originalPrice'] ?? null,
                $stockCount,
                $data['lowStockThreshold'] ?? 5,
                $categoryId,
                $categoryIdsStr,
                $data['badge'] ?? null,
                isset($data['sizes']) ? json_encode($data['sizes']) : null,
                isset($data['colors']) ? json_encode($data['colors']) : null,
                isset($data['inventory']) ? json_encode($data['inventory']) : null,
                $data['featured'] ?? 0,
                $data['fabricComposition'] ?? null,
                $data['careInstructions'] ?? null,
                $id
            ]);

            // Upsert into product_details table
            $pdStmt = $this->pdo->prepare("
                INSERT INTO product_details (product_id, description, long_description, sizes, colors, inventory, fabric_composition, care_instructions)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    description = VALUES(description),
                    long_description = VALUES(long_description),
                    sizes = VALUES(sizes),
                    colors = VALUES(colors),
                    inventory = VALUES(inventory),
                    fabric_composition = VALUES(fabric_composition),
                    care_instructions = VALUES(care_instructions)
            ");
            $pdStmt->execute([
                $id,
                $data['description'] ?? null,
                $data['longDescription'] ?? null,
                isset($data['sizes']) ? json_encode($data['sizes']) : null,
                isset($data['colors']) ? json_encode($data['colors']) : null,
                isset($data['inventory']) ? json_encode($data['inventory']) : null,
                $data['fabricComposition'] ?? null,
                $data['careInstructions'] ?? null
            ]);

            // Sync images in product_images table (delete old ones & re-insert)
            $this->imageService->syncProductImages($id, $data, true);

            $this->pdo->commit();
            CacheHelper::invalidate('products_');
            CacheHelper::invalidate('product_');

            // Trigger discount/price drop notification if eligible
            try {
                $newPrice = (float)$data['price'];
                $newOriginalPrice = (isset($data['originalPrice']) && $data['originalPrice'] !== null) ? (float)$data['originalPrice'] : null;
                
                if ($oldProduct) {
                    $oldPrice = (float)$oldProduct['price'];
                    
                    // Trigger if selling price has dropped and is currently discounted
                    if ($newPrice < $oldPrice && $newOriginalPrice !== null && $newPrice < $newOriginalPrice) {
                        $notifTitle = "Price Drop! ✦ Special Discount";
                        $notifMsg = "Great news! " . $data['name'] . " is now discounted to Rs. " . number_format($newPrice, 2) . ". Don't miss out!";
                        $notifType = "discount";
                        $notifLink = "/product/" . $data['slug'];
                        
                        $notifStmt = $this->pdo->prepare("INSERT INTO notifications (title, message, type, link) VALUES (?, ?, ?, ?)");
                        $notifStmt->execute([$notifTitle, $notifMsg, $notifType, $notifLink]);

                        // Broadcast Web Push Notification
                        PushNotificationHelper::send($notifTitle, $notifMsg, $notifLink);
                    }
                }
            } catch (\Exception $ne) {
                error_log("Failed to insert or send discount notification: " . $ne->getMessage());
            }

            http_response_code(200);
            echo json_encode(['message' => 'Product updated successfully', 'product_id' => $id]);
        } catch (\Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            error_log("Failed to update product: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update product', 'details' => $e->getMessage()]);
        }
    }

    /**
     * DELETE /api/products/:id
     * Admin protected endpoint to delete product and associated images.
     */
    public function delete($id) {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        try {
            $this->pdo->beginTransaction();

            // 1. Fetch images to delete from Cloudinary
            $stmt = $this->pdo->prepare("SELECT image_url FROM product_images WHERE product_id = ?");
            $stmt->execute([$id]);
            $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 2. Delete product from database (cascade deletes product_images due to foreign key)
            $stmt = $this->pdo->prepare("DELETE FROM products WHERE id = ?");
            $stmt->execute([$id]);

            $this->pdo->commit();
            CacheHelper::invalidate('products_');
            CacheHelper::invalidate('product_');

            // 3. Delete images from Cloudinary securely via backend
            foreach ($images as $img) {
                if (!empty($img['image_url'])) {
                    CloudinaryHelper::deleteImage($img['image_url']);
                }
            }

            http_response_code(200);
            echo json_encode(['message' => 'Product and associated images deleted successfully']);
        } catch (\Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete product']);
        }
    }

    private function resolveCategories($data) {
        $categoryId = null;
        if (!empty($data['category'])) {
            $categorySlug = trim($data['category']);
            $stmt = $this->pdo->prepare("SELECT id FROM categories WHERE TRIM(slug) = ? OR id = ?");
            $stmt->execute([$categorySlug, $categorySlug]);
            $catRow = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($catRow) {
                $categoryId = $catRow['id'];
            }
        }

        $categoryIdsStr = null;
        if (!empty($data['category_ids']) && is_array($data['category_ids'])) {
            $cleanIds = array_map('intval', $data['category_ids']);
            $cleanIds = array_filter($cleanIds, function($val) { return $val > 0; });
            if (!empty($cleanIds)) {
                $categoryIdsStr = implode(',', $cleanIds);
            }
        }
        if ($categoryIdsStr === null && $categoryId !== null) {
            $categoryIdsStr = (string)$categoryId;
        }

        return [$categoryId, $categoryIdsStr];
    }

    private function generateUniqueSlug($initialSlug, $excludeId = null) {
        $originalSlug = rtrim($initialSlug, '-');
        $slug = $originalSlug;
        $slugSuffix = 1;

        while (true) {
            if ($excludeId !== null) {
                $checkStmt = $this->pdo->prepare("SELECT COUNT(*) FROM products WHERE slug = ? AND id != ?");
                $checkStmt->execute([$slug, $excludeId]);
            } else {
                $checkStmt = $this->pdo->prepare("SELECT COUNT(*) FROM products WHERE slug = ?");
                $checkStmt->execute([$slug]);
            }

            if ($checkStmt->fetchColumn() == 0) {
                break;
            }
            $slug = $originalSlug . '-' . $slugSuffix;
            $slugSuffix++;
        }

        return $slug;
    }

    private function checkAdmin() {
        if (isset($_REQUEST['user'])) {
            if (isset($_REQUEST['user']['role']) && $_REQUEST['user']['role'] === 'admin') {
                return true;
            } elseif (isset($_REQUEST['user']['id'])) {
                $stmt = $this->pdo->prepare("SELECT is_admin FROM users WHERE id = ?");
                $stmt->execute([$_REQUEST['user']['id']]);
                $dbUser = $stmt->fetch(\PDO::FETCH_ASSOC);
                if ($dbUser && (bool)$dbUser['is_admin']) {
                    return true;
                }
            }
        }
        return false;
    }
}
