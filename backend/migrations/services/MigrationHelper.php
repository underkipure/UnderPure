<?php

class MigrationHelper {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function createTable(string $name, string $sql): void {
        $this->pdo->exec($sql);
        echo " [OK] Table '$name' verified/created.\n";
    }

    public function ensureColumn(string $table, string $col, string $def): void {
        $cols = $this->pdo->query("DESCRIBE `$table`")->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array($col, $cols)) {
            $this->pdo->exec("ALTER TABLE `$table` ADD COLUMN `$col` $def");
            echo " [ADDED] Column '$col' added to table '$table'.\n";
        } else {
            echo " [EXISTS] Column '$table.$col' is present.\n";
        }
    }

    public function modifyColumn(string $table, string $col, string $def): void {
        try {
            $this->pdo->exec("ALTER TABLE `$table` MODIFY COLUMN `$col` $def");
            echo " [MODIFIED] Column '$table.$col' modified to: $def.\n";
        } catch (Exception $e) {
            echo " [WARN] Modify '$table.$col': " . $e->getMessage() . "\n";
        }
    }

    public function addIndex(string $table, string|array $columns, string $indexName): void {
        try {
            $indexes = $this->pdo->query("SHOW INDEXES FROM `$table` WHERE Key_name = '$indexName'")->fetchAll();
            if (empty($indexes)) {
                $colList = is_array($columns) ? $columns : explode(',', $columns);
                $formattedCols = implode(', ', array_map(fn($c) => "`" . trim($c, "` ") . "`", $colList));
                $this->pdo->exec("CREATE INDEX `$indexName` ON `$table` ($formattedCols)");
                echo " [INDEX] Index '$indexName' created on '$table' ($formattedCols).\n";
            } else {
                echo " [EXISTS] Index '$indexName' is present on '$table'.\n";
            }
        } catch (Exception $e) {
            echo " [WARN] Add Index '$indexName' on '$table': " . $e->getMessage() . "\n";
        }
    }

    public function getPdo(): PDO {
        return $this->pdo;
    }
}
