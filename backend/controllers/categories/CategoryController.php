<?php
require_once __DIR__ . '/../../helpers/CacheHelper.php';

class CategoryController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    private function autoMigrate() {
        try {
            static $migrated = false;
            if ($migrated) return;
            $cols = $this->pdo->query("DESCRIBE categories")->fetchAll(PDO::FETCH_COLUMN);
            $schema = [
                'image_url'      => 'VARCHAR(512) DEFAULT NULL',
                'is_visible'     => 'TINYINT(1) DEFAULT 1',
                'show_image'     => 'TINYINT(1) DEFAULT 1',
                'show_in_header' => 'TINYINT(1) DEFAULT 1',
                'tab_title'      => 'VARCHAR(255) DEFAULT NULL',
                'sub_label'      => 'VARCHAR(255) DEFAULT NULL',
                'priority'       => 'INT DEFAULT 0',
                'parent_id'      => 'INT DEFAULT NULL',
                'size_class_id'  => 'INT DEFAULT NULL',
            ];
            foreach ($schema as $col => $definition) {
                if (!in_array($col, $cols)) {
                    $this->pdo->exec("ALTER TABLE categories ADD COLUMN `$col` $definition");
                }
            }
            $migrated = true;
        } catch (\Exception $e) {
            // Silently continue
        }
    }

    public function index() {
        try {
            if (CacheHelper::streamRaw('categories_list_raw', [
                'Cache-Control: public, max-age=60, stale-while-revalidate=120'
            ])) {
                return;
            }

            $sql = "SELECT id, slug, label, sub_label, tab_title, image_url, show_image, parent_id, size_class_id, priority, show_in_header, is_visible FROM categories WHERE (parent_id IS NULL OR parent_id > 0) ORDER BY priority DESC, label ASC";
            $stmt = $this->pdo->query($sql);
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Format for frontend
            $formatted = array_map(function($c) {
                return [
                    'id'           => $c['id'],
                    'slug'         => $c['slug'],
                    'name'         => $c['label'],
                    'subTitle'     => $c['sub_label'] ?? '',
                    'tabTitle'     => $c['tab_title'] ?? '',
                    'image'        => $c['image_url'] ?? '',
                    'showImage'    => isset($c['show_image']) ? (bool)$c['show_image'] : true,
                    'parentId'     => $c['parent_id'],
                    'sizeClassId'  => $c['size_class_id'],
                    'priority'     => (int)($c['priority'] ?? 0),
                    'showInHeader' => (bool)($c['show_in_header'] ?? true),
                    'isVisible'    => isset($c['is_visible']) ? (bool)$c['is_visible'] : true,
                ];
            }, $categories);

            $json = json_encode($formatted);
            CacheHelper::setRaw('categories_list_raw', $json, 600);
            CacheHelper::set('categories_list', $formatted, 600);

            if (!headers_sent()) {
                header('Cache-Control: public, max-age=60, stale-while-revalidate=120');
                header('Content-Type: application/json; charset=utf-8');
            }
            http_response_code(200);
            echo $json;
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch categories']);
        }
    }

    public function create() {
        $this->autoMigrate();
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['name']) || !isset($data['slug'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }

        try {
            $imageUrl = $data['image'] ?? null;
            if ($imageUrl && preg_match('/^data:image\/\w+;base64,/', $imageUrl)) {
                require_once __DIR__ . '/../../helpers/CloudinaryHelper.php';
                $uploadedUrl = CloudinaryHelper::uploadImageBase64($imageUrl, 'categories');
                if ($uploadedUrl) {
                    $imageUrl = $uploadedUrl;
                }
            }

            $sql = "INSERT INTO categories (slug, label, sub_label, tab_title, image_url, show_image, parent_id, size_class_id, priority, show_in_header, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                $data['slug'],
                $data['name'],
                $data['subTitle'] ?? null,
                $data['tabTitle'] ?? null,
                $imageUrl,
                isset($data['showImage']) ? (int)$data['showImage'] : 1,
                $data['parentId'] ?? null,
                $data['sizeClassId'] ?? null,
                $data['priority'] ?? 0,
                isset($data['showInHeader']) ? (int)$data['showInHeader'] : 1,
                isset($data['isVisible']) ? (int)$data['isVisible'] : 1,
            ]);
            $id = $this->pdo->lastInsertId();
            CacheHelper::invalidate('categories');
            CacheHelper::invalidate('products');
            
            http_response_code(201);
            echo json_encode(['id' => $id, 'message' => 'Category created']);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'error'         => 'Failed to create category',
                'details'       => $e->getMessage(),
                'sql'           => $sql,
                'received_data' => $data
            ]);
        }
    }

    public function update($id) {
        $this->autoMigrate();
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data']);
            return;
        }

        try {
            // Check old image to delete if it was changed
            $stmt = $this->pdo->prepare("SELECT image_url FROM categories WHERE id = ?");
            $stmt->execute([$id]);
            $category = $stmt->fetch(PDO::FETCH_ASSOC);

            $imageUrl = $data['image'] ?? null;
            if ($imageUrl && preg_match('/^data:image\/\w+;base64,/', $imageUrl)) {
                require_once __DIR__ . '/../../helpers/CloudinaryHelper.php';
                $uploadedUrl = CloudinaryHelper::uploadImageBase64($imageUrl, 'categories');
                if ($uploadedUrl) {
                    $imageUrl = $uploadedUrl;
                }
            }

            if ($category && !empty($category['image_url']) && isset($data['image']) && $category['image_url'] !== $imageUrl) {
                require_once __DIR__ . '/../../helpers/CloudinaryHelper.php';
                CloudinaryHelper::deleteImage($category['image_url']);
            }

            $sql = "UPDATE categories SET slug = ?, label = ?, sub_label = ?, tab_title = ?, image_url = ?, show_image = ?, parent_id = ?, size_class_id = ?, priority = ?, show_in_header = ?, is_visible = ? WHERE id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                $data['slug'] ?? '',
                $data['name'] ?? '',
                $data['subTitle'] ?? null,
                $data['tabTitle'] ?? null,
                $imageUrl,
                isset($data['showImage']) ? (int)$data['showImage'] : 1,
                $data['parentId'] ?? null,
                $data['sizeClassId'] ?? null,
                $data['priority'] ?? 0,
                isset($data['showInHeader']) ? (int)$data['showInHeader'] : 1,
                isset($data['isVisible']) ? (int)$data['isVisible'] : 1,
                $id
            ]);
            
            CacheHelper::invalidate('categories');
            CacheHelper::invalidate('products');
            
            http_response_code(200);
            echo json_encode(['message' => 'Category updated']);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update category']);
        }
    }

    public function delete($id) {
        try {
            // First get the image url of main category
            $stmt = $this->pdo->prepare("SELECT image_url FROM categories WHERE id = ?");
            $stmt->execute([$id]);
            $category = $stmt->fetch(PDO::FETCH_ASSOC);

            // Fetch and delete subcategories if any
            $stmtSub = $this->pdo->prepare("SELECT id, image_url FROM categories WHERE parent_id = ?");
            $stmtSub->execute([$id]);
            $subCategories = $stmtSub->fetchAll(PDO::FETCH_ASSOC);
            foreach ($subCategories as $sub) {
                if (!empty($sub['image_url'])) {
                    require_once __DIR__ . '/../../helpers/CloudinaryHelper.php';
                    CloudinaryHelper::deleteImage($sub['image_url']);
                }
            }
            $this->pdo->prepare("DELETE FROM categories WHERE parent_id = ?")->execute([$id]);

            // Delete category from database
            $stmt = $this->pdo->prepare("DELETE FROM categories WHERE id = ?");
            $stmt->execute([$id]);

            // If category had an image, delete it from Cloudinary
            if ($category && !empty($category['image_url'])) {
                require_once __DIR__ . '/../../helpers/CloudinaryHelper.php';
                CloudinaryHelper::deleteImage($category['image_url']);
            }
            
            CacheHelper::invalidate('categories');
            CacheHelper::invalidate('products');
            
            http_response_code(200);
            echo json_encode(['message' => 'Category deleted']);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete category']);
        }
    }
}
