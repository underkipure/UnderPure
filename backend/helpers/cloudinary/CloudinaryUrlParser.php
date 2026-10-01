<?php

class CloudinaryUrlParser {
    /**
     * Extracts public_id from a Cloudinary URL
     * Example URL: https://res.cloudinary.com/dcdogxx8v/image/upload/v1714574989/underpure_preset/image_abc.jpg
     */
    public static function extractPublicId($url) {
        if (!$url || strpos($url, 'cloudinary.com') === false) {
            return false;
        }

        $parts = explode('/upload/', $url);
        if (count($parts) < 2) {
            return false;
        }

        $path = $parts[1];
        $pathParts = explode('/', $path);
        
        // Remove version string (e.g. v123456789) if present
        if (preg_match('/^v\d+$/', $pathParts[0])) {
            array_shift($pathParts);
        }
        
        $pathWithoutVersion = implode('/', $pathParts);
        
        // Remove file extension
        $publicId = preg_replace('/\.[^.]+$/', '', $pathWithoutVersion);
        
        return $publicId;
    }
}
