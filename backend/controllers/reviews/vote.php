<?php
require_once __DIR__ . '/../../config/db.php';

$db = new Database();
$conn = $db->getConnection();

$reviewId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if (!$reviewId) {
    echo json_encode(["error" => "Review ID is required"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$type = isset($input['type']) ? $input['type'] : '';

if ($type !== 'up' && $type !== 'down') {
    echo json_encode(["error" => "Invalid vote type. Use 'up' or 'down'."]);
    exit();
}

try {
    if ($type === 'up') {
        $query = "UPDATE reviews SET helpful_votes = helpful_votes + 1 WHERE id = :id";
    } else {
        $query = "UPDATE reviews SET unhelpful_votes = unhelpful_votes + 1 WHERE id = :id";
    }
    
    $stmt = $conn->prepare($query);
    $stmt->execute([':id' => $reviewId]);
    
    // Fetch updated counts
    $stmt = $conn->prepare("SELECT helpful_votes, unhelpful_votes FROM reviews WHERE id = :id");
    $stmt->execute([':id' => $reviewId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "helpful_votes" => (int)$result['helpful_votes'],
        "unhelpful_votes" => (int)$result['unhelpful_votes']
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update vote: " . $e->getMessage()]);
}
