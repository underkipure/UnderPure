<?php
require_once '../../config/database.php';
require_once '../../middleware/auth.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
if (!$data || !isset($data->id) || !isset($data->status)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid data"]);
    exit;
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    $stmt = $conn->prepare("UPDATE return_requests SET status = ? WHERE id = ?");
    $stmt->execute([$data->status, $data->id]);
    
    echo json_encode(["success" => true, "message" => "Status updated."]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server Error: " . $e->getMessage()]);
}
?>
