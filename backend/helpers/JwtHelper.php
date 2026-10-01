<?php
class JwtHelper {
    private static $secret = null;

    private static function getSecret() {
        if (self::$secret !== null) {
            return self::$secret;
        }

        if (!empty($_ENV['JWT_SECRET'])) {
            self::$secret = $_ENV['JWT_SECRET'];
            return self::$secret;
        }

        if (function_exists('getenv') && !empty(getenv('JWT_SECRET'))) {
            self::$secret = getenv('JWT_SECRET');
            return self::$secret;
        }

        try {
            require_once __DIR__ . '/../config/db.php';
            $db = new Database();
            $pdo = $db->getConnection();
            if ($pdo) {
                $stmt = $pdo->prepare("SELECT setting_value FROM settings_integrations WHERE setting_key = 'jwt_secret'");
                $stmt->execute();
                $sec = $stmt->fetchColumn();
                if ($sec && strlen($sec) >= 16) {
                    self::$secret = $sec;
                    return self::$secret;
                }

                $newSecret = bin2hex(random_bytes(32));
                $upd = $pdo->prepare("INSERT INTO settings_integrations (setting_key, setting_value) VALUES ('jwt_secret', ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
                $upd->execute([$newSecret]);
                self::$secret = $newSecret;
                return self::$secret;
            }
        } catch (\Throwable $e) {}

        self::$secret = hash('sha256', (__FILE__ . ($_ENV['DB_NAME'] ?? 'underpure_new')));
        return self::$secret;
    }

    public static function encode($payload) {
        $secret = self::getSecret();
        $header = json_encode(["typ" => "JWT", "alg" => "HS256"]);
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac("sha256", $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function decode($jwt) {
        $secret = self::getSecret();
        $parts = explode(".", $jwt);
        if (count($parts) !== 3) return null;
        
        list($header64, $payload64, $sign64) = $parts;
        
        $signature = self::base64UrlEncode(hash_hmac("sha256", $header64 . "." . $payload64, $secret, true));
        if (!hash_equals($signature, $sign64)) return null; // Signature mismatch
        
        $payload = json_decode(self::base64UrlDecode($payload64), true);
        
        if (isset($payload["exp"]) && $payload["exp"] < time()) {
            return null; // Token expired
        }
        
        return $payload;
    }

    private static function base64UrlEncode($data) {
        return str_replace(["+", "/", "="], ["-", "_", ""], base64_encode($data));
    }

    private static function base64UrlDecode($data) {
        $b64 = str_replace(["-", "_"], ["+", "/"], $data);
        while (strlen($b64) % 4 !== 0) $b64 .= "=";
        return base64_decode($b64);
    }
}

