<?php
require_once __DIR__ . '/../../config/cloudinary.php';

class CloudinaryBase64Uploader {
    /**
     * Uploads a base64 encoded media (image or video) to Cloudinary
     */
    public static function uploadMediaBase64($base64String, $folder = 'reviews', $resourceType = 'image') {
        if (CLOUDINARY_API_KEY === 'YOUR_API_KEY_HERE' || CLOUDINARY_API_SECRET === 'YOUR_API_SECRET_HERE') {
            error_log("Cloudinary API credentials not configured. Cannot upload media.");
            return false;
        }

        $url = "https://api.cloudinary.com/v1_1/" . CLOUDINARY_CLOUD_NAME . "/" . $resourceType . "/upload";
        
        $timestamp = time();
        $stringToSign = "folder=" . $folder . "&timestamp=" . $timestamp . CLOUDINARY_API_SECRET;
        $signature = sha1($stringToSign);

        $postFields = [
            'file' => $base64String,
            'api_key' => CLOUDINARY_API_KEY,
            'timestamp' => $timestamp,
            'signature' => $signature,
            'folder' => $folder
        ];

        // Decode base64 to temp file if it's a data URI or base64 to use CURLFile
        $tempFile = null;
        if (strpos($base64String, 'data:') === 0) {
            if (preg_match('/^data:([^;]+);base64,(.*)$/', $base64String, $matches)) {
                $mimeType = $matches[1];
                $data = base64_decode($matches[2]);
            } else {
                $mimeType = ($resourceType === 'video') ? 'video/mp4' : 'image/jpeg';
                $data = base64_decode($base64String);
            }
            
            if ($data !== false) {
                $tempFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'cloudinary_upload_' . uniqid() . ($resourceType === 'video' ? '.mp4' : '.jpg');
                if (file_put_contents($tempFile, $data) !== false) {
                    $postFields['file'] = new CURLFile($tempFile, $mimeType, basename($tempFile));
                } else {
                    $tempFile = null;
                }
            }
        } else {
            // Check if it's a raw base64 string
            $decoded = base64_decode($base64String, true);
            if ($decoded !== false && base64_encode($decoded) === $base64String) {
                $mimeType = ($resourceType === 'video') ? 'video/mp4' : 'image/jpeg';
                $tempFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'cloudinary_upload_' . uniqid() . ($resourceType === 'video' ? '.mp4' : '.jpg');
                if (file_put_contents($tempFile, $decoded) !== false) {
                    $postFields['file'] = new CURLFile($tempFile, $mimeType, basename($tempFile));
                } else {
                    $tempFile = null;
                }
            }
        }

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Avoid local SSL issues
        curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4); // Force IPv4 to prevent Windows DNS lookup hangs
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // Cleanup temp file
        if ($tempFile && file_exists($tempFile)) {
            unlink($tempFile);
        }

        $result = json_decode($response, true);
        
        if ($httpCode == 200 && isset($result['secure_url'])) {
            return $result['secure_url'];
        }
        
