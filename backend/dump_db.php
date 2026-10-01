<?php
$pdo = new PDO('mysql:host=localhost;dbname=underpure_new', 'root', '');
$stmt = $pdo->query("SELECT setting_value FROM site_settings WHERE setting_key = 'megaMenuData'");
$row = $stmt->fetch();
if ($row) {
    echo json_encode(json_decode($row['setting_value']), JSON_PRETTY_PRINT);
}
