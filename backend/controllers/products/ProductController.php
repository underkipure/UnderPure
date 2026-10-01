<?php

require_once __DIR__ . '/services/ProductQueryService.php';
require_once __DIR__ . '/services/ProductImageService.php';
require_once __DIR__ . '/services/ProductInventoryService.php';
require_once __DIR__ . '/services/ProductMutationService.php';

class ProductController {
    private $pdo;
    private $queryService;
    private $mutationService;
    private $inventoryService;
    private $imageService;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->queryService     = new ProductQueryService($pdo);
        $this->imageService     = new ProductImageService($pdo);
        $this->inventoryService = new ProductInventoryService($pdo);
        $this->mutationService  = new ProductMutationService($pdo);
    }

    /**
     * GET /api/products
     * Fetch all products with filtering, search, badges, and sorting.
     */
    public function index() {
        $this->queryService->index();
    }

    /**
     * GET /api/products/:slugOrId
     * Fetch single product details with grouped images and decoded variants.
     */
    public function show($slugOrId) {
        $this->queryService->show($slugOrId);
    }

    /**
     * POST /api/products
     * Admin protected endpoint to create a product.
     */
    public function create() {
        $this->mutationService->create();
    }

    /**
     * PUT /api/products/:id
     * Admin protected endpoint to update a product.
     */
    public function update($id) {
        $this->mutationService->update($id);
    }

    /**
     * DELETE /api/products/:id
     * Admin protected endpoint to delete a product and clean up images.
     */
    public function delete($id) {
        $this->mutationService->delete($id);
    }

    /**
     * GET /api/inventory
     * Admin protected endpoint to fetch global inventory list.
     */
    public function inventory() {
        $this->inventoryService->inventory();
    }

    /**
     * PUT /api/inventory/:productId/stock
     * Admin protected endpoint to update variant stock for specific color & size.
     */
    public function updateStock($productId) {
        $this->inventoryService->updateStock($productId);
    }
}
