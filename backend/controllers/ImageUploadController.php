<?php

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/CloudinaryHelper.php';

class ImageUploadController {
    
    public static function upload($pdo) {
        @set_time_limit(300);
        try {
            // Accept both 'file' and 'image' field names for compatibility
            $fileKey = isset($_FILES['image']) ? 'image' : (isset($_FILES['file']) ? 'file' : null);

            if (!$fileKey || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'No file provided or upload error: ' . ($_FILES[$fileKey ?? 'file']['error'] ?? 'missing')
                ]);
            }

            $file = $_FILES[$fileKey];

            // 1. Validate file extension against strict whitelist
            $origName = $file['name'] ?? '';
            $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov', 'avi', 'webm', 'mpeg'];
            if (!in_array($ext, $allowedExtensions, true)) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Invalid file extension. Allowed: jpg, jpeg, png, webp, gif, mp4, mov, avi, webm'
                ]);
            }

            // 2. Validate real server-side magic bytes (prevent MIME spoofing)
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $detectedMime = $finfo ? finfo_file($finfo, $file['tmp_name']) : $file['type'];
            if ($finfo) {
                finfo_close($finfo);
            }

            $allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            $allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/mpeg'];
            $isVideo = in_array($detectedMime, $allowedVideoTypes, true);
            $isImage = in_array($detectedMime, $allowedImageTypes, true);

            // Validate file type
            if (!$isImage && !$isVideo) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Invalid file format. Detected type (' . htmlspecialchars($detectedMime) . ') is not an allowed image or video format.'
                ]);
            }

            // Validate file size — images max 10MB, videos max 100MB
            $maxSize = $isVideo ? (100 * 1024 * 1024) : (10 * 1024 * 1024);
            if ($file['size'] > $maxSize) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => $isVideo ? 'Video size exceeds 100MB limit' : 'Image size exceeds 10MB limit'
                ]);
            }

            // Get folder from query param
            $folder = $_GET['folder'] ?? ($isVideo ? 'hero_videos' : 'site_media');

            // Use direct CURLFile upload — no base64 conversion, memory-efficient for large videos
            $uploadedUrl = CloudinaryHelper::uploadDirect(
                $file['tmp_name'],
                $detectedMime,
                $folder,
                $isVideo ? 'video' : 'image'
            );

            if (!$uploadedUrl) {
                http_response_code(500);
                return json_encode([
                    'success' => false,
                    'error' => 'Failed to upload to Cloudinary'
                ]);
            }

            http_response_code(200);
            return json_encode([
                'success' => true,
                'url' => $uploadedUrl
            ]);

        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}
