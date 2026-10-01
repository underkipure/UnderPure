<?php

require_once __DIR__ . '/../EmailHelper.php';

/**
 * Class OtpVerificationService
 * Shared utility for generating, dispatching, verifying, and clearing one-time password (OTP) codes.
 */
class OtpVerificationService {
    private $pdo;

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Generate numeric random OTP
     *
     * @param int $length
     * @return string
     */
    public static function generateOtp(int $length = 6): string {
        $min = (int)pow(10, $length - 1);
        $max = (int)(pow(10, $length) - 1);
        return (string)random_int($min, $max);
    }

    /**
     * Generate and persist an OTP for a user with a 10-minute expiry and 0 attempts
     *
     * @param string $email
     * @return string Generated OTP code
     */
    public function createAndSaveOtp(string $email): string {
        $otp = self::generateOtp(6);
        $stmt = $this->pdo->prepare("
            UPDATE users 
            SET otp_code = ?, 
                otp_expires_at = DATE_ADD(NOW(), INTERVAL 10 MINUTE), 
                otp_attempts = 0 
            WHERE email = ?
        ");
        $stmt->execute([$otp, trim($email)]);
        return $otp;
    }

    /**
     * Verify an OTP against the user record with expiration, lockout, and timing attack protection
     *
     * @param string $email
     * @param string $otp
     * @param bool $clearOnSuccess
     * @return array ['valid' => bool, 'user' => ?array, 'error' => ?string]
     */
    public function verifyOtp(string $email, string $otp, bool $clearOnSuccess = true): array {
        $email = trim($email);
        $otp = trim($otp);

        $stmt = $this->pdo->prepare("
            SELECT *, 
                   (otp_expires_at IS NOT NULL AND otp_expires_at < NOW()) AS is_otp_expired 
            FROM users 
            WHERE email = ?
        ");
        $stmt->execute([$email]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$user) {
            return [
                'valid' => false,
                'user' => null,
                'error' => 'No user found with this email address'
            ];
        }

        // 1. Check max attempts lockout (5 attempts limit)
        $attempts = (int)($user['otp_attempts'] ?? 0);
        if ($attempts >= 5) {
            return [
                'valid' => false,
                'user' => $user,
                'error' => 'Too many failed verification attempts. This code has been locked for security. Please request a new code.'
            ];
        }

        // 2. Check expiration (10-minute TTL) evaluated against database time
        if (!empty($user['is_otp_expired'])) {
            return [
                'valid' => false,
                'user' => $user,
                'error' => 'Verification code has expired. Please request a new code.'
            ];
        }

        // 3. Verify OTP code using timing-safe comparison
        if (empty($user['otp_code']) || !hash_equals((string)$user['otp_code'], (string)$otp)) {
            // Increment failed attempts
            $newAttempts = $attempts + 1;
            $remaining = max(0, 5 - $newAttempts);
            $upd = $this->pdo->prepare("UPDATE users SET otp_attempts = ? WHERE id = ?");
            $upd->execute([$newAttempts, $user['id']]);

            $errorMsg = $remaining > 0
                ? "Invalid verification code. {$remaining} attempt(s) remaining."
                : "Invalid verification code. Maximum attempts reached. Please request a new code.";

            return [
                'valid' => false,
                'user' => $user,
                'error' => $errorMsg
            ];
        }

        // 4. Success: clear code, expiry, and reset attempts
        if ($clearOnSuccess) {
            $this->clearOtp($email);
            $user['otp_code'] = null;
            $user['otp_expires_at'] = null;
            $user['otp_attempts'] = 0;
        }

        return [
            'valid' => true,
            'user' => $user,
            'error' => null
        ];
    }

    /**
     * Clear stored OTP, expiry timestamp, and reset attempts for a user
     *
     * @param string $email
     * @return bool
     */
    public function clearOtp(string $email): bool {
        $stmt = $this->pdo->prepare("UPDATE users SET otp_code = NULL, otp_expires_at = NULL, otp_attempts = 0 WHERE email = ?");
        return $stmt->execute([trim($email)]);
    }

    /**
     * Helper to dispatch password reset OTP email
     *
     * @param string $email
     * @param string $userName
     * @return array ['success' => bool, 'otp' => string, 'mailSent' => bool]
     */
    public function sendPasswordResetOtp(string $email, string $userName): array {
        $otp = $this->createAndSaveOtp($email);
        $mailSent = EmailHelper::sendPasswordReset($email, $userName, $otp);

        $isLocalhost = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1'])
            || (isset($_SERVER['SERVER_NAME']) && in_array($_SERVER['SERVER_NAME'], ['localhost', '127.0.0.1']));

        return [
            'success' => $mailSent || $isLocalhost,
            'otp' => $otp,
            'mailSent' => $mailSent,
            'isLocalhost' => $isLocalhost
        ];
    }
}
