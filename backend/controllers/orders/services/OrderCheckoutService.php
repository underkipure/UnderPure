<?php

require_once __DIR__ . "/../../../helpers/JwtHelper.php";
require_once __DIR__ . "/../../../helpers/NotificationHelper.php";
require_once __DIR__ . "/../../../helpers/EmailHelper.php";
require_once __DIR__ . "/../../../helpers/PromotionHelper.php";
require_once __DIR__ . "/OrderInventoryService.php";

class OrderCheckoutService {
    private $pdo;
    private $inventoryService;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->inventoryService = new OrderInventoryService($pdo);
    }

    /**
     * Process checkout request
     */
    public function processCheckout() {
        $userId = $this->resolveUserId();

        $rawBody = file_get_contents("php://input");
        $data = json_decode($rawBody, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON payload.']);
            return;
        }

        if (empty($data['cart_items']) || !is_array($data['cart_items'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Cart items are required.']);
            return;
        }

        // Calculate subtotal
        $subtotal = 0;
        foreach ($data['cart_items'] as $item) {
            $subtotal += ($item['price'] ?? 0) * ($item['quantity'] ?? 1);
        }

        $promoCode = !empty($data['promo_code']) ? trim(strtoupper($data['promo_code'])) : null;
        $discount = 0.00;
        $promoId = null;

        // Verify promo code first if passed
        if ($promoCode) {
            $promoVal = PromotionHelper::validate($this->pdo, $promoCode, $subtotal, $data['cart_items']);
            if (isset($promoVal['error'])) {
                http_response_code(400);
                echo json_encode(['error' => $promoVal['error']]);
                return;
            }
            $discount = (float)$promoVal['discount_amount'];
            $promoId = $promoVal['promo']['id'];
        }

        try {
            $this->pdo->beginTransaction();

            // 1. ATOMIC STOCK RESERVATION: Deduct stock first under InnoDB row lock.
            // Throws OutOfStockException if any variant has insufficient stock, preventing overselling.
            $this->inventoryService->deductStockForItems($data['cart_items']);

            // 2. ATOMIC PROMO INCREMENT: Atomically verify limit and increment usage in a single conditional query.
            if ($promoId) {
                $updateStmt = $this->pdo->prepare("
                    UPDATE promotions 
                    SET uses = uses + 1 
                    WHERE id = ? 
                      AND (max_uses IS NULL OR uses < max_uses)
                      AND active = 1
                ");
                $updateStmt->execute([$promoId]);
                if ($updateStmt->rowCount() === 0) {
                    $this->pdo->rollBack();
                    http_response_code(409);
                    echo json_encode(['error' => 'Promo code usage limit has just been reached by another customer.']);
                    return;
                }
            }

            // Fetch shipping settings from database
            $stmtSettings = $this->pdo->query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('freeShippingThreshold', 'deliveryFee')");
            $settings = [];
            while ($row = $stmtSettings->fetch(\PDO::FETCH_ASSOC)) {
                $settings[$row['setting_key']] = $row['setting_value'];
            }
            
            $threshold = isset($settings['freeShippingThreshold']) && is_numeric($settings['freeShippingThreshold']) ? (float)$settings['freeShippingThreshold'] : 5000;
            $deliveryFee = isset($settings['deliveryFee']) && is_numeric($settings['deliveryFee']) ? (float)$settings['deliveryFee'] : 200;

            // Calculate VIP discount and shipping override
            $vipDiscount = 0.00;
            $firstOrderDiscount = 0.00;
            $isVip = false;
            $isFirstOrder = false;

            if ($userId) {
                $vipCheck = $this->pdo->prepare("SELECT is_vip FROM users WHERE id = ?");
                $vipCheck->execute([$userId]);
                $isVip = (bool) $vipCheck->fetchColumn();

                $orderCheck = $this->pdo->prepare("SELECT id FROM orders WHERE user_id = ? LIMIT 1");
                $orderCheck->execute([$userId]);
                if (!$orderCheck->fetch()) {
                    $isFirstOrder = true;
                }
            }

            if ($isVip) {
                $vipDiscount = round($subtotal * 0.10);
                $shipping = 0;
                $promoCode = $promoCode ? ($promoCode . " + VIP") : "VIP10";
            } elseif ($isFirstOrder) {
                $firstOrderDiscount = round($subtotal * 0.15);
                $shipping = ($subtotal >= $threshold) ? 0 : $deliveryFee;
                $promoCode = $promoCode ? ($promoCode . " + WELCOME15") : "WELCOME15";
            } else {
                $shipping = ($subtotal >= $threshold) ? 0 : $deliveryFee;
            }

            $totalDiscount = $discount + $vipDiscount + $firstOrderDiscount;
            $total = max(0.00, $subtotal - $totalDiscount + $shipping);

            // Fetch loyalty settings
            $sStmt = $this->pdo->query("SELECT setting_value FROM site_settings WHERE setting_key = 'loyaltySettings'");
            $sRow = $sStmt->fetch(\PDO::FETCH_ASSOC);
            $loyaltySettings = $sRow ? json_decode($sRow['setting_value'], true) : [];
            $pointsPerSpend = isset($loyaltySettings['pointsPerSpend']) ? (int)$loyaltySettings['pointsPerSpend'] : 10;
            $spendUnit = isset($loyaltySettings['spendUnit']) ? (int)$loyaltySettings['spendUnit'] : 1000;
            $redemptionRatio = isset($loyaltySettings['redemptionRatio']) ? (float)$loyaltySettings['redemptionRatio'] : 0.1;

            $pointsUsed = isset($data['points_used']) ? (int)$data['points_used'] : 0;
            $pointsDiscount = 0;
            $rewardPoints = 0;

            if ($userId) {
                if ($spendUnit > 0) {
                    $pointsRatio = $pointsPerSpend / $spendUnit;
                    $rewardPoints = floor($subtotal * $pointsRatio);
                }

                if ($pointsUsed > 0) {
                    // Lock user row and atomically verify available points
                    $uStmt = $this->pdo->prepare("SELECT loyalty_points FROM users WHERE id = ? FOR UPDATE");
                    $uStmt->execute([$userId]);
                    $userPoints = (int)$uStmt->fetchColumn();

                    if ($userPoints < $pointsUsed) {
                        $pointsUsed = $userPoints;
                    }

                    if ($pointsUsed > 0) {
                        $pointsDiscount = $pointsUsed * $redemptionRatio;
                        $totalDiscount += $pointsDiscount;
                        $total = max(0.00, $subtotal - $totalDiscount + $shipping);

                        // 3. ATOMIC LOYALTY DEDUCTION: verify balance and deduct in single conditional query
                        $uUpd = $this->pdo->prepare("UPDATE users SET loyalty_points = loyalty_points - ? WHERE id = ? AND loyalty_points >= ?");
                        $uUpd->execute([$pointsUsed, $userId, $pointsUsed]);
                        if ($uUpd->rowCount() === 0) {
                            $this->pdo->rollBack();
                            http_response_code(409);
                            echo json_encode(['error' => 'Insufficient loyalty points balance.']);
                            return;
                        }
                    }
                }
            }

            $cleanStr = function($val) {
                return $val !== null ? htmlspecialchars(strip_tags(trim((string)$val)), ENT_QUOTES, 'UTF-8') : '';
            };

            $giftNote = !empty($data['gift_note']) ? $cleanStr($data['gift_note']) : null;

            // Insert into orders
            $stmt = $this->pdo->prepare("
                INSERT INTO orders (user_id, shipping_name, shipping_email, shipping_phone, shipping_address, shipping_city, shipping_zip, total, status, promo_code, discount, points_used, reward_points, points_awarded, gift_note)
                VALUES (:user_id, :shipping_name, :shipping_email, :shipping_phone, :shipping_address, :shipping_city, :shipping_zip, :total, 'pending', :promo_code, :discount, :points_used, :reward_points, 0, :gift_note)
            ");

            $stmt->execute([
                ':user_id' => $userId,
                ':shipping_name' => $cleanStr($data['shipping_name'] ?? ''),
                ':shipping_email' => filter_var($data['shipping_email'] ?? '', FILTER_SANITIZE_EMAIL),
                ':shipping_phone' => preg_replace('/[^\d\+\-\s\(\)]/', '', (string)($data['shipping_phone'] ?? '')),
                ':shipping_address' => $cleanStr($data['shipping_address'] ?? ''),
                ':shipping_city' => $cleanStr($data['shipping_city'] ?? ''),
                ':shipping_zip' => $cleanStr($data['shipping_zip'] ?? ''),
                ':total' => $total,
                ':promo_code' => $promoCode,
                ':discount' => $totalDiscount,
                ':points_used' => $pointsUsed,
                ':reward_points' => $rewardPoints,
                ':gift_note' => $giftNote
            ]);

            $orderId = $this->pdo->lastInsertId();

            // Insert into order_items
            $stmtItem = $this->pdo->prepare("
                INSERT INTO order_items (order_id, product_id, product_name, color, size, quantity, price)
                VALUES (:order_id, :product_id, :product_name, :color, :size, :quantity, :price)
            ");

            foreach ($data['cart_items'] as $item) {
                $productId = null;
                $dbProductName = null;
                if (!empty($item['product_id'])) {
                    if (is_numeric($item['product_id']) && intval($item['product_id']) > 0) {
                        $extractedId = intval($item['product_id']);
                        $pCheck = $this->pdo->prepare("SELECT id, name FROM products WHERE id = ?");
                        $pCheck->execute([$extractedId]);
                        if ($pRow = $pCheck->fetch(\PDO::FETCH_ASSOC)) {
                            $productId = $pRow['id'];
                            $dbProductName = $pRow['name'];
                        } else {
                            $productId = null;
                        }
                    } else {
                        // Gift/Virtual item (e.g. shipping protection), keep null for FK compliance
                        $productId = null;
                    }
                }

                $resolvedName = !empty($item['product_name']) && $item['product_name'] !== 'Unknown Product'
                    ? $item['product_name']
                    : (!empty($item['name']) && $item['name'] !== 'Unknown Product' ? $item['name'] : (!empty($item['title']) && $item['title'] !== 'Unknown Product' ? $item['title'] : ($dbProductName ?? 'Unknown Product')));

                $stmtItem->execute([
                    ':order_id' => $orderId,
                    ':product_id' => $productId,
                    ':product_name' => $resolvedName,
                    ':color' => $item['color'] ?? null,
                    ':size' => $item['size'] ?? null,
                    ':quantity' => $item['quantity'] ?? 1,
                    ':price' => $item['price'] ?? 0
                ]);
            }

            $this->pdo->commit();

            $responsePayload = [
                'message' => 'Order created successfully',
                'order' => [
                    'order_id' => $orderId,
                    'status' => 'pending',
                    'total' => $total,
                    'reward_points' => $rewardPoints
                ]
            ];

            http_response_code(201);
            header('Content-Type: application/json');
            $jsonResponse = json_encode($responsePayload);

            // Schedule background notification via async job file (fire-and-forget)
            // This ensures the HTTP response returns instantly without waiting for SMTP/email
            $jobData = [
                'order_id' => $orderId,
                'user_id' => $userId,
                'shipping_email' => $data['shipping_email'] ?? '',
                'shipping_phone' => $data['shipping_phone'] ?? '',
                'shipping_name' => $data['shipping_name'] ?? '',
                'shipping_address' => $data['shipping_address'] ?? '',
                'shipping_city' => $data['shipping_city'] ?? '',
                'shipping_zip' => $data['shipping_zip'] ?? '',
                'total' => $total,
                'cart_items' => $data['cart_items']
            ];

            // Invalidate admin analytics dashboard cache so new order appears instantly
            require_once __DIR__ . '/../../../helpers/CacheHelper.php';
            CacheHelper::invalidate('admin_dashboard_stats');

            $jobDir = __DIR__ . '/../../../storage/jobs';
            if (!is_dir($jobDir)) {
                @mkdir($jobDir, 0755, true);
            }
            $jobFile = $jobDir . '/order_notify_' . $orderId . '.json';
            @file_put_contents($jobFile, json_encode($jobData));

            // Fire-and-forget: process notification in background
            $phpBin = PHP_BINARY ?: 'php';
            $workerScript = realpath(__DIR__ . '/../../../workers/order_notification_worker.php');
            if ($workerScript && is_file($workerScript)) {
                if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                    @pclose(@popen("start /B \"\" \"$phpBin\" \"$workerScript\" \"$jobFile\" > NUL 2>&1", 'r'));
                } else {
                    @exec("\"$phpBin\" \"$workerScript\" \"$jobFile\" > /dev/null 2>&1 &");
                }
            } else {
                // Fallback: process inline if worker doesn't exist (slightly slower)
                try {
                    $notifier = new NotificationHelper($this->pdo);
                    $notifier->sendOrderPlaced([
                        'id' => $orderId,
                        'user_id' => $userId,
                        'shipping_email' => $data['shipping_email'] ?? '',
                        'shipping_phone' => $data['shipping_phone'] ?? '',
                        'shipping_name' => $data['shipping_name'] ?? '',
                        'total' => $total,
                        'status' => 'pending'
                    ]);
                } catch (\Throwable $ne) {
                    error_log("Order notification inline fallback error: " . $ne->getMessage());
                }
            }

            echo $jsonResponse;
            exit;

        } catch (OutOfStockException $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            http_response_code(409);
            header('Content-Type: application/json');
            echo json_encode([
                'error' => $e->getMessage(),
                'out_of_stock' => $e->getDetails()
            ]);
            exit;
        } catch (\PDOException $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            require_once __DIR__ . "/../../../helpers/ErrorHandler.php";
            ErrorHandler::respondWithError(500, 'Database error during checkout.', $e);
        } catch (\Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            require_once __DIR__ . "/../../../helpers/ErrorHandler.php";
            ErrorHandler::respondWithError(500, 'Server error during checkout.', $e);
        }
    }

    private function resolveUserId() {
        $userId = null;
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $authHeader = $headers["Authorization"] ?? ($headers["authorization"] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? ''));

        if (preg_match("/Bearer\s(\S+)/", $authHeader, $matches)) {
            $jwt = $matches[1];
            if ($jwt !== "guest") {
                try {
                    $decoded = JwtHelper::decode($jwt);
                    if ($decoded && isset($decoded['id'])) {
                        $userId = $decoded['id'];
                    }
                } catch (\Exception $e) {}
            }
        }

        if ($userId) {
            $uCheck = $this->pdo->prepare("SELECT id, token_version FROM users WHERE id = ?");
            $uCheck->execute([$userId]);
            $uRow = $uCheck->fetch(\PDO::FETCH_ASSOC);
            if (!$uRow) {
                $userId = null;
            } else {
                $userTv = (int)($uRow['token_version'] ?? 1);
                $tokenTv = isset($decoded['tv']) ? (int)$decoded['tv'] : 0;
                if ($tokenTv < $userTv) {
                    $userId = null;
                }
            }
        }

        return $userId;
    }
}
