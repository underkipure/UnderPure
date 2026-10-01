<?php

require_once __DIR__ . "/../../../helpers/NotificationHelper.php";
require_once __DIR__ . "/../../../helpers/EmailHelper.php";
require_once __DIR__ . "/OrderInventoryService.php";
require_once __DIR__ . "/OrderLoyaltyService.php";

class OrderStatusService
{
    private $pdo;
    private $inventoryService;
    private $loyaltyService;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
        $this->inventoryService = new OrderInventoryService($pdo);
        $this->loyaltyService = new OrderLoyaltyService($pdo);
    }

    /**
     * Update order status (Admin only)
     */
    public function updateOrderStatus($orderId)
    {
        if (!isset($_REQUEST['user']) || $_REQUEST['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        $rawBody = file_get_contents("php://input");
        $data = json_decode($rawBody, true);

        if (!isset($data['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Status is required']);
            return;
        }

        try {
            // Get old status and full order data for notifications
            $stmtOld = $this->pdo->prepare("SELECT * FROM orders WHERE id = :id");
            $stmtOld->execute([':id' => $orderId]);
            $orderData = $stmtOld->fetch(\PDO::FETCH_ASSOC);

            if (!$orderData) {
                http_response_code(404);
                echo json_encode(['error' => 'Order not found']);
                return;
            }

            $oldStatus = $orderData['status'] ?? '';
            $newStatus = $data['status'];

            $stmt = $this->pdo->prepare("UPDATE orders SET status = :status WHERE id = :id");
            $stmt->execute([
                ':status' => $newStatus,
                ':id' => $orderId
            ]);

            // Invalidate admin dashboard cache on status change
            require_once __DIR__ . '/../../../helpers/CacheHelper.php';
            CacheHelper::invalidate('admin_dashboard_stats');

            // Award UP Points if status updated to delivered
            if ($newStatus === 'delivered') {
                $this->loyaltyService->awardLoyaltyPointsForOrder($orderId);
            }

            // Refund redeemed points if status changed to cancelled or returned
            if ($newStatus === 'cancelled' || $newStatus === 'returned') {
                $this->loyaltyService->refundLoyaltyPointsForCancelledOrder($orderId);
            }

            // Send status change notification & email
            if ($oldStatus !== $newStatus) {
                $orderData['status'] = $newStatus;
                $notifier = new NotificationHelper($this->pdo);
                $notifier->sendOrderStatusUpdate($orderData, $oldStatus, $newStatus, false);

                // Auto call PostEx when status changes to confirmed
                $trackingNumber = $orderData['tracking_number'] ?? null;
                $items = [];
                if ($newStatus === 'confirmed') {
                    $stmtItems = $this->pdo->prepare("SELECT oi.*, COALESCE(NULLIF(oi.product_name, 'Unknown Product'), p.name, oi.product_name) as product_name FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = :order_id");
                    $stmtItems->execute([':order_id' => $orderId]);
                    $items = $stmtItems->fetchAll(\PDO::FETCH_ASSOC);

                    $stmtAddr = $this->pdo->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'contact_address'");
                    $stmtAddr->execute();
                    $pickupAddress = $stmtAddr->fetchColumn();
                    if (!$pickupAddress) $pickupAddress = 'Lahore, Pakistan';

                    require_once __DIR__ . '/../../../helpers/PostExHelper.php';
                    $phone = !empty($orderData['shipping_phone']) ? $orderData['shipping_phone'] : '03000000000';

                    $postexData = [
                        'order_id'         => $orderData['id'],
                        'shipping_name'    => $orderData['shipping_name'],
                        'shipping_phone'   => $phone,
                        'shipping_address' => $orderData['shipping_address'],
                        'shipping_city'    => $orderData['shipping_city'],
                        'total_amount'     => $orderData['total'],
                        'items'            => $items,
                        'pickup_address'   => $pickupAddress
                    ];

                    $postexResult = PostExHelper::createShipment($postexData);
                    if ($postexResult['success']) {
                        $trackingNumber = $postexResult['tracking_number'];
                        PostExHelper::saveTrackingToOrder($this->pdo, $orderId, $trackingNumber);
                    } else {
                        // Revert status to old if PostEx fails
                        $stmtRevert = $this->pdo->prepare("UPDATE orders SET status = :status WHERE id = :id");
                        $stmtRevert->execute([':status' => $oldStatus, ':id' => $orderId]);

                        http_response_code(500);
                        echo json_encode(['error' => 'Failed to book shipment with PostEx', 'details' => $postexResult['error']]);
                        return;
                    }
                }

                // Dispatch specific transactional email based on new status
                if (!empty($orderData['shipping_email'])) {
                    if ($newStatus === 'confirmed') {
                        EmailHelper::sendOrderConfirmed($orderData['shipping_email'], $orderData['shipping_name'] ?? 'Valued Customer', $orderId, (float)$orderData['total'], $items, $trackingNumber);
                    } elseif ($newStatus === 'cancelled') {
                        EmailHelper::sendOrderCancelled($orderData['shipping_email'], $orderData['shipping_name'] ?? 'Valued Customer', $orderId);
                    } elseif ($newStatus === 'returned') {
                        EmailHelper::sendOrderUndelivered($orderData['shipping_email'], $orderData['shipping_name'] ?? 'Valued Customer', $orderId, $orderData['courier_status'] ?? 'Returned to facility', (int)($orderData['points_used'] ?? 0));
                    } elseif ($newStatus !== 'delivered') {
                        // Delivered status is handled by awardLoyaltyPointsForOrder
                        EmailHelper::sendOrderStatusUpdated($orderData['shipping_email'], $orderData['shipping_name'], $orderId, $newStatus);
                    }
                }
            }

            $isStockRestoredState = ($newStatus === 'cancelled' || $newStatus === 'returned');
            $wasStockRestoredState = ($oldStatus === 'cancelled' || $oldStatus === 'returned');

            // If changing to cancelled/returned and it wasn't already in a stock-restored state
            if ($isStockRestoredState && !$wasStockRestoredState) {
                $this->inventoryService->restoreOrderStock($orderId);
            }
            // If changing FROM cancelled/returned to active (e.g. pending/processing)
            elseif ($wasStockRestoredState && !$isStockRestoredState) {
                $this->inventoryService->redeductOrderStock($orderId);
            }

            http_response_code(200);
            echo json_encode([
                'message' => 'Order status updated successfully',
                'order' => [
                    'id' => $orderId,
                    'status' => $newStatus
                ]
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * Cancel an order (Admin only)
     */
    public function cancelOrder($orderId)
    {
        if (!isset($_REQUEST['user']) || $_REQUEST['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        try {
            // Check if order exists
            $stmt = $this->pdo->prepare("SELECT * FROM orders WHERE id = :id");
            $stmt->execute([':id' => $orderId]);
            $order = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$order) {
                http_response_code(404);
                echo json_encode(['error' => 'Order not found']);
                return;
            }

            if ($order['status'] === 'delivered') {
                http_response_code(400);
                echo json_encode(['error' => 'Cannot cancel a delivered order']);
                return;
            }

            // Update status to cancelled
            $stmt = $this->pdo->prepare("UPDATE orders SET status = 'cancelled' WHERE id = :id");
            $stmt->execute([':id' => $orderId]);

            // Refund redeemed points if any
            $this->loyaltyService->refundLoyaltyPointsForCancelledOrder($orderId);

            // Send order cancelled notification & email
            $order['status'] = 'cancelled';
            $notifier = new NotificationHelper($this->pdo);
            $notifier->sendOrderCancelled($order, false);

            if (!empty($order['shipping_email'])) {
                EmailHelper::sendOrderCancelled($order['shipping_email'], $order['shipping_name'] ?? 'Valued Customer', $orderId);
            }

            // Add Stock back to Inventory
            $this->inventoryService->restoreOrderStock($orderId);

            http_response_code(200);
            echo json_encode([
                'message' => 'Order cancelled successfully',
                'order'   => [
                    'id'     => $orderId,
                    'status' => 'cancelled'
                ]
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }
}
