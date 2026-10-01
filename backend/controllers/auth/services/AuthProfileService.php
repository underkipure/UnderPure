<?php

class AuthProfileService {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function me() {
        // Assume authMiddleware() has already populated $_REQUEST['user']
        $userPayload = $_REQUEST["user"];
        
        try {
            $stmt = $this->pdo->prepare("SELECT id, name, email, is_admin, is_vip, vip_privileges, created_at, phone, loyalty_points, dob FROM users WHERE id = ?");
            $stmt->execute([$userPayload["id"]]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $oStmt = $this->pdo->prepare("SELECT id FROM orders WHERE user_id = ? LIMIT 1");
                $oStmt->execute([$userPayload["id"]]);
                $user["isFirstOrder"] = !$oStmt->fetch();

                $user["isAdmin"] = (bool) $user["is_admin"];
                $user["isVip"] = (bool) $user["is_vip"];
                $user["vipPrivileges"] = !empty($user["vip_privileges"]) ? json_decode($user["vip_privileges"], true) : [];
                $user["loyaltyPoints"] = (int) $user["loyalty_points"];
                // remove snake_case keys to keep response clean
                unset($user["is_admin"]);
                unset($user["is_vip"]);
                unset($user["vip_privileges"]);
                unset($user["loyalty_points"]);
                echo json_encode(["user" => $user]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "User not found"]);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database error.", "details" => $e->getMessage()]);
        }
    }

    public function updateProfile() {
        $userPayload = $_REQUEST["user"];
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->name, $data->email)) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields: name, email"]);
            return;
        }

        try {
            // Check if email is being changed and if it already exists
            $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
            $stmt->execute([trim($data->email), $userPayload["id"]]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(["error" => "Email is already in use by another account"]);
                return;
            }

            $phone = isset($data->phone) ? trim($data->phone) : null;
            $dob = isset($data->dob) && !empty($data->dob) ? $data->dob : null;

            $stmt = $this->pdo->prepare("UPDATE users SET name = ?, email = ?, phone = ?, dob = ? WHERE id = ?");
            if ($stmt->execute([trim($data->name), trim($data->email), $phone, $dob, $userPayload["id"]])) {
                
                // Fetch updated user to return
                $stmt = $this->pdo->prepare("SELECT id, name, email, is_admin, is_vip, vip_privileges, created_at, phone, loyalty_points, dob FROM users WHERE id = ?");
                $stmt->execute([$userPayload["id"]]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                $user["isAdmin"] = (bool) $user["is_admin"];
                $user["isVip"] = (bool) $user["is_vip"];
                $user["vipPrivileges"] = !empty($user["vip_privileges"]) ? json_decode($user["vip_privileges"], true) : [];
                $user["loyaltyPoints"] = (int) $user["loyalty_points"];
                unset($user["is_admin"]);
                unset($user["is_vip"]);
                unset($user["vip_privileges"]);
                unset($user["loyalty_points"]);

                echo json_encode(["success" => true, "message" => "Profile updated successfully", "user" => $user]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to update profile"]);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database error.", "details" => $e->getMessage()]);
        }
    }

    public function updatePassword() {
        $userPayload = $_REQUEST["user"];
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->currentPassword, $data->newPassword)) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields: currentPassword, newPassword"]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("SELECT password_hash FROM users WHERE id = ?");
            $stmt->execute([$userPayload["id"]]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                http_response_code(404);
                echo json_encode(["error" => "User not found"]);
                return;
            }

            // Verify current password
            if (!password_verify($data->currentPassword, $user["password_hash"])) {
                http_response_code(401);
                echo json_encode(["error" => "Incorrect current password"]);
                return;
            }

            // Update with new password and invalidate previous sessions
            $newPasswordHash = password_hash($data->newPassword, PASSWORD_DEFAULT);
            $stmt = $this->pdo->prepare("UPDATE users SET password_hash = ?, token_version = token_version + 1 WHERE id = ?");
            if ($stmt->execute([$newPasswordHash, $userPayload["id"]])) {
                echo json_encode(["success" => true, "message" => "Password updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to update password"]);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database error.", "details" => $e->getMessage()]);
        }
    }
}
