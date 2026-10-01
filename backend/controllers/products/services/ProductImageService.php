<?php

require_once __DIR__ . '/../../../helpers/CloudinaryHelper.php';

class ProductImageService {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Process and batch-upload all Base64 images found in product payload to Cloudinary.
     * Updates $data in place with the resulting Cloudinary URLs.
     */
    public function processPayloadImages(&$data) {
        $imagesToUpload = [];
        $imagePointers = [];

        // 1. Inventory images
        if (!empty($data['inventory']) && is_array($data['inventory'])) {
            foreach ($data['inventory'] as $invIdx => $invItem) {
                if (!empty($invItem['images']) && is_array($invItem['images'])) {
                    foreach ($invItem['images'] as $iIdx => $imgData) {
                        if (is_string($imgData) && strpos($imgData, 'data:image') === 0) {
                            $imagesToUpload[] = $imgData;
                            $imagePointers[] = ['type' => 'inventory', 'invIdx' => $invIdx, 'iIdx' => $iIdx];
                        }
                    }
                }
            }
        }

        // 2. Color images
        if (!empty($data['colors']) && is_array($data['colors'])) {
            foreach ($data['colors'] as $cIdx => $colorObj) {
                if (!empty($colorObj['images']) && is_array($colorObj['images'])) {
                    foreach ($colorObj['images'] as $iIdx => $imgData) {
                        if (is_string($imgData) && strpos($imgData, 'data:image') === 0) {
                            $imagesToUpload[] = $imgData;
                            $imagePointers[] = ['type' => 'color', 'cIdx' => $cIdx, 'iIdx' => $iIdx];
                        }
                    }
                }
            }
        }

        // 3. Primary image
        if (!empty($data['image']) && is_string($data['image']) && strpos($data['image'], 'data:image') === 0) {
            $imagesToUpload[] = $data['image'];
            $imagePointers[] = ['type' => 'primary'];
        }

        // 4. Additional images
        if (!empty($data['additionalImages']) && is_array($data['additionalImages'])) {
            foreach ($data['additionalImages'] as $idx => $imgData) {
                if (is_string($imgData) && strpos($imgData, 'data:image') === 0) {
                    $imagesToUpload[] = $imgData;
                    $imagePointers[] = ['type' => 'additional', 'idx' => $idx];
                }
            }
        }

        // Batch upload
        if (!empty($imagesToUpload)) {
            $uploadedUrls = CloudinaryHelper::uploadImagesBatchBase64($imagesToUpload);
            foreach ($imagePointers as $k => $ptr) {
                $url = $uploadedUrls[$k] ?? null;
                if ($url) {
                    if ($ptr['type'] === 'color') {
                        $data['colors'][$ptr['cIdx']]['images'][$ptr['iIdx']] = $url;
                    } elseif ($ptr['type'] === 'inventory') {
                        $data['inventory'][$ptr['invIdx']]['images'][$ptr['iIdx']] = $url;
                    } elseif ($ptr['type'] === 'primary') {
                        $data['image'] = $url;
                    } elseif ($ptr['type'] === 'additional') {
                        $data['additionalImages'][$ptr['idx']] = $url;
                    }
                }
            }
        }

        // Clean out any remaining un-uploaded base64 strings
        if (!empty($data['colors']) && is_array($data['colors'])) {
            foreach ($data['colors'] as $k => $colorObj) {
                if (!empty($colorObj['images']) && is_array($colorObj['images'])) {
                    $cleanUrls = [];
                    foreach ($colorObj['images'] as $imgData) {
                        if (is_string($imgData) && strpos($imgData, 'data:image') !== 0) {
                            $cleanUrls[] = $imgData;
                        }
                    }
                    $data['colors'][$k]['images'] = $cleanUrls;
                }
            }
        }

        if (!empty($data['inventory']) && is_array($data['inventory'])) {
            foreach ($data['inventory'] as $k => $invItem) {
                if (!empty($invItem['images']) && is_array($invItem['images'])) {
                    $cleanUrls = [];
                    foreach ($invItem['images'] as $imgData) {
                        if (is_string($imgData) && strpos($imgData, 'data:image') !== 0) {
                            $cleanUrls[] = $imgData;
                        }
                    }
                    $data['inventory'][$k]['images'] = $cleanUrls;
                }
            }
        }

        if (!empty($data['image']) && is_string($data['image']) && strpos($data['image'], 'data:image') === 0) {
            $data['image'] = null;
        }
    }

    /**
     * Synchronize product images table for create or update.
     */
    public function syncProductImages($productId, $data, $isUpdate = false) {
        if ($isUpdate) {
            $this->pdo->prepare("DELETE FROM product_images WHERE product_id = ?")->execute([$productId]);
        }

        // Primary Image
        if (!empty($data['image']) && is_string($data['image']) && strpos($data['image'], 'data:image') !== 0) {
            $this->pdo->prepare("INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)")
                      ->execute([$productId, $data['image']]);
        }

        // Additional Images
        if (!empty($data['additionalImages']) && is_array($data['additionalImages'])) {
            foreach ($data['additionalImages'] as $url) {
                if (is_string($url) && strpos($url, 'data:image') !== 0) {
                    $this->pdo->prepare("INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 0)")
                              ->execute([$productId, $url]);
                }
            }
        }

        // Color Images
        if (!empty($data['colors']) && is_array($data['colors'])) {
            foreach ($data['colors'] as $colorObj) {
                if (!empty($colorObj['images']) && is_array($colorObj['images'])) {
                    $cName = is_string($colorObj['name'] ?? null) ? $colorObj['name'] : (is_string($colorObj['color'] ?? null) ? $colorObj['color'] : 'Default');
                    foreach ($colorObj['images'] as $url) {
                        if (is_string($url) && strpos($url, 'data:image') !== 0) {
                            $this->pdo->prepare("INSERT INTO product_images (product_id, image_url, color, is_primary) VALUES (?, ?, ?, 0)")
                                      ->execute([$productId, $url, $cName]);
                        }
                    }
                }
            }
        }
    }

    /**
     * Fetch and delete all Cloudinary images associated with a product.
     */
    public function deleteImagesFromCloudinary($productId) {
        $stmt = $this->pdo->prepare("SELECT image_url FROM product_images WHERE product_id = ?");
        $stmt->execute([$productId]);
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($images as $img) {
            if (!empty($img['image_url'])) {
                CloudinaryHelper::deleteImage($img['image_url']);
            }
        }
        return $images;
    }
}
