<?php

// 1. Core Middleware Includes
require_once __DIR__ . "/../middleware/auth.php";
require_once __DIR__ . "/../middleware/RateLimiter.php";

/**
 * On-Demand Lazy Controller Proxy
 * Defers require_once and class instantiation until the controller method is actually invoked.
 * Eliminates upfront instantiation of 14 controllers on every API request.
 */
if (!class_exists('LazyControllerProxy')) {
    class LazyControllerProxy
    {
        private $factory;
        private $instance = null;

        public function __construct(callable $factory)
        {
            $this->factory = $factory;
        }

        public function __call($method, $args)
        {
            if ($this->instance === null) {
                $this->instance = ($this->factory)();
            }
            return $this->instance->$method(...$args);
        }

        public function __get($prop)
        {
            if ($this->instance === null) {
                $this->instance = ($this->factory)();
            }
            return $this->instance->$prop;
        }

        public function __set($prop, $val)
        {
            if ($this->instance === null) {
                $this->instance = ($this->factory)();
            }
            $this->instance->$prop = $val;
        }
    }
}

// 2. Request URI & HTTP Method Normalization
$requestUri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// Support HTTP Method Override for servers that restrict PUT/DELETE requests
$methodOverrideHeader = '';
if (isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'])) {
    $methodOverrideHeader = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'];
} elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    $methodOverrideHeader = isset($headers['X-HTTP-Method-Override'])
        ? $headers['X-HTTP-Method-Override']
        : (isset($headers['x-http-method-override']) ? $headers['x-http-method-override'] : '');
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && !empty($methodOverrideHeader)) {
    $_SERVER["REQUEST_METHOD"] = strtoupper($methodOverrideHeader);
} elseif ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_REQUEST['_method'])) {
    $_SERVER["REQUEST_METHOD"] = strtoupper($_REQUEST['_method']);
}
$method = $_SERVER["REQUEST_METHOD"];

// Strip common prefixes (e.g., if hosted at /api)
$uri = str_replace("/api", "", $requestUri);
$basePath = dirname($_SERVER["SCRIPT_NAME"]);

if (strpos($uri, $basePath) === 0) {
    $uri = substr($uri, strlen($basePath));
}

$uri = ltrim($uri, "/");
if (strpos($uri, "index.php/") === 0) {
    $uri = substr($uri, 10);
} elseif ($uri === "index.php") {
    $uri = "";
}

$uri = "/" . ltrim($uri, "/"); // Ensure it starts with a slash

// 3. Initialize Lazy Controllers (Only initialized when route matches)
$authController      = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/auth/AuthController.php";
    return new AuthController($pdo);
});
$productController   = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/products/ProductController.php";
    return new ProductController($pdo);
});
$analyticsController = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/admin/AnalyticsController.php";
    return new AnalyticsController($pdo);
});
$wishlistController  = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/wishlist/WishlistController.php";
    return new WishlistController($pdo);
});
$customerController  = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/admin/CustomerController.php";
    return new CustomerController($pdo);
});
$settingsController  = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/settings/SettingsController.php";
    return new SettingsController($pdo);
});
$promotionController = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/admin/PromotionController.php";
    return new PromotionController($pdo);
});
$categoryController  = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/categories/CategoryController.php";
    return new CategoryController($pdo);
});
$orderController     = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/orders/OrderController.php";
    return new OrderController($pdo);
});
$returnController    = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/returns/ReturnController.php";
    return new ReturnController($pdo);
});
$sizeClassController = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/inventory/SizeClassController.php";
    return new SizeClassController($pdo);
});
$badgeController     = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/badges/BadgeController.php";
    return new BadgeController($pdo);
});
$addressController   = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/user/AddressController.php";
    return new AddressController($pdo);
});
$surveyController    = new LazyControllerProxy(function () use ($pdo) {
    require_once __DIR__ . "/../controllers/SurveyController.php";
    return new SurveyController($pdo);
});

// Helper for dynamic route matching (e.g. /wishlist/1)
if (!function_exists('routeMatch')) {
    function routeMatch($pattern, $uri, &$matches)
    {
        return preg_match("#^" . $pattern . "$#", $uri, $matches);
    }
}

