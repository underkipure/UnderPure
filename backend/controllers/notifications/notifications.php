<?php
// Customer Notifications API - users can get notifications and mark them as read
require_once __DIR__ . '/../../config/db.php';

$db = new Database();
$conn = $db->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Authenticate token to fetch logged in user's read states
            require_once __DIR__ . '/../../middleware/auth.php';
            authMiddleware();
            $userId = $_REQUEST['user']['id'];

            // Fetch notifications showing read/unread status for this user
            $query = "SELECT n.id, n.title, n.message, n.type, n.link, n.created_at, 
                             COALESCE(un.is_read, 0) as is_read, un.read_at
                      FROM notifications n
                      LEFT JOIN user_notifications un ON n.id = un.notification_id AND un.user_id = :uid
                      ORDER BY n.created_at DESC";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':uid', $userId, PDO::PARAM_INT);
            $stmt->execute();
            $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Fetch unread count for badge
            $unreadQuery = "SELECT COUNT(*) as unread_count 
                            FROM notifications n
                            LEFT JOIN user_notifications un ON n.id = un.notification_id AND un.user_id = :uid
                            WHERE un.is_read IS NULL OR un.is_read = 0";
            $unreadStmt = $conn->prepare($unreadQuery);
            $unreadStmt->bindParam(':uid', $userId, PDO::PARAM_INT);
            $unreadStmt->execute();
            $unreadStats = $unreadStmt->fetch(PDO::FETCH_ASSOC);
            $unreadCount = $unreadStats ? (int)$unreadStats['unread_count'] : 0;

            echo json_encode([
                "success" => true,
                "unread_count" => $unreadCount,
                "notifications" => $notifications
            ]);
            break;

        case 'POST':
            require_once __DIR__ . '/../../middleware/auth.php';
            authMiddleware();
            $userId = $_REQUEST['user']['id'];

            $data = json_decode(file_get_contents("php://input"), true);
            $notificationId = isset($data['notification_id']) ? (int)$data['notification_id'] : null;
            $markAll = isset($data['mark_all']) ? (bool)$data['mark_all'] : false;

            if ($markAll) {
                // Mark all notifications as read for this user
                $allQuery = "SELECT id FROM notifications";
                $allStmt = $conn->prepare($allQuery);
                $allStmt->execute();
                $allNotifications = $allStmt->fetchAll(PDO::FETCH_ASSOC);

                if (!empty($allNotifications)) {
                    $insertSql = "INSERT INTO user_notifications (user_id, notification_id, is_read, read_at) VALUES ";
                    $placeholders = [];
                    $params = [];
                    foreach ($allNotifications as $idx => $notif) {
                        $placeholders[] = "(?, ?, 1, CURRENT_TIMESTAMP)";
                        $params[] = $userId;
                        $params[] = $notif['id'];
                    }
                    $insertSql .= implode(", ", $placeholders);
                    $insertSql .= " ON DUPLICATE KEY UPDATE is_read = 1, read_at = CURRENT_TIMESTAMP";
                    
                    $insertStmt = $conn->prepare($insertSql);
                    $insertStmt->execute($params);
                }

                echo json_encode([
                    "success" => true,
                    "message" => "All notifications marked as read."
                ]);
                break;
            }

            if (!$notificationId) {
                http_response_code(400);
                echo json_encode(["error" => "Notification ID is required."]);
                exit;
            }

            // Insert/Update read status for this specific notification
            $query = "INSERT INTO user_notifications (user_id, notification_id, is_read, read_at) 
                      VALUES (:uid, :nid, 1, CURRENT_TIMESTAMP) 
                      ON DUPLICATE KEY UPDATE is_read = 1, read_at = CURRENT_TIMESTAMP";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':uid', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':nid', $notificationId, PDO::PARAM_INT);
            $stmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Notification marked as read."
            ]);
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed."]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Notifications API error: " . $e->getMessage()]);
}
