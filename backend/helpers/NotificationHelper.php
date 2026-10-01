<?php

require_once __DIR__ . '/EmailHelper.php';
require_once __DIR__ . '/WhatsAppHelper.php';
require_once __DIR__ . '/notifications/NotificationEmailTemplate.php';
require_once __DIR__ . '/notifications/OrderPlacedNotification.php';
require_once __DIR__ . '/notifications/OrderStatusNotification.php';

class NotificationHelper
{
    private $email;
    private $whatsapp;
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
        $this->email = new EmailHelper($pdo);
        $this->whatsapp = new WhatsAppHelper($pdo);
    }

    public function sendOrderPlaced($order, $sendEmail = true)
    {
        $emailService = $sendEmail ? $this->email : null;
        return OrderPlacedNotification::send($this->pdo, $emailService, $order);
    }

    public function sendOrderStatusUpdate($order, $oldStatus, $newStatus, $sendEmail = true)
    {
        $emailService = $sendEmail ? $this->email : null;
        return OrderStatusNotification::send($this->pdo, $emailService, $order, $oldStatus, $newStatus);
    }

    public function sendOrderAccepted($order, $sendEmail = false)
    {
        $this->sendOrderStatusUpdate($order, 'pending', 'processing', $sendEmail);
    }

    public function sendOrderCancelled($order, $sendEmail = false)
    {
        $this->sendOrderStatusUpdate($order, $order['status'] ?? 'processing', 'cancelled', $sendEmail);
    }
}
