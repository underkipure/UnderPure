<?php
$pdo = new PDO('mysql:host=localhost;dbname=underpure_new', 'root', '');
$stmt = $pdo->query("SELECT setting_value FROM site_settings WHERE setting_key = 'megaMenuData'");
$row = $stmt->fetch();
if ($row) {
    echo substr($row['setting_value'], 0, 800);
} else {
    echo "Not found";
}
