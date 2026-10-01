<?php
/**
 * CRON SCRIPT: Birthday Wishes & Loyalty Points
 * Run this script daily via a cron job (e.g., `php /path/to/backend/cron/birthday_wishes.php`)
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/EmailHelper.php';

echo "Starting Birthday Cron Job...\n";

$database = new Database();
$pdo = $database->getConnection();

if (!$pdo) {
    die("Database connection failed.\n");
}

// Fetch loyalty settings
$sStmt = $pdo->query("SELECT setting_value FROM site_settings WHERE setting_key IN ('loyaltySettings', 'loyalty_settings') LIMIT 1");
$sRow = $sStmt->fetch(PDO::FETCH_ASSOC);
$loyaltySettings = $sRow ? json_decode($sRow['setting_value'], true) : [];
$birthdayBonus = isset($loyaltySettings['birthdayBonus']) ? (int)$loyaltySettings['birthdayBonus'] : 500;

$currentMonth = date('m');
$currentYear = date('Y');

// Find users whose birthday is this month and who haven't received a reward this year
$stmt = $pdo->prepare("SELECT id, name, email, loyalty_points FROM users WHERE MONTH(dob) = ? AND (last_birthday_reward_year IS NULL OR last_birthday_reward_year != ?)");
$stmt->execute([$currentMonth, $currentYear]);
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

$count = 0;
foreach ($users as $user) {
    $newPoints = $user['loyalty_points'] + $birthdayBonus;
    
    // Update DB
    $updateStmt = $pdo->prepare("UPDATE users SET loyalty_points = ?, last_birthday_reward_year = ? WHERE id = ?");
    if ($updateStmt->execute([$newPoints, $currentYear, $user['id']])) {
        // Send Email
        $userName = !empty($user['name']) ? $user['name'] : 'Lover';
        if (EmailHelper::sendBirthdayWish($user['email'], $userName, $birthdayBonus)) {
            $count++;
            echo "Sent birthday wish to {$user['email']}\n";
        } else {
            echo "Failed to send email to {$user['email']} (but points were added)\n";
        }
    } else {
        echo "Failed to update DB for user {$user['id']}\n";
    }
}

echo "Birthday cron completed. Processed $count users.\n";
