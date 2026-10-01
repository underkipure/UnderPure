<?php

require_once __DIR__ . '/NotificationEmailTemplate.php';
require_once __DIR__ . '/../email/EmailComponents.php';
require_once __DIR__ . '/../PushNotificationHelper.php';

class OrderPlacedNotification {
    public static function send($pdo, $emailHelper, $order) {
        $orderId = $order['id'] ?? null;
        if (!$orderId) return;

        // Fetch full order data to make it extremely robust
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$orderId]);
        $fullOrder = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$fullOrder) return;

        // Fetch order items
        $stmtItems = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $stmtItems->execute([$orderId]);
        $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

        $name = $fullOrder['shipping_name'] ?: 'Customer';
        $email = $fullOrder['shipping_email'] ?: null;
        $total = (float)$fullOrder['total'];

        $title = "Order Placed Successfully #" . $orderId . " | UnderPure";
        $headerText = "Order Placed Successfully";

        // Build itemized table using EmailComponents
        $itemsHtml = EmailComponents::orderTable($items, $total);

        $destHtml = '
            <p style="margin: 0; font-weight: 600; color: #111111;">' . htmlspecialchars($fullOrder['shipping_name']) . '</p>
            <p style="margin: 3px 0; color: #6E6864;">Phone: ' . htmlspecialchars($fullOrder['shipping_phone']) . '</p>
            <p style="margin: 3px 0; color: #6E6864;">' . htmlspecialchars($fullOrder['shipping_address']) . '</p>
            <p style="margin: 3px 0; color: #6E6864;">' . htmlspecialchars($fullOrder['shipping_city']) . ' ' . htmlspecialchars($fullOrder['shipping_zip']) . ', Pakistan</p>
        ';
        $shippingCard = EmailComponents::calloutCard($destHtml, 'Delivery Destination');

        $giftCard = !empty($fullOrder['gift_note'])
            ? EmailComponents::calloutCard(
                '<p style="margin: 0; font-style: italic; color: #3A3533;">"' . htmlspecialchars($fullOrder['gift_note']) . '"</p>',
                'Gift Note'
            )
            : '';

        $bodyHtml = '
            <p>Dear ' . htmlspecialchars($name) . ',</p>
            <p>Thank you for choosing <strong>UnderPure</strong>. Your order has been placed successfully and is currently under review by our atelier concierge.</p>
            
            ' . $itemsHtml . '
            ' . $shippingCard . '
            ' . $giftCard . '

            <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">Once your order is confirmed by our concierge team, you will receive an official confirmation notice with courier dispatch details.</p>
            ' . EmailComponents::button('https://www.underpure.com/account?tab=orders', 'View & Track Order') . '
        ';

        $htmlMessage = NotificationEmailTemplate::getHtmlTemplate($title, $headerText, $bodyHtml);

        if (!empty($email) && $emailHelper) {
            $emailHelper->send($email, $name, $title, $htmlMessage, true);
        }

        // Trigger Database & Web Push Notifications
        try {
            $notifTitle = "Order Placed Successfully! ✦";
            $notifMsg = "Thank you for shopping! Your order #{$orderId} has been successfully received.";
            $notifType = "order";
            $notifLink = "/account/orders";

            $notifStmt = $pdo->prepare("INSERT INTO notifications (title, message, type, link) VALUES (?, ?, ?, ?)");
            $notifStmt->execute([$notifTitle, $notifMsg, $notifType, $notifLink]);
            $dbNotifId = $pdo->lastInsertId();

            if (!empty($fullOrder['user_id'])) {
                $userNotifStmt = $pdo->prepare("INSERT INTO user_notifications (user_id, notification_id, is_read) VALUES (?, ?, 0)");
                $userNotifStmt->execute([$fullOrder['user_id'], $dbNotifId]);
            }
        } catch (\Exception $dbEx) {
            error_log("Failed to insert db order placed notification: " . $dbEx->getMessage());
        }

        if (!empty($fullOrder['user_id'])) {
            try {
                PushNotificationHelper::send($notifTitle, $notifMsg, "/account/orders", $fullOrder['user_id']);
            } catch (\Exception $pushEx) {
                error_log("Failed to send push order placed notification: " . $pushEx->getMessage());
            }
        }
    }
}
