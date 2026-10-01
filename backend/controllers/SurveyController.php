<?php
class SurveyController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function submit() {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->recommend_score, $data->email)) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("INSERT INTO survey_responses (recommend_score, improvement_feedback, three_words, email) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data->recommend_score,
                $data->improvement_feedback ?? null,
                $data->three_words ?? null,
                $data->email
            ]);
            
            echo json_encode(["success" => true, "message" => "Survey submitted successfully"]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to submit survey", "details" => $e->getMessage()]);
        }
    }

    private function requireAdmin() {
        if (!isset($_REQUEST['user']) || !isset($_REQUEST['user']['role']) || $_REQUEST['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            exit();
        }
    }

    public function getAll() {
        $this->requireAdmin();
        try {
            $page = max(1, intval($_GET['page'] ?? 1));
            $limit = max(1, min(100, intval($_GET['limit'] ?? 20)));
            $offset = ($page - 1) * $limit;
            $search = trim($_GET['search'] ?? '');

            // Overall stats for summary cards
            $statsStmt = $this->pdo->query("SELECT COUNT(*) as total_all, AVG(recommend_score) as overall_avg FROM survey_responses");
            $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);
            $totalSubmissions = intval($stats['total_all'] ?? 0);
            $overallAvgScore = ($stats && $stats['overall_avg'] !== null) ? round(floatval($stats['overall_avg']), 1) : 0;

            $whereClauses = [];
            $params = [];

            if ($search !== '') {
                $whereClauses[] = "(email LIKE :search OR three_words LIKE :search OR improvement_feedback LIKE :search)";
                $params[':search'] = "%$search%";
            }

            $whereSql = !empty($whereClauses) ? "WHERE " . implode(" AND ", $whereClauses) : "";

            // Total matching current search
            $countStmt = $this->pdo->prepare("SELECT COUNT(*) FROM survey_responses $whereSql");
            foreach ($params as $k => $v) {
                $countStmt->bindValue($k, $v);
            }
            $countStmt->execute();
            $total = intval($countStmt->fetchColumn());

            // Paged data
            $sql = "SELECT * FROM survey_responses $whereSql ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
            $stmt = $this->pdo->prepare($sql);
            foreach ($params as $k => $v) {
                $stmt->bindValue($k, $v);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $surveys = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $hasMore = ($offset + count($surveys)) < $total;

            echo json_encode([
                "surveys" => $surveys,
                "total" => $total,
                "totalSubmissions" => $totalSubmissions,
                "avgScore" => $overallAvgScore,
                "page" => $page,
                "limit" => $limit,
                "hasMore" => $hasMore
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch surveys", "details" => $e->getMessage()]);
        }
    }
}
