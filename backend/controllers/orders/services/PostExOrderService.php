<?php

require_once __DIR__ . "/../../../helpers/NotificationHelper.php";
require_once __DIR__ . "/../../../helpers/EmailHelper.php";
require_once __DIR__ . "/../../../helpers/PostExHelper.php";
require_once __DIR__ . "/../../../helpers/shipping/ShippingGatewayFactory.php";
require_once __DIR__ . "/OrderInventoryService.php";
require_once __DIR__ . "/OrderLoyaltyService.php";

class PostExOrderService
{
    private $pdo;
    private $inventoryService;
    private $shippingGateway;
    private $loyaltyService;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
        $this->inventoryService = new OrderInventoryService($pdo);
        $this->shippingGateway = ShippingGatewayFactory::create('postex');
        $this->loyaltyService = new OrderLoyaltyService($pdo);
    }

    /**
     * Accept order → Send to PostEx for shipment booking (Admin only)
     */
    public function acceptOrder($orderId)
    {
        if (!isset($_REQUEST['user']) || $_REQUEST['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("SELECT * FROM orders WHERE id = :id");
            $stmt->execute([':id' => $orderId]);
            $order = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$order) {
                http_response_code(404);
                echo json_encode(['error' => 'Order not found']);
                return;
            }

            if ($order['status'] === 'cancelled') {
                http_response_code(400);
                echo json_encode(['error' => 'Cannot accept a cancelled order']);
                return;
            }

            if ($order['status'] !== 'pending') {
                http_response_code(400);
                echo json_encode(['error' => 'Order already processed. Current status: ' . $order['status']]);
                return;
            }

            $stmtItems = $this->pdo->prepare("SELECT oi.*, COALESCE(NULLIF(oi.product_name, 'Unknown Product'), p.name, oi.product_name) as product_name FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = :order_id");
            $stmtItems->execute([':order_id' => $orderId]);
            $items = $stmtItems->fetchAll(\PDO::FETCH_ASSOC);

            $stmtAddr = $this->pdo->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'contact_address'");
            $stmtAddr->execute();
            $pickupAddress = $stmtAddr->fetchColumn();
            if (!$pickupAddress) {
                $pickupAddress = 'Lahore, Pakistan';
            }

            $phone = !empty($order['shipping_phone']) ? $order['shipping_phone'] : '03000000000';

            $postexData = [
                'order_id'         => $order['id'],
                'shipping_name'    => $order['shipping_name'],
                'shipping_phone'   => $phone,
                'shipping_address' => $order['shipping_address'],
                'shipping_city'    => $order['shipping_city'],
                'total_amount'     => $order['total'],
                'items'            => $items,
                'pickup_address'   => $pickupAddress
            ];

            $postexResult = $this->shippingGateway->createShipment($postexData);
            $trackingNumber = null;

            if ($postexResult['success']) {
                PostExHelper::saveTrackingToOrder($this->pdo, $orderId, $postexResult['tracking_number']);
                $trackingNumber = $postexResult['tracking_number'];

                http_response_code(200);
                echo json_encode([
                    'message'         => 'Order accepted and sent to PostEx successfully',
                    'tracking_number' => $postexResult['tracking_number'],
                    'order'           => [
                        'id'              => $orderId,
                        'status'          => 'processing',
                        'tracking_number' => $postexResult['tracking_number'],
                        'courier_status'  => 'booked'
                    ]
                ]);
            } else {
                $stmt = $this->pdo->prepare("UPDATE orders SET status = 'processing' WHERE id = :id");
                $stmt->execute([':id' => $orderId]);

                http_response_code(200);
                echo json_encode([
                    'message'       => 'Order accepted but PostEx booking failed. Status updated to processing.',
                    'postex_error'  => $postexResult['error'] ?? 'Unknown PostEx error',
                    'order'         => [
                        'id'     => $orderId,
                        'status' => 'processing'
                    ]
                ]);
            }

            // Send order accepted notification & confirmation email
            $order['status'] = 'processing';
            $order['tracking_number'] = $trackingNumber;
            $notifier = new NotificationHelper($this->pdo);
            $notifier->sendOrderAccepted($order, false);

            if (!empty($order['shipping_email'])) {
                EmailHelper::sendOrderConfirmed(
                    $order['shipping_email'],
                    $order['shipping_name'] ?? 'Valued Customer',
                    $orderId,
                    (float)$order['total'],
                    $items,
                    $trackingNumber
                );
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * Sync local order statuses from PostEx tracking (Admin only)
     */
    public function syncPostExStatuses()
    {
        if (!isset($_REQUEST['user']) || $_REQUEST['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        try {
            $stmt = $this->pdo->query("SELECT id, tracking_number, status, courier_status, shipping_name, shipping_email, points_used FROM orders WHERE tracking_number IS NOT NULL AND status NOT IN ('cancelled', 'delivered', 'returned')");
            $orders = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            if (empty($orders)) {
                http_response_code(200);
                echo json_encode(['message' => 'No active PostEx orders to sync.', 'updated' => 0]);
                return;
            }

            $updatedCount = 0;

            foreach ($orders as $order) {
                $trackingResult = $this->shippingGateway->trackShipment($order['tracking_number']);

                if ($trackingResult['success'] && isset($trackingResult['tracking']['dist'])) {
                    $dist = $trackingResult['tracking']['dist'];

                    $isCancelled = false;
                    $isDelivered = false;
                    $isReturned = false;
                    $lastMessage = $dist['transactionStatus'] ?? '';

                    if (isset($dist['transactionStatusHistory']) && is_array($dist['transactionStatusHistory'])) {
                        foreach ($dist['transactionStatusHistory'] as $historyItem) {
                            $msg = strtolower($historyItem['transactionStatusMessage'] ?? '');
                            $lastMessage = $historyItem['transactionStatusMessage'];

                            if (strpos($msg, 'cancel') !== false) {
                                $isCancelled = true;
                            } elseif (strpos($msg, 'deliver') !== false) {
                                $isDelivered = true;
                            } elseif (strpos($msg, 'return') !== false || strpos($msg, 'rtv') !== false) {
                                $isReturned = true;
                            }
                        }
                    }

                    $newStatus = $order['status'];
                    if ($isReturned) {
                        $newStatus = 'returned';
                    } elseif ($isCancelled) {
                        $newStatus = 'cancelled';
                    } elseif ($isDelivered) {
                        $newStatus = 'delivered';
                    } elseif (strpos(strtolower($lastMessage), 'ship') !== false || strpos(strtolower($lastMessage), 'transit') !== false) {
                        $newStatus = 'shipped';
                    }

                    if ($newStatus !== $order['status'] || $lastMessage !== $order['courier_status']) {
                        $updStmt = $this->pdo->prepare("UPDATE orders SET status = :status, courier_status = :courier_status WHERE id = :id");
                        $updStmt->execute([
                            ':status' => $newStatus,
                            ':courier_status' => $lastMessage,
                            ':id' => $order['id']
                        ]);

                        if ($newStatus !== $order['status']) {
                            $oldStatus = $order['status'];
                            $order['status'] = $newStatus;
                            $order['courier_status'] = $lastMessage;

                            // Award UP Points if status updated to delivered
                            if ($newStatus === 'delivered') {
                                $this->loyaltyService->awardLoyaltyPointsForOrder($order['id']);
                            }

                            // Refund redeemed points if status changed to cancelled or returned
                            if ($newStatus === 'cancelled' || $newStatus === 'returned') {
                                $this->loyaltyService->refundLoyaltyPointsForCancelledOrder($order['id']);
                            }

                            $isStockRestoredState = ($newStatus === 'cancelled' || $newStatus === 'returned');
                            $wasStockRestoredState = ($oldStatus === 'cancelled' || $oldStatus === 'returned');
                            if ($isStockRestoredState && !$wasStockRestoredState) {
                                $this->inventoryService->restoreOrderStock($order['id']);
                            }

                            // Dispatch dedicated transactional email
                            if (!empty($order['shipping_email'])) {
                                if ($newStatus === 'returned') {
                                    EmailHelper::sendOrderUndelivered(
                                        $order['shipping_email'],
                                        $order['shipping_name'] ?? 'Valued Customer',
                                        $order['id'],
                                        $lastMessage ?: 'Returned to facility',
                                        (int)($order['points_used'] ?? 0)
                                    );
                                } elseif ($newStatus === 'cancelled') {
                                    EmailHelper::sendOrderCancelled(
                                        $order['shipping_email'],
                                        $order['shipping_name'] ?? 'Valued Customer',
                                        $order['id'],
                                        $lastMessage ?: 'Cancelled via courier'
                                    );
                                }
                            }

                            $notifier = new NotificationHelper($this->pdo);
                            $notifier->sendOrderStatusUpdate($order, $oldStatus, $newStatus, false);
                        }

                        $updatedCount++;
                    }
                }
            }

            http_response_code(200);
            echo json_encode([
                'message' => "Synced successfully. Updated $updatedCount orders.",
                'updated' => $updatedCount
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * Fetch live tracking info from PostEx for an order (owner or admin)
     */
    public function trackOrder($orderId)
    {
        if (!isset($_REQUEST['user']) || !isset($_REQUEST['user']['id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $userId = $_REQUEST['user']['id'];
        $isAdmin = isset($_REQUEST['user']['role']) && $_REQUEST['user']['role'] === 'admin';

        try {
            $stmt = $this->pdo->prepare("SELECT * FROM orders WHERE id = :id");
            $stmt->execute([':id' => $orderId]);
            $order = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$order) {
                http_response_code(404);
                echo json_encode(['error' => 'Order not found']);
                return;
            }

            if (!$isAdmin && (int)$order['user_id'] !== (int)$userId) {
                http_response_code(403);
                echo json_encode(['error' => 'Forbidden']);
                return;
            }

            $stmtItems = $this->pdo->prepare("
                SELECT oi.*,
                       COALESCE(NULLIF(oi.product_name, 'Unknown Product'), p.name, oi.product_name) as product_name,
                       (SELECT image_url FROM product_images pi WHERE pi.product_id = oi.product_id ORDER BY pi.is_primary DESC, pi.id ASC LIMIT 1) as image_url
                FROM order_items oi
                LEFT JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = :order_id
            ");
            $stmtItems->execute([':order_id' => $orderId]);
            $order['items'] = $stmtItems->fetchAll(\PDO::FETCH_ASSOC);

            $trackingData = null;
            if (!empty($order['tracking_number'])) {
                $trackResult = $this->shippingGateway->trackShipment($order['tracking_number']);
                if ($trackResult['success'] && isset($trackResult['tracking']['dist'])) {
                    $dist = $trackResult['tracking']['dist'];
                    $history = [];
                    if (isset($dist['transactionStatusHistory']) && is_array($dist['transactionStatusHistory'])) {
                        $history = array_map(function ($h) {
                            return [
                                'status'    => $h['transactionStatus'] ?? '',
                                'message'   => $h['transactionStatusMessage'] ?? '',
                                'date'      => $h['transactionStatusDate'] ?? null,
                                'city'      => $h['cityName'] ?? null,
                                'riderName' => $h['riderName'] ?? null,
                                'riderPhone' => $h['riderPhone'] ?? null,
                            ];
                        }, $dist['transactionStatusHistory']);
                    }
                    $trackingData = [
                        'tracking_number'   => $order['tracking_number'],
                        'current_status'    => $dist['transactionStatus'] ?? 'Unknown',
                        'status_message'    => $dist['transactionStatusMessage'] ?? '',
                        'consignee_name'    => $dist['customerName'] ?? null,
                        'consignee_phone'   => $dist['customerPhone'] ?? null,
                        'delivery_address'  => $dist['deliveryAddress'] ?? null,
                        'destination_city'  => $dist['cityName'] ?? null,
                        'weight'            => isset($dist['parcelWeight']) ? (float)$dist['parcelWeight'] : null,
                        'pieces'            => isset($dist['parcelPieces']) ? (int)$dist['parcelPieces'] : null,
                        'cod_amount'        => isset($dist['invoicePayment']) ? (float)$dist['invoicePayment'] : null,
                        'history'           => $history,
                    ];

                    // Auto-sync status if not final
                    if (!in_array($order['status'], ['cancelled', 'delivered', 'returned'])) {
                        $isCancelled = false;
                        $isDelivered = false;
                        $isReturned = false;
                        $lastMessage = $dist['transactionStatus'] ?? '';

                        foreach ($history as $h) {
                            $msg = strtolower($h['message']);
                            if (strpos($msg, 'cancel') !== false) {
                                $isCancelled = true;
                            } elseif (strpos($msg, 'deliver') !== false) {
                                $isDelivered = true;
                            } elseif (strpos($msg, 'return') !== false || strpos($msg, 'rtv') !== false) {
                                $isReturned = true;
                            }
                        }

                        $newStatus = $order['status'];
                        if ($isReturned) {
                            $newStatus = 'returned';
                        } elseif ($isCancelled) {
                            $newStatus = 'cancelled';
                        } elseif ($isDelivered) {
                            $newStatus = 'delivered';
                        } elseif (strpos(strtolower($lastMessage), 'ship') !== false || strpos(strtolower($lastMessage), 'transit') !== false) {
                            $newStatus = 'shipped';
                        }

                        if ($newStatus !== $order['status'] || $lastMessage !== $order['courier_status']) {
                            $updStmt = $this->pdo->prepare("UPDATE orders SET status = :status, courier_status = :courier_status WHERE id = :id");
                            $updStmt->execute([
                                ':status' => $newStatus,
                                ':courier_status' => $lastMessage,
                                ':id' => $order['id']
                            ]);

                            if ($newStatus !== $order['status']) {
                                $oldStatus = $order['status'];
                                $order['status'] = $newStatus;
                                $order['courier_status'] = $lastMessage;

                                // Award UP Points if status updated to delivered
                                if ($newStatus === 'delivered') {
                                    $this->loyaltyService->awardLoyaltyPointsForOrder($order['id']);
                                }

                                // Refund redeemed points if status changed to cancelled or returned
                                if ($newStatus === 'cancelled' || $newStatus === 'returned') {
                                    $this->loyaltyService->refundLoyaltyPointsForCancelledOrder($order['id']);
                                }

                                $isStockRestoredState = ($newStatus === 'cancelled' || $newStatus === 'returned');
                                $wasStockRestoredState = ($oldStatus === 'cancelled' || $oldStatus === 'returned');
                                if ($isStockRestoredState && !$wasStockRestoredState) {
                                    $this->inventoryService->restoreOrderStock($order['id']);
                                }

                                $notifier = new \NotificationHelper($this->pdo);
                                $notifier->sendOrderStatusUpdate($order, $oldStatus, $newStatus);
                            } else {
                                $order['courier_status'] = $lastMessage;
                            }
                        }
                    }
                } else {
                    $trackingData = [
                        'tracking_number' => $order['tracking_number'],
                        'error' => $trackResult['error'] ?? 'Unable to fetch tracking details',
                    ];
                }
            }

            http_response_code(200);
            echo json_encode([
                'order'    => $order,
                'tracking' => $trackingData,
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * Webhook endpoint for PostEx real-time status callbacks
     * Handles: Delivered (+UP Points awarded & email), Cancelled / Not Received (No points & undelivered email)
     */
    public function handlePostExWebhook()
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        if (empty($data)) {
            $data = $_POST;
        }

        if (empty($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Empty webhook payload']);
            return;
        }

        $trackingNumber = $data['trackingNumber'] ?? $data['tracking_number'] ?? null;
        $orderRef = $data['orderRefNumber'] ?? $data['orderRef'] ?? $data['order_id'] ?? $data['orderId'] ?? null;

        if (empty($trackingNumber) && empty($orderRef)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing tracking number or order reference in webhook payload']);
            return;
        }

        try {
            $stmt = null;
            if (!empty($trackingNumber)) {
                $stmt = $this->pdo->prepare("SELECT * FROM orders WHERE tracking_number = :tn");
                $stmt->execute([':tn' => $trackingNumber]);
            }
            $order = $stmt ? $stmt->fetch(\PDO::FETCH_ASSOC) : null;

            if (!$order && !empty($orderRef)) {
                $stmt = $this->pdo->prepare("SELECT * FROM orders WHERE id = :id");
                $stmt->execute([':id' => $orderRef]);
                $order = $stmt->fetch(\PDO::FETCH_ASSOC);
            }

            if (!$order) {
                http_response_code(404);
                echo json_encode(['error' => 'Order not found for given webhook data']);
                return;
            }

            $orderId = $order['id'];
            $oldStatus = $order['status'];

            // Extract status and message
            $rawStatus = $data['transactionStatus'] ?? $data['orderStatus'] ?? $data['status'] ?? '';
            $statusMsg = $data['transactionStatusMessage'] ?? $data['message'] ?? $rawStatus;
            $statusLower = strtolower($rawStatus . ' ' . $statusMsg);

            $newStatus = $oldStatus;
            if (strpos($statusLower, 'deliver') !== false) {
                $newStatus = 'delivered';
            } elseif (strpos($statusLower, 'return') !== false || strpos($statusLower, 'rtv') !== false || strpos($statusLower, 'un-deliver') !== false || strpos($statusLower, 'fail') !== false) {
                $newStatus = 'returned';
            } elseif (strpos($statusLower, 'cancel') !== false) {
                $newStatus = 'cancelled';
            } elseif (strpos($statusLower, 'ship') !== false || strpos($statusLower, 'transit') !== false) {
                $newStatus = 'shipped';
            }

            // Update order
            $upd = $this->pdo->prepare("UPDATE orders SET status = :status, courier_status = :cs WHERE id = :id");
            $upd->execute([
                ':status' => $newStatus,
                ':cs'     => $statusMsg,
                ':id'     => $orderId,
            ]);

            $order['status'] = $newStatus;
            $order['courier_status'] = $statusMsg;

            // Handle business logic on status change
            if ($newStatus === 'delivered') {
                // Award UP points atomically & send sendOrderDeliveredWithPoints email
                $this->loyaltyService->awardLoyaltyPointsForOrder($orderId);
            } elseif ($newStatus === 'returned' || $newStatus === 'cancelled') {
                $this->loyaltyService->refundLoyaltyPointsForCancelledOrder($orderId);
                $this->inventoryService->restoreOrderStock($orderId);

                if (!empty($order['shipping_email'])) {
                    if ($newStatus === 'returned') {
                        // User specifically asked: PostEx reports cancelled or not received -> "order not received by customer or UP points not assigned"
                        EmailHelper::sendOrderUndelivered(
                            $order['shipping_email'],
                            $order['shipping_name'] ?? 'Valued Customer',
                            $orderId,
                            $statusMsg ?: 'Delivery Unsuccessful / Not Received',
                            (int)($order['points_used'] ?? 0)
                        );
                    } else {
                        EmailHelper::sendOrderCancelled(
                            $order['shipping_email'],
                            $order['shipping_name'] ?? 'Valued Customer',
                            $orderId,
                            $statusMsg ?: 'Cancelled via courier'
                        );
                    }
                }
            }

            $notifier = new NotificationHelper($this->pdo);
            $notifier->sendOrderStatusUpdate($order, $oldStatus, $newStatus, false);

            http_response_code(200);
            echo json_encode([
                'success'        => true,
                'order_id'       => $orderId,
                'old_status'     => $oldStatus,
                'new_status'     => $newStatus,
                'courier_status' => $statusMsg,
            ]);
        } catch (\Throwable $e) {
            error_log("PostEx Webhook Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Webhook processing failed', 'details' => $e->getMessage()]);
        }
    }
}
