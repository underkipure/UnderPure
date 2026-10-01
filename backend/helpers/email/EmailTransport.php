<?php

require_once __DIR__ . '/../../libs/PHPMailer-6.9.1/src/Exception.php';
require_once __DIR__ . '/../../libs/PHPMailer-6.9.1/src/PHPMailer.php';
require_once __DIR__ . '/../../libs/PHPMailer-6.9.1/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailTransport {
    public static function getMailer($type = 'notification') {
        $mail = new PHPMailer(true);
        $mail->SMTPDebug = 0;
        $mail->Debugoutput = function($str, $level) {
            // Silently log or ignore
        };

        $userKey = $type === 'noreply' ? 'SMTP_USER_NOREPLY' : 'SMTP_USER_NOTIFICATION';
        $passKey = $type === 'noreply' ? 'SMTP_PASS_NOREPLY' : 'SMTP_PASS_NOTIFICATION';
        $fromEmailKey = $type === 'noreply' ? 'SMTP_FROM_EMAIL_NOREPLY' : 'SMTP_FROM_EMAIL_NOTIFICATION';
        $fromNameKey = $type === 'noreply' ? 'SMTP_FROM_NAME_NOREPLY' : 'SMTP_FROM_NAME_NOTIFICATION';

        try {
            // Check if SMTP is configured
            if (isset($_ENV['SMTP_HOST']) && $_ENV['SMTP_HOST'] !== 'smtp.gmail.com') {
                $mail->isSMTP();
                $mail->Timeout    = 3; // 3 seconds timeout to prevent blocking checkout
                $mail->Host       = $_ENV['SMTP_HOST'];
                $mail->SMTPAuth   = true;
                $mail->Username   = $_ENV[$userKey] ?? $_ENV['SMTP_USER'] ?? '';
                $mail->Password   = $_ENV[$passKey] ?? $_ENV['SMTP_PASS'] ?? '';
                $mail->SMTPSecure = ($_ENV['SMTP_PORT'] == 465) ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = $_ENV['SMTP_PORT'];
            } elseif (isset($_ENV['SMTP_HOST']) && $_ENV['SMTP_HOST'] === 'smtp.gmail.com' && $_ENV['SMTP_USER'] !== 'your_email@gmail.com') {
                $mail->isSMTP();
                $mail->Timeout    = 3; // 3 seconds timeout to prevent blocking checkout
                $mail->Host       = $_ENV['SMTP_HOST'];
                $mail->SMTPAuth   = true;
                $mail->Username   = $_ENV[$userKey] ?? $_ENV['SMTP_USER'] ?? '';
                $mail->Password   = $_ENV[$passKey] ?? $_ENV['SMTP_PASS'] ?? '';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                $mail->Port       = 465;
            }

            $fromEmail = $_ENV[$fromEmailKey] ?? $_ENV['SMTP_FROM_EMAIL'] ?? 'underpure18@gmail.com';
            $fromName = $_ENV[$fromNameKey] ?? $_ENV['SMTP_FROM_NAME'] ?? 'Underpure Store';
            
            $mail->setFrom($fromEmail, $fromName);
            $mail->isHTML(true);

            return $mail;
        } catch (Exception $e) {
            error_log("Mailer configuration error: {$mail->ErrorInfo}");
            return null;
        }
    }

    public static function send($to, $name, $subject, $body, $isHtml = true) {
        $mail = self::getMailer();
        if (!$mail) return false;

        try {
            $mail->addAddress($to, $name);
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->isHTML($isHtml);
            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send email to $to: {$mail->ErrorInfo}");
            return false;
        }
    }
}
