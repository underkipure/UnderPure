<?php

class ColumnMigrations {
    public static function migrateAll(MigrationHelper $helper): void {
        $pdo = $helper->getPdo();

        // Users
        $helper->ensureColumn('users', 'google_id', 'VARCHAR(255) DEFAULT NULL');
        $helper->ensureColumn('users', 'phone', 'VARCHAR(255) DEFAULT NULL');
        $helper->ensureColumn('users', 'is_admin', 'BOOLEAN DEFAULT FALSE');
        $helper->ensureColumn('users', 'is_vip', 'BOOLEAN DEFAULT FALSE');
        $helper->ensureColumn('users', 'vip_privileges', 'TEXT DEFAULT NULL');
        $helper->ensureColumn('users', 'loyalty_points', 'INT DEFAULT 0');
        $helper->ensureColumn('users', 'otp_code', 'VARCHAR(10) DEFAULT NULL');
        $helper->ensureColumn('users', 'otp_expires_at', 'DATETIME DEFAULT NULL');
        $helper->ensureColumn('users', 'otp_attempts', 'INT DEFAULT 0');
        $helper->ensureColumn('users', 'token_version', 'INT NOT NULL DEFAULT 1');

        // Products
        $helper->ensureColumn('products', 'original_price', 'DECIMAL(10,2) DEFAULT NULL');
        $helper->ensureColumn('products', 'category_id', 'INT DEFAULT NULL');
        $helper->ensureColumn('products', 'category_ids', 'TEXT DEFAULT NULL');
        $helper->ensureColumn('products', 'stock_count', 'INT DEFAULT 0');
        $helper->ensureColumn('products', 'low_stock_threshold', 'INT DEFAULT 5');
        $helper->ensureColumn('products', 'badge', 'TEXT DEFAULT NULL');
        $helper->ensureColumn('products', 'sizes', 'LONGTEXT DEFAULT NULL');
        $helper->ensureColumn('products', 'colors', 'LONGTEXT DEFAULT NULL');
        $helper->ensureColumn('products', 'inventory', 'LONGTEXT DEFAULT NULL');
        $helper->ensureColumn('products', 'featured', 'BOOLEAN DEFAULT FALSE');
        $helper->ensureColumn('products', 'is_disabled', 'TINYINT(1) DEFAULT 0');
        $helper->ensureColumn('products', 'fabric_composition', 'VARCHAR(255) DEFAULT NULL');
        $helper->ensureColumn('products', 'care_instructions', 'VARCHAR(255) DEFAULT NULL');
        $helper->modifyColumn('products', 'badge', 'TEXT DEFAULT NULL');

        // Categories
        $helper->ensureColumn('categories', 'show_image', 'TINYINT(1) DEFAULT 1');
        $helper->ensureColumn('categories', 'is_visible', 'TINYINT(1) DEFAULT 1');
        $helper->ensureColumn('categories', 'tab_title', 'VARCHAR(255) DEFAULT NULL');
        $helper->ensureColumn('categories', 'parent_id', 'INT DEFAULT NULL');
        $helper->ensureColumn('categories', 'size_class_id', 'INT DEFAULT NULL');
        $helper->ensureColumn('categories', 'sub_label', 'VARCHAR(255) DEFAULT NULL');
        $helper->ensureColumn('categories', 'show_in_header', 'TINYINT(1) DEFAULT 1');
        $helper->ensureColumn('categories', 'priority', 'INT DEFAULT 0');
        $helper->ensureColumn('categories', 'image_url', 'VARCHAR(512) DEFAULT NULL');

        // Orders
        $helper->ensureColumn('orders', 'shipping_email', 'VARCHAR(255) NULL');
        $helper->ensureColumn('orders', 'shipping_phone', 'VARCHAR(50) NULL');
        $helper->ensureColumn('orders', 'tracking_number', 'VARCHAR(100) DEFAULT NULL');
        $helper->ensureColumn('orders', 'courier_status', 'TEXT DEFAULT NULL');
        $helper->ensureColumn('orders', 'promo_code', 'VARCHAR(50) DEFAULT NULL');
        $helper->ensureColumn('orders', 'discount', 'DECIMAL(10,2) DEFAULT 0.00');
        $helper->ensureColumn('orders', 'points_used', 'INT DEFAULT 0');
        $helper->ensureColumn('orders', 'reward_points', 'INT DEFAULT 0');
        $helper->ensureColumn('orders', 'points_awarded', 'TINYINT(1) DEFAULT 0');
        $helper->ensureColumn('orders', 'total', 'DECIMAL(10,2) NOT NULL DEFAULT 0.00');
        $helper->modifyColumn('orders', 'status', "VARCHAR(50) DEFAULT 'pending'");

        // Order items
        $helper->ensureColumn('order_items', 'color', 'VARCHAR(50) DEFAULT NULL');
        $helper->ensureColumn('order_items', 'size', 'VARCHAR(50) DEFAULT NULL');

        // Reviews
        $helper->ensureColumn('reviews', 'title', 'VARCHAR(255) NULL');
        $helper->ensureColumn('reviews', 'size_rating', 'INT NULL');
        $helper->ensureColumn('reviews', 'age_range', 'VARCHAR(50) NULL');
        $helper->ensureColumn('reviews', 'size_purchased', 'VARCHAR(50) NULL');
        $helper->ensureColumn('reviews', 'true_size', 'VARCHAR(50) NULL');
        $helper->ensureColumn('reviews', 'recommend', 'TINYINT(1) DEFAULT 1');
        $helper->ensureColumn('reviews', 'media_url', 'VARCHAR(512) NULL');
        $helper->ensureColumn('reviews', 'media_type', "ENUM('image', 'video') NULL");
        $helper->ensureColumn('reviews', 'is_disabled', 'TINYINT(1) DEFAULT 0');
        $helper->ensureColumn('reviews', 'helpful_votes', 'INT DEFAULT 0');
        $helper->ensureColumn('reviews', 'unhelpful_votes', 'INT DEFAULT 0');

        // Site settings
        $helper->modifyColumn('site_settings', 'setting_value', 'LONGTEXT');
        try {
            $pdo->exec("ALTER TABLE site_settings ADD UNIQUE (setting_key)");
        } catch (Exception $e) {}

        // Promotions
        $helper->ensureColumn('promotions', 'category_id', 'INT DEFAULT NULL');
    }
}
