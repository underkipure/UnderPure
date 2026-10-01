<?php

// Prevent browser and CDN caching of index.php so users always fetch latest JS chunk bundle references
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

$requestUri = $_SERVER['REQUEST_URI'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);

// --- AUTOMATIC GOOGLE SITE VERIFICATION HANDLER ---
if (preg_match('/^\/google([a-zA-Z0-9_-]+)\.html$/i', $requestPath, $matches)) {
    header('Content-Type: text/html; charset=UTF-8');
    echo "google-site-verification: google" . htmlspecialchars($matches[1], ENT_QUOTES) . ".html";
    exit;
}

$htmlFilePath = __DIR__ . '/index.html';
if (!file_exists($htmlFilePath)) {
    die("Error: index.html not found.");
}
$html = file_get_contents($htmlFilePath);

$baseUrl = "https://www.underpure.com";
$apiUrlBase = $baseUrl . "/backend"; // Fallback API endpoint

// --- 1. DEFAULT SEO & WHATSAPP META VALUES ---
$title = "UnderPure Official Store | Premium Luxury Clothing & Lingerie";
$description = "Official UnderPure Store: Shop UnderPure online for premium luxury clothing, designer lingerie, handcrafted apparel, and everyday intimates with fast delivery.";
$defaultImage = $baseUrl . "/images/HP_MAIN_HERO_BANNER_-_NEW_ARRIVALS_4855c4d5-c02c-4a1c-955c-2294ee7c9ebb.jpg"; 
$image = $defaultImage;
$url = $baseUrl . $requestUri;

// --- DIRECT PDO DATABASE HELPER (Instant resolution without cURL loopback) ---
function getDirectPdo() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $possibleEnvPaths = [
        __DIR__ . '/../backend/.env',
        __DIR__ . '/backend/.env',
        ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/backend/.env',
        'c:/xampp/htdocs/backend/.env'
    ];

    $envVars = [];
    foreach ($possibleEnvPaths as $envPath) {
        if (file_exists($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || strpos($line, '#') === 0) continue;
                if (strpos($line, '=') !== false) {
                    list($name, $value) = explode('=', $line, 2);
                    $envVars[trim($name)] = trim($value, " \t\n\r\0\x0B\"'");
                }
            }
            break;
        }
    }

    $host = $envVars['DB_HOST'] ?? '127.0.0.1';
    $dbName = $envVars['DB_NAME'] ?? 'underpure_new';
    $user = $envVars['DB_USER'] ?? 'root';
    $pass = $envVars['DB_PASS'] ?? '';
    $portPrimary = $envVars['DB_PORT_PRIMARY'] ?? '3306';
    $portFallback = $envVars['DB_PORT_FALLBACK'] ?? '3306';

    $tryConnect = function($h, $db, $u, $p, $pt) {
        try {
            $dsn = "mysql:host={$h};dbname={$db};charset=utf8mb4";
            if (!empty($pt)) $dsn .= ";port={$pt}";
            return new PDO($dsn, $u, $p, [
                PDO::ATTR_TIMEOUT => 2,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_SILENT,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } catch (Exception $e) {
            return null;
        }
    };

    $pdo = $tryConnect($host, $dbName, $user, $pass, $portPrimary);
    if (!$pdo && $portPrimary !== $portFallback) {
        $pdo = $tryConnect($host, $dbName, $user, $pass, $portFallback);
    }
    if (!$pdo && $host !== '127.0.0.1') {
        $pdo = $tryConnect('127.0.0.1', $dbName, $user, $pass, '3306');
    }

    return $pdo;
}

// Secondary API fetch helper if DB is inaccessible
function fetchApi($url) {
    if (!function_exists('curl_init')) return null;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 2);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response ? json_decode($response, true) : null;
}

// --- 2. DYNAMIC ROUTING & METADATA RESOLUTION ---

// Permanent 301 redirect legacy /home or /home.html /index.html to canonical root /
if (preg_match('#^/(home|home\.html|index\.html)/?$#i', $requestPath)) {
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: " . $baseUrl . "/");
    exit;
}

