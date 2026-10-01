<?php
$host = 'localhost';
$db   = 'underpure';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if columns exist
    $stmt = $pdo->query("SHOW COLUMNS FROM reviews LIKE 'helpful_votes'");
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN helpful_votes INT DEFAULT 0");
        echo "Added helpful_votes.\n";
    }
    
    $stmt = $pdo->query("SHOW COLUMNS FROM reviews LIKE 'unhelpful_votes'");
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE reviews ADD COLUMN unhelpful_votes INT DEFAULT 0");
        echo "Added unhelpful_votes.\n";
    }
    
    echo "Done.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
