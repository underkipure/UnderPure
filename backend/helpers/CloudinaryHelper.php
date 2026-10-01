<?php
require_once __DIR__ . '/cloudinary/CloudinaryUrlParser.php';
require_once __DIR__ . '/cloudinary/CloudinaryDirectUploader.php';
require_once __DIR__ . '/cloudinary/CloudinaryBase64Uploader.php';
require_once __DIR__ . '/cloudinary/CloudinaryDestroyer.php';

class CloudinaryHelper {
    
    /**
     * Extracts public_id from a Cloudinary URL
     */
    public static function extractPublicId($url) {
        return CloudinaryUrlParser::extractPublicId($url);
    }

    /**
     * Uploads a file directly from its tmp_name path to Cloudinary.
     * Memory-efficient — no base64 conversion. Use for videos and large files.
     */
    public static function uploadDirect($tmpPath, $mimeType, $folder = 'site_media', $resourceType = 'image') {
        return CloudinaryDirectUploader::uploadDirect($tmpPath, $mimeType, $folder, $resourceType);
    }

    /**
     * Uploads a base64 encoded media (image or video) to Cloudinary
     */
    public static function uploadMediaBase64($base64String, $folder = 'reviews', $resourceType = 'image') {
        return CloudinaryBase64Uploader::uploadMediaBase64($base64String, $folder, $resourceType);
    }

    /**
     * Uploads a base64 encoded image to Cloudinary
     */
    public static function uploadImageBase64($base64String, $folder = 'products') {
        return CloudinaryBase64Uploader::uploadImageBase64($base64String, $folder);
    }

    /**
     * Uploads multiple base64 encoded images to Cloudinary concurrently
     */
    public static function uploadImagesBatchBase64($base64Strings, $folder = 'products') {
        return CloudinaryBase64Uploader::uploadImagesBatchBase64($base64Strings, $folder);
    }

    /**
     * Deletes an image from Cloudinary using REST API
     */
    public static function deleteImage($url) {
        return CloudinaryDestroyer::deleteImage($url);
    }
}
