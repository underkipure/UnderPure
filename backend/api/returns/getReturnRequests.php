<?php
require_once '../../config/database.php';
require_once '../../middleware/auth.php'; // ensure admin auth

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// You can verify admin token here if you want
// $user = authenticate();
// if (!$user || ($user['role'] !== 'admin' && $user['is_admin'] != 1)) {
//     http_response_code(403);
//     echo json_encode(["error" => "Unauthorized"]);
//     exit;
// }

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Create table if it doesn't exist so query doesn't fail
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

    $stmt = $conn->query("SELECT * FROM return_requests ORDER BY created_at DESC");
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["success" => true, "requests" => $requests]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server Error: " . $e->getMessage()]);
}
?>
