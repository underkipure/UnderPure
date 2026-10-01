<?php

class TableDefinitions {
    public static function createAll(MigrationHelper $helper): void {
        $helper->createTable("users", "CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            is_admin BOOLEAN DEFAULT FALSE,
            google_id VARCHAR(255) DEFAULT NULL,
            otp_code VARCHAR(10) DEFAULT NULL,
            is_vip BOOLEAN DEFAULT FALSE,
            phone VARCHAR(255) DEFAULT NULL,
            vip_privileges TEXT DEFAULT NULL,
            loyalty_points INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_user_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("size_classes", "CREATE TABLE IF NOT EXISTS size_classes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            sizes TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("categories", "CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(255) NOT NULL UNIQUE,
            label VARCHAR(255) NOT NULL,
            sub_label VARCHAR(255) NULL,
            tab_title VARCHAR(255) NULL,
            image_url VARCHAR(512) NULL,
            show_image TINYINT(1) DEFAULT 1,
            parent_id INT NULL,
            size_class_id INT NULL,
            priority INT DEFAULT 0,
            show_in_header TINYINT(1) DEFAULT 1,
            is_visible TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_category_slug (slug),
            INDEX idx_category_parent (parent_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("products", "CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(255) NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            long_description LONGTEXT NULL,
            price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
            original_price DECIMAL(10, 2) NULL,
            stock_count INT NOT NULL DEFAULT 0,
            low_stock_threshold INT DEFAULT 5,
            category_id INT NULL,
            category_ids TEXT NULL,
            badge TEXT NULL,
            sizes LONGTEXT NULL,
            colors LONGTEXT NULL,
            inventory LONGTEXT NULL,
            featured BOOLEAN DEFAULT FALSE,
            is_disabled TINYINT(1) DEFAULT 0,
            fabric_composition VARCHAR(255) DEFAULT NULL,
            care_instructions VARCHAR(255) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_product_slug (slug),
            INDEX idx_product_category (category_id),
            INDEX idx_cat_disabled (category_id, is_disabled),
            INDEX idx_prod_cat_created (category_id, created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("product_images", "CREATE TABLE IF NOT EXISTS product_images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            image_url VARCHAR(512) NOT NULL,
            color VARCHAR(50) NULL,
            is_primary BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_product_image (product_id),
            INDEX idx_prod_primary (product_id, is_primary)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("badges", "CREATE TABLE IF NOT EXISTS badges (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("orders", "CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT DEFAULT NULL,
            shipping_name VARCHAR(255) NOT NULL,
            shipping_email VARCHAR(255) DEFAULT NULL,
            shipping_phone VARCHAR(50) NULL,
            shipping_address TEXT NOT NULL,
            shipping_city VARCHAR(100) NOT NULL,
            shipping_zip VARCHAR(50) NULL,
            total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
            status VARCHAR(50) DEFAULT 'pending',
            tracking_number VARCHAR(100) DEFAULT NULL,
            courier_status TEXT DEFAULT NULL,
            promo_code VARCHAR(50) DEFAULT NULL,
            discount DECIMAL(10, 2) DEFAULT 0.00,
            points_used INT DEFAULT 0,
            reward_points INT DEFAULT 0,
            points_awarded TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_order_user (user_id),
            INDEX idx_order_status (status),
            INDEX idx_user_status (user_id, status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("order_items", "CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id INT NULL,
            product_name VARCHAR(255) NOT NULL,
            color VARCHAR(50) DEFAULT NULL,
            size VARCHAR(50) DEFAULT NULL,
            quantity INT NOT NULL DEFAULT 1,
            price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
            INDEX idx_order_item_order (order_id),
            INDEX idx_order_item_product (product_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("wishlists", "CREATE TABLE IF NOT EXISTS wishlists (
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, product_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("site_settings", "CREATE TABLE IF NOT EXISTS site_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(255) UNIQUE,
            setting_value LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("promotions", "CREATE TABLE IF NOT EXISTS promotions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(50) NOT NULL UNIQUE,
            type ENUM('percent', 'fixed') NOT NULL DEFAULT 'percent',
            value DECIMAL(10, 2) NOT NULL,
            min_order DECIMAL(10, 2) DEFAULT 0,
            uses INT DEFAULT 0,
            max_uses INT NULL,
            active BOOLEAN DEFAULT TRUE,
            expires DATE NULL,
            category_id INT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_promotion_code (code)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("reviews", "CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id INT NULL,
            rating INT NOT NULL,
            title VARCHAR(255) NULL,
            size_rating INT NULL,
            age_range VARCHAR(50) NULL,
            size_purchased VARCHAR(50) NULL,
            true_size VARCHAR(50) NULL,
            recommend TINYINT(1) DEFAULT 1,
            comment TEXT NULL,
            media_url VARCHAR(512) NULL,
            media_type ENUM('image', 'video') NULL,
            is_disabled TINYINT(1) DEFAULT 0,
            helpful_votes INT DEFAULT 0,
            unhelpful_votes INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_review_product (product_id),
            INDEX idx_review_user (user_id),
            INDEX idx_prod_disabled (product_id, is_disabled, created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("return_requests", "CREATE TABLE IF NOT EXISTS return_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_number VARCHAR(100),
            order_date VARCHAR(50),
            reason TEXT,
            method VARCHAR(50),
            status VARCHAR(50) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("notifications", "CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) NOT NULL DEFAULT 'general',
            link VARCHAR(255) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("user_notifications", "CREATE TABLE IF NOT EXISTS user_notifications (
            user_id INT NOT NULL,
            notification_id INT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            read_at TIMESTAMP NULL,
            PRIMARY KEY (user_id, notification_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("user_addresses", "CREATE TABLE IF NOT EXISTS user_addresses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            address TEXT NOT NULL,
            city VARCHAR(100) NOT NULL,
            zip VARCHAR(50) NULL,
            phone VARCHAR(50) NULL,
            is_default BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_user_address (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("survey_responses", "CREATE TABLE IF NOT EXISTS survey_responses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            recommend_score INT NOT NULL,
            improvement_feedback TEXT,
            three_words TEXT,
            email VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        // Section-Wise Partitioned Tables
        $helper->createTable("settings_general", "CREATE TABLE IF NOT EXISTS settings_general (
            setting_key VARCHAR(100) PRIMARY KEY,
            setting_value TEXT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("settings_theme", "CREATE TABLE IF NOT EXISTS settings_theme (
            setting_key VARCHAR(100) PRIMARY KEY,
            setting_value LONGTEXT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("settings_integrations", "CREATE TABLE IF NOT EXISTS settings_integrations (
            setting_key VARCHAR(100) PRIMARY KEY,
            setting_value TEXT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("cms_pages", "CREATE TABLE IF NOT EXISTS cms_pages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(150) NOT NULL UNIQUE,
            title VARCHAR(255) NOT NULL,
            content_json LONGTEXT NULL,
            is_published TINYINT(1) DEFAULT 1,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_cms_slug (slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("product_details", "CREATE TABLE IF NOT EXISTS product_details (
            product_id INT PRIMARY KEY,
            description TEXT NULL,
            long_description LONGTEXT NULL,
            sizes LONGTEXT NULL,
            colors LONGTEXT NULL,
            inventory LONGTEXT NULL,
            fabric_composition VARCHAR(255) DEFAULT NULL,
            care_instructions VARCHAR(255) DEFAULT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("return_requests", "CREATE TABLE IF NOT EXISTS return_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_number VARCHAR(100),
            order_date VARCHAR(50),
            reason TEXT,
            method VARCHAR(50),
            status VARCHAR(50) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_return_order (order_number),
            INDEX idx_return_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $helper->createTable("user_addresses", "CREATE TABLE IF NOT EXISTS user_addresses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            label VARCHAR(100) DEFAULT 'Home',
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(50) DEFAULT NULL,
            address_line1 VARCHAR(255) NOT NULL,
            address_line2 VARCHAR(255) DEFAULT NULL,
            city VARCHAR(100) NOT NULL,
            state VARCHAR(100) DEFAULT NULL,
            zip VARCHAR(20) DEFAULT NULL,
            country VARCHAR(100) DEFAULT 'Pakistan',
            is_default TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_address_user (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    }
}
