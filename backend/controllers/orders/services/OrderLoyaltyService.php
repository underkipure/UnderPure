<?php

require_once __DIR__ . "/../../../helpers/EmailHelper.php";
require_once __DIR__ . "/../../../helpers/PushNotificationHelper.php";

class OrderLoyaltyService
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Award loyalty points to customer when order is DELIVERED
     */
    public function awardLoyaltyPointsForOrder($orderId)
    {
        try {
            $stmt = $this->pdo->prepare("SELECT id, user_id, shipping_name, shipping_email, reward_points, points_awarded, status, total FROM orders WHERE id = ?");
            $stmt->execute([$orderId]);
            $order = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$order) {
                return false;
            }

            if ($order['status'] !== 'delivered') {
                return false;
            }

            // Handle guest orders: send delivered email with 0 points
            if (empty($order['user_id'])) {
                if (!empty($order['shipping_email']) && (int)$order['points_awarded'] === 0) {
                    $this->pdo->prepare("UPDATE orders SET points_awarded = 1 WHERE id = ?")->execute([$orderId]);
                    EmailHelper::sendOrderDeliveredWithPoints(
                        $order['shipping_email'],
                        !empty($order['shipping_name']) ? $order['shipping_name'] : 'Valued Customer',
                        $orderId,
                        0,
                        0,
                        (float)($order['total'] ?? 0)
                    );
                }
                return true;
            }

            // Points already awarded
            if ((int)$order['points_awarded'] !== 0) {
                return false;
            }

            $userId = (int)$order['user_id'];
            $rewardPoints = (int)($order['reward_points'] ?? 0);

            $this->pdo->beginTransaction();

            // 1. Atomic claim: mark points_awarded = 1 ONLY IF currently 0 and status is delivered
            $updOrder = $this->pdo->prepare("UPDATE orders SET points_awarded = 1 WHERE id = ? AND points_awarded = 0 AND status = 'delivered'");
            $updOrder->execute([$orderId]);

            // If 0 rows affected, another concurrent worker/request already awarded points
            if ($updOrder->rowCount() === 0) {
                $this->pdo->rollBack();
                return false;
            }

            // 2. Credit loyalty points to user only after successful atomic claim
            if ($rewardPoints > 0) {
                $updUser = $this->pdo->prepare("UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?");
                $updUser->execute([$rewardPoints, $userId]);
            }

            // 3. Fetch new total points
            $ptsStmt = $this->pdo->prepare("SELECT loyalty_points FROM users WHERE id = ?");
            $ptsStmt->execute([$userId]);
            $newTotalPoints = (int)$ptsStmt->fetchColumn();

            $this->pdo->commit();

            // 4. Send Email Confirmation
            if (!empty($order['shipping_email'])) {
                try {
                    EmailHelper::sendOrderDeliveredWithPoints(
                        $order['shipping_email'],
                        !empty($order['shipping_name']) ? $order['shipping_name'] : 'Valued Customer',
                        $orderId,
                        $rewardPoints,
                        $newTotalPoints,
                        (float)($order['total'] ?? 0)
                    );
                } catch (\Throwable $ee) {
                    error_log("Failed to send loyalty points email for order #$orderId: " . $ee->getMessage());
                }
            }

            // 5. Send In-App / User Panel Notification
            try {
                $title = "UP Coins Credited! 🪙";
                $message = "Congratulations! You have earned " . number_format($rewardPoints) . " UP Coins for your delivered Order #{$orderId}.";
                $type = "loyalty";
                $link = "/account";

                $notifStmt = $this->pdo->prepare("INSERT INTO notifications (title, message, type, link) VALUES (?, ?, ?, ?)");
                $notifStmt->execute([$title, $message, $type, $link]);
                $notifId = $this->pdo->lastInsertId();

                $userNotifStmt = $this->pdo->prepare("INSERT INTO user_notifications (user_id, notification_id, is_read) VALUES (?, ?, 0)");
                $userNotifStmt->execute([$userId, $notifId]);

                // Send Web Push Notification if subscribed
                try {
                    PushNotificationHelper::send($title, $message, $link, $userId);
                } catch (\Throwable $pe) {
                }
            } catch (\Throwable $ne) {
                error_log("Failed to insert loyalty notification for order #$orderId: " . $ne->getMessage());
            }

            return true;
        } catch (\Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            error_log("Error in OrderLoyaltyService::awardLoyaltyPointsForOrder: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Refund redeemed points if order is cancelled or returned
     */
    public function refundLoyaltyPointsForCancelledOrder($orderId)
    {
        try {
            $stmt = $this->pdo->prepare("SELECT id, user_id, points_used, status FROM orders WHERE id = ?");
            $stmt->execute([$orderId]);
            $order = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$order || empty($order['user_id']) || (int)$order['points_used'] <= 0) {
                return false;
            }

            $userId = (int)$order['user_id'];
            $pointsUsed = (int)$order['points_used'];

            $this->pdo->beginTransaction();

            // 1. Atomic claim: mark points_used = 0 ONLY IF currently > 0
            $updOrder = $this->pdo->prepare("UPDATE orders SET points_used = 0 WHERE id = ? AND points_used > 0");
            $updOrder->execute([$orderId]);

            // If 0 rows affected, another request already processed the refund
            if ($updOrder->rowCount() === 0) {
                $this->pdo->rollBack();
                return false;
            }

            // 2. Refund points back to user only after successful atomic claim
            $updUser = $this->pdo->prepare("UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?");
            $updUser->execute([$pointsUsed, $userId]);

            $this->pdo->commit();

            // 3. Send In-App Notification
            try {
                $title = "UP Coins Refunded 🪙";
                $message = number_format($pointsUsed) . " UP Coins redeemed on Order #{$orderId} have been refunded to your account.";
                $type = "loyalty";
                $link = "/account";

                $notifStmt = $this->pdo->prepare("INSERT INTO notifications (title, message, type, link) VALUES (?, ?, ?, ?)");
                $notifStmt->execute([$title, $message, $type, $link]);
                $notifId = $this->pdo->lastInsertId();

                $userNotifStmt = $this->pdo->prepare("INSERT INTO user_notifications (user_id, notification_id, is_read) VALUES (?, ?, 0)");
                $userNotifStmt->execute([$userId, $notifId]);
            } catch (\Throwable $ne) {
            }

            return true;
        } catch (\Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            error_log("Error in OrderLoyaltyService::refundLoyaltyPointsForCancelledOrder: " . $e->getMessage());
            return false;
        }
    }
}
