<?php
require_once __DIR__ . "/config/db.php";

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    echo "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Database Auto-Repair</title>";
    echo "<style>body{font-family:sans-serif;padding:20px;background:#f8f9fa;color:#212529;} .card{background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);max-width:800px;margin:auto;} h1{color:#198754;} .item{padding:6px 0;border-bottom:1px solid #eee;}</style></head><body><div class='card'>";
    echo "<h1>🛠️ Database Auto-Repair & Schema Sync</h1>";

    // Helper to check table and create
    $createTable = function($name, $sql) use ($pdo) {
        $pdo->exec($sql);
        echo "<div class='item'>✅ Table <b>$name</b> checked/created.</div>";
    };

    // Helper to add column if not exists
    $ensureCol = function($table, $col, $def) use ($pdo) {
        $cols = $pdo->query("DESCRIBE `$table`")->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array($col, $cols)) {
            $pdo->exec("ALTER TABLE `$table` ADD COLUMN `$col` $def");
            echo "<div class='item'>✅ Column <b>$col</b> added to table <b>$table</b>.</div>";
        }
    };

    // 1. Create Tables
    $createTable("size_classes", "CREATE TABLE IF NOT EXISTS size_classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sizes TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $createTable("orders", "CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT NULL,
        shipping_name VARCHAR(255),
        shipping_email VARCHAR(255),
        shipping_phone VARCHAR(50),
        shipping_address TEXT,
        shipping_city VARCHAR(100),
        shipping_zip VARCHAR(20),
        total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        status VARCHAR(50) DEFAULT 'pending',
        tracking_number VARCHAR(100) DEFAULT NULL,
        courier_status TEXT DEFAULT NULL,
        promo_code VARCHAR(50) DEFAULT NULL,
        discount DECIMAL(10,2) DEFAULT 0.00,
        points_used INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $createTable("order_items", "CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT DEFAULT NULL,
        product_name VARCHAR(255),
        color VARCHAR(50) DEFAULT NULL,
        size VARCHAR(50) DEFAULT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $createTable("reviews", "CREATE TABLE IF NOT EXISTS reviews (
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $createTable("return_requests", "CREATE TABLE IF NOT EXISTS return_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(100),
        order_date VARCHAR(50),
        reason TEXT,
        method VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $createTable("notifications", "CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'general',
        link VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $createTable("user_notifications", "CREATE TABLE IF NOT EXISTS user_notifications (
        user_id INT NOT NULL,
        notification_id INT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP NULL,
        PRIMARY KEY (user_id, notification_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $createTable("survey_responses", "CREATE TABLE IF NOT EXISTS survey_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recommend_score INT NOT NULL,
        improvement_feedback TEXT,
        three_words TEXT,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $createTable("site_settings", "CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(255) UNIQUE,
        setting_value LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $createTable("badges", "CREATE TABLE IF NOT EXISTS badges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // 2. Ensure users columns
    $ensureCol('users', 'google_id', 'VARCHAR(255) DEFAULT NULL');
    $ensureCol('users', 'phone', 'VARCHAR(255) DEFAULT NULL');
    $ensureCol('users', 'is_admin', 'BOOLEAN DEFAULT FALSE');
    $ensureCol('users', 'is_vip', 'BOOLEAN DEFAULT FALSE');
    $ensureCol('users', 'vip_privileges', 'TEXT DEFAULT NULL');
    $ensureCol('users', 'loyalty_points', 'INT DEFAULT 0');
    $ensureCol('users', 'otp_code', 'VARCHAR(10) DEFAULT NULL');

    // 3. Ensure products columns
    $ensureCol('products', 'original_price', 'DECIMAL(10,2) DEFAULT NULL');
    $ensureCol('products', 'category_id', 'INT DEFAULT NULL');
    $ensureCol('products', 'category_ids', 'TEXT DEFAULT NULL');
    $ensureCol('products', 'stock_count', 'INT DEFAULT 0');
    $ensureCol('products', 'low_stock_threshold', 'INT DEFAULT 5');
    $ensureCol('products', 'badge', 'TEXT DEFAULT NULL');
    $ensureCol('products', 'sizes', 'LONGTEXT DEFAULT NULL');
    $ensureCol('products', 'colors', 'LONGTEXT DEFAULT NULL');
    $ensureCol('products', 'inventory', 'LONGTEXT DEFAULT NULL');
    $ensureCol('products', 'featured', 'BOOLEAN DEFAULT FALSE');
    $ensureCol('products', 'fabric_composition', 'VARCHAR(255) DEFAULT NULL');
    $ensureCol('products', 'care_instructions', 'VARCHAR(255) DEFAULT NULL');

    // 4. Ensure categories columns
    $ensureCol('categories', 'show_image', 'TINYINT(1) DEFAULT 1');
    $ensureCol('categories', 'is_visible', 'TINYINT(1) DEFAULT 1');
    $ensureCol('categories', 'tab_title', 'VARCHAR(255) DEFAULT NULL');
    $ensureCol('categories', 'parent_id', 'INT DEFAULT NULL');
    $ensureCol('categories', 'size_class_id', 'INT DEFAULT NULL');
    $ensureCol('categories', 'sub_label', 'VARCHAR(255) DEFAULT NULL');
    $ensureCol('categories', 'show_in_header', 'TINYINT(1) DEFAULT 1');
    $ensureCol('categories', 'priority', 'INT DEFAULT 0');
    $ensureCol('categories', 'image_url', 'VARCHAR(255) DEFAULT NULL');

    // 5. Ensure orders columns
    $ensureCol('orders', 'shipping_email', 'VARCHAR(255) NULL');
    $ensureCol('orders', 'tracking_number', 'VARCHAR(100) DEFAULT NULL');
    $ensureCol('orders', 'courier_status', 'TEXT DEFAULT NULL');
    $ensureCol('orders', 'promo_code', 'VARCHAR(50) DEFAULT NULL');
    $ensureCol('orders', 'discount', 'DECIMAL(10,2) DEFAULT 0.00');
    $ensureCol('orders', 'points_used', 'INT DEFAULT 0');
    $ensureCol('orders', 'total', 'DECIMAL(10,2) NOT NULL DEFAULT 0.00');

    // 6. Ensure order_items columns
    $ensureCol('order_items', 'color', 'VARCHAR(50) DEFAULT NULL');
    $ensureCol('order_items', 'size', 'VARCHAR(50) DEFAULT NULL');

    // 7. Ensure reviews columns
    $ensureCol('reviews', 'title', 'VARCHAR(255) NULL');
    $ensureCol('reviews', 'size_rating', 'INT NULL');
    $ensureCol('reviews', 'age_range', 'VARCHAR(50) NULL');
    $ensureCol('reviews', 'size_purchased', 'VARCHAR(50) NULL');
    $ensureCol('reviews', 'true_size', 'VARCHAR(50) NULL');
    $ensureCol('reviews', 'recommend', 'TINYINT(1) DEFAULT 1');
    $ensureCol('reviews', 'media_url', 'VARCHAR(512) NULL');
    $ensureCol('reviews', 'media_type', "ENUM('image', 'video') NULL");
    $ensureCol('reviews', 'is_disabled', 'TINYINT(1) DEFAULT 0');
    $ensureCol('reviews', 'helpful_votes', 'INT DEFAULT 0');
    $ensureCol('reviews', 'unhelpful_votes', 'INT DEFAULT 0');

    // 8. Ensure promotions column
    $ensureCol('promotions', 'category_id', 'INT DEFAULT NULL');

    echo "<h2 style='color:#198754;margin-top:20px;'>🎉 All Repairs Completed Successfully!</h2>";
    echo "<p>Aapki database tables aur saare naye columns auto-add/verify ho chuke hain.</p>";
    echo "</div></body></html>";

} catch (Exception $e) {
    echo "<h2 style='color:red;'>Error during repair:</h2> " . htmlspecialchars($e->getMessage());
}
?>