if ($requestPath === '/' || $requestPath === '') {
    // HOMEPAGE
    $data = fetchApi($apiUrlBase . '/settings/homepage');
    if ($data && !isset($data['error']) && isset($data['heroData'])) {
        $heroData = is_string($data['heroData']) ? json_decode($data['heroData'], true) : $data['heroData'];
        if ($heroData && !empty($heroData['mediaUrl'])) {
            $mediaUrl = $heroData['mediaUrl'];
            if (strpos($mediaUrl, 'http') !== 0) $mediaUrl = $baseUrl . $mediaUrl;
            
            $isVid = preg_match('/\.(mp4|webm|ogg)$/i', $mediaUrl);
            $preloadTag = $isVid 
                ? '<link rel="preload" as="video" href="' . $mediaUrl . '" type="video/mp4" crossorigin="anonymous">'
                : '<link rel="preload" as="image" href="' . $mediaUrl . '" fetchpriority="high">';
            $html = str_replace('</title>', "</title>\n    " . $preloadTag, $html);
            
            if (!$isVid) {
                $image = $mediaUrl;
            }
        }
    }
} 
elseif (preg_match('#^/product/([^/?]+)#i', $requestPath, $matches)) {
    // PRODUCT PAGE
    $slug = urldecode($matches[1]);
    $fetched = false;

    // 1. Direct DB Query (Fastest & 100% reliable on server)
    $pdo = getDirectPdo();
    if ($pdo) {
        $stmt = $pdo->prepare("
            SELECT p.id, p.name, p.description, 
                   (SELECT image_url FROM product_images WHERE product_id = p.id AND (is_primary = 1 OR image_url IS NOT NULL) ORDER BY is_primary DESC, id ASC LIMIT 1) as primary_image
            FROM products p
            WHERE p.slug = ? OR p.id = ?
            LIMIT 1
        ");
        $stmt->execute([$slug, $slug]);
        $prod = $stmt->fetch();
        if ($prod) {
            $title = $prod['name'] . " | UnderPure Official Store";
            if (!empty($prod['description'])) {
                $cleanDesc = trim(strip_tags($prod['description']));
                if (!empty($cleanDesc)) {
                    $description = mb_substr($cleanDesc, 0, 200);
                }
            }
            if (!empty($prod['primary_image'])) {
                $image = (strpos($prod['primary_image'], 'http') !== 0) ? $baseUrl . $prod['primary_image'] : $prod['primary_image'];
            }
            $fetched = true;
        }
    }

    // 2. Fallback to API if DB direct fetch didn't hit
    if (!$fetched) {
        $data = fetchApi($apiUrlBase . '/products/' . urlencode($slug));
        if ($data && !isset($data['error'])) {
            $title = isset($data['name']) ? $data['name'] . " | UnderPure Official Store" : $title;
            if (!empty($data['description'])) {
                $description = mb_substr(strip_tags($data['description']), 0, 200);
            }
            
            $imgCandidate = null;
            if (!empty($data['image'])) {
                $imgCandidate = $data['image'];
            } elseif (!empty($data['images'])) {
                $images = is_string($data['images']) ? json_decode($data['images'], true) : $data['images'];
                if (is_array($images) && count($images) > 0) {
                    $imgCandidate = $images[0];
                }
            }
            if (!empty($imgCandidate)) {
                $image = (strpos($imgCandidate, 'http') !== 0) ? $baseUrl . $imgCandidate : $imgCandidate;
            }
        }
    }
}
elseif (preg_match('#^/(category|collections)/([^/?]+)#i', $requestPath, $matches)) {
    // CATEGORY / COLLECTION PAGE
    $slug = urldecode($matches[2]);
    $fetched = false;

    $pdo = getDirectPdo();
    if ($pdo) {
        $stmt = $pdo->prepare("SELECT label, sub_label, image_url FROM categories WHERE slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $cat = $stmt->fetch();
        if ($cat) {
            $title = $cat['label'] . " - Premium Collection | UnderPure";
            if (!empty($cat['sub_label'])) {
                $description = strip_tags($cat['sub_label']);
            } else {
                $description = "Shop the exclusive " . $cat['label'] . " collection at UnderPure.";
            }
            if (!empty($cat['image_url'])) {
                $image = (strpos($cat['image_url'], 'http') !== 0) ? $baseUrl . $cat['image_url'] : $cat['image_url'];
            }
            $fetched = true;
        }
    }

    if (!$fetched) {
        $data = fetchApi($apiUrlBase . '/categories/' . urlencode($slug));
        if ($data && !isset($data['error'])) {
            $title = isset($data['name']) ? $data['name'] . " - Premium Collection | UnderPure" : $title;
            $description = isset($data['description']) ? strip_tags($data['description']) : "Shop the exclusive " . $data['name'] . " collection at UnderPure.";
            if (!empty($data['image'])) {
                $image = (strpos($data['image'], 'http') !== 0) ? $baseUrl . $data['image'] : $data['image'];
            }
        }
    }
}
// --- STATIC PAGES ---
elseif ($requestPath === '/returns') {
    $title = "Returns Center | UnderPure";
    $description = "Easily process your UnderPure returns or exchanges through our Returns Center.";
}
elseif ($requestPath === '/terms') {
    $title = "Terms of Service | UnderPure";
    $description = "Read the UnderPure Terms of Service and guidelines.";
}
elseif ($requestPath === '/privacy') {
    $title = "Privacy Policy | UnderPure";
    $description = "Learn how UnderPure respects and protects your privacy and data.";
}
elseif ($requestPath === '/affiliates') {
    $title = "Become an Affiliate | UnderPure";
    $description = "Join the UnderPure Affiliate Program and earn commissions by sharing luxury fashion.";
}
elseif ($requestPath === '/do-not-sell') {
    $title = "Do Not Sell My Personal Information | UnderPure";
    $description = "Manage your data preferences and opt-out of data sharing.";
}
elseif ($requestPath === '/data-requests') {
    $title = "Customer Data Requests | UnderPure";
    $description = "Submit requests regarding your personal data and privacy at UnderPure.";
}
elseif ($requestPath === '/about-us') {
    $title = "About Us | UnderPure";
    $description = "Discover the story, vision, and craftsmanship behind UnderPure luxury clothing.";
}
elseif (strpos($requestPath, '/admin') === 0) {
    $title = "Admin Portal | UnderPure";
    $description = "UnderPure Management Portal.";
    $robotsTag = "<meta name='robots' content='noindex, nofollow' />";
} else {
    $robotsTag = "<meta name='robots' content='index, follow' />";
}


// --- 3. DYNAMIC CANONICAL & FULL WHATSAPP / SOCIAL OG METADATA INJECTION ---

$cleanPath = strtok($requestUri, '?');
if (empty($cleanPath) || $cleanPath === false) {
    $cleanPath = '/';
}
$canonicalUrl = $baseUrl . $cleanPath;

// Clean up image URL format
if (strpos($image, 'http') !== 0) {
    $image = $baseUrl . '/' . ltrim($image, '/');
}
$ogImageSecure = str_replace('http://', 'https://', $image);

// Determine MIME type for og:image:type
$pathOnly = parse_url($image, PHP_URL_PATH);
$ext = strtolower(pathinfo($pathOnly, PATHINFO_EXTENSION));
$ogImageType = 'image/jpeg';
if ($ext === 'png') {
    $ogImageType = 'image/png';
} elseif ($ext === 'webp') {
    $ogImageType = 'image/webp';
} elseif ($ext === 'gif') {
    $ogImageType = 'image/gif';
} elseif ($ext === 'svg') {
    $ogImageType = 'image/svg+xml';
}

$metaTags = "
    <!-- INJECTED DYNAMIC PHP SEO & WHATSAPP OG TAGS -->
    <title>" . htmlspecialchars($title, ENT_QUOTES) . "</title>
    <meta name='description' content='" . htmlspecialchars($description, ENT_QUOTES) . "' />
    <meta name='keywords' content='UnderPure, Underpure, Underpure online, UnderPure official, UnderPure store, UnderPure online store, UnderPure clothing, luxury clothing Pakistan' />
    <link rel='canonical' href='" . htmlspecialchars($canonicalUrl, ENT_QUOTES) . "' />
    " . (isset($robotsTag) ? $robotsTag : "") . "
    
    <!-- Open Graph (Facebook / WhatsApp / iMessage / Instagram / LinkedIn) -->
    <meta property='og:type' content='website' />
    <meta property='og:site_name' content='UnderPure Official Store' />
    <meta property='og:title' content='" . htmlspecialchars($title, ENT_QUOTES) . "' />
    <meta property='og:description' content='" . htmlspecialchars($description, ENT_QUOTES) . "' />
    <meta property='og:image' content='" . htmlspecialchars($image, ENT_QUOTES) . "' />
    <meta property='og:image:secure_url' content='" . htmlspecialchars($ogImageSecure, ENT_QUOTES) . "' />
    <meta property='og:image:type' content='" . $ogImageType . "' />
    <meta property='og:image:width' content='1200' />
    <meta property='og:image:height' content='630' />
    <meta property='og:url' content='" . htmlspecialchars($canonicalUrl, ENT_QUOTES) . "' />
    
    <!-- Twitter Cards -->
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content='" . htmlspecialchars($title, ENT_QUOTES) . "' />
    <meta name='twitter:description' content='" . htmlspecialchars($description, ENT_QUOTES) . "' />
    <meta name='twitter:image' content='" . htmlspecialchars($image, ENT_QUOTES) . "' />
    <meta name='twitter:image:src' content='" . htmlspecialchars($image, ENT_QUOTES) . "' />
";

// Strip out existing static tags from index.html so we don't have duplicates
$html = preg_replace('/<link rel="canonical".*?>/is', '', $html);
$html = preg_replace('/<meta property="og:.*?".*?>/is', '', $html);
$html = preg_replace('/<meta property="twitter:.*?".*?>/is', '', $html);
$html = preg_replace('/<meta name="twitter:.*?".*?>/is', '', $html);
$html = preg_replace('/<title>.*?<\/title>/is', '', $html);
$html = preg_replace('/<meta name="description".*?>/is', '', $html);

// Inject our new dynamic tags right before closing </head>
$html = str_replace('</head>', $metaTags . "\n</head>", $html);

// Output the final HTML to browser / crawler
echo $html;
?>
