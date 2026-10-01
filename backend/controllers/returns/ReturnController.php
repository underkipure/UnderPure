<?php
class ReturnController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    private function requireAdmin() {
        if (!isset($_REQUEST['user']) || !isset($_REQUEST['user']['role']) || $_REQUEST['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            exit();
        }
    }

    public function index() {
        $this->requireAdmin();
        try {
            $whereClauses = ["1=1"];
            $params = [];

            if (!empty($_GET['search'])) {
                $search = '%' . trim($_GET['search']) . '%';
                $whereClauses[] = "(order_number LIKE ? OR reason LIKE ? OR method LIKE ?)";
                $params[] = $search;
                $params[] = $search;
                $params[] = $search;
            }

            if (!empty($_GET['status']) && strtolower($_GET['status']) !== 'all') {
                $whereClauses[] = "LOWER(status) = ?";
                $params[] = strtolower(trim($_GET['status']));
            }

            $whereSql = implode(" AND ", $whereClauses);

            // Total count
            $countStmt = $this->pdo->prepare("SELECT COUNT(*) FROM return_requests WHERE $whereSql");
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();

            // Pagination
            $page = isset($_GET['page']) && is_numeric($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
            $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? max(1, min(500, (int)$_GET['limit'])) : 20;
            $offset = ($page - 1) * $limit;

            $stmt = $this->pdo->prepare("SELECT * FROM return_requests WHERE $whereSql ORDER BY created_at DESC LIMIT $limit OFFSET $offset");
            $stmt->execute($params);
            $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $hasMore = ($offset + count($requests)) < $total;
            $totalPages = (int)ceil($total / $limit);

            echo json_encode([
                "success" => true,
                "requests" => $requests,
                "total" => $total,
                "page" => $page,
                "limit" => $limit,
                "totalPages" => $totalPages,
                "hasMore" => $hasMore
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch return requests: " . $e->getMessage()]);
        }
    }

    public function create() {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['orderNumber'])) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid data"]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("INSERT INTO return_requests (order_number, order_date, reason, method) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['orderNumber'],
                $data['orderDate'] ?? '',
                $data['reason'] ?? '',
                $data['method'] ?? 'Unknown'
            ]);
            http_response_code(201);
            echo json_encode(["success" => true, "message" => "Return request saved."]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save return request: " . $e->getMessage()]);
        }
    }

    public function updateStatus($id) {
        $this->requireAdmin();
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['status'])) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid data"]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("UPDATE return_requests SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $id]);
            echo json_encode(["success" => true, "message" => "Status updated."]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update status: " . $e->getMessage()]);
        }
    }
}
