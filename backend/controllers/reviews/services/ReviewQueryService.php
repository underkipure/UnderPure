<?php
/**
 * ReviewQueryService
 * Handles read operations for product reviews and overall service reviews.
 */
class ReviewQueryService {
    public static function getOverallReviews(PDO $conn): array {
        $query = "SELECT r.id, r.user_id, r.rating, r.title, r.size_rating, r.age_range, r.size_purchased, r.true_size, r.recommend, r.comment, r.media_url, r.media_type, r.helpful_votes, r.unhelpful_votes, r.created_at, u.name as user_name
                  FROM reviews r
                  JOIN users u ON r.user_id = u.id
                  WHERE r.product_id IS NULL AND r.is_disabled = 0
                  ORDER BY r.created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getTopGlobalReviews(PDO $conn, int $limit = 8): array {
        $query = "SELECT r.id, r.user_id, r.rating, r.title, r.size_rating, r.age_range, r.size_purchased, r.true_size, r.recommend, r.comment, r.media_url, r.media_type, r.helpful_votes, r.unhelpful_votes, r.created_at, u.name as user_name, p.name as product_name, p.slug as product_slug, 
                  (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) as product_image
                  FROM reviews r
                  JOIN users u ON r.user_id = u.id
                  LEFT JOIN products p ON r.product_id = p.id
                  WHERE r.product_id IS NULL AND r.rating >= 4 AND r.comment IS NOT NULL AND r.comment != '' AND r.is_disabled = 0
                  ORDER BY r.created_at DESC LIMIT :lim";
        $stmt = $conn->prepare($query);
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getProductReviews(PDO $conn, int $productId): array {
        // Reviews fetch with user name
        $query = "SELECT r.id, r.user_id, r.rating, r.title, r.size_rating, r.age_range, r.size_purchased, r.true_size, r.recommend, r.comment, r.media_url, r.media_type, r.helpful_votes, r.unhelpful_votes, r.created_at, u.name as user_name
                  FROM reviews r
                  JOIN users u ON r.user_id = u.id
                  WHERE r.product_id = :pid AND r.is_disabled = 0
                  ORDER BY (r.media_url IS NOT NULL) DESC, r.created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':pid', $productId, PDO::PARAM_INT);
        $stmt->execute();
        $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Average rating calculation
        $avgQuery = "SELECT COALESCE(AVG(rating), 0) as avg_rating, COUNT(*) as total_reviews 
                     FROM reviews WHERE product_id = :pid AND is_disabled = 0";
        $avgStmt = $conn->prepare($avgQuery);
        $avgStmt->bindParam(':pid', $productId, PDO::PARAM_INT);
        $avgStmt->execute();
        $stats = $avgStmt->fetch(PDO::FETCH_ASSOC);

        // Rating distribution (5 star, 4 star, etc.)
        $distQuery = "SELECT rating, COUNT(*) as count FROM reviews WHERE product_id = :pid AND is_disabled = 0 GROUP BY rating ORDER BY rating DESC";
        $distStmt = $conn->prepare($distQuery);
        $distStmt->bindParam(':pid', $productId, PDO::PARAM_INT);
        $distStmt->execute();
        $distribution = $distStmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            "success" => true,
            "product_id" => $productId,
            "avg_rating" => round((float)$stats['avg_rating'], 1),
            "total_reviews" => (int)$stats['total_reviews'],
            "rating_distribution" => $distribution,
            "reviews" => $reviews
        ];
    }
}
