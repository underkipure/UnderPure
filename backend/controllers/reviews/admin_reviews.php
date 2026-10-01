<?php
// Admin Reviews Controller - Admin reviews ko read, toggle/disable, aur delete kar sakta hai
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../middleware/auth.php';

// Auth Check (Must be Admin)
authMiddleware();
$role = isset($_REQUEST['user']['role']) ? $_REQUEST['user']['role'] : '';
if ($role !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "Access denied. Admin privileges required."]);
    exit;
}

$db = new Database();
$conn = $db->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Parse URL to find review ID
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', $requestUri);
$reviewsIndex = array_search('reviews', $pathParts);

$reviewId = null;
if ($reviewsIndex !== false && isset($pathParts[$reviewsIndex + 1]) && is_numeric($pathParts[$reviewsIndex + 1])) {
    $reviewId = (int)$pathParts[$reviewsIndex + 1];
}

try {
    switch ($method) {
        case 'GET':
            // Fetch all reviews in the system with server-side pagination & search
            $whereClauses = ["1=1"];
            $params = [];

            if (!empty($_GET['search'])) {
                $search = '%' . trim($_GET['search']) . '%';
                $whereClauses[] = "(r.title LIKE ? OR r.comment LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR p.name LIKE ?)";
                $params = array_merge($params, array_fill(0, 5, $search));
            }

            if (!empty($_GET['tab'])) {
                $tab = strtolower(trim($_GET['tab']));
                if ($tab === 'service') {
                    $whereClauses[] = "r.product_id IS NULL";
                } elseif ($tab === 'product') {
                    $whereClauses[] = "r.product_id IS NOT NULL";
                } elseif ($tab === 'disabled') {
                    $whereClauses[] = "r.is_disabled = 1";
                }
            }

            $whereSql = implode(" AND ", $whereClauses);

            // Total count
            $countSql = "SELECT COUNT(*) FROM reviews r JOIN users u ON r.user_id = u.id LEFT JOIN products p ON r.product_id = p.id WHERE $whereSql";
            $countStmt = $conn->prepare($countSql);
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();

            // Pagination
            $page = isset($_GET['page']) && is_numeric($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
            $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? max(1, min(500, (int)$_GET['limit'])) : 20;
            $offset = ($page - 1) * $limit;

            $query = "SELECT r.id, r.user_id, r.product_id, r.rating, r.title, r.size_rating, r.age_range, r.size_purchased, r.true_size, r.recommend, r.comment, r.media_url, r.media_type, r.is_disabled, r.created_at, 
                             u.name as user_name, u.email as user_email, p.name as product_name, p.slug as product_slug
                      FROM reviews r
                      JOIN users u ON r.user_id = u.id
                      LEFT JOIN products p ON r.product_id = p.id
                      WHERE $whereSql
                      ORDER BY r.created_at DESC
                      LIMIT $limit OFFSET $offset";
            $stmt = $conn->prepare($query);
            $stmt->execute($params);
            $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $hasMore = ($offset + count($reviews)) < $total;
            $totalPages = (int)ceil($total / $limit);

            echo json_encode([
                "success" => true,
                "reviews" => $reviews,
                "total" => $total,
                "page" => $page,
                "limit" => $limit,
                "totalPages" => $totalPages,
                "hasMore" => $hasMore
            ]);
            break;

        case 'POST':
            // Toggle active/disabled status
            if (!$reviewId) {
                http_response_code(400);
                echo json_encode(["error" => "Review ID is required."]);
                exit;
            }

            // Find current status
            $checkQuery = "SELECT is_disabled FROM reviews WHERE id = :id";
            $checkStmt = $conn->prepare($checkQuery);
            $checkStmt->bindParam(':id', $reviewId, PDO::PARAM_INT);
            $checkStmt->execute();
            $review = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if (!$review) {
                http_response_code(404);
                echo json_encode(["error" => "Review not found."]);
                exit;
            }

            $newStatus = $review['is_disabled'] ? 0 : 1;

            $updateQuery = "UPDATE reviews SET is_disabled = :status WHERE id = :id";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bindParam(':status', $newStatus, PDO::PARAM_INT);
            $updateStmt->bindParam(':id', $reviewId, PDO::PARAM_INT);
            $updateStmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Review status has been updated successfully.",
                "is_disabled" => (bool)$newStatus
            ]);
            break;

        case 'DELETE':
            if (!$reviewId) {
                http_response_code(400);
                echo json_encode(["error" => "Review ID is required."]);
                exit;
            }

            // Optional: delete image from Cloudinary if exists
            $checkQuery = "SELECT media_url FROM reviews WHERE id = :id";
            $checkStmt = $conn->prepare($checkQuery);
            $checkStmt->bindParam(':id', $reviewId, PDO::PARAM_INT);
            $checkStmt->execute();
            $review = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if (!$review) {
                http_response_code(404);
                echo json_encode(["error" => "Review not found."]);
                exit;
            }

            if (!empty($review['media_url'])) {
                require_once __DIR__ . '/../../helpers/CloudinaryHelper.php';
                CloudinaryHelper::deleteImage($review['media_url']);
            }

            $deleteQuery = "DELETE FROM reviews WHERE id = :id";
            $deleteStmt = $conn->prepare($deleteQuery);
            $deleteStmt->bindParam(':id', $reviewId, PDO::PARAM_INT);
            $deleteStmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Review has been deleted successfully."
            ]);
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed."]);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Admin reviews error: " . $e->getMessage()]);
}
