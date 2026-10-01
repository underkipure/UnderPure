<?php
// Database Migration - Add 'returned' order status and extend badge column length
require_once __DIR__ . '/../config/db.php';

try {
    $db = new Database();
    $pdo = $db->getConnection();

    echo "Running migrations...\n";

    // 1. Alter orders.status column
    echo "Altering orders table status column...\n";
    $pdo->exec("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned') DEFAULT 'pending'");
    echo "Successfully updated orders.status to support 'returned'!\n";

    // 2. Alter products.badge column
    echo "Altering products table badge column...\n";
    $pdo->exec("ALTER TABLE products MODIFY COLUMN badge VARCHAR(255) NULL");
    echo "Successfully extended products.badge column length to 255!\n";

    echo "All migrations completed successfully!\n";
} catch (\PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
