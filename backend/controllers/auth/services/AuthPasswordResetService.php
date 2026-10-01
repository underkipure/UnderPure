<?php

require_once __DIR__ . "/../../../helpers/auth/OtpVerificationService.php";

class AuthPasswordResetService {
    private $pdo;
    private $otpService;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->otpService = new OtpVerificationService($pdo);
    }

    public function forgotPassword() {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->email)) {
            http_response_code(400);
            echo json_encode(["error" => "Missing email address"]);
            return;
        }

        try {
            $email = trim($data->email);
            $stmt = $this->pdo->prepare("SELECT id, name FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                http_response_code(404);
                echo json_encode(["error" => "No account found with this email address"]);
                return;
            }

            $result = $this->otpService->sendPasswordResetOtp($email, $user['name']);

            if ($result['success']) {
                $responsePayload = ["success" => true, "message" => "OTP sent successfully"];
                if (!empty($result['isLocalhost']) && !$result['mailSent']) {
                    $responsePayload["debug_otp"] = $result['otp'];
                }
                echo json_encode($responsePayload);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to send email. Please ensure your SMTP server is configured."]);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Internal server error", "details" => $e->getMessage()]);
        }
    }

    public function resetPassword() {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->email, $data->otp, $data->password)) {
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

            // Hash new password
            $password_hash = password_hash($data->password, PASSWORD_DEFAULT);
            $stmt = $this->pdo->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
            
            if ($stmt->execute([$password_hash, $email])) {
                echo json_encode(["success" => true, "message" => "Password reset successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to update password"]);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Internal server error", "details" => $e->getMessage()]);
        }
    }
}
