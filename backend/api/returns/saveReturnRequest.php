<?php
require_once '../../config/database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
if (!$data || !isset($data->orderNumber)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid data"]);
    exit;
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Create table if it doesn't exist
    $sql = "CREATE TABLE IF NOT EXISTS return_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(100),
        order_date VARCHAR(50),
        reason TEXT,
        method VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);

    // Insert the new return request
    $stmt = $conn->prepare("INSERT INTO return_requests (order_number, order_date, reason, method) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $data->orderNumber, 
        $data->orderDate, 
        $data->reason, 
        $data->method ?? 'Unknown'
    ]);
    
    echo json_encode(["success" => true, "message" => "Return request saved."]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server Error: " . $e->getMessage()]);
}
?>
