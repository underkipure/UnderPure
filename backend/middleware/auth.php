<?php
require_once __DIR__ . "/../helpers/JwtHelper.php";

function authMiddleware() {
    $headers = getallheaders();
    $authHeader = isset($headers["Authorization"]) ? $headers["Authorization"] : (isset($headers["authorization"]) ? $headers["authorization"] : "");
    
    // Fallback for Apache when getallheaders() misses it
    if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (empty($authHeader) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    
    if (preg_match("/Bearer\s(\S+)/", $authHeader, $matches)) {
        $jwt = $matches[1];
        $decoded = JwtHelper::decode($jwt);
        
        if ($decoded) {
            // Fetch up-to-date role from the database to ensure correctness and prevent stale tokens
            if (isset($decoded['id'])) {
                require_once __DIR__ . "/../config/db.php";
                $db = new Database();
                $pdo = $db->getConnection();
                if ($pdo) {
                    $stmt = $pdo->prepare("SELECT is_admin, token_version FROM users WHERE id = ?");
                    $stmt->execute([$decoded['id']]);
                    $dbUser = $stmt->fetch(\PDO::FETCH_ASSOC);
                    if (!$dbUser) {
                        http_response_code(401);
                        echo json_encode(["error" => "User account no longer exists."]);
                        exit();
                    }

                    // Multi-device session revocation check
                    $userTv = (int)($dbUser['token_version'] ?? 1);
                    $tokenTv = isset($decoded['tv']) ? (int)$decoded['tv'] : 0;
                    if ($tokenTv < $userTv) {
                        http_response_code(401);
                        echo json_encode([
                            "error" => "Session revoked. Signed out of all devices.",
                            "code" => "SESSION_REVOKED"
                        ]);
                        exit();
                    }

                    $decoded['role'] = (bool)$dbUser['is_admin'] ? 'admin' : 'customer';
                }
            }
            
            // Attach user details to the global request context
            $_REQUEST["user"] = $decoded;
            return true;
        }
    }
    
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized or invalid token"]);
    exit();
}

