<?php
require_once __DIR__ . '/../config/db.php';
$db = new Database();
$pdo = $db->getConnection();

echo "=== FIXING CORRUPT SETTINGS IN DATABASE ===\n";

// Fix contactEmail and contactPhone in site_settings
$pdo->prepare("UPDATE site_settings SET setting_value = 'hello@underpure.com' WHERE setting_key = 'contactEmail'")->execute();
$pdo->prepare("UPDATE site_settings SET setting_value = '+92 317 7470775' WHERE setting_key = 'contactPhone'")->execute();

// Fix in settings_general
$pdo->prepare("UPDATE settings_general SET setting_value = 'hello@underpure.com' WHERE setting_key = 'contactEmail'")->execute();
$pdo->prepare("UPDATE settings_general SET setting_value = '+92 317 7470775' WHERE setting_key = 'contactPhone'")->execute();

echo "Updated contactEmail to 'hello@underpure.com'\n";
echo "Updated contactPhone to '+92 317 7470775'\n";

// Check all keys in site_settings to ensure no other corruptions
$stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings");
while ($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $v = $r['setting_value'];
    if (strlen($v) > 100) $v = substr($v, 0, 80) . '...';
    echo $r['setting_key'] . " => " . $v . "\n";
}
