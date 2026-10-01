<?php
/**
 * UnderPure Backend Entrypoint
 */

// 1. CORS, GZIP Compression & Caching Headers
require_once __DIR__ . "/config/cors.php";

// 2. Database Connection
require_once __DIR__ . "/config/db.php";

$database = new Database();
$pdo = $database->getConnection();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// 3. Database Auto Repair & Schema Migrations (Only executed on explicit on-demand migration trigger)
if (isset($_GET['migrate']) && $_GET['migrate'] === 'true') {
    require_once __DIR__ . "/migrations/services/MigrationRunner.php";
    header('Content-Type: text/plain; charset=UTF-8');
    MigrationRunner::run($pdo);
    exit;
}

// 5. API Routing & Dispatcher
require_once __DIR__ . "/routes/api.php";