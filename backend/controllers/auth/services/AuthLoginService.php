<?php

require_once __DIR__ . "/../../../helpers/JwtHelper.php";
require_once __DIR__ . "/../../../helpers/EmailHelper.php";
require_once __DIR__ . "/../../../helpers/auth/OtpVerificationService.php";

class AuthLoginService {
    private $pdo;
    private $otpService;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->otpService = new OtpVerificationService($pdo);
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->email, $data->password)) {
            http_response_code(400);
            echo json_encode(["error" => "Missing email or password"]);
            return;
        }

        try {
            $email = trim($data->email);
            $stmt = $this->pdo->prepare("SELECT id, name, email, password_hash, is_admin, is_vip, vip_privileges, loyalty_points, dob, last_birthday_reward_year, token_version FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                http_response_code(401);
                echo json_encode(["error" => "User account not found with this email"]);
                return;
            }

            if (password_verify($data->password, $user["password_hash"])) {
                $isAdmin = (bool) $user["is_admin"];
                $isVip = (bool) $user["is_vip"];
                $role = $isAdmin ? 'admin' : 'customer';
                
                // Birthday Month Logic
                $birthdayReward = false;
                $birthdayBonus = 0;
                
                if (!empty($user['dob'])) {
                    $dobMonth = date('m', strtotime($user['dob']));
                    $currentMonth = date('m');
                    $currentYear = date('Y');
                    
                    if ($dobMonth === $currentMonth && $user['last_birthday_reward_year'] != $currentYear) {
                        $sStmt = $this->pdo->query("SELECT setting_value FROM site_settings WHERE setting_key IN ('loyaltySettings', 'loyalty_settings') LIMIT 1");
                        $sRow = $sStmt->fetch(PDO::FETCH_ASSOC);
                        $loyaltySettings = $sRow ? json_decode($sRow['setting_value'], true) : [];
                        $birthdayBonus = isset($loyaltySettings['birthdayBonus']) ? (int)$loyaltySettings['birthdayBonus'] : 500;
                        
                        $newPoints = (int)$user['loyalty_points'] + $birthdayBonus;
                        $updateStmt = $this->pdo->prepare("UPDATE users SET loyalty_points = ?, last_birthday_reward_year = ? WHERE id = ?");
                        $updateStmt->execute([$newPoints, $currentYear, $user['id']]);
                        
                        $user['loyalty_points'] = $newPoints;
                        $birthdayReward = true;

                        // Send Birthday Wishes email with UP Points Gift
                        try {
                            EmailHelper::sendBirthdayWish($user['email'], $user['name'] ?? 'Lover', $birthdayBonus);
                        } catch (\Throwable $e) {
                            error_log("Failed to send birthday wish email on login: " . $e->getMessage());
                        }
                    }
                }
                
                $payload = [
                    "id" => $user["id"],
                    "email" => $user["email"],
                    "role" => $role,
                    "tv" => (int)($user["token_version"] ?? 1),
                    "exp" => time() + (60 * 60 * 24) // 24-hour expiration
                ];
                
                $oStmt = $this->pdo->prepare("SELECT id FROM orders WHERE user_id = ? LIMIT 1");
                $oStmt->execute([$user["id"]]);
                $isFirstOrder = !$oStmt->fetch();
                
                echo json_encode([
                    "success" => true,
                    "message" => "Login successful",
                    "token" => JwtHelper::encode($payload),
                    "user" => [
                        "id" => (string)$user["id"],
                        "name" => $user["name"],
                        "email" => $user["email"],
                        "isAdmin" => $isAdmin,
                        "isVip" => $isVip,
                        "vipPrivileges" => !empty($user["vip_privileges"]) ? json_decode($user["vip_privileges"], true) : [],
                        "loyaltyPoints" => (int)$user["loyalty_points"],
                        "dob" => $user["dob"],
                        "isFirstOrder" => $isFirstOrder
                    ],
                    "birthdayReward" => $birthdayReward,
                    "birthdayBonus" => $birthdayBonus
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Invalid password."]);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database error.", "details" => $e->getMessage()]);
        }
    }

    public function googleLogin() {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->credential)) {
            http_response_code(400);
            echo json_encode(["error" => "Missing Google credential"]);
            return;
        }

        try {
            // 1. Verify token with Google API
            $id_token = $data->credential;
            $verify_url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . $id_token;
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $verify_url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // For local dev
            $response = curl_exec($ch);
            
            if ($response === false) {
                $error = curl_error($ch);
                curl_close($ch);
                http_response_code(500);
                echo json_encode(["error" => "Google verification failed", "details" => $error]);
                return;
            }
            curl_close($ch);
            
            $google_user = json_decode($response, true);

            if (!isset($google_user['email'])) {
                http_response_code(401);
                echo json_encode(["error" => "Invalid Google token response", "raw" => $response]);
                return;
            }

            $email = $google_user['email'];
            $name = $google_user['name'];
            $google_id = $google_user['sub'];

            // 2. Check if user exists
            $stmt = $this->pdo->prepare("SELECT id, name, email, is_admin, is_vip, vip_privileges, loyalty_points, dob, last_birthday_reward_year, token_version FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            $birthdayReward = false;
            $birthdayBonus = 0;

            if (!$user) {
                // Fetch loyalty signup bonus setting
                $sStmt = $this->pdo->query("SELECT setting_value FROM site_settings WHERE setting_key IN ('loyaltySettings', 'loyalty_settings') LIMIT 1");
                $sRow = $sStmt->fetch(PDO::FETCH_ASSOC);
                $loyaltySettings = $sRow ? json_decode($sRow['setting_value'], true) : [];
                $signupBonus = isset($loyaltySettings['signupBonus']) ? (int)$loyaltySettings['signupBonus'] : 200;

                // 3. Create new user if not exists
                try {
                    $stmt = $this->pdo->prepare("INSERT INTO users (name, email, is_admin, google_id, loyalty_points) VALUES (?, ?, FALSE, ?, ?)");
                    $stmt->execute([$name, $email, $google_id, $signupBonus]);
                    $userId = $this->pdo->lastInsertId();
                } catch (\PDOException $e) {
                    // Fallback: If google_id column doesn't exist, insert without it
                    $stmt = $this->pdo->prepare("INSERT INTO users (name, email, is_admin, loyalty_points) VALUES (?, ?, FALSE, ?)");
                    $stmt->execute([$name, $email, $signupBonus]);
                    $userId = $this->pdo->lastInsertId();
                }
                
                $user = [
                    "id" => $userId,
                    "name" => $name,
                    "email" => $email,
                    "is_admin" => 0,
                    "is_vip" => 0,
                    "vip_privileges" => null,
                    "loyalty_points" => $signupBonus,
                    "dob" => null,
                    "last_birthday_reward_year" => null
                ];

                // Send Welcome Email for new Google signups
                EmailHelper::sendWelcomeEmail($email, $name, $signupBonus);
            } else {
                // Check birthday reward for existing Google user
                if (!empty($user['dob'])) {
                    $dobMonth = date('m', strtotime($user['dob']));
                    $currentMonth = date('m');
                    $currentYear = date('Y');

                    if ($dobMonth === $currentMonth && $user['last_birthday_reward_year'] != $currentYear) {
                        $sStmt = $this->pdo->query("SELECT setting_value FROM site_settings WHERE setting_key IN ('loyaltySettings', 'loyalty_settings') LIMIT 1");
                        $sRow = $sStmt->fetch(PDO::FETCH_ASSOC);
                        $loyaltySettings = $sRow ? json_decode($sRow['setting_value'], true) : [];
                        $birthdayBonus = isset($loyaltySettings['birthdayBonus']) ? (int)$loyaltySettings['birthdayBonus'] : 500;

                        $newPoints = (int)$user['loyalty_points'] + $birthdayBonus;
                        $updateStmt = $this->pdo->prepare("UPDATE users SET loyalty_points = ?, last_birthday_reward_year = ? WHERE id = ?");
                        $updateStmt->execute([$newPoints, $currentYear, $user['id']]);

                        $user['loyalty_points'] = $newPoints;
                        $birthdayReward = true;

                        // Send Birthday Wishes email with UP Points Gift
                        try {
                            EmailHelper::sendBirthdayWish($user['email'], $user['name'] ?? 'Lover', $birthdayBonus);
                        } catch (\Throwable $e) {
                            error_log("Failed to send birthday wish email on Google login: " . $e->getMessage());
                        }
                    }
                }
            }

            // 4. Generate JWT
            $isAdmin = (bool) $user["is_admin"];
            $isVip = (bool) $user["is_vip"];
            $role = $isAdmin ? 'admin' : 'customer';
            
            $payload = [
                "id" => $user["id"],
                "email" => $user["email"],
                "role" => $role,
                "tv" => (int)($user["token_version"] ?? 1),
                "exp" => time() + (60 * 60 * 24 * 7) // 1 week
            ];
            
            echo json_encode([
                "success" => true,
                "message" => "Google login successful",
                "token" => JwtHelper::encode($payload),
                "user" => [
                    "id" => (string)$user["id"],
                    "name" => $user["name"],
                    "email" => $user["email"],
                    "isAdmin" => $isAdmin,
                    "isVip" => $isVip,
                    "vipPrivileges" => !empty($user["vip_privileges"]) ? json_decode($user["vip_privileges"], true) : [],
                    "loyaltyPoints" => (int)$user["loyalty_points"],
                    "dob" => $user["dob"] ?? null,
                    "isFirstOrder" => true
                ],
                "birthdayReward" => $birthdayReward,
                "birthdayBonus" => $birthdayBonus
            ]);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Internal server error during Google login", "message" => $e->getMessage()]);
        }
    }

    public function verifyOtpAndLogin() {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->email, $data->otp)) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            return;
        }

        try {
            $email = trim($data->email);
            $verifyResult = $this->otpService->verifyOtp($email, $data->otp, true);

            if (!$verifyResult['valid']) {
                http_response_code(400);
                echo json_encode(["error" => $verifyResult['error'] ?? "Invalid or expired verification code"]);
                return;
            }

            $user = $verifyResult['user'];

            // Generate JWT Token
            $isAdmin = isset($user['role']) && $user['role'] === 'admin';
            $isVip = false;
            
            if (isset($user['tier_id'])) {
                $tierStmt = $this->pdo->prepare("SELECT name FROM vip_tiers WHERE id = ?");
                $tierStmt->execute([$user['tier_id']]);
                $tier = $tierStmt->fetch(PDO::FETCH_ASSOC);
                $isVip = $tier && strtoupper($tier['name']) !== 'NONE';
            }

            $payload = [
                "id" => $user["id"],
                "role" => $isAdmin ? 'admin' : 'user',
                "email" => $user["email"],
                "tv" => (int)($user["token_version"] ?? 1),
                "exp" => time() + (86400 * 30) // 30 days
            ];

            // Birthday Month Logic for OTP login
            $birthdayReward = false;
            $birthdayBonus = 0;
            if (!empty($user['dob'])) {
                $dobMonth = date('m', strtotime($user['dob']));
                $currentMonth = date('m');
                $currentYear = date('Y');

                if ($dobMonth === $currentMonth && ($user['last_birthday_reward_year'] ?? null) != $currentYear) {
                    $sStmt = $this->pdo->query("SELECT setting_value FROM site_settings WHERE setting_key IN ('loyaltySettings', 'loyalty_settings') LIMIT 1");
                    $sRow = $sStmt->fetch(PDO::FETCH_ASSOC);
                    $loyaltySettings = $sRow ? json_decode($sRow['setting_value'], true) : [];
                    $birthdayBonus = isset($loyaltySettings['birthdayBonus']) ? (int)$loyaltySettings['birthdayBonus'] : 500;

                    $newPoints = (int)$user['loyalty_points'] + $birthdayBonus;
                    $updateStmt = $this->pdo->prepare("UPDATE users SET loyalty_points = ?, last_birthday_reward_year = ? WHERE id = ?");
                    $updateStmt->execute([$newPoints, $currentYear, $user['id']]);

                    $user['loyalty_points'] = $newPoints;
                    $birthdayReward = true;

                    // Send Birthday Wishes email with UP Points Gift
                    try {
                        EmailHelper::sendBirthdayWish($user['email'], $user['name'] ?? 'Lover', $birthdayBonus);
                    } catch (\Throwable $e) {
                        error_log("Failed to send birthday wish email on OTP login: " . $e->getMessage());
                    }
                }
            }

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "OTP verified successfully. Please change your password from account settings.",
                "token" => JwtHelper::encode($payload),
                "user" => [
                    "id" => (string)$user["id"],
                    "name" => $user["name"],
                    "email" => $user["email"],
                    "isAdmin" => $isAdmin,
                    "isVip" => $isVip,
                    "vipPrivileges" => !empty($user["vip_privileges"]) ? json_decode($user["vip_privileges"], true) : [],
                    "loyaltyPoints" => (int)$user["loyalty_points"]
                ],
                "birthdayReward" => $birthdayReward,
                "birthdayBonus" => $birthdayBonus
            ]);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Internal server error", "details" => $e->getMessage()]);
        }
    }

    /**
     * Sign out of all devices by incrementing token_version.
     * All existing JWTs with older token_version will be rejected by authMiddleware.
     */
    public function logoutAll() {
        if (!isset($_REQUEST['user']['id'])) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            return;
        }

        $userId = $_REQUEST['user']['id'];

        try {
            $stmt = $this->pdo->prepare("UPDATE users SET token_version = token_version + 1 WHERE id = ?");
            $stmt->execute([$userId]);

            echo json_encode([
                "success" => true,
                "message" => "Successfully signed out of all devices."
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database error.", "details" => $e->getMessage()]);
        }
    }
}
