<?php
require_once __DIR__ . '/../config/db.php';

try {
    $db = new Database();
    $pdo = $db->getConnection();

    echo "Running database image fixes...\n";

    // 1. Fix Category 9 image (Bras)
    $catQuery = "UPDATE categories SET image_url = 'https://res.cloudinary.com/dcdogxx8v/image/upload/v1778612138/vehtb2iko53xswj2qwux.jpg' WHERE id = 9";
    $pdo->exec($catQuery);
    echo "Updated Category 9 (Bras) to use padded bra image.\n";

    // 2. Fix Product 12, 13, 14 primary images to use the valid sports bra image
    $prodQuery = "UPDATE product_images SET image_url = 'https://res.cloudinary.com/dcdogxx8v/image/upload/v1778594361/k1e6nznbrlxdwcyl3bsn.jpg' WHERE product_id IN (12, 13, 14) AND is_primary = 1";
    $pdo->exec($prodQuery);
    echo "Updated Product 12, 13, 14 primary images to use valid sports bra image.\n";

    // 3. Delete broken non-primary images for Product 12, 13, 14 to avoid console errors
    $stmt = $pdo->query("SELECT id, image_url FROM product_images WHERE product_id IN (12, 13, 14) AND is_primary = 0");
    $brokenCount = 0;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (checkUrl($row['image_url']) !== 200) {
            $pdo->exec("DELETE FROM product_images WHERE id = {$row['id']}");
            echo "Deleted broken thumbnail image ID {$row['id']}: {$row['image_url']}\n";
            $brokenCount++;
        }
    }
    echo "Deleted {$brokenCount} broken thumbnails.\n";

    echo "Database image fixes completed successfully!\n";
} catch (\PDOException $e) {
    echo "Database fix failed: " . $e->getMessage() . "\n";
}

function checkUrl($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $code;
}
