<?php
// Suppress HTML error output in API responses to prevent JSON syntax errors
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT);

// Centralized Production Error Masking
require_once __DIR__ . '/../helpers/ErrorHandler.php';
set_exception_handler(function (\Throwable $e) {
    ErrorHandler::respondWithError(500, 'An unexpected server error occurred.', $e);
});

// Enable output compression (gzip) safely without buffer collision
if (ob_get_level() === 0) {
    if (isset($_SERVER['HTTP_ACCEPT_ENCODING']) && substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) {
        @ob_start("ob_gzhandler");
    } else {
        @ob_start();
    }
}

// CORS Headers & Allowed Origins Whitelist
$allowed_origins = [
    "https://www.underpure.com",
    "https://underpure.com",
    "http://www.underpure.com",
    "http://underpure.com",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000"
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? trim($_SERVER['HTTP_ORIGIN']) : '';

// Check exact origin whitelist or local development port patterns
$isAllowedOrigin = in_array($origin, $allowed_origins) 
    || preg_match('/^https?:\/\/localhost(:\d+)?$/i', $origin) 
    || preg_match('/^https?:\/\/127\.0\.0\.1(:\d+)?$/i', $origin);

if ($isAllowedOrigin && !empty($origin)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
    header("Vary: Origin");
} else {
    // If request has no Origin header (same-origin or server-to-server), allow default domain
    if (empty($origin)) {
        header("Access-Control-Allow-Origin: https://www.underpure.com");
    }
    // Note: Do NOT emit Access-Control-Allow-Credentials for disallowed origins
}

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-HTTP-Method-Override, Cache-Control, Pragma, Expires");

// HTTP Security Defense Headers
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Permissions-Policy: geolocation=(), camera=(), microphone=()");

// Enable caching for GET requests to improve performance (LiteSpeed/Cloudflare edge caching)
$requestMethod = $_SERVER["REQUEST_METHOD"] ?? 'GET';
if ($requestMethod === "GET" && !isset($_SERVER['HTTP_AUTHORIZATION'])) {
    // Cache public GET requests for 2 minutes (120 seconds)
    header("Cache-Control: public, max-age=120");
} else {
    header("Cache-Control: no-cache, no-store, must-revalidate");
}

// Handle Preflight OPTIONS Request
if ($requestMethod === "OPTIONS") {
    http_response_code(200);
    exit();
}
