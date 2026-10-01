<?php

class DataSeeder {
    public static function seedBadges(MigrationHelper $helper): void {
        $pdo = $helper->getPdo();
        $badgeCount = (int)$pdo->query("SELECT COUNT(*) FROM badges")->fetchColumn();
        if ($badgeCount === 0) {
            $defaultBadges = ["NEW", "SALE", "EXCLUSIVE", "BESTSELLER", "TRENDING", "LIMITED EDITION", "CLEARANCE", "ESSENTIAL", "HOT"];
            $stmtInsert = $pdo->prepare("INSERT IGNORE INTO badges (name) VALUES (?)");
            foreach ($defaultBadges as $bName) {
                $stmtInsert->execute([$bName]);
            }
            echo " [SEEDED] " . count($defaultBadges) . " default badges created.\n";
        } else {
            echo " [OK] Badges table has $badgeCount entries.\n";
        }
    }
}
