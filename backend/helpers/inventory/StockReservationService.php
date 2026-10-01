<?php

if (!class_exists('OutOfStockException')) {
    class OutOfStockException extends \Exception {
        private $details;

        public function __construct(string $message, array $details = [], int $code = 409, ?\Throwable $previous = null) {
            parent::__construct($message, $code, $previous);
            $this->details = $details;
        }

        public function getDetails(): array {
            return $this->details;
        }
    }
}

/**
 * Class StockReservationService
 * Centralized, atomic engine for inventory verification, variant stock deduction, and order restoration.
 */
class StockReservationService {
    private $pdo;

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Calculate total units available across all color and size variants
     *
     * @param array $inventory
     * @return int
     */
    public static function calculateTotalStock(array $inventory): int {
        $total = 0;
        foreach ($inventory as $inv) {
            if (isset($inv['sizes']) && is_array($inv['sizes'])) {
                foreach ($inv['sizes'] as $sz) {
                    $total += isset($sz['stock']) ? (int)$sz['stock'] : 0;
                }
            } elseif (isset($inv['stock'])) {
                $total += (int)$inv['stock'];
            }
        }
        return $total;
    }

    /**
     * Validate whether sufficient stock is available for cart items
     *
     * @param array $cartItems
     * @return array ['valid' => bool, 'out_of_stock' => array]
     */
    public function validateItemsStock(array $cartItems): array {
        $outOfStock = [];

        foreach ($cartItems as $item) {
            $productId = intval($item['product_id'] ?? 0);
            if ($productId <= 0) continue;

            $stmt = $this->pdo->prepare("SELECT id, name, inventory, stock_count FROM products WHERE id = ?");
            $stmt->execute([$productId]);
            $product = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$product) {
                $outOfStock[] = [
                    'product_id' => $productId,
                    'product_name' => $item['product_name'] ?? 'Unknown',
                    'requested' => $item['quantity'] ?? 1,
                    'available' => 0,
                    'reason' => 'Product not found'
                ];
                continue;
            }

            $inventory = !empty($product['inventory']) ? json_decode($product['inventory'], true) : [];
            $requestedColor = trim(strtolower($item['color'] ?? ''));
            $requestedSize = trim(strtolower($item['size'] ?? ''));
            $requestedQty = max(1, intval($item['quantity'] ?? 1));

            $availableStock = 0;
            $foundVariant = false;

            if (is_array($inventory) && !empty($inventory)) {
                foreach ($inventory as $inv) {
                    $color = trim(strtolower($inv['color'] ?? ''));
                    if ($requestedColor === '' || $color === $requestedColor) {
                        if (isset($inv['sizes']) && is_array($inv['sizes'])) {
                            foreach ($inv['sizes'] as $sz) {
                                $size = trim(strtolower($sz['size'] ?? ''));
                                if ($requestedSize === '' || $size === $requestedSize) {
                                    $availableStock += intval($sz['stock'] ?? 0);
                                    $foundVariant = true;
                                }
                            }
                        }
                    }
                }
            }

            if (!$foundVariant) {
                $availableStock = intval($product['stock_count'] ?? 0);
            }

            if ($availableStock < $requestedQty) {
                $outOfStock[] = [
                    'product_id' => $productId,
                    'product_name' => $product['name'],
                    'color' => $item['color'] ?? null,
                    'size' => $item['size'] ?? null,
                    'requested' => $requestedQty,
                    'available' => $availableStock
                ];
            }
        }

