<?php
require_once __DIR__ . '/../../config/cloudinary.php';

class CloudinaryDirectUploader {
    /**
     * Uploads a file directly from its tmp_name path to Cloudinary.
     * Memory-efficient — no base64 conversion. Use for videos and large files.
     *
     * @param string $tmpPath   PHP tmp file path ($_FILES[...]['tmp_name'])
     * @param string $mimeType  MIME type of the file
     * @param string $folder    Cloudinary folder
     * @param string $resourceType 'image' or 'video'
     */
    public static function uploadDirect($tmpPath, $mimeType, $folder = 'site_media', $resourceType = 'image') {
        @set_time_limit(300);

        if (CLOUDINARY_API_KEY === 'YOUR_API_KEY_HERE' || CLOUDINARY_API_SECRET === 'YOUR_API_SECRET_HERE') {
            error_log("Cloudinary API credentials not configured.");
            return false;
        }

        if (empty($mimeType) || $mimeType === 'application/octet-stream') {
            if (function_exists('mime_content_type') && file_exists($tmpPath)) {
                $detected = @mime_content_type($tmpPath);
                if ($detected) $mimeType = $detected;
            }
        }

        $url = "https://api.cloudinary.com/v1_1/" . CLOUDINARY_CLOUD_NAME . "/" . $resourceType . "/upload";

        $timestamp = time();
        $stringToSign = "folder=" . $folder . "&timestamp=" . $timestamp . CLOUDINARY_API_SECRET;
        $signature   = sha1($stringToSign);

        $postFields = [
            'file'      => new CURLFile($tmpPath, $mimeType, basename($tmpPath)),
            'api_key'   => CLOUDINARY_API_KEY,
            'timestamp' => $timestamp,
            'signature' => $signature,
            'folder'    => $folder,
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($ch, CURLOPT_TIMEOUT, 300); // 5 min for large videos

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $result = json_decode($response, true);

        if ($httpCode == 200 && isset($result['secure_url'])) {
            return $result['secure_url'];
        }

        error_log("Cloudinary direct upload failed (HTTP $httpCode): " . $response);
        return false;
    }
}
