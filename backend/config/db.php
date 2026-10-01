<?php
require_once __DIR__ . '/env.php';
Env::load(__DIR__ . '/../.env');

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port_primary;
    private $port_fallback;
    
    public $conn;
    private static $activeWorkingConfig = null;

    public function __construct() {
        $this->host = $_ENV['DB_HOST'] ?? "127.0.0.1";
        $this->db_name = $_ENV['DB_NAME'] ?? "underpure_new";
        $this->username = $_ENV['DB_USER'] ?? "root";
        $this->password = $_ENV['DB_PASS'] ?? "";
        $this->port_primary = $_ENV['DB_PORT_PRIMARY'] ?? "3306";
        $this->port_fallback = $_ENV['DB_PORT_FALLBACK'] ?? "3306";
    }

    private static function getCacheFile() {
        return __DIR__ . '/../cache/db_resolved_config.json';
    }

    public function getConnection() {
        $this->conn = null;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_TIMEOUT            => 2,
            PDO::ATTR_PERSISTENT         => true
        ];

        // 0. Fast-path: Check in-process static memoization
        if (self::$activeWorkingConfig !== null) {
            try {
                $c = self::$activeWorkingConfig;
                $this->conn = new PDO($c['dsn'], $c['user'], $c['pass'], $options);
                return $this->conn;
            } catch (\PDOException $e) {
                self::$activeWorkingConfig = null;
            }
        }

        // 0b. Fast-path: Check disk-cached verified working configuration
        $cacheFile = self::getCacheFile();
        if (file_exists($cacheFile)) {
            $cached = @json_decode(@file_get_contents($cacheFile), true);
            if ($cached && !empty($cached['dsn'])) {
                try {
                    $this->conn = new PDO($cached['dsn'], $cached['user'], $cached['pass'], $options);
                    self::$activeWorkingConfig = $cached;
                    return $this->conn;
                } catch (\PDOException $e) {
                    @unlink($cacheFile);
                }
            }
        }

        // Candidate connection configurations in priority order (with embedded charset=utf8mb4)
        $candidates = [
            [
                'dsn'  => "mysql:host={$this->host};port={$this->port_primary};dbname={$this->db_name};charset=utf8mb4",
                'user' => $this->username,
                'pass' => $this->password
            ],
            [
                'dsn'  => "mysql:host={$this->host};port={$this->port_primary};dbname=" . ($_ENV['DB_NAME_LOCAL'] ?? $this->db_name) . ";charset=utf8mb4",
                'user' => $_ENV['DB_USER_LOCAL'] ?? "root",
                'pass' => $_ENV['DB_PASS_LOCAL'] ?? ""
            ],
            [
                'dsn'  => "mysql:host={$this->host};port={$this->port_fallback};dbname=" . ($_ENV['DB_NAME_LOCAL'] ?? $this->db_name) . ";charset=utf8mb4",
                'user' => $_ENV['DB_USER_LOCAL'] ?? "root",
                'pass' => $_ENV['DB_PASS_LOCAL'] ?? ""
            ]
        ];

        foreach ($candidates as $cand) {
            try {
                $this->conn = new PDO($cand['dsn'], $cand['user'], $cand['pass'], $options);
                self::$activeWorkingConfig = $cand;
                
                // Persist verified working config to cache file
                $cacheDir = dirname($cacheFile);
                if (!is_dir($cacheDir)) {
                    @mkdir($cacheDir, 0777, true);
                }
                @file_put_contents($cacheFile, json_encode($cand), LOCK_EX);
                return $this->conn;
            } catch (\PDOException $ex) {
                continue;
            }
        }

        http_response_code(500);
        echo json_encode(["error" => "Database Connection Error. Please try again later."]);
        exit;
    }
}
?>
