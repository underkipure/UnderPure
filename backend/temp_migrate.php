<?php
try {
    $pdo = new PDO('mysql:host=localhost;port=3306;dbname=underpure_new', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('ALTER TABLE categories ADD COLUMN tab_title VARCHAR(255) NULL AFTER sub_label');
    echo 'Migration successful';
} catch (Exception $e) {
    if (strpos($e->getMessage(), 'Duplicate column') !== false) {
        echo 'Column already exists';
    } else {
        echo 'Error: ' . $e->getMessage();
    }
}
