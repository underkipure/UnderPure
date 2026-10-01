<?php
// Database Migration - Create reviews table if not exists or add media_url and media_type and allow product_id to be NULL
require_once __DIR__ . '/../config/db.php';

try {
    $db = new Database();
    $pdo = $db->getConnection();

    echo "Running reviews table migration...\n";

    // 1. Create table if not exists
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id INT NULL,
            rating INT NOT NULL,
            comment TEXT NULL,
            media_url VARCHAR(512) NULL,
            media_type ENUM('image', 'video') NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "Reviews table checked/created successfully!\n";

    // 2. Double-check product_id column can be NULL (to support overall service reviews)
    try {
        $pdo->exec("ALTER TABLE reviews MODIFY COLUMN product_id INT NULL");
        echo "Successfully modified product_id to support NULL values for overall reviews!\n";
    } catch (\Exception $e) {
        echo "Note: Modify product_id to NULL column change log: " . $e->getMessage() . "\n";
    }

    // 3. Double-check media_url and media_type exist
    $columns = $pdo->query("DESCRIBE reviews")->fetchAll(PDO::FETCH_COLUMN);
    
    if (!in_array('media_url', $columns)) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN media_url VARCHAR(512) NULL AFTER comment");
        echo "Successfully added 'media_url' column!\n";
    }
    
    if (!in_array('media_type', $columns)) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN media_type ENUM('image', 'video') NULL AFTER media_url");
        echo "Successfully added 'media_type' column!\n";
    }

    echo "Reviews table migration completed successfully!\n";
} catch (\PDOException $e) {
    echo "Reviews migration failed: " . $e->getMessage() . "\n";
}
