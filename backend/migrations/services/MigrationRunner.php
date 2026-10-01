<?php
require_once __DIR__ . '/MigrationHelper.php';
require_once __DIR__ . '/TableDefinitions.php';
require_once __DIR__ . '/ColumnMigrations.php';
require_once __DIR__ . '/IndexMigrations.php';
require_once __DIR__ . '/DataSeeder.php';

class MigrationRunner {
    public static function run(PDO $pdo): void {
        echo "========================================\n";
        echo " DATABASE MIGRATIONS & SCHEMA SYNC\n";
        echo "========================================\n";
        echo "Host: " . ($_ENV['DB_HOST'] ?? '127.0.0.1') . "\n";
        echo "DB:   " . ($_ENV['DB_NAME'] ?? 'underpure_new') . "\n";
        echo "----------------------------------------\n\n";

        $helper = new MigrationHelper($pdo);

        // Step 1: Tables Creation
        echo "\n--- Step 1: Verify / Create Tables ---\n";
        TableDefinitions::createAll($helper);

        // Step 2: Columns Verification & Auto-Alter
        echo "\n--- Step 2: Verify Columns & Add Missing ---\n";
        ColumnMigrations::migrateAll($helper);

        // Step 3: Database Indexes & Latency Optimization (Factor 6)
        echo "\n--- Step 3: Verify & Build Compound Database Indexes ---\n";
        IndexMigrations::migrateAll($helper);

        // Step 4: Seed Badges & Metadata
        echo "\n--- Step 4: Verify Seed Data & Badges ---\n";
        DataSeeder::seedBadges($helper);

        echo "\n========================================\n";
        echo " ALL MIGRATIONS COMPLETED SUCCESSFULLY!\n";
        echo "========================================\n";
    }
}
