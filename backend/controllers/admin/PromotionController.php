<?php

require_once __DIR__ . "/../../helpers/PromotionHelper.php";
require_once __DIR__ . "/../../helpers/EmailHelper.php";

/* 
MySQL CREATE TABLE Statement for promotions:

CREATE TABLE promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
    value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(10, 2) DEFAULT 0.00,
    active BOOLEAN DEFAULT TRUE,
    expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_promo_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/

class PromotionController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Helper to verify admin access
     */
    private function requireAdmin() {
        if (!isset($_REQUEST['user']) || !isset($_REQUEST['user']['role']) || $_REQUEST['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            exit();
        }
    }

    /**
     * GET /api/admin/promotions
     * Admin: Fetch all promotions
     */
    public function index() {
        $this->requireAdmin();

        try {
            $stmt = $this->pdo->query("SELECT * FROM promotions ORDER BY created_at DESC");
            $promotions = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Format numeric and boolean values
            foreach ($promotions as &$promo) {
                $promo['value'] = (float)$promo['value'];
                $promo['min_order'] = (float)$promo['min_order'];
                $promo['minOrder'] = (float)$promo['min_order'];
                $promo['uses'] = (int)$promo['uses'];
                $promo['max_uses'] = $promo['max_uses'] !== null ? (int)$promo['max_uses'] : null;
                $promo['maxUses'] = $promo['max_uses'] !== null ? (int)$promo['max_uses'] : null;
                $promo['active'] = (bool)$promo['active'];
                $promo['category_id'] = $promo['category_id'] !== null ? (int)$promo['category_id'] : null;
            }

            http_response_code(200);
            echo json_encode($promotions);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * POST /api/admin/promotions
     * Admin: Create a new promotion
     */
    public function create() {
        $this->requireAdmin();

        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data->code) || empty($data->type) || !isset($data->value)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: code, type, value']);
            return;
        }

        $minOrder = isset($data->minOrder) ? $data->minOrder : (isset($data->min_order) ? $data->min_order : 0);
        $maxUses = isset($data->maxUses) ? $data->maxUses : (isset($data->max_uses) ? $data->max_uses : null);

        try {
            $sql = "INSERT INTO promotions (code, type, value, min_order, max_uses, active, expires, category_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                trim(strtoupper($data->code)),
                $data->type,
                $data->value,
                $minOrder,
                $maxUses,
                isset($data->active) ? (int)$data->active : 1,
                $data->expires ?? null,
                $data->category_id ?? null
            ]);

            $promoId = $this->pdo->lastInsertId();

            // Trigger Notification
            try {
                $code = trim(strtoupper($data->code));
                $type = $data->type;
                $value = $data->value;
                
                $notifTitle = "New Offer Available! ✦";
                if ($type === 'percentage') {
                    $notifMsg = "Use code {$code} to get " . floatval($value) . "% off on your order! (Min order: Rs. " . number_format($minOrder, 2) . ")";
                } else {
                    $notifMsg = "Use code {$code} to get Rs. " . number_format($value, 2) . " off on your order! (Min order: Rs. " . number_format($minOrder, 2) . ")";
                }
                $notifType = "promotion";
                $notifLink = "/shop";
                
                $notifStmt = $this->pdo->prepare("INSERT INTO notifications (title, message, type, link) VALUES (?, ?, ?, ?)");
                $notifStmt->execute([$notifTitle, $notifMsg, $notifType, $notifLink]);

                // Broadcast Web Push Notification
                require_once __DIR__ . '/../../helpers/PushNotificationHelper.php';
                PushNotificationHelper::send($notifTitle, $notifMsg, $notifLink);

                // Send Email to all users (in a real production app with many users, this should be moved to a job queue)
                $userStmt = $this->pdo->query("SELECT name, email FROM users WHERE email IS NOT NULL AND email != ''");
                $users = $userStmt->fetchAll(PDO::FETCH_ASSOC);
                
                $discountValString = ($type === 'percentage') ? floatval($value) . '%' : 'Rs. ' . number_format($value);
                $expiryStr = ($data->expires) ? date('M j, Y', strtotime($data->expires)) : 'a limited time';
                
                foreach ($users as $u) {
                    EmailHelper::sendPromoEmail($u['email'], $u['name'] ?? 'Lover', $code, $discountValString, $expiryStr);
                }
            } catch (\Exception $ne) {
                error_log("Failed to insert or send notification/email for new promotion: " . $ne->getMessage());
            }

            http_response_code(201);
            echo json_encode([
                'message' => 'Promotion created successfully', 
                'id' => $promoId
            ]);
        } catch (\PDOException $e) {
            // Check for duplicate code
            if ($e->getCode() == 23000) {
                http_response_code(409);
                echo json_encode(['error' => 'Promotion code already exists']);
                return;
            }
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * PUT /api/admin/promotions/{id}
     * Admin: Update an existing promotion
     */
    public function update($id) {
        $this->requireAdmin();

        if (empty($id) || !is_numeric($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid promotion ID']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"));
        if (empty($data->code) || empty($data->type) || !isset($data->value)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }

        $minOrder = isset($data->minOrder) ? $data->minOrder : (isset($data->min_order) ? $data->min_order : 0);
        $maxUses = isset($data->maxUses) ? $data->maxUses : (isset($data->max_uses) ? $data->max_uses : null);

        try {
            $sql = "UPDATE promotions 
                    SET code = ?, type = ?, value = ?, min_order = ?, max_uses = ?, active = ?, expires = ?, category_id = ?
                    WHERE id = ?";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                trim(strtoupper($data->code)),
                $data->type,
                $data->value,
                $minOrder,
                $maxUses,
                isset($data->active) ? (int)$data->active : 1,
                $data->expires ?? null,
                $data->category_id ?? null,
                $id
            ]);

            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(['message' => 'Promotion updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Promotion not found or no changes made']);
            }
        } catch (\PDOException $e) {
            if ($e->getCode() == 23000) {
                http_response_code(409);
                echo json_encode(['error' => 'Promotion code already exists']);
                return;
            }
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * DELETE /api/admin/promotions/{id}
     * Admin: Delete a promotion
     */
    public function delete($id) {
        $this->requireAdmin();

        if (empty($id) || !is_numeric($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid promotion ID']);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("DELETE FROM promotions WHERE id = ?");
            $stmt->execute([$id]);

            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(['message' => 'Promotion deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Promotion not found']);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * POST /api/checkout/validate-promo
     * Public: Validate promo code and calculate discount
     */
    public function validatePromo() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['code']) || !isset($data['subtotal'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing promo code or cart subtotal']);
            return;
        }

        $code = trim(strtoupper($data['code']));
        $subtotal = (float)$data['subtotal'];
        $cartItems = isset($data['cart_items']) && is_array($data['cart_items']) ? $data['cart_items'] : [];

        $result = PromotionHelper::validate($this->pdo, $code, $subtotal, $cartItems);

        if (isset($result['error'])) {
            http_response_code(400);
            echo json_encode(['error' => $result['error']]);
            return;
        }

        http_response_code(200);
        echo json_encode([
            'message' => 'Promo code applied!',
            'code' => $result['promo']['code'],
            'discount_amount' => $result['discount_amount'],
            'new_total' => $result['new_total']
        ]);
    }
}
