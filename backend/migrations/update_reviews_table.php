<?php
// Database Migration - Add new fields to reviews table for the updated UI
require_once __DIR__ . '/../config/db.php';

try {
    $db = new Database();
    $pdo = $db->getConnection();

    echo "Running reviews table update migration...\n";

    $columns = $pdo->query("DESCRIBE reviews")->fetchAll(PDO::FETCH_COLUMN);
    
    // Add 'title' column
    if (!in_array('title', $columns)) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN title VARCHAR(255) NULL AFTER rating");
        echo "Successfully added 'title' column!\n";
    }

    // Add 'size_rating' column
    if (!in_array('size_rating', $columns)) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN size_rating INT NULL AFTER title");
        echo "Successfully added 'size_rating' column!\n";
    }

    // Add 'age_range' column
    if (!in_array('age_range', $columns)) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN age_range VARCHAR(50) NULL AFTER size_rating");
        echo "Successfully added 'age_range' column!\n";
    }

    // Add 'size_purchased' column
    if (!in_array('size_purchased', $columns)) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN size_purchased VARCHAR(50) NULL AFTER age_range");
        echo "Successfully added 'size_purchased' column!\n";
    }

    // Add 'true_size' column
    if (!in_array('true_size', $columns)) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN true_size VARCHAR(50) NULL AFTER size_purchased");
        echo "Successfully added 'true_size' column!\n";
    }

    // Add 'recommend' column
    if (!in_array('recommend', $columns)) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN recommend TINYINT(1) DEFAULT 1 AFTER true_size");
        echo "Successfully added 'recommend' column!\n";
    }

    echo "Reviews table update migration completed successfully!\n";
} catch (\PDOException $e) {
    echo "Reviews update migration failed: " . $e->getMessage() . "\n";
}
