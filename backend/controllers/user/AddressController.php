<?php

class AddressController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    private function getUserId() {
        if (!isset($_REQUEST['user']) || !isset($_REQUEST['user']['id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit();
        }
        return $_REQUEST['user']['id'];
    }

    /** GET /addresses - list all user addresses */
    public function index() {
        $userId = $this->getUserId();
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at ASC");
            $stmt->execute([$userId]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /** POST /addresses - create a new address */
    public function create() {
        $userId = $this->getUserId();
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->full_name, $data->address_line1, $data->city)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: full_name, address_line1, city']);
            return;
        }
        try {
            // If this is set as default, unset all others first
            if (!empty($data->is_default)) {
                $this->pdo->prepare("UPDATE user_addresses SET is_default = 0 WHERE user_id = ?")->execute([$userId]);
            }

            $stmt = $this->pdo->prepare("INSERT INTO user_addresses 
                (user_id, label, full_name, phone, address_line1, address_line2, city, state, zip, country, is_default) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $userId,
                $data->label ?? 'Home',
                $data->full_name,
                $data->phone ?? null,
                $data->address_line1,
                $data->address_line2 ?? null,
                $data->city,
                $data->state ?? null,
                $data->zip ?? null,
                $data->country ?? 'Pakistan',
                !empty($data->is_default) ? 1 : 0,
            ]);
            $newId = $this->pdo->lastInsertId();
            $newAddr = $this->pdo->prepare("SELECT * FROM user_addresses WHERE id = ?")->execute([$newId]);
            $stmt2 = $this->pdo->prepare("SELECT * FROM user_addresses WHERE id = ?");
            $stmt2->execute([$newId]);
            http_response_code(201);
            echo json_encode(['success' => true, 'address' => $stmt2->fetch(PDO::FETCH_ASSOC)]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /** PUT /addresses/{id} - update an address */
    public function update($id) {
        $userId = $this->getUserId();
        $data = json_decode(file_get_contents("php://input"));
        try {
            // Verify ownership
            $stmt = $this->pdo->prepare("SELECT id FROM user_addresses WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $userId]);
            if (!$stmt->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => 'Address not found']);
                return;
            }

            if (!empty($data->is_default)) {
                $this->pdo->prepare("UPDATE user_addresses SET is_default = 0 WHERE user_id = ?")->execute([$userId]);
            }

            $stmt = $this->pdo->prepare("UPDATE user_addresses SET 
                label = ?, full_name = ?, phone = ?, address_line1 = ?, address_line2 = ?, 
                city = ?, state = ?, zip = ?, country = ?, is_default = ? 
                WHERE id = ? AND user_id = ?");
            $stmt->execute([
                $data->label ?? 'Home',
                $data->full_name ?? '',
                $data->phone ?? null,
                $data->address_line1 ?? '',
                $data->address_line2 ?? null,
                $data->city ?? '',
                $data->state ?? null,
                $data->zip ?? null,
                $data->country ?? 'Pakistan',
                !empty($data->is_default) ? 1 : 0,
                $id,
                $userId,
            ]);

            $stmt2 = $this->pdo->prepare("SELECT * FROM user_addresses WHERE id = ?");
            $stmt2->execute([$id]);
            echo json_encode(['success' => true, 'address' => $stmt2->fetch(PDO::FETCH_ASSOC)]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /** DELETE /addresses/{id} */
    public function delete($id) {
        $userId = $this->getUserId();
        try {
            $stmt = $this->pdo->prepare("DELETE FROM user_addresses WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $userId]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Address deleted']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Address not found']);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /** PUT /addresses/{id}/default */
    public function setDefault($id) {
        $userId = $this->getUserId();
        try {
            $this->pdo->prepare("UPDATE user_addresses SET is_default = 0 WHERE user_id = ?")->execute([$userId]);
            $stmt = $this->pdo->prepare("UPDATE user_addresses SET is_default = 1 WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $userId]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Address not found']);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }
}
