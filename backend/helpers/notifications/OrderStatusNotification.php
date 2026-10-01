<?php

require_once __DIR__ . '/NotificationEmailTemplate.php';
require_once __DIR__ . '/../email/EmailComponents.php';
require_once __DIR__ . '/../PushNotificationHelper.php';

class OrderStatusNotification {
    public static function send($pdo, $emailHelper, $order, $oldStatus, $newStatus) {
        $email = $order['shipping_email'] ?? null;
        $name = $order['shipping_name'] ?? 'Customer';
        $orderId = $order['id'] ?? 'N/A';

        if (empty($email)) return;

        // Custom template for returns / unsuccessful delivery
        if ($newStatus === 'returned') {
            $title = "Delivery Unsuccessful - Order #$orderId | UnderPure";
            $headerText = "Delivery Attempt Failed";

            $detailsCard = EmailComponents::calloutCard(
                '<p style="margin: 0;">Order Reference: <strong>#' . htmlspecialchars($orderId) . '</strong></p>' .
                '<p style="margin: 4px 0;">Tracking Number: <strong>' . htmlspecialchars($order['tracking_number'] ?: 'N/A') . '</strong></p>' .
                '<p style="margin: 4px 0;">Courier Status: <span style="color: #C0392B; font-weight: 600;">' . htmlspecialchars($order['courier_status'] ?: 'Returned to Facility') . '</span></p>',
                'Returned Consignment Details'
            );

            $bodyHtml = '
                <p>Dear ' . htmlspecialchars($name) . ',</p>
                <p>We are writing to inform you that the delivery attempt for your order <strong>#' . htmlspecialchars($orderId) . '</strong> was unsuccessful. Our courier partner was unable to hand over the package, and it is safely returning to our fulfillment center.</p>
                
                ' . $detailsCard . '

                <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">If you would like us to re-arrange dispatch for this selection, please connect with our team on WhatsApp or reply directly to this communication.</p>
                ' . EmailComponents::button('https://wa.me/923001234567?text=' . urlencode("My Order #$orderId was returned. Please re-dispatch it."), 'Message Client Care on WhatsApp') . '
            ';
        }
        // Custom template for shipped status
        elseif ($newStatus === 'shipped') {
            $title = "Your Selection Has Shipped! Order #" . $orderId . " | UnderPure";
            $headerText = "Package In Transit";

            $trackingUrl = !empty($order['tracking_number']) ? 'https://www.postex.pk/tracking?trackingNumber=' . urlencode($order['tracking_number']) : 'https://www.underpure.com/account';

            $trackingCard = EmailComponents::calloutCard(
                '<p style="margin: 0;">Courier: <strong>PostEx Express</strong></p>' .
                '<p style="margin: 4px 0;">Tracking Number: <strong style="color: #8F6B58; letter-spacing: 1px;">' . htmlspecialchars($order['tracking_number'] ?: 'Standard Dispatch') . '</strong></p>' .
                '<p style="margin: 4px 0;">Estimated Transit: <strong>2 &ndash; 4 Business Days</strong></p>',
                'Shipment Tracking Details'
            );

            $bodyHtml = '
                <p>Dear ' . htmlspecialchars($name) . ',</p>
                <p>Splendid news! Your order <strong>#' . htmlspecialchars($orderId) . '</strong> has successfully completed final inspection and has been transferred to our shipping courier.</p>
                
                ' . $trackingCard . '

                <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">Please keep your primary phone line accessible so the courier ambassador can coordinate arrival upon reaching your location.</p>
                ' . EmailComponents::button($trackingUrl, 'Track Your Shipment') . '
            ';
        }
        // Custom template for delivered status
        elseif ($newStatus === 'delivered') {
            $title = "Delivered! Thank You for Choosing UnderPure";
            $headerText = "Delivered With Care";

            $bodyHtml = '
                <p>Dear ' . htmlspecialchars($name) . ',</p>
                <p>Your package from <strong>UnderPure</strong> has been successfully delivered. We sincerely hope your chosen pieces envelop you in pure comfort and timeless beauty.</p>
                
                ' . EmailComponents::calloutCard(
                    'We invite you to share your experience or explore matching coordinates from our seasonal collection.',
                    'Order #' . htmlspecialchars($orderId) . ' Complete',
                    'Delivered'
                ) . '

                <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">Should you require any fit guidance, care advice, or concierge assistance, our team remains at your complete disposal.</p>
                ' . EmailComponents::button('https://www.underpure.com/account', 'Review Your Pieces') . '
            ';
        }
        // Custom template for cancelled status
        elseif ($newStatus === 'cancelled') {
            $title = "Order #" . $orderId . " Cancellation Notice | UnderPure";
            $headerText = "Order Cancelled";

            $bodyHtml = '
                <p>Dear ' . htmlspecialchars($name) . ',</p>
                <p>This communication confirms that your order <strong>#' . htmlspecialchars($orderId) . '</strong> has been cancelled.</p>
                
                ' . EmailComponents::calloutCard(
                    'If this cancellation was unintended, or if any payment or points deduction occurred, please connect with our concierge team immediately.',
                    'Order Status',
                    'Cancelled'
                ) . '

