<?php

require_once __DIR__ . '/../../../helpers/inventory/StockReservationService.php';

/**
 * Class OrderInventoryService
 * Coordinates order-level stock deductions, restorations, and cancellations via StockReservationService.
 */
class OrderInventoryService {
    private $pdo;
    private $reservationService;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->reservationService = new StockReservationService($pdo);
    }

    /**
     * Deduct stock for cart items during checkout
     */
    public function deductStockForItems(array $cartItems) {
        return $this->reservationService->deductItemsStock($cartItems);
    }

    /**
     * Restore stock to products for a given order (e.g. on cancellation/return)
     */
    public function restoreOrderStock($orderId) {
        return $this->reservationService->restoreOrderStock((int)$orderId);
    }

    /**
     * Re-deduct stock for an order (e.g. when un-cancelling an order back to pending/processing)
     */
    public function redeductOrderStock($orderId) {
        $stmtItems = $this->pdo->prepare("SELECT product_id, color, size, quantity FROM order_items WHERE order_id = :order_id");
        $stmtItems->execute([':order_id' => $orderId]);
        $items = $stmtItems->fetchAll(\PDO::FETCH_ASSOC);

        return $this->reservationService->deductItemsStock($items);
    }

    /**
     * Pre-checkout validation of item availability
     */
    public function validateStockBeforeOrder(array $cartItems): array {
        return $this->reservationService->validateItemsStock($cartItems);
    }
}
