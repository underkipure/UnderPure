<?php
// Database Migration - Create notifications and user_notifications tables for Customer Notification System
require_once __DIR__ . '/../config/db.php';

try {
    $db = new Database();
    $pdo = $db->getConnection();

    echo "Running in-app notifications tables migration...\n";

    // 1. Create notifications table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) NOT NULL DEFAULT 'general',
            link VARCHAR(255) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "Notifications table checked/created successfully!\n";

    // 2. Create user_notifications table (junction to track user read status)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_notifications (
            user_id INT NOT NULL,
            notification_id INT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            read_at TIMESTAMP NULL,
            PRIMARY KEY (user_id, notification_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "User notifications table checked/created successfully!\n";

    echo "In-app notifications tables migration completed successfully!\n";
} catch (\PDOException $e) {
    echo "In-app notifications migration failed: " . $e->getMessage() . "\n";
}
