<?php
require_once __DIR__ . "/../../helpers/EmailHelper.php";

class CustomerController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * GET /api/admin/customers
     * Fetch all non-admin users with their total orders and lifetime value.
     */
    public function index() {
        // Assume authMiddleware() ran and populated $_REQUEST['user']
        if (!isset($_REQUEST['user']) || !isset($_REQUEST['user']['role']) || $_REQUEST['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        try {
            $whereClauses = ["u.is_admin = FALSE"];
            $params = [];

            if (!empty($_GET['search'])) {
                $search = '%' . trim($_GET['search']) . '%';
                $whereClauses[] = "(u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)";
                $params[] = $search;
                $params[] = $search;
                $params[] = $search;
            }

            if (isset($_GET['vip']) && $_GET['vip'] !== '' && $_GET['vip'] !== 'all') {
                if ($_GET['vip'] === 'vip' || $_GET['vip'] === '1' || $_GET['vip'] === 'true') {
                    $whereClauses[] = "u.is_vip = TRUE";
                } elseif ($_GET['vip'] === 'regular' || $_GET['vip'] === '0' || $_GET['vip'] === 'false') {
                    $whereClauses[] = "(u.is_vip = FALSE OR u.is_vip IS NULL)";
                }
            }

            $whereSql = "WHERE " . implode(" AND ", $whereClauses);

            // Total count
            $countSql = "SELECT COUNT(DISTINCT u.id) FROM users u $whereSql";
            $countStmt = $this->pdo->prepare($countSql);
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();

            // Pagination
            $page = isset($_GET['page']) && is_numeric($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
            $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? max(1, min(500, (int)$_GET['limit'])) : 20;
            $offset = ($page - 1) * $limit;

            $sql = "SELECT 
                        u.id, 
                        u.name, 
                        u.email, 
                        u.phone,
                        u.is_vip,
                        u.vip_privileges,
                        u.created_at as joined,
                        COUNT(o.id) as total_orders,
                        COALESCE(SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END), 0) as lifetime_value,
                        MAX(o.created_at) as lastOrder,
                        MAX(o.shipping_phone) as order_phone
                    FROM users u
                    LEFT JOIN orders o ON u.id = o.user_id
                    $whereSql
                    GROUP BY u.id, u.name, u.email, u.phone, u.is_vip, u.vip_privileges, u.created_at
                    ORDER BY u.created_at DESC
                    LIMIT $limit OFFSET $offset";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Format numeric values and derived fields
            foreach ($customers as &$customer) {
                $customer['orders'] = (int)$customer['total_orders'];
                $customer['totalSpent'] = (float)$customer['lifetime_value'];
                $customer['isVip'] = (bool)$customer['is_vip'];
                $customer['vipPrivileges'] = !empty($customer['vip_privileges']) ? json_decode($customer['vip_privileges'], true) : [];
                $customer['phone'] = $customer['phone'] ?: $customer['order_phone']; // Fallback to order phone if user phone is missing
                $customer['status'] = $customer['isVip'] ? 'VIP' : 'Active';
                $customer['country'] = "Pakistan";
                $customer['lastOrder'] = $customer['lastOrder'] ? substr($customer['lastOrder'], 0, 10) : "Never";
                $customer['joined'] = substr($customer['joined'], 0, 10);
            }

            $hasMore = ($offset + count($customers)) < $total;
            $totalPages = (int)ceil($total / $limit);

            http_response_code(200);
            echo json_encode([
                'customers' => $customers,
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'totalPages' => $totalPages,
                'hasMore' => $hasMore
            ]);

        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    public function promote() {
        if (!isset($_REQUEST['user']) || !isset($_REQUEST['user']['role']) || $_REQUEST['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['customer_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Customer ID is required']);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("UPDATE users SET is_vip = TRUE WHERE id = ?");
            $stmt->execute([$data['customer_id']]);
            echo json_encode(['success' => true, 'message' => 'Customer promoted to VIP']);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    public function updateVip() {
        if (!isset($_REQUEST['user']) || !isset($_REQUEST['user']['role']) || $_REQUEST['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        $customerId = $data['customer_id'] ?? $data['user_id'] ?? null;

        if (!$customerId) {
            http_response_code(400);
            echo json_encode(['error' => 'Customer ID (or user_id) is required']);
            return;
        }

        $isVip = isset($data['is_vip']) ? (bool)$data['is_vip'] : false;
        $privileges = isset($data['vip_privileges']) ? json_encode($data['vip_privileges']) : json_encode([]);

        try {
            $stmt = $this->pdo->prepare("UPDATE users SET is_vip = ?, vip_privileges = ? WHERE id = ?");
            $stmt->execute([$isVip ? 1 : 0, $privileges, $customerId]);

            // If upgraded to VIP, send email
            if ($isVip) {
                $userStmt = $this->pdo->prepare("SELECT name, email FROM users WHERE id = ?");
                $userStmt->execute([$customerId]);
                $user = $userStmt->fetch(PDO::FETCH_ASSOC);

                if ($user && !empty($user['email'])) {
                    $privArray = isset($data['vip_privileges']) ? $data['vip_privileges'] : [];
                    EmailHelper::sendVipUpgrade($user['email'], $user['name'] ?? 'Lover', $privArray);
                }
            }

            echo json_encode(['success' => true, 'message' => 'Customer VIP settings updated successfully']);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }
}

