<?php
/**
 * @deprecated Legacy migration script.
 * Replaced by unified MigrationRunner in /migrations/services/MigrationRunner.php
 * Run via CLI: php migrations/run.php
 */
require_once __DIR__ . '/../migrations/services/MigrationRunner.php';
if (isset($pdo) && $pdo instanceof PDO && isset($_GET['migrate']) && $_GET['migrate'] === 'true') {
    MigrationRunner::run($pdo);
}