        error_log("Cloudinary media upload failed (HTTP $httpCode): " . $response);
        return false;
    }

    /**
     * Uploads a base64 encoded image to Cloudinary
     */
    public static function uploadImageBase64($base64String, $folder = 'products') {
        if (CLOUDINARY_API_KEY === 'YOUR_API_KEY_HERE' || CLOUDINARY_API_SECRET === 'YOUR_API_SECRET_HERE') {
            error_log("Cloudinary API credentials not configured. Cannot upload image.");
            return false;
        }

        $url = "https://api.cloudinary.com/v1_1/" . CLOUDINARY_CLOUD_NAME . "/image/upload";
        
        $timestamp = time();
        $stringToSign = "folder=" . $folder . "&timestamp=" . $timestamp . CLOUDINARY_API_SECRET;
        $signature = sha1($stringToSign);

        $postFields = [
            'file' => $base64String,
            'api_key' => CLOUDINARY_API_KEY,
            'timestamp' => $timestamp,
            'signature' => $signature,
            'folder' => $folder
        ];

        // Decode base64 to temp file if it's a data URI or base64 to use CURLFile
        $tempFile = null;
        if (strpos($base64String, 'data:') === 0) {
            if (preg_match('/^data:([^;]+);base64,(.*)$/', $base64String, $matches)) {
                $mimeType = $matches[1];
                $data = base64_decode($matches[2]);
            } else {
                $mimeType = 'image/jpeg';
                $data = base64_decode($base64String);
            }
            
            if ($data !== false) {
                $tempFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'cloudinary_upload_' . uniqid() . '.jpg';
                if (file_put_contents($tempFile, $data) !== false) {
                    $postFields['file'] = new CURLFile($tempFile, $mimeType, basename($tempFile));
                } else {
                    $tempFile = null;
                }
            }
        }

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Avoid local SSL issues
        curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4); // Force IPv4 to prevent Windows DNS lookup hangs
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // Cleanup temp file
        if ($tempFile && file_exists($tempFile)) {
            unlink($tempFile);
        }

        $result = json_decode($response, true);
        
        if ($httpCode == 200 && isset($result['secure_url'])) {
            return $result['secure_url'];
        }
        
        error_log("Cloudinary upload failed (HTTP $httpCode): " . $response);
        return false;
    }

    /**
     * Uploads multiple base64 encoded images to Cloudinary concurrently
     */
    public static function uploadImagesBatchBase64($base64Strings, $folder = 'products') {
        @set_time_limit(300);
        if (empty($base64Strings)) return [];
        
        if (CLOUDINARY_API_KEY === 'YOUR_API_KEY_HERE' || CLOUDINARY_API_SECRET === 'YOUR_API_SECRET_HERE') {
            error_log("Cloudinary API credentials not configured. Cannot upload images.");
            return array_fill(0, count($base64Strings), false);
        }

        $url = "https://api.cloudinary.com/v1_1/" . CLOUDINARY_CLOUD_NAME . "/image/upload";
        
        $multiHandle = curl_multi_init();
        $curlHandles = [];
        $results = array_fill(0, count($base64Strings), false);

        $timestamp = time();
        $stringToSign = "folder=" . $folder . "&timestamp=" . $timestamp . CLOUDINARY_API_SECRET;
        $signature = sha1($stringToSign);

        foreach ($base64Strings as $i => $base64String) {
            $postFields = [
                'file' => $base64String,
                'api_key' => CLOUDINARY_API_KEY,
                'timestamp' => $timestamp,
                'signature' => $signature,
                'folder' => $folder
            ];

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Avoid local SSL issues
            curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4); // Force IPv4 to prevent Windows DNS lookup hangs
            
            $curlHandles[$i] = $ch;
            curl_multi_add_handle($multiHandle, $ch);
        }

        $active = null;
        do {
            $mrc = curl_multi_exec($multiHandle, $active);
        } while ($mrc == CURLM_CALL_MULTI_PERFORM);

        while ($active && $mrc == CURLM_OK) {
            if (curl_multi_select($multiHandle, 0.5) == -1) {
                usleep(250);
            }
            do {
                $mrc = curl_multi_exec($multiHandle, $active);
            } while ($mrc == CURLM_CALL_MULTI_PERFORM);
        }

        foreach ($curlHandles as $i => $ch) {
            $response = curl_multi_getcontent($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            
            if ($httpCode == 200) {
                $result = json_decode($response, true);
                if (isset($result['secure_url'])) {
                    $results[$i] = $result['secure_url'];
                }
            } else {
                error_log("Cloudinary batch upload failed for index $i: " . $response);
            }
            
            curl_multi_remove_handle($multiHandle, $ch);
            curl_close($ch);
        }

        curl_multi_close($multiHandle);

        return $results;
    }
}
