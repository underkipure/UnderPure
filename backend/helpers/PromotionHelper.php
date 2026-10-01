<?php

class PromotionHelper {
    /**
     * Validate a promo code against a cart and subtotal.
     * 
     * @param PDO $pdo Database connection
     * @param string $code Promo code
     * @param float $subtotal Current subtotal
     * @param array $cartItems Cart items (array of arrays with product_id, price, quantity)
     * @return array Validation result with success/error status and calculated discount
     */
    public static function validate($pdo, $code, $subtotal, $cartItems) {
        $code = trim(strtoupper($code));
        $subtotal = (float)$subtotal;

        if (empty($code)) {
            return ['error' => 'Promo code cannot be empty.'];
        }

        try {
            $stmt = $pdo->prepare("SELECT * FROM promotions WHERE code = ?");
            $stmt->execute([$code]);
            $promo = $stmt->fetch(PDO::FETCH_ASSOC);

            // Check if promo exists
            if (!$promo) {
                return ['error' => 'Invalid promo code'];
            }

            // Check if it's active
            if (!(bool)$promo['active']) {
                return ['error' => 'Promo code is no longer active'];
            }

            // Check expiration date
            if (!empty($promo['expires']) && strtotime($promo['expires']) < time()) {
                return ['error' => 'Promo code has expired'];
            }

            // Check max uses
            if ($promo['max_uses'] !== null && $promo['uses'] >= $promo['max_uses']) {
                return ['error' => 'Promo code usage limit reached'];
            }

            // Check minimum order value (applied to global subtotal)
            if ($subtotal < (float)$promo['min_order']) {
                return ['error' => "Subtotal must be at least Rs. " . number_format($promo['min_order'], 2) . " to use this code"];
            }

            // Fetch product information for validation from DB
            $productIds = [];
            foreach ($cartItems as $item) {
                $pId = $item['product_id'] ?? $item['productId'] ?? null;
                if ($pId) {
                    $productIds[] = (int)$pId;
                }
            }

            $productsById = [];
            if (!empty($productIds)) {
                $inQuery = implode(',', array_fill(0, count($productIds), '?'));
                $stmtProd = $pdo->prepare("SELECT id, price, original_price, category_id FROM products WHERE id IN ($inQuery)");
                $stmtProd->execute($productIds);
                $dbProducts = $stmtProd->fetchAll(PDO::FETCH_ASSOC);
                
                foreach ($dbProducts as $p) {
                    $productsById[(int)$p['id']] = $p;
                }
            }

            // 1. RULE: Check if cart contains any discounted items
            foreach ($cartItems as $item) {
                $pId = $item['product_id'] ?? $item['productId'] ?? null;
                if ($pId && isset($productsById[(int)$pId])) {
                    $dbProd = $productsById[(int)$pId];
                    $origPrice = $dbProd['original_price'] !== null ? (float)$dbProd['original_price'] : null;
                    $currentPrice = (float)$dbProd['price'];
                    
                    if ($origPrice !== null && $currentPrice < $origPrice) {
                        return ['error' => 'Promo code cannot be applied because your cart contains discounted items.'];
                    }
                }
            }

            // 2. RULE: Check category restriction
            $promoCategoryId = $promo['category_id'] !== null ? (int)$promo['category_id'] : null;
            $discount = 0.00;

            if ($promoCategoryId !== null) {
                // Category-specific promo code (includes subcategories recursively)
                $validCategoryIds = self::getAllCategoryIdsRecursively($pdo, $promoCategoryId);

                $matchingSubtotal = 0.00;
                foreach ($cartItems as $item) {
                    $pId = $item['product_id'] ?? $item['productId'] ?? null;
                    if ($pId && isset($productsById[(int)$pId])) {
                        $dbProd = $productsById[(int)$pId];
                        $prodCatId = $dbProd['category_id'] !== null ? (int)$dbProd['category_id'] : null;

                        if ($prodCatId !== null && in_array($prodCatId, $validCategoryIds)) {
                            $qty = (int)($item['quantity'] ?? 1);
                            $price = (float)$dbProd['price'];
                            $matchingSubtotal += $price * $qty;
                        }
                    }
                }

                if ($matchingSubtotal <= 0.00) {
                    // Fetch category name
                    $catStmt = $pdo->prepare("SELECT label FROM categories WHERE id = ?");
                    $catStmt->execute([$promoCategoryId]);
                    $catName = $catStmt->fetchColumn() ?: "the selected category";
                    return ['error' => "This promo code is only valid for products in category: {$catName} or its subcategories"];
                }

                // Apply discount ONLY to the matching products subtotal
                if ($promo['type'] === 'percentage' || $promo['type'] === 'percent') {
                    $discount = $matchingSubtotal * ((float)$promo['value'] / 100);
                } else if ($promo['type'] === 'fixed') {
                    $discount = (float)$promo['value'];
                }

                // Cap discount at matching subtotal
                if ($discount > $matchingSubtotal) {
                    $discount = $matchingSubtotal;
                }
            } else {
                // Global promo code
                if ($promo['type'] === 'percentage' || $promo['type'] === 'percent') {
                    $discount = $subtotal * ((float)$promo['value'] / 100);
                } else if ($promo['type'] === 'fixed') {
                    $discount = (float)$promo['value'];
                }

                // Cap discount at subtotal
                if ($discount > $subtotal) {
                    $discount = $subtotal;
                }
            }

            return [
                'success' => true,
                'promo' => $promo,
                'discount_amount' => round($discount, 2),
                'new_total' => round(max(0.00, $subtotal - $discount), 2)
            ];

        } catch (\PDOException $e) {
            return ['error' => 'Database error during promo validation: ' . $e->getMessage()];
        }
    }

    /**
     * Get all child category IDs recursively including the parent category ID.
     */
    private static function getAllCategoryIdsRecursively($pdo, $parentCategoryId) {
        $categoryIds = [(int)$parentCategoryId];
        
        try {
            // Fetch all categories to do the tree traversal in memory
            $stmt = $pdo->query("SELECT id, parent_id FROM categories");
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Build child map
            $childrenMap = [];
            foreach ($categories as $cat) {
                $pId = $cat['parent_id'] !== null ? (int)$cat['parent_id'] : null;
                if ($pId !== null) {
                    $childrenMap[$pId][] = (int)$cat['id'];
                }
            }
            
            // Traverse tree starting from parentCategoryId
            $queue = [(int)$parentCategoryId];
            $visited = [];
            
            while (!empty($queue)) {
                $current = array_shift($queue);
                if (in_array($current, $visited)) {
                    continue;
                }
                $visited[] = $current;
                
                if (isset($childrenMap[$current])) {
                    foreach ($childrenMap[$current] as $childId) {
                        if (!in_array($childId, $categoryIds)) {
                            $categoryIds[] = $childId;
                            $queue[] = $childId;
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            // Fallback to parent ID only on error
            error_log("Failed to load subcategories: " . $e->getMessage());
        }
        
        return $categoryIds;
    }
}
