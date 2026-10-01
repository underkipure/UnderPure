<?php
require_once __DIR__ . '/../config/db.php';
$db = new Database();
$pdo = $db->getConnection();
$stmt = $pdo->query("SELECT * FROM settings_general WHERE setting_key LIKE '%contact%' OR setting_key LIKE '%email%' OR setting_key LIKE '%phone%'");
while ($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $r['setting_key'] . " = " . $r['setting_value'] . "\n";
}
