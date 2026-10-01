<?php

class OrderQueryService {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Get orders for the logged-in user or all orders for admin
     */
    public function getUserOrders() {
        if (!isset($_REQUEST['user']) || !isset($_REQUEST['user']['id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $userId = $_REQUEST['user']['id'];
        $isAdmin = isset($_REQUEST['user']['role']) && $_REQUEST['user']['role'] === 'admin';

        try {
            $whereClauses = [];
            $params = [];

            if (!$isAdmin) {
                $whereClauses[] = "user_id = ?";
                $params[] = $userId;
            }

            if (!empty($_GET['status']) && strtolower($_GET['status']) !== 'all') {
                $whereClauses[] = "status = ?";
                $params[] = trim($_GET['status']);
            }

            if (!empty($_GET['search'])) {
                $search = '%' . trim($_GET['search']) . '%';
                $whereClauses[] = "(id LIKE ? OR tracking_number LIKE ? OR shipping_name LIKE ? OR shipping_email LIKE ? OR shipping_phone LIKE ? OR shipping_city LIKE ?)";
                $params = array_merge($params, array_fill(0, 6, $search));
            }

            $whereSql = !empty($whereClauses) ? "WHERE " . implode(" AND ", $whereClauses) : "";

            // Total count
            $countStmt = $this->pdo->prepare("SELECT COUNT(*) FROM orders $whereSql");
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();

            // Status counts for admin tab bar
            $statusCounts = [];
            if ($isAdmin) {
                try {
                    $stStmt = $this->pdo->query("SELECT status as st, COUNT(*) as cnt FROM orders GROUP BY status");
                    $rows = $stStmt->fetchAll(\PDO::FETCH_ASSOC);
                    $totAll = 0;
                    foreach ($rows as $r) {
                        $stLower = strtolower($r['st']);
                        $statusCounts[$stLower] = (int)$r['cnt'];
                        $totAll += (int)$r['cnt'];
                    }
                    $statusCounts['all'] = $totAll;
                } catch (\Exception $e) {}
            }

            // Pagination
            $page = isset($_GET['page']) && is_numeric($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
            $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? max(1, min(500, (int)$_GET['limit'])) : ($isAdmin ? 20 : null);
            $offset = $limit !== null ? ($page - 1) * $limit : null;

            $limitSql = "";
            if ($limit !== null) {
                $limitSql = " LIMIT $limit OFFSET $offset";
            }

            $stmt = $this->pdo->prepare("SELECT * FROM orders $whereSql ORDER BY created_at DESC $limitSql");
            $stmt->execute($params);
            $orders = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            // Fetch items for each order efficiently (Fix N+1 query issue)
            $orderIds = array_column($orders, 'id');
            if (!empty($orderIds)) {
                $inQuery = implode(',', array_fill(0, count($orderIds), '?'));
                $stmtItems = $this->pdo->prepare("
                    SELECT oi.*, 
                           COALESCE(NULLIF(oi.product_name, 'Unknown Product'), p.name, oi.product_name) as product_name,
                           (SELECT image_url FROM product_images pi WHERE pi.product_id = oi.product_id ORDER BY pi.is_primary DESC, pi.id ASC LIMIT 1) as image_url
                    FROM order_items oi 
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id IN ($inQuery)
                ");
                $stmtItems->execute($orderIds);
                $allItems = $stmtItems->fetchAll(\PDO::FETCH_ASSOC);
                
                $itemsByOrder = [];
                foreach ($allItems as $item) {
                    $itemsByOrder[$item['order_id']][] = $item;
                }
                foreach ($orders as &$order) {
                    $order['items'] = $itemsByOrder[$order['id']] ?? [];
                }
            } else {
                foreach ($orders as &$order) {
                    $order['items'] = [];
                }
            }

            $hasMore = $limit !== null ? (($offset + count($orders)) < $total) : false;
            $totalPages = $limit !== null ? (int)ceil($total / $limit) : 1;

            http_response_code(200);
            echo json_encode([
                'orders' => $orders,
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'totalPages' => $totalPages,
                'hasMore' => $hasMore,
                'statusCounts' => $statusCounts
            ]);

        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }
}
