<?php

require_once __DIR__ . '/email/EmailTemplates.php';
require_once __DIR__ . '/email/EmailTransport.php';
require_once __DIR__ . '/email/TransactionalEmails.php';

class EmailHelper {
    private $pdo;

    public function __construct($pdo = null) {
        $this->pdo = $pdo;
    }

    public static function getMailer($type = 'notification') {
        return EmailTransport::getMailer($type);
    }

    public static function getButtonHtml($url, $text) {
        return EmailTemplates::getButtonHtml($url, $text);
    }

    public static function getBaseTemplate($title, $content) {
        return EmailTemplates::getBaseTemplate($title, $content);
    }

    public function send($to, $name, $subject, $body, $isHtml = true) {
        return EmailTransport::send($to, $name, $subject, $body, $isHtml);
    }

    public static function sendWelcomeEmail($to, $name, $signupBonus) {
        return TransactionalEmails::sendWelcomeEmail($to, $name, $signupBonus);
    }

    public static function sendOrderPlaced($to, $name, $orderId, $orderTotal, $items, $details = []) {
        return TransactionalEmails::sendOrderPlaced($to, $name, $orderId, $orderTotal, $items, $details);
    }

    public static function sendOrderConfirmed($to, $name, $orderId, $orderTotal, $items, $trackingNumber = null) {
        return TransactionalEmails::sendOrderConfirmed($to, $name, $orderId, $orderTotal, $items, $trackingNumber);
    }

    public static function sendOrderCancelled($to, $name, $orderId, $reason = null) {
        return TransactionalEmails::sendOrderCancelled($to, $name, $orderId, $reason);
    }

    public static function sendOrderDeliveredWithPoints($to, $name, $orderId, $pointsAwarded, $newTotalPoints, $orderTotal = 0) {
        return TransactionalEmails::sendOrderDeliveredWithPoints($to, $name, $orderId, $pointsAwarded, $newTotalPoints, $orderTotal);
    }

    public static function sendOrderUndelivered($to, $name, $orderId, $courierStatus = '', $pointsRefunded = 0) {
        return TransactionalEmails::sendOrderUndelivered($to, $name, $orderId, $courierStatus, $pointsRefunded);
    }

    public static function sendOrderStatusUpdated($to, $name, $orderId, $newStatus) {
        return TransactionalEmails::sendOrderStatusUpdated($to, $name, $orderId, $newStatus);
    }

    public static function sendLoyaltyPointsUpdated($to, $name, $pointsAdded, $newTotal, $reason) {
        return TransactionalEmails::sendLoyaltyPointsUpdated($to, $name, $pointsAdded, $newTotal, $reason);
    }

    public static function sendBirthdayWish($to, $name, $bonusPoints) {
        return TransactionalEmails::sendBirthdayWish($to, $name, $bonusPoints);
    }

    public static function sendPasswordReset($to, $name, $otp) {
        return TransactionalEmails::sendPasswordReset($to, $name, $otp);
    }

    public static function sendPromoEmail($to, $name, $promoCode, $discountValue, $expiryDate) {
        return TransactionalEmails::sendPromoEmail($to, $name, $promoCode, $discountValue, $expiryDate);
    }

    public static function sendVipUpgrade($to, $name, $privileges) {
        return TransactionalEmails::sendVipUpgrade($to, $name, $privileges);
    }
}
