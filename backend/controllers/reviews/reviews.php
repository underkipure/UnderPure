<?php
/**
 * Product & Service Reviews API Controller
 * GET = fetch reviews (public), POST = add/update review (auth), DELETE = delete review (auth)
 */
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/services/ReviewRequestHelper.php';
require_once __DIR__ . '/services/ReviewQueryService.php';
require_once __DIR__ . '/services/ReviewMutationService.php';

// Database connection
$db = new Database();
$conn = $db->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$productId = ReviewRequestHelper::extractProductId();

try {
    switch ($method) {
        // ===== GET - Reviews fetch (Public) =====
        case 'GET':
            $isOverall = isset($_GET['type']) && $_GET['type'] === 'overall';

            if ($isOverall) {
                $reviews = ReviewQueryService::getOverallReviews($conn);
                echo json_encode([
                    "success" => true,
                    "reviews" => $reviews
                ]);
                exit;
            }

            if (!$productId) {
                $reviews = ReviewQueryService::getTopGlobalReviews($conn);
                echo json_encode([
                    "success" => true,
                    "reviews" => $reviews
                ]);
                exit;
            }

            $response = ReviewQueryService::getProductReviews($conn, $productId);
            echo json_encode($response);
            break;

        // ===== POST - Add or update review (Login required) =====
        case 'POST':
            require_once __DIR__ . '/../../middleware/auth.php';
            authMiddleware();
            $userId = (int)$_REQUEST['user']['id'];

            $data = json_decode(file_get_contents("php://input"), true) ?: [];
            $result = ReviewMutationService::saveReview($conn, $userId, $data);
            echo json_encode($result);
            break;

        // ===== DELETE - Delete review (Login required) =====
        case 'DELETE':
            require_once __DIR__ . '/../../middleware/auth.php';
            authMiddleware();
            $userId = (int)$_REQUEST['user']['id'];

            $isOverall = isset($_GET['type']) && $_GET['type'] === 'overall';
            $result = ReviewMutationService::deleteReview($conn, $userId, $productId, $isOverall);
            echo json_encode($result);
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed."]);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Reviews error: " . $e->getMessage()]);
}
