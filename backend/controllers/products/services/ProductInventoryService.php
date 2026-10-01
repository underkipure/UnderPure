<?php

require_once __DIR__ . '/../../../helpers/inventory/StockReservationService.php';
require_once __DIR__ . '/../../../helpers/CacheHelper.php';

class ProductInventoryService {
    private $pdo;
    private $reservationService;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->reservationService = new StockReservationService($pdo);
    }

    /**
     * Calculate total stock count from nested inventory array or fallback stockCount.
     */
    public function calculateStockCount($data) {
        if (!empty($data['inventory']) && is_array($data['inventory'])) {
            return StockReservationService::calculateTotalStock($data['inventory']);
        }
        return isset($data['stockCount']) ? (int)$data['stockCount'] : 0;
    }

    /**
     * GET /api/inventory
     * Fetch inventory for all products (Admin only)
     */
    public function inventory() {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        $sql = "SELECT id, name, inventory, low_stock_threshold FROM products";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $inventoryList = [];
        foreach ($products as $p) {
            $inventory = !empty($p['inventory']) ? json_decode($p['inventory'], true) : [];
            $threshold = (int)($p['low_stock_threshold'] ?? 5);

            foreach ($inventory as $inv) {
                if (empty($inv['sizes']) || !is_array($inv['sizes'])) continue;
                foreach ($inv['sizes'] as $s) {
                    $stock = (int)($s['stock'] ?? 0);
                    $inventoryList[] = [
                        'productId' => $p['id'],
                        'productName' => $p['name'],
                        'color' => $inv['color'] ?? '',
                        'size' => $s['size'] ?? '',
                        'stock' => $stock,
                        'sku' => $s['sku'] ?? '',
                        'lowStock' => $stock <= $threshold
                    ];
                }
            }
        }

        http_response_code(200);
        echo json_encode($inventoryList);
    }

    /**
     * PUT /api/inventory/:productId/stock
     * Update stock for a specific product, color, and size (Admin only)
     */
    public function updateStock($productId) {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['color']) || !isset($data['size']) || !isset($data['stock'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: color, size, stock']);
            return;
        }

        try {
            $this->pdo->beginTransaction();

            $result = $this->reservationService->updateVariantStock(
                (int)$productId,
                $data['color'],
                $data['size'],
                (int)$data['stock']
            );

            if ($result['success']) {
                $this->pdo->commit();
                CacheHelper::invalidate('products_');
                CacheHelper::invalidate('product_');
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Stock updated successfully', 'stock' => $result['stock']]);
            } else {
                $this->pdo->rollBack();
                http_response_code(404);
                echo json_encode(['error' => $result['error'] ?? 'Variant not found in inventory']);
            }
        } catch (\Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update stock', 'details' => $e->getMessage()]);
        }
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
