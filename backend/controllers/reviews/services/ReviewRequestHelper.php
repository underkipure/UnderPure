<?php
/**
 * ReviewRequestHelper
 * Extracts routing and request parameters for reviews.
 */
class ReviewRequestHelper {
    public static function extractProductId(): ?int {
        $requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
        $pathParts = explode('/', $requestUri);
        $reviewsIndex = array_search('reviews', $pathParts);

        if ($reviewsIndex !== false && isset($pathParts[$reviewsIndex + 1]) && is_numeric($pathParts[$reviewsIndex + 1])) {
            return (int)$pathParts[$reviewsIndex + 1];
        }

        return null;
    }
}