                ' . EmailComponents::button('mailto:underpure18@gmail.com', 'Connect With Client Care') . '
            ';
        }
        // Default brand status updates
        else {
            $title = "Order #" . $orderId . " Update: " . strtoupper($newStatus) . " | UnderPure";
            $headerText = "Order Progress";

            $infoGrid = EmailComponents::infoGrid([
                'Order Reference' => '#' . htmlspecialchars($orderId),
                'Previous Status' => '<span style="text-decoration: line-through; color: #9A948E;">' . ucfirst($oldStatus) . '</span>',
                'Current Status' => '<strong style="color: #8F6B58; letter-spacing: 0.1em; text-transform: uppercase;">' . ucfirst($newStatus) . '</strong>'
            ]);

            $bodyHtml = '
                <p>Dear ' . htmlspecialchars($name) . ',</p>
                <p>Your order <strong>#' . htmlspecialchars($orderId) . '</strong> has progressed to a new status:</p>
                
                ' . $infoGrid . '

                ' . EmailComponents::button('https://www.underpure.com/account', 'View Order Details') . '
            ';
        }

        $htmlMessage = NotificationEmailTemplate::getHtmlTemplate($title, $headerText, $bodyHtml);
        if ($emailHelper) {
            $emailHelper->send($email, $name, $title, $htmlMessage, true);
        }

        // Trigger Database & Web Push Notifications
        try {
            $notifTitle = "Order #{$orderId} Update! ✦";
            $notifMsg = "Your order status has been updated to " . ucfirst($newStatus) . ".";
            if ($newStatus === 'shipped') {
                $notifMsg = "Great news! Your order #{$orderId} has been shipped. 🚀";
            } elseif ($newStatus === 'delivered') {
                $notifMsg = "Delivered! Your order #{$orderId} has been successfully received. Thank you!";
            } elseif ($newStatus === 'cancelled') {
                $notifMsg = "Your order #{$orderId} has been cancelled.";
            }
            
            $notifType = "order";
            $notifLink = "/account/orders";

            $notifStmt = $pdo->prepare("INSERT INTO notifications (title, message, type, link) VALUES (?, ?, ?, ?)");
            $notifStmt->execute([$notifTitle, $notifMsg, $notifType, $notifLink]);
            $dbNotifId = $pdo->lastInsertId();

            if (!empty($order['user_id'])) {
                $userNotifStmt = $pdo->prepare("INSERT INTO user_notifications (user_id, notification_id, is_read) VALUES (?, ?, 0)");
                $userNotifStmt->execute([$order['user_id'], $dbNotifId]);
            }
        } catch (\Exception $dbEx) {
            error_log("Failed to insert db order status update notification: " . $dbEx->getMessage());
        }

        if (!empty($order['user_id'])) {
            try {
                PushNotificationHelper::send($notifTitle, $notifMsg, "/account/orders", $order['user_id']);
            } catch (\Exception $pushEx) {
                error_log("Failed to send push order status update notification: " . $pushEx->getMessage());
            }
        }
    }
}
