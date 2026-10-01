<?php
/**
 * ReviewMutationService
 * Handles create, update, and delete operations for product & overall reviews.
 */
class ReviewMutationService {
    public static function saveReview(PDO $conn, int $userId, array $data): array {
        $rating = isset($data['rating']) ? (int)$data['rating'] : 0;
        $comment = isset($data['comment']) ? htmlspecialchars(strip_tags(trim($data['comment'])), ENT_QUOTES, 'UTF-8') : null;
        $title = isset($data['title']) ? htmlspecialchars(strip_tags(trim($data['title'])), ENT_QUOTES, 'UTF-8') : null;
        $sizeRating = isset($data['size_rating']) ? (int)$data['size_rating'] : null;
        $ageRange = isset($data['age_range']) ? htmlspecialchars(strip_tags(trim($data['age_range'])), ENT_QUOTES, 'UTF-8') : null;
        $sizePurchased = isset($data['size_purchased']) ? htmlspecialchars(strip_tags(trim($data['size_purchased'])), ENT_QUOTES, 'UTF-8') : null;
        $trueSize = isset($data['true_size']) ? htmlspecialchars(strip_tags(trim($data['true_size'])), ENT_QUOTES, 'UTF-8') : null;
        $recommend = isset($data['recommend']) ? (int)$data['recommend'] : 1;
        $reviewProductId = isset($data['product_id']) && $data['product_id'] !== 'overall' && (int)$data['product_id'] > 0 
            ? (int)$data['product_id'] 
            : null;

        // Validation
        if (empty($rating)) {
            http_response_code(400);
            return ["error" => "Rating is required."];
        }

        if ($rating < 1 || $rating > 5) {
            http_response_code(400);
            return ["error" => "Rating must be between 1 and 5 stars."];
        }

        if ($reviewProductId) {
            $checkProduct = "SELECT id FROM products WHERE id = :pid";
            $checkStmt = $conn->prepare($checkProduct);
            $checkStmt->bindParam(':pid', $reviewProductId, PDO::PARAM_INT);
            $checkStmt->execute();

            if ($checkStmt->rowCount() === 0) {
                http_response_code(404);
                return ["error" => "Product not found."];
            }
        }

        // Cloudinary Media Upload (Image & Video)
        $mediaUrl = null;
        $mediaType = null;
        if (!empty($data['media']) && !empty($data['media_type'])) {
            set_time_limit(300); // 5 minutes execution limit for large media
            require_once __DIR__ . '/../../../helpers/CloudinaryHelper.php';
            $resourceType = ($data['media_type'] === 'video') ? 'video' : 'image';
            $uploadedUrl = CloudinaryHelper::uploadMediaBase64($data['media'], 'reviews', $resourceType);
            if ($uploadedUrl) {
                $mediaUrl = $uploadedUrl;
                $mediaType = ($resourceType === 'video') ? 'video' : 'image';
            } else {
                http_response_code(500);
                return ["error" => "Failed to upload media to Cloudinary. Please check your connection or file size/format."];
            }
        }

        // Check if user already reviewed
        if ($reviewProductId) {
            $checkReview = "SELECT id FROM reviews WHERE user_id = :uid AND product_id = :pid";
            $checkRStmt = $conn->prepare($checkReview);
            $checkRStmt->bindParam(':uid', $userId, PDO::PARAM_INT);
            $checkRStmt->bindParam(':pid', $reviewProductId, PDO::PARAM_INT);
        } else {
            $checkReview = "SELECT id FROM reviews WHERE user_id = :uid AND product_id IS NULL";
            $checkRStmt = $conn->prepare($checkReview);
            $checkRStmt->bindParam(':uid', $userId, PDO::PARAM_INT);
        }
        $checkRStmt->execute();

        if ($checkRStmt->rowCount() > 0) {
            // Update review
            if ($reviewProductId) {
                $updateQuery = "UPDATE reviews SET rating = :rating, title = :title, size_rating = :size_rating, age_range = :age_range, size_purchased = :size_purchased, true_size = :true_size, recommend = :recommend, comment = :comment, media_url = COALESCE(:media_url, media_url), media_type = COALESCE(:media_type, media_type) WHERE user_id = :uid AND product_id = :pid";
                $updateStmt = $conn->prepare($updateQuery);
                $updateStmt->bindParam(':pid', $reviewProductId, PDO::PARAM_INT);
            } else {
                $updateQuery = "UPDATE reviews SET rating = :rating, title = :title, size_rating = :size_rating, age_range = :age_range, size_purchased = :size_purchased, true_size = :true_size, recommend = :recommend, comment = :comment, media_url = COALESCE(:media_url, media_url), media_type = COALESCE(:media_type, media_type) WHERE user_id = :uid AND product_id IS NULL";
                $updateStmt = $conn->prepare($updateQuery);
            }
            $updateStmt->bindParam(':rating', $rating, PDO::PARAM_INT);
            $updateStmt->bindParam(':title', $title);
            $updateStmt->bindParam(':size_rating', $sizeRating, PDO::PARAM_INT);
            $updateStmt->bindParam(':age_range', $ageRange);
            $updateStmt->bindParam(':size_purchased', $sizePurchased);
            $updateStmt->bindParam(':true_size', $trueSize);
            $updateStmt->bindParam(':recommend', $recommend, PDO::PARAM_INT);
            $updateStmt->bindParam(':comment', $comment);
            $updateStmt->bindParam(':media_url', $mediaUrl);
            $updateStmt->bindParam(':media_type', $mediaType);
            $updateStmt->bindParam(':uid', $userId, PDO::PARAM_INT);
            $updateStmt->execute();

            return [
                "success" => true,
                "message" => "Review has been updated successfully.",
                "media_url" => $mediaUrl,
                "media_type" => $mediaType
            ];
        } else {
            // Insert new review
            $insertQuery = "INSERT INTO reviews (user_id, product_id, rating, title, size_rating, age_range, size_purchased, true_size, recommend, comment, media_url, media_type) VALUES (:uid, :pid, :rating, :title, :size_rating, :age_range, :size_purchased, :true_size, :recommend, :comment, :media_url, :media_type)";
            $insertStmt = $conn->prepare($insertQuery);
            $insertStmt->bindParam(':uid', $userId, PDO::PARAM_INT);
            $insertStmt->bindValue(':pid', $reviewProductId, $reviewProductId ? PDO::PARAM_INT : PDO::PARAM_NULL);
            $insertStmt->bindParam(':rating', $rating, PDO::PARAM_INT);
            $insertStmt->bindParam(':title', $title);
            $insertStmt->bindParam(':size_rating', $sizeRating, PDO::PARAM_INT);
            $insertStmt->bindParam(':age_range', $ageRange);
            $insertStmt->bindParam(':size_purchased', $sizePurchased);
            $insertStmt->bindParam(':true_size', $trueSize);
            $insertStmt->bindParam(':recommend', $recommend, PDO::PARAM_INT);
            $insertStmt->bindParam(':comment', $comment);
            $insertStmt->bindParam(':media_url', $mediaUrl);
            $insertStmt->bindParam(':media_type', $mediaType);
            $insertStmt->execute();

            http_response_code(201);
            return [
                "success" => true,
                "message" => "Review has been posted successfully.",
                "review" => [
                    "id" => (int)$conn->lastInsertId(),
                    "rating" => $rating,
                    "comment" => $comment,
                    "media_url" => $mediaUrl,
                    "media_type" => $mediaType
                ]
            ];
        }
    }

    public static function deleteReview(PDO $conn, int $userId, ?int $productId, bool $isOverall): array {
        if ($isOverall) {
            $deleteQuery = "DELETE FROM reviews WHERE user_id = :uid AND product_id IS NULL";
            $stmt = $conn->prepare($deleteQuery);
            $stmt->bindParam(':uid', $userId, PDO::PARAM_INT);
            $stmt->execute();
        } else {
            if (!$productId) {
                http_response_code(400);
                return ["error" => "Product ID is required for deletion."];
            }
            $deleteQuery = "DELETE FROM reviews WHERE user_id = :uid AND product_id = :pid";
            $stmt = $conn->prepare($deleteQuery);
            $stmt->bindParam(':uid', $userId, PDO::PARAM_INT);
            $stmt->bindParam(':pid', $productId, PDO::PARAM_INT);
            $stmt->execute();
        }

        return [
            "success" => true,
            "message" => "Review has been deleted successfully."
        ];
    }
}
