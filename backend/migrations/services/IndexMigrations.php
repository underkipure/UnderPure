<?php

class IndexMigrations {
    public static function migrateAll(MigrationHelper $helper): void {
        // Products Table Indexes (Factor 6)
        $helper->addIndex('products', ['category_id', 'is_disabled'], 'idx_cat_disabled');
        $helper->addIndex('products', ['category_id', 'created_at'], 'idx_prod_cat_created');
        $helper->addIndex('products', ['category_id', 'is_disabled', 'created_at'], 'idx_prod_cat_disabled_created');
        $helper->addIndex('products', ['category_id', 'is_disabled', 'price'], 'idx_prod_cat_price');
        $helper->addIndex('products', ['slug', 'is_disabled'], 'idx_prod_slug_disabled');
        $helper->addIndex('products', ['featured', 'created_at'], 'idx_prod_featured');
        $helper->addIndex('products', ['price'], 'idx_prod_price');
        $helper->addIndex('products', ['created_at'], 'idx_products_created_at');

        // Product Images Table Indexes (Factor 6)
        $helper->addIndex('product_images', ['product_id', 'is_primary'], 'idx_prod_primary');
        $helper->addIndex('product_images', ['product_id', 'is_primary', 'id'], 'idx_prod_img_sort');
        $helper->addIndex('product_images', ['product_id', 'color', 'is_primary'], 'idx_img_prod_color_primary');

        // Reviews Table Indexes (Factor 6)
        $helper->addIndex('reviews', ['product_id', 'is_disabled', 'created_at'], 'idx_prod_disabled');
        $helper->addIndex('reviews', ['product_id', 'is_disabled', 'helpful_votes'], 'idx_review_helpful');
        $helper->addIndex('reviews', ['product_id', 'is_disabled', 'rating'], 'idx_review_prod_rating');

        // Orders Table Indexes (Factor 6)
        $helper->addIndex('orders', ['user_id', 'status'], 'idx_user_status');
        $helper->addIndex('orders', ['user_id', 'created_at'], 'idx_user_created');
        $helper->addIndex('orders', ['user_id', 'created_at'], 'idx_orders_user_created_desc');
        $helper->addIndex('orders', ['status', 'created_at'], 'idx_status_created');
        $helper->addIndex('orders', ['tracking_number', 'status'], 'idx_orders_status_tracking');
        $helper->addIndex('orders', ['shipping_email'], 'idx_orders_email');
        $helper->addIndex('orders', ['created_at'], 'idx_order_created');
        $helper->addIndex('orders', ['tracking_number'], 'idx_order_tracking');

        // Order Items Table Indexes
        $helper->addIndex('order_items', ['order_id', 'product_id'], 'idx_order_item_order_prod');
        $helper->addIndex('order_items', ['product_id'], 'idx_order_item_prod_perf');

        // Categories Table Indexes
        $helper->addIndex('categories', ['is_visible', 'priority'], 'idx_category_visible_priority');
        $helper->addIndex('categories', ['parent_id', 'priority'], 'idx_category_parent_priority');

        // Notifications & User Notifications Indexes
        $helper->addIndex('user_notifications', ['user_id', 'is_read'], 'idx_unotif_user_read');
        $helper->addIndex('notifications', ['created_at'], 'idx_notif_created');

        // User Addresses & Wishlist Indexes
        $helper->addIndex('user_addresses', ['user_id', 'is_default'], 'idx_addr_user_default');
        $helper->addIndex('wishlists', ['user_id', 'created_at'], 'idx_wishlist_user_created');

        // Users Table Indexes (Admin Dashboard & Auth speed)
        $helper->addIndex('users', ['is_admin', 'created_at'], 'idx_user_admin_created');
        $helper->addIndex('users', ['phone'], 'idx_user_phone');
        $helper->addIndex('users', ['is_vip', 'created_at'], 'idx_user_vip_created');

        // Promotions & CMS Pages Indexes
        $helper->addIndex('promotions', ['code', 'active'], 'idx_promo_code_active');
        $helper->addIndex('cms_pages', ['slug', 'is_published'], 'idx_cms_slug_published');
    }
}
