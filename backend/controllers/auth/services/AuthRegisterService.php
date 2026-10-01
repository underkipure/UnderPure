<?php

require_once __DIR__ . "/../../../helpers/JwtHelper.php";
require_once __DIR__ . "/../../../helpers/EmailHelper.php";

class AuthRegisterService {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->name, $data->email, $data->password)) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            return;
        }

        try {
            // Check for existing user
            $email = trim($data->email);
            $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(["error" => "Email already registered"]);
                return;
            }

            // Fetch loyalty signup bonus setting
            $sStmt = $this->pdo->query("SELECT setting_value FROM site_settings WHERE setting_key = 'loyaltySettings'");
            $sRow = $sStmt->fetch(PDO::FETCH_ASSOC);
            $loyaltySettings = $sRow ? json_decode($sRow['setting_value'], true) : [];
            $signupBonus = isset($loyaltySettings['signupBonus']) ? (int)$loyaltySettings['signupBonus'] : 200;

            // Hash and Store
            $password_hash = password_hash($data->password, PASSWORD_DEFAULT);
            $dob = isset($data->dob) && !empty($data->dob) ? $data->dob : null;
            
            $stmt = $this->pdo->prepare("INSERT INTO users (name, email, password_hash, is_admin, loyalty_points, dob) VALUES (?, ?, ?, FALSE, ?, ?)");
            
            if ($stmt->execute([$data->name, $email, $password_hash, $signupBonus, $dob])) {
                $newUserId = $this->pdo->lastInsertId();
                
                $payload = [
                    "id" => $newUserId,
                    "email" => $data->email,
                    "role" => 'customer',
                    "tv" => 1,
                    "exp" => time() + (60 * 60 * 24)
                ];
                
                http_response_code(201);
                echo json_encode([
                    "message" => "User registered successfully",
                    "token" => JwtHelper::encode($payload),
                    "user" => [
                        "id" => (string)$newUserId,
                        "name" => $data->name,
                        "email" => $data->email,
                        "isAdmin" => false,
                        "loyaltyPoints" => $signupBonus,
                        "dob" => $dob,
                        "isFirstOrder" => true
                    ]
                ]);

                // Send Welcome Email
                EmailHelper::sendWelcomeEmail($data->email, $data->name, $signupBonus);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Server error while saving user."]);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database error.", "details" => $e->getMessage()]);
        }
    }
}
