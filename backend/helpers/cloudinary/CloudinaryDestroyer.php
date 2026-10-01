<?php
require_once __DIR__ . '/../../config/cloudinary.php';
require_once __DIR__ . '/CloudinaryUrlParser.php';

class CloudinaryDestroyer {
    /**
     * Deletes an image from Cloudinary using REST API
     */
    public static function deleteImage($url) {
        $publicId = CloudinaryUrlParser::extractPublicId($url);
        
        if (!$publicId) {
            return false;
        }

        if (CLOUDINARY_API_KEY === 'YOUR_API_KEY_HERE' || CLOUDINARY_API_SECRET === 'YOUR_API_SECRET_HERE') {
            // Cannot delete, credentials not configured
            error_log("Cloudinary API credentials not configured. Cannot delete image.");
            return false;
        }

        $timestamp = time();
        $stringToSign = "public_id=" . $publicId . "&timestamp=" . $timestamp . CLOUDINARY_API_SECRET;
        $signature = sha1($stringToSign);

        $postFields = [
            'public_id' => $publicId,
            'api_key' => CLOUDINARY_API_KEY,
            'timestamp' => $timestamp,
            'signature' => $signature
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://api.cloudinary.com/v1_1/" . CLOUDINARY_CLOUD_NAME . "/image/destroy");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postFields));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Avoid local SSL issues
        curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4); // Force IPv4 to prevent Windows DNS lookup hangs
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $result = json_decode($response, true);
        
        return $httpCode == 200 && isset($result['result']) && $result['result'] === 'ok';
    }
}
