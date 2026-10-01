<?php
if (!function_exists('getallheaders')) {
    function getallheaders()
    {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

require_once __DIR__ . "/services/OrderInventoryService.php";
require_once __DIR__ . "/services/OrderCheckoutService.php";
require_once __DIR__ . "/services/OrderQueryService.php";
require_once __DIR__ . "/services/OrderStatusService.php";
require_once __DIR__ . "/services/PostExOrderService.php";

class OrderController
{
    private $pdo;
    private $checkoutService;
    private $queryService;
    private $statusService;
    private $postExService;

    public function __construct($pdo)
    {
        $this->checkoutService = new OrderCheckoutService($pdo);
        $this->queryService    = new OrderQueryService($pdo);
        $this->statusService   = new OrderStatusService($pdo);
        $this->postExService   = new PostExOrderService($pdo);
    }

    /**
     * POST /checkout
     * Create a new order.
     */
    public function checkout()
    {
        $this->checkoutService->processCheckout();
    }

    /**
     * GET /orders
     * Fetch user's orders (or all if admin).
     */
    public function getUserOrders()
    {
        $this->queryService->getUserOrders();
    }

    /**
     * PUT /orders/:id
     * Update order status (Admin only)
     */
    public function updateOrderStatus($orderId)
    {
        $this->statusService->updateOrderStatus($orderId);
    }

    /**
     * POST /orders/:id/accept
     * Accept order → Send to PostEx for shipment booking (Admin only)
     */
    public function acceptOrder($orderId)
    {
        $this->postExService->acceptOrder($orderId);
    }

    /**
     * POST /orders/:id/cancel
     * Cancel an order (Admin only)
     */
    public function cancelOrder($orderId)
    {
        $this->statusService->cancelOrder($orderId);
    }

    /**
     * POST /orders/sync-postex
     * Sync local order statuses from PostEx tracking (Admin only)
     */
    public function syncPostExStatuses()
    {
        $this->postExService->syncPostExStatuses();
    }

    /**
     * GET /orders/:id/track
     * Fetch live tracking info from PostEx for an order (owner or admin)
     */
    public function trackOrder($orderId)
    {
        $this->postExService->trackOrder($orderId);
    }

    /**
     * POST /orders/postex-webhook or /webhook/postex
     * Webhook endpoint for PostEx real-time status callbacks
     */
    public function postExWebhook()
    {
        $this->postExService->handlePostExWebhook();
    }
}