        return [
            'valid' => empty($outOfStock),
            'out_of_stock' => $outOfStock
        ];
    }

    /**
     * Atomically deduct stock for multiple cart items (e.g. at order checkout)
     * Locks matching product rows via SELECT ... FOR UPDATE.
     * Throws OutOfStockException if any variant lacks requested quantity (prevents overselling).
     *
     * @param array $cartItems
     * @return bool
     * @throws OutOfStockException
     */
    public function deductItemsStock(array $cartItems): bool {
        foreach ($cartItems as $item) {
            $productId = intval($item['product_id'] ?? 0);
            if ($productId <= 0) continue;

            $pStmt = $this->pdo->prepare("SELECT id, name, inventory, stock_count FROM products WHERE id = ? FOR UPDATE");
            $pStmt->execute([$productId]);
            $productData = $pStmt->fetch(\PDO::FETCH_ASSOC);

            if (!$productData) {
                throw new OutOfStockException(
                    "Product not found: ID #{$productId}",
                    ['product_id' => $productId, 'reason' => 'Product does not exist']
                );
            }

            $inventory = !empty($productData['inventory']) ? json_decode($productData['inventory'], true) : [];
            $targetColor = trim(strtolower($item['color'] ?? ''));
            $targetSize = trim(strtolower($item['size'] ?? ''));
            $qtyToDeduct = max(1, intval($item['quantity'] ?? 1));
            $productName = $productData['name'] ?? ($item['product_name'] ?? 'Product');

            if (is_array($inventory) && !empty($inventory)) {
                $foundVariant = false;
                $updated = false;

                foreach ($inventory as &$invItem) {
                    $c = trim(strtolower($invItem['color'] ?? ''));
                    if ($targetColor === '' || $c === $targetColor) {
                        if (isset($invItem['sizes']) && is_array($invItem['sizes'])) {
                            foreach ($invItem['sizes'] as &$sizeObj) {
                                $s = trim(strtolower($sizeObj['size'] ?? ''));
                                if ($targetSize === '' || $s === $targetSize) {
                                    $foundVariant = true;
                                    $currentStock = intval($sizeObj['stock'] ?? 0);

                                    if ($currentStock < $qtyToDeduct) {
                                        $label = $productName . (!empty($item['size']) ? " ({$item['size']})" : "");
                                        throw new OutOfStockException(
                                            "Insufficient stock for \"{$label}\". Only {$currentStock} remaining, {$qtyToDeduct} requested.",
                                            [
                                                'product_id' => $productId,
                                                'product_name' => $productName,
                                                'color' => $item['color'] ?? null,
                                                'size' => $item['size'] ?? null,
                                                'available' => $currentStock,
                                                'requested' => $qtyToDeduct
                                            ]
                                        );
                                    }

                                    $sizeObj['stock'] = $currentStock - $qtyToDeduct;
                                    $updated = true;
                                    break 2;
                                }
                            }
                        }
                    }
                }

                if ($foundVariant && $updated) {
                    $totalStock = self::calculateTotalStock($inventory);
                    $updStmt = $this->pdo->prepare("UPDATE products SET inventory = ?, stock_count = ? WHERE id = ?");
                    $updStmt->execute([json_encode($inventory), $totalStock, $productId]);
                    continue;
                }
            }

            // Fallback for products without variant breakdown
            $currentTotalStock = intval($productData['stock_count'] ?? 0);
            if ($currentTotalStock < $qtyToDeduct) {
                throw new OutOfStockException(
                    "Insufficient stock for \"{$productName}\". Only {$currentTotalStock} remaining, {$qtyToDeduct} requested.",
                    [
                        'product_id' => $productId,
                        'product_name' => $productName,
                        'available' => $currentTotalStock,
                        'requested' => $qtyToDeduct
                    ]
                );
            }

            $newTotal = $currentTotalStock - $qtyToDeduct;
            $updStmt = $this->pdo->prepare("UPDATE products SET stock_count = ? WHERE id = ?");
            $updStmt->execute([$newTotal, $productId]);
        }

        return true;
    }

    /**
     * Restore stock for all items associated with an order (e.g. cancellation or return)
     *
     * @param int $orderId
     * @return bool
     */
    public function restoreOrderStock(int $orderId): bool {
        $stmtItems = $this->pdo->prepare("SELECT product_id, color, size, quantity FROM order_items WHERE order_id = :order_id");
        $stmtItems->execute([':order_id' => $orderId]);
        $items = $stmtItems->fetchAll(\PDO::FETCH_ASSOC);

        foreach ($items as $item) {
            $productId = intval($item['product_id'] ?? 0);
            if ($productId <= 0) continue;

            $pStmt = $this->pdo->prepare("SELECT inventory FROM products WHERE id = ? FOR UPDATE");
            $pStmt->execute([$productId]);
            $productData = $pStmt->fetch(\PDO::FETCH_ASSOC);

            if ($productData && !empty($productData['inventory'])) {
                $inventory = json_decode($productData['inventory'], true);
                if (is_array($inventory)) {
                    $updated = false;
                    $targetColor = trim(strtolower($item['color'] ?? ''));
                    $targetSize = trim(strtolower($item['size'] ?? ''));
                    $qtyToAdd = max(1, intval($item['quantity'] ?? 1));

                    foreach ($inventory as &$invItem) {
                        $c = trim(strtolower($invItem['color'] ?? ''));
                        if ($targetColor === '' || $c === $targetColor) {
                            if (isset($invItem['sizes']) && is_array($invItem['sizes'])) {
                                foreach ($invItem['sizes'] as &$sizeObj) {
                                    $s = trim(strtolower($sizeObj['size'] ?? ''));
                                    if ($targetSize === '' || $s === $targetSize) {
                                        $sizeObj['stock'] = intval($sizeObj['stock'] ?? 0) + $qtyToAdd;
                                        $updated = true;
                                        break 2;
                                    }
                                }
                            }
                        }
                    }

                    if ($updated) {
                        $totalStock = self::calculateTotalStock($inventory);
                        $updStmt = $this->pdo->prepare("UPDATE products SET inventory = ?, stock_count = ? WHERE id = ?");
                        $updStmt->execute([json_encode($inventory), $totalStock, $productId]);
                    }
                }
            }
        }

        return true;
    }

    /**
     * Atomically update a specific variant's stock level (Admin)
     *
     * @param int $productId
     * @param string $color
     * @param string $size
     * @param int $newStock
     * @return array ['success' => bool, 'stock' => int, 'totalStock' => int, 'error' => ?string]
     */
    public function updateVariantStock(int $productId, string $color, string $size, int $newStock): array {
        $stmt = $this->pdo->prepare("SELECT inventory FROM products WHERE id = ? FOR UPDATE");
        $stmt->execute([$productId]);
        $product = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$product) {
            return ['success' => false, 'error' => 'Product not found'];
        }

        $inventory = !empty($product['inventory']) ? json_decode($product['inventory'], true) : [];
        $updated = false;
        $totalStock = 0;

        foreach ($inventory as &$inv) {
            if (strcasecmp($inv['color'] ?? '', $color) === 0) {
                if (!empty($inv['sizes']) && is_array($inv['sizes'])) {
                    foreach ($inv['sizes'] as &$s) {
                        if (strcasecmp($s['size'] ?? '', $size) === 0) {
                            $s['stock'] = max(0, $newStock);
                            $updated = true;
                        }
                        $totalStock += intval($s['stock'] ?? 0);
                    }
                }
            } else {
                if (!empty($inv['sizes']) && is_array($inv['sizes'])) {
                    foreach ($inv['sizes'] as $s) {
                        $totalStock += intval($s['stock'] ?? 0);
                    }
                }
            }
        }

        if (!$updated) {
            return ['success' => false, 'error' => 'Variant not found for specified color and size'];
        }

        $upd = $this->pdo->prepare("UPDATE products SET inventory = ?, stock_count = ? WHERE id = ?");
        $upd->execute([json_encode($inventory), $totalStock, $productId]);

        return [
            'success' => true,
            'stock' => max(0, $newStock),
            'totalStock' => $totalStock
        ];
    }
}
