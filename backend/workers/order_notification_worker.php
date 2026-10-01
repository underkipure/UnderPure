<?php

/**
 * Background Worker: Order Notification & Confirmation Email
 * 
 * This script is spawned as a separate PHP process by OrderCheckoutService
 * to handle email/notification sending without blocking the HTTP response.
 * 
 * Usage: php order_notification_worker.php /path/to/job_file.json
 */

// Suppress any output
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);

if (!isset($argv[1]) || !is_file($argv[1])) {
    error_log("Order notification worker: No valid job file provided.");
    exit(1);
}

$jobFile = $argv[1];
$jobData = json_decode(file_get_contents($jobFile), true);

if (!$jobData || empty($jobData['order_id'])) {
    error_log("Order notification worker: Invalid job data in $jobFile");
    @unlink($jobFile);
    exit(1);
}

// Bootstrap database connection
require_once __DIR__ . '/../config/db.php';
$database = new Database();
$pdo = $database->getConnection();

if (!$pdo) {
    error_log("Order notification worker: Database connection failed for order #{$jobData['order_id']}");
    @unlink($jobFile);
    exit(1);
}

require_once __DIR__ . '/../helpers/NotificationHelper.php';
require_once __DIR__ . '/../helpers/EmailHelper.php';

$orderId       = $jobData['order_id'];
$userId        = $jobData['user_id'] ?? null;
$shippingEmail = $jobData['shipping_email'] ?? '';
$shippingPhone = $jobData['shipping_phone'] ?? '';
$shippingName  = $jobData['shipping_name'] ?? '';
$total         = $jobData['total'] ?? 0;
$cartItems     = $jobData['cart_items'] ?? [];

// 1. Send in-app notification
try {
    $notifier = new NotificationHelper($pdo);
    $notifier->sendOrderPlaced([
        'id'             => $orderId,
        'user_id'        => $userId,
        'shipping_email' => $shippingEmail,
        'shipping_phone' => $shippingPhone,
        'shipping_name'  => $shippingName,
        'total'          => $total,
        'status'         => 'pending'
    ]);
} catch (\Throwable $e) {
    error_log("Order notification worker: In-app notification failed for order #$orderId: " . $e->getMessage());
}

// 2. Send confirmation email
if (!empty($shippingEmail)) {
    try {
        EmailHelper::sendOrderConfirmed(
            $shippingEmail,
            $shippingName ?: 'Lover',
            $orderId,
            $total,
            $cartItems
        );
    } catch (\Throwable $e) {
        error_log("Order notification worker: Email failed for order #$orderId to $shippingEmail: " . $e->getMessage());
    }
}

// Cleanup job file
@unlink($jobFile);

exit(0);
