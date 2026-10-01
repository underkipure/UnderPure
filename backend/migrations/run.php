<?php
/**
 * UnderPure Database Migration & Schema Sync CLI Tool
 *
 * Usage:
 *   php migrations/run.php
 */

if (php_sapi_name() !== 'cli') {
    header('HTTP/1.1 403 Forbidden');
    echo "This script can only be run from the command line.\n";
    exit(1);
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/services/MigrationRunner.php';

$database = new Database();
$pdo = $database->getConnection();

if (!$pdo) {
    echo "[ERROR] Database connection failed.\n";
    exit(1);
}

MigrationRunner::run($pdo);
