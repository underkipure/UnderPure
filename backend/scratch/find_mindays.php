<?php
require_once __DIR__ . '/../config/db.php';
$db = new Database();
$pdo = $db->getConnection();
$stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings");
while ($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
    if (strpos($r['setting_value'], 'minDays') !== false) {
        echo "FOUND minDays in KEY: " . $r['setting_key'] . "\n";
        echo $r['setting_value'] . "\n\n";
    }
}
