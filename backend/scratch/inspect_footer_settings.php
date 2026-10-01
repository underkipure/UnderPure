<?php
require_once __DIR__ . '/../config/db.php';
$db = new Database();
$pdo = $db->getConnection();
$stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key LIKE '%footer%' OR setting_key LIKE '%shipping%'");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "=== KEY: " . $row['setting_key'] . " ===\n";
    echo $row['setting_value'] . "\n\n";
}
