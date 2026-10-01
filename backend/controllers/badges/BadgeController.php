<?php

class BadgeController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Check if the requesting user is an admin.
     */
    private function checkAdmin() {
        $isAdmin = false;
        if (isset($_REQUEST['user'])) {
            if (isset($_REQUEST['user']['role']) && $_REQUEST['user']['role'] === 'admin') {
                $isAdmin = true;
            } elseif (isset($_REQUEST['user']['id'])) {
                $stmt = $this->pdo->prepare("SELECT is_admin FROM users WHERE id = ?");
                $stmt->execute([$_REQUEST['user']['id']]);
                $dbUser = $stmt->fetch(\PDO::FETCH_ASSOC);
                if ($dbUser && (bool)$dbUser['is_admin']) {
                    $isAdmin = true;
                }
            }
        }
        return $isAdmin;
    }

    /**
     * GET /api/badges
     * Fetch all badges.
     */
    public function index() {
        try {
            // Fetch all badges and also calculate product count for each badge
            $stmt = $this->pdo->query("SELECT * FROM badges ORDER BY name ASC");
            $badges = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Fetch products to count how many use each badge
            $prodStmt = $this->pdo->query("SELECT badge FROM products WHERE badge IS NOT NULL AND badge != ''");
            $prodBadges = $prodStmt->fetchAll(PDO::FETCH_COLUMN);

            foreach ($badges as &$badge) {
                $count = 0;
                $badgeNameUpper = strtoupper(trim($badge['name']));
                foreach ($prodBadges as $pBadgeStr) {
                    $parts = array_map('trim', explode(',', strtoupper($pBadgeStr)));
                    if (in_array($badgeNameUpper, $parts)) {
                        $count++;
                    }
                }
                $badge['product_count'] = $count;
            }

            header('Cache-Control: public, max-age=120, stale-while-revalidate=300');
            http_response_code(200);
            echo json_encode($badges);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch badges', 'details' => $e->getMessage()]);
        }
    }

    /**
     * POST /api/admin/badges
     * Create a new badge.
     */
    public function create() {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['name']) || empty(trim($data['name']))) {
            http_response_code(400);
            echo json_encode(['error' => 'Badge name is required']);
            return;
        }

        $badgeName = strtoupper(trim($data['name']));

        try {
            // Check if badge already exists
            $stmtCheck = $this->pdo->prepare("SELECT id FROM badges WHERE name = ?");
            $stmtCheck->execute([$badgeName]);
            if ($stmtCheck->fetch()) {
                http_response_code(400);
                echo json_encode(['error' => 'Badge already exists']);
                return;
            }

            $sql = "INSERT INTO badges (name) VALUES (?)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$badgeName]);
            $id = $this->pdo->lastInsertId();

            http_response_code(201);
            echo json_encode(['id' => $id, 'name' => $badgeName, 'message' => 'Badge created successfully']);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create badge', 'details' => $e->getMessage()]);
        }
    }

    /**
     * PUT /api/admin/badges/:id
     * Update a badge and synchronize product badge list.
     */
    public function update($id) {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['name']) || empty(trim($data['name']))) {
            http_response_code(400);
            echo json_encode(['error' => 'Badge name is required']);
            return;
        }

        $newName = strtoupper(trim($data['name']));

        try {
            // 1. Fetch current badge details
            $stmtSelect = $this->pdo->prepare("SELECT name FROM badges WHERE id = ?");
            $stmtSelect->execute([$id]);
            $badge = $stmtSelect->fetch(PDO::FETCH_ASSOC);

            if (!$badge) {
                http_response_code(404);
                echo json_encode(['error' => 'Badge not found']);
                return;
            }

            $oldName = strtoupper(trim($badge['name']));

            // Check if new name already exists on another badge
            $stmtCheck = $this->pdo->prepare("SELECT id FROM badges WHERE name = ? AND id != ?");
            $stmtCheck->execute([$newName, $id]);
            if ($stmtCheck->fetch()) {
                http_response_code(400);
                echo json_encode(['error' => 'Another badge with this name already exists']);
                return;
            }

            $this->pdo->beginTransaction();

            // 2. Update badges table
            $stmtUpdate = $this->pdo->prepare("UPDATE badges SET name = ? WHERE id = ?");
            $stmtUpdate->execute([$newName, $id]);

            // 3. Update products table
            $stmtProducts = $this->pdo->query("SELECT id, badge FROM products WHERE badge IS NOT NULL AND badge != ''");
            $products = $stmtProducts->fetchAll(PDO::FETCH_ASSOC);

            $stmtProdUpdate = $this->pdo->prepare("UPDATE products SET badge = ? WHERE id = ?");
            foreach ($products as $p) {
                $parts = explode(',', $p['badge']);
                $changed = false;
                foreach ($parts as &$part) {
                    if (strcasecmp(trim($part), $oldName) === 0) {
                        $part = $newName;
                        $changed = true;
                    }
                }
                if ($changed) {
                    $newBadgeStr = implode(', ', array_filter(array_map('trim', $parts)));
                    $stmtProdUpdate->execute([$newBadgeStr, $p['id']]);
                }
            }

            $this->pdo->commit();

            http_response_code(200);
            echo json_encode(['message' => 'Badge updated successfully', 'name' => $newName]);
        } catch (\Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update badge', 'details' => $e->getMessage()]);
        }
    }

    /**
     * DELETE /api/admin/badges/:id
     * Delete a badge and synchronize product badge list.
     */
    public function delete($id) {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        try {
            // 1. Fetch current badge details
            $stmtSelect = $this->pdo->prepare("SELECT name FROM badges WHERE id = ?");
            $stmtSelect->execute([$id]);
            $badge = $stmtSelect->fetch(PDO::FETCH_ASSOC);

            if (!$badge) {
                http_response_code(404);
                echo json_encode(['error' => 'Badge not found']);
                return;
            }

            $badgeName = strtoupper(trim($badge['name']));

            $this->pdo->beginTransaction();

            // 2. Delete from badges table
            $stmtDelete = $this->pdo->prepare("DELETE FROM badges WHERE id = ?");
            $stmtDelete->execute([$id]);

            // 3. Remove badge from any products using it
            $stmtProducts = $this->pdo->query("SELECT id, badge FROM products WHERE badge IS NOT NULL AND badge != ''");
            $products = $stmtProducts->fetchAll(PDO::FETCH_ASSOC);

            $stmtProdUpdate = $this->pdo->prepare("UPDATE products SET badge = ? WHERE id = ?");
            foreach ($products as $p) {
                $parts = explode(',', $p['badge']);
                $newParts = [];
                $changed = false;
                foreach ($parts as $part) {
                    if (strcasecmp(trim($part), $badgeName) === 0) {
                        $changed = true;
                    } else {
                        $newParts[] = trim($part);
                    }
                }
                if ($changed) {
                    $newBadgeStr = count($newParts) > 0 ? implode(', ', $newParts) : null;
                    $stmtProdUpdate->execute([$newBadgeStr, $p['id']]);
                }
            }

            $this->pdo->commit();

            http_response_code(200);
            echo json_encode(['message' => 'Badge deleted successfully']);
        } catch (\Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete badge', 'details' => $e->getMessage()]);
        }
    }
}