// 4. Route Dispatcher
switch (true) {
    // --- AUTH ROUTES ---
    case ($uri === "/auth/register" && $method === "POST"):
        RateLimiter::check('auth_register', 5, 60);
        $authController->register();
        break;

    case ($uri === "/auth/login" && $method === "POST"):
        RateLimiter::check('auth_login', 5, 60);
        $authController->login();
        break;

    case ($uri === "/auth/google" && $method === "POST"):
        RateLimiter::check('auth_google', 10, 60);
        $authController->googleLogin();
        break;

    case ($uri === "/auth/me" && $method === "GET"):
        authMiddleware();
        $authController->me();
        break;

    case ($uri === "/auth/profile" && $method === "PUT"):
        authMiddleware();
        $authController->updateProfile();
        break;

    case ($uri === "/auth/password" && $method === "PUT"):
        authMiddleware();
        $authController->updatePassword();
        break;

    case ($uri === "/auth/forgot-password" && $method === "POST"):
        RateLimiter::check('auth_forgot', 5, 60);
        $authController->forgotPassword();
        break;

    case ($uri === "/auth/reset-password" && $method === "POST"):
        RateLimiter::check('auth_reset', 5, 60);
        $authController->resetPassword();
        break;

    case ($uri === "/auth/verify-otp-login" && $method === "POST"):
        RateLimiter::check('auth_otp', 5, 60);
        $authController->verifyOtpAndLogin();
        break;

    case ($uri === "/auth/logout-all" && $method === "POST"):
        authMiddleware();
        $authController->logoutAll();
        break;

    // --- UPLOAD ROUTES ---
    case ($uri === "/upload/image" && $method === "POST"):
        authMiddleware();
        require_once __DIR__ . "/../controllers/ImageUploadController.php";
        echo ImageUploadController::upload($pdo);
        break;

    // --- PRODUCT ROUTES ---
    case ($uri === "/products" && $method === "GET"):
        $productController->index();
        break;
    case (routeMatch("/products/([a-zA-Z0-9-]+)", $uri, $matches) && $method === "GET"):
        $productController->show($matches[1]);
        break;
    case ($uri === "/products" && $method === "POST"):
        authMiddleware();
        $productController->create();
        break;
    case (routeMatch("/products/([0-9]+)", $uri, $matches) && $method === "PUT"):
        authMiddleware();
        $productController->update($matches[1]);
        break;
    case (routeMatch("/products/([0-9]+)", $uri, $matches) && $method === "DELETE"):
        authMiddleware();
        $productController->delete($matches[1]);
        break;

    // --- CATEGORY ROUTES ---
    case ($uri === "/categories" && $method === "GET"):
        $categoryController->index();
        break;
    case ($uri === "/categories" && $method === "POST"):
        authMiddleware();
        $categoryController->create();
        break;
    case (routeMatch("/categories/([0-9]+)", $uri, $matches) && $method === "PUT"):
        authMiddleware();
        $categoryController->update($matches[1]);
        break;
    case (routeMatch("/categories/([0-9]+)", $uri, $matches) && $method === "DELETE"):
        authMiddleware();
        $categoryController->delete($matches[1]);
        break;

    // --- WISHLIST ROUTES ---
    case ($uri === "/wishlist" && $method === "GET"):
        authMiddleware();
        $wishlistController->index();
        break;
    case (routeMatch("/wishlist/([0-9]+)", $uri, $matches) && $method === "POST"):
        authMiddleware();
        $wishlistController->add($matches[1]);
        break;
    case (routeMatch("/wishlist/([0-9]+)", $uri, $matches) && $method === "DELETE"):
        authMiddleware();
        $wishlistController->remove($matches[1]);
        break;

    // --- ADDRESS ROUTES ---
    case ($uri === "/addresses" && $method === "GET"):
        authMiddleware();
        $addressController->index();
        break;
    case ($uri === "/addresses" && $method === "POST"):
        authMiddleware();
        $addressController->create();
        break;
    case (routeMatch("/addresses/([0-9]+)", $uri, $matches) && $method === "PUT"):
        authMiddleware();
        $addressController->update($matches[1]);
        break;
    case (routeMatch("/addresses/([0-9]+)", $uri, $matches) && $method === "DELETE"):
        authMiddleware();
        $addressController->delete($matches[1]);
        break;
    case (routeMatch("/addresses/([0-9]+)/default", $uri, $matches) && $method === "PUT"):
        authMiddleware();
        $addressController->setDefault($matches[1]);
        break;

    // --- SETTINGS ROUTES ---
    case ($uri === "/settings/storefront" && $method === "GET"):
        $settingsController->getStorefront();
        break;
    case ($uri === "/settings" && $method === "GET"):
        $settingsController->index();
        break;
    case ($uri === "/settings" && $method === "PUT"):
        authMiddleware();
        $settingsController->update();
        break;
    case ($uri === "/settings/homepage" && $method === "GET"):
        $settingsController->getHomepage();
        break;
    case ($uri === "/settings/homepage" && $method === "PUT"):
        authMiddleware();
        $settingsController->updateHomepage();
        break;
    case ($uri === "/settings/support-pages" && $method === "GET"):
        $settingsController->getSupportPages();
        break;
    case (routeMatch("/cms/([a-zA-Z0-9-]+)", $uri, $matches) && $method === "GET"):
        $settingsController->getCmsPage($matches[1]);
        break;

    // --- CHECKOUT/ORDERS ROUTES ---
    case ($uri === "/checkout" && $method === "POST"):
        RateLimiter::check('checkout', 10, 60);
        $orderController->checkout();
        break;
    case ($uri === "/orders" && $method === "GET"):
        authMiddleware();
        $orderController->getUserOrders();
        break;
    case (routeMatch("/orders/([0-9]+)", $uri, $matches) && $method === "PUT"):
        authMiddleware();
        $orderController->updateOrderStatus($matches[1]);
        break;
    case (routeMatch("/orders/([0-9]+)/accept", $uri, $matches) && $method === "POST"):
        authMiddleware();
        $orderController->acceptOrder($matches[1]);
        break;
    case (routeMatch("/orders/([0-9]+)/cancel", $uri, $matches) && $method === "POST"):
        authMiddleware();
        $orderController->cancelOrder($matches[1]);
        break;
    case ($uri === "/orders/sync-postex" && $method === "POST"):
        authMiddleware();
        $orderController->syncPostExStatuses();
        break;
    case (($uri === "/orders/postex-webhook" || $uri === "/webhook/postex") && $method === "POST"):
        $orderController->postExWebhook();
        break;
    case (routeMatch("/orders/([0-9]+)/track", $uri, $matches) && $method === "GET"):
        authMiddleware();
        $orderController->trackOrder($matches[1]);
        break;
    case ($uri === "/checkout/validate-promo" && $method === "POST"):
        $promotionController->validatePromo();
        break;

    // --- ADMIN ROUTES ---
    case ($uri === "/admin/stats" && $method === "GET"):
        authMiddleware();
        $analyticsController->stats();
        break;
    case ($uri === "/admin/customers" && $method === "GET"):
        authMiddleware();
        $customerController->index();
        break;
    case ($uri === "/admin/customers/promote" && $method === "POST"):
        authMiddleware();
        $customerController->promote();
        break;
    case ($uri === "/admin/customers/update-vip" && $method === "POST"):
        authMiddleware();
        $customerController->updateVip();
        break;
    case ($uri === "/admin/promotions" && $method === "GET"):
        authMiddleware();
        $promotionController->index();
        break;
    case ($uri === "/admin/promotions" && $method === "POST"):
        authMiddleware();
        $promotionController->create();
        break;
    case (routeMatch("/admin/promotions/([0-9]+)", $uri, $matches) && $method === "PUT"):
        authMiddleware();
        $promotionController->update($matches[1]);
        break;
    case (routeMatch("/admin/promotions/([0-9]+)", $uri, $matches) && $method === "DELETE"):
        authMiddleware();
        $promotionController->delete($matches[1]);
        break;

    // --- SIZE CLASS ROUTES ---
    case ($uri === "/size-classes" && $method === "GET"):
        $sizeClassController->index();
        break;
    case ($uri === "/size-classes" && $method === "POST"):
        authMiddleware();
        $sizeClassController->create();
        break;
    case (routeMatch("/size-classes/([0-9]+)", $uri, $matches) && $method === "PUT"):
        authMiddleware();
        $sizeClassController->update($matches[1]);
        break;
    case (routeMatch("/size-classes/([0-9]+)", $uri, $matches) && $method === "DELETE"):
        authMiddleware();
        $sizeClassController->delete($matches[1]);
        break;

    // --- INVENTORY ROUTES ---
    case ($uri === "/inventory" && $method === "GET"):
        authMiddleware();
        $productController->inventory();
        break;
    case (routeMatch("/inventory/([0-9]+)/stock", $uri, $matches) && $method === "PUT"):
        authMiddleware();
        $productController->updateStock($matches[1]);
        break;

    // --- BADGE ROUTES ---
    case ($uri === "/badges" && $method === "GET"):
        $badgeController->index();
        break;
    case ($uri === "/admin/badges" && $method === "POST"):
        authMiddleware();
        $badgeController->create();
        break;
    case (routeMatch("/admin/badges/([0-9]+)", $uri, $matches) && $method === "PUT"):
        authMiddleware();
        $badgeController->update($matches[1]);
        break;
    case (routeMatch("/admin/badges/([0-9]+)", $uri, $matches) && $method === "DELETE"):
        authMiddleware();
        $badgeController->delete($matches[1]);
        break;

    // --- ADMIN REVIEWS ROUTES ---
    case ($uri === "/admin/reviews" && $method === "GET"):
        require_once __DIR__ . "/../controllers/reviews/admin_reviews.php";
        break;
    case (routeMatch("/admin/reviews/([0-9]+)/toggle", $uri, $matches) && $method === "POST"):
        require_once __DIR__ . "/../controllers/reviews/admin_reviews.php";
        break;
    case (routeMatch("/admin/reviews/([0-9]+)", $uri, $matches) && $method === "DELETE"):
        require_once __DIR__ . "/../controllers/reviews/admin_reviews.php";
        break;

    // --- REVIEWS ROUTES ---
    case ($uri === "/reviews" && ($method === "GET" || $method === "POST" || $method === "DELETE")):
        require_once __DIR__ . "/../controllers/reviews/reviews.php";
        break;
    case (routeMatch("/reviews/([0-9]+)", $uri, $matches) && ($method === "GET" || $method === "POST" || $method === "DELETE")):
        require_once __DIR__ . "/../controllers/reviews/reviews.php";
        break;
    case (routeMatch("/reviews/([0-9]+)/vote", $uri, $matches) && $method === "POST"):
        $_GET['id'] = $matches[1];
        require_once __DIR__ . "/../controllers/reviews/vote.php";
        break;

    // --- IN-APP NOTIFICATIONS ROUTES ---
    case ($uri === "/notifications" && ($method === "GET" || $method === "POST")):
        require_once __DIR__ . "/../controllers/notifications/notifications.php";
        break;

    // --- RETURN REQUESTS ROUTES ---
    case ($uri === "/returns" && $method === "GET"):
        authMiddleware();
        $returnController->index();
        break;
    case ($uri === "/returns" && $method === "POST"):
        $returnController->create();
        break;
    case (routeMatch("/returns/([0-9]+)/status", $uri, $matches) && $method === "PUT"):
        authMiddleware();
        $returnController->updateStatus($matches[1]);
        break;

    // --- SURVEY ROUTES ---
    case ($uri === "/survey" && $method === "POST"):
        $surveyController->submit();
        break;
    case ($uri === "/admin/surveys" && $method === "GET"):
        authMiddleware();
        $surveyController->getAll();
        break;

    // --- DEFAULT 404 ---
    default:
        http_response_code(404);
        echo json_encode(["error" => "API endpoint not found", "path" => $uri]);
        break;
}
