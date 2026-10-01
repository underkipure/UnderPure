<?php

require_once __DIR__ . '/../../helpers/CacheHelper.php';

class SettingsController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * GET /settings/storefront
     * Highly optimized, public storefront settings endpoint.
     * Returns only the critical UI, branding, homepage, and navigation keys.
     */
    public function getStorefront() {
        try {
            $partition = $_GET['partition'] ?? 'full';
            $cacheKey = ($partition === 'core') ? 'settings_storefront_core' : 'settings_storefront';

            if (CacheHelper::streamRaw($cacheKey . '_raw', [
                'Cache-Control: public, max-age=60, stale-while-revalidate=120'
            ])) {
                return;
            }

            if ($partition === 'core') {
                $storefrontKeys = [
                    'storeName', 'storeTagline', 'currency', 'currencySymbol',
                    'freeShippingThreshold', 'lowStockThreshold', 'taxRate', 'shippingRates',
                    'socialLinks', 'contactEmail', 'contactPhone', 'globalSizes', 'logo', 'favicon',
                    'metaTitle', 'metaDescription',
                    'announcementBar', 'announcementBarEnabled', 'announcementBarLink',
                    'announcementBarBgColor', 'announcementBarTextColor',
                    'megaMenuData', 'header', 'footer', 'boutiqueHeader',
                    'heroData', 'homeSectionToggles', 'categoryBanners', 'featuredBanners',
                    'pleasureSwimBanners', 'sportBanner', 'shopTheFeed', 'homeCarousels',
                    'brandDescription', 'pressQuotes',
                    'collectionSettings', 'productDetailSettings',
                    'cartSettings', 'checkoutSettings',
                    'popupSettings', 'popup', 'chatWidgetSettings', 'chatWidgetData', 'authSettings', 'authData', 'accountData',
                    'footerData'
                ];
            } else {
                $storefrontKeys = [
                    'storeName', 'storeTagline', 'currency', 'currencySymbol',
                    'freeShippingThreshold', 'lowStockThreshold', 'taxRate', 'shippingRates',
                    'socialLinks', 'contactEmail', 'contactPhone', 'globalSizes', 'logo', 'favicon',
                    'metaTitle', 'metaDescription',
                    'announcementBar', 'announcementBarEnabled', 'announcementBarLink',
                    'announcementBarBgColor', 'announcementBarTextColor',
                    'megaMenuData', 'header', 'footer', 'boutiqueHeader',
                    'heroData', 'homeSectionToggles', 'categoryBanners', 'featuredBanners',
                    'pleasureSwimBanners', 'sportBanner', 'shopTheFeed', 'homeCarousels',
                    'brandDescription', 'pressQuotes',
                    'collectionSettings', 'productDetailSettings',
                    'cartSettings', 'checkoutSettings',
                    'popupSettings', 'popup', 'chatWidgetSettings', 'chatWidgetData', 'authSettings', 'authData', 'accountData',
                    'aboutUsData', 'affiliatesData', 'careersData', 'contactUsData',
                    'cookieDeclarationData', 'doNotSellData', 'privacyPolicyData', 'termsOfServiceData',
                    'returnsData', 'faqs', 'faqHeroImage', 'braSizeData', 'lovelistData', 'loyaltyData', 'loyaltySettings',
                    'customPages', 'footerData'
                ];
            }

            $placeholders = implode(',', array_fill(0, count($storefrontKeys), '?'));
            $stmt = $this->pdo->prepare("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ($placeholders)");
            $stmt->execute($storefrontKeys);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $settings = [];
            foreach ($rows as $row) {
                $val = $row['setting_value'];
                $decoded = json_decode($val, true);
                if (json_last_error() === JSON_ERROR_NONE && !is_numeric($val) && !is_bool($val)) {
                    $settings[$row['setting_key']] = $decoded;
                } else {
                    if ($val === 'true') $val = true;
                    if ($val === 'false') $val = false;
                    $settings[$row['setting_key']] = $val;
                }
            }

            $json = json_encode($settings);
            CacheHelper::setRaw($cacheKey . '_raw', $json, 600);
            CacheHelper::set($cacheKey, $settings, 600);

            if (!headers_sent()) {
                header('Cache-Control: public, max-age=60, stale-while-revalidate=120');
                header('Content-Type: application/json; charset=utf-8');
            }
            http_response_code(200);
            echo $json;

        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * GET /settings
     * Fetch all site settings and format as a key-value object.
     * Sanitizes sensitive credentials for unauthenticated requests.
     */
    public function index() {
        try {
            $isAdmin = false;
            $headers = function_exists('getallheaders') ? getallheaders() : [];
            $authHeader = $headers["Authorization"] ?? $headers["authorization"] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
            if (preg_match("/Bearer\s(\S+)/", $authHeader, $matches)) {
                require_once __DIR__ . "/../../helpers/JwtHelper.php";
                $decoded = JwtHelper::decode($matches[1]);
                if ($decoded && isset($decoded['id'])) {
                    $stmt = $this->pdo->prepare("SELECT is_admin, token_version FROM users WHERE id = ?");
                    $stmt->execute([$decoded['id']]);
                    $u = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($u && (bool)$u['is_admin']) {
                        $userTv = (int)($u['token_version'] ?? 1);
                        $tokenTv = isset($decoded['tv']) ? (int)$decoded['tv'] : 0;
                        if ($tokenTv >= $userTv) {
                            $isAdmin = true;
                        }
                    }
                }
            }

            if ($isAdmin) {
                $stmt = $this->pdo->query("SELECT setting_key, setting_value FROM site_settings");
            } else {
                $stmt = $this->pdo->query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key NOT LIKE 'whatsapp_%' AND setting_key NOT LIKE 'wa_%' AND setting_key NOT LIKE '%_secret' AND setting_key NOT LIKE '%_key' AND setting_key NOT LIKE '%_token'");
            }

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $settings = [];
            foreach ($rows as $row) {
                $val = $row['setting_value'];
                
                // Attempt to parse JSON values (arrays, objects stored as JSON strings)
                $decoded = json_decode($val, true);
                if (json_last_error() === JSON_ERROR_NONE && !is_numeric($val) && !is_bool($val)) {
                    $settings[$row['setting_key']] = $decoded;
                } else {
                    // Convert string booleans back to actual booleans
                    if ($val === 'true') $val = true;
                    if ($val === 'false') $val = false;
                    $settings[$row['setting_key']] = $val;
                }
            }

            http_response_code(200);
            echo json_encode($settings);

        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * PUT /settings
     * Update or insert site settings. Requires Admin access.
     */
    public function update() {
        // ---- Auth Check ----
        if (!isset($_REQUEST['user']) || $_REQUEST['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        // ---- Read & Validate JSON Payload ----
        $rawBody = file_get_contents("php://input");

        if (empty($rawBody)) {
            http_response_code(400);
            echo json_encode([
                'error'   => 'Empty request body. Expected a JSON object with key-value pairs.',
                'rawBody' => ''
            ]);
            return;
        }

        $data = json_decode($rawBody, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode([
                'error'          => 'Invalid JSON payload.',
                'json_error'     => json_last_error_msg(),
                'raw_body_start' => substr($rawBody, 0, 200) // First 200 chars for debugging
            ]);
            return;
        }

        if (!is_array($data) || count($data) === 0) {
            http_response_code(400);
            echo json_encode([
                'error' => 'JSON decoded successfully but result is not a non-empty object/array.',
                'type'  => gettype($data)
            ]);
            return;
        }

        // ---- Upsert each setting into section tables & DB ----
        try {
            $this->pdo->beginTransaction();

            $sqlOld = "INSERT INTO site_settings (setting_key, setting_value) VALUES (:skey, :sval) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)";
            $stmtOld = $this->pdo->prepare($sqlOld);

            $stmtGen   = $this->pdo->prepare("INSERT INTO settings_general (setting_key, setting_value) VALUES (:k, :v) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
            $stmtTheme = $this->pdo->prepare("INSERT INTO settings_theme (setting_key, setting_value) VALUES (:k, :v) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
            $stmtInteg = $this->pdo->prepare("INSERT INTO settings_integrations (setting_key, setting_value) VALUES (:k, :v) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
            $stmtCms   = $this->pdo->prepare("INSERT INTO cms_pages (slug, title, content_json, is_published) VALUES (:slug, :title, :content, 1) ON DUPLICATE KEY UPDATE title = VALUES(title), content_json = VALUES(content_json)");

            $themeKeys = [
                'logo', 'favicon', 'announcementBar', 'announcementBarEnabled', 'announcementBarLink',
                'announcementBarBgColor', 'announcementBarTextColor', 'megaMenuData', 'header', 'footer',
                'boutiqueHeader', 'heroData', 'homeSectionToggles', 'categoryBanners', 'featuredBanners',
                'pleasureSwimBanners', 'sportBanner', 'shopTheFeed', 'homeCarousels', 'brandDescription',
                'pressQuotes', 'heroSlides', 'featuredCategories', 'faqHeroImage', 'footerData'
            ];

            $cmsPageMapping = [
                'aboutUsData'           => ['title' => 'About Us', 'slug' => 'about-us'],
                'privacyPolicyData'     => ['title' => 'Privacy Policy', 'slug' => 'privacy-policy'],
                'termsOfServiceData'    => ['title' => 'Terms of Service', 'slug' => 'terms-of-service'],
                'returnsData'           => ['title' => 'Returns & Exchange Policy', 'slug' => 'return-policy'],
                'faqs'                  => ['title' => 'Frequently Asked Questions', 'slug' => 'faqs'],
                'affiliatesData'        => ['title' => 'Affiliates', 'slug' => 'affiliates'],
                'careersData'           => ['title' => 'Careers', 'slug' => 'careers'],
                'contactUsData'         => ['title' => 'Contact Us', 'slug' => 'contact-us'],
                'cookieDeclarationData' => ['title' => 'Cookie Declaration', 'slug' => 'cookie-declaration'],
                'doNotSellData'         => ['title' => 'Do Not Sell My Info', 'slug' => 'do-not-sell'],
                'braSizeData'           => ['title' => 'Bra Size Guide', 'slug' => 'bra-size-guide']
            ];

            foreach ($data as $key => $value) {
                // Flatten arrays/objects to JSON strings for storage, booleans to 'true'/'false', strings/numbers as string
                if (is_array($value) || is_object($value)) {
                    $valStr = json_encode($value);
                } elseif (is_bool($value)) {
                    $valStr = $value ? 'true' : 'false';
                } else {
                    $valStr = (string) $value;
                }

                // Prevent Base64 Image Database Bloat: Automatically offload any base64 images to Cloudinary
                if (strpos($valStr, 'data:image') !== false) {
                    require_once __DIR__ . '/../../helpers/CloudinaryHelper.php';
                    $valStr = preg_replace_callback('/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+\/=]+/', function ($matches) use ($key) {
                        $uploadedUrl = CloudinaryHelper::uploadImageBase64($matches[0], 'settings_' . preg_replace('/[^a-zA-Z0-9_]/', '', $key));
                        return $uploadedUrl ?: $matches[0];
                    }, $valStr);
                }

                $stmtOld->execute([':skey' => $key, ':sval' => $valStr]);

                if (isset($cmsPageMapping[$key])) {
                    $stmtCms->execute([
                        ':slug'    => $cmsPageMapping[$key]['slug'],
                        ':title'   => $cmsPageMapping[$key]['title'],
                        ':content' => $valStr
                    ]);
                } elseif (in_array($key, $themeKeys)) {
                    $stmtTheme->execute([':k' => $key, ':v' => $valStr]);
                } elseif (strpos($key, 'wa_') === 0 || strpos($key, 'whatsapp_') === 0 || strpos($key, 'postex_') === 0 || strpos($key, 'secret') !== false || strpos($key, 'token') !== false) {
                    $stmtInteg->execute([':k' => $key, ':v' => $valStr]);
                } else {
                    $stmtGen->execute([':k' => $key, ':v' => $valStr]);
                }
            }

            $this->pdo->commit();
            CacheHelper::invalidate('settings');

            http_response_code(200);
            echo json_encode([
                'message'      => 'Settings updated successfully.',
                'keys_updated' => array_keys($data)
            ]);

        } catch (\PDOException $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            require_once __DIR__ . '/../../helpers/ErrorHandler.php';
            ErrorHandler::respondWithError(500, 'Database error while saving settings.', $e);
        }
    }

    /**
     * GET /settings/homepage
     * Fetch homepage content (hero slides, featured categories, announcement bar).
     */
    public function getHomepage() {
        try {
            $keys = ['heroSlides', 'featuredCategories', 'announcementBar'];
            $placeholders = implode(',', array_fill(0, count($keys), '?'));
            $stmt = $this->pdo->prepare("SELECT setting_key, setting_value FROM settings_theme WHERE setting_key IN ($placeholders)");
            $stmt->execute($keys);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $content = [
                'heroSlides'         => [],
                'featuredCategories' => [],
                'announcementBar'    => '15% OFF YOUR FIRST ORDER | USE CODE WELCOME15',
            ];

            foreach ($rows as $row) {
                $decoded = json_decode($row['setting_value'], true);
                $content[$row['setting_key']] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $row['setting_value'];
            }

            http_response_code(200);
            echo json_encode($content);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * PUT /settings/homepage
     * Update homepage content. Requires Admin access.
     */
    public function updateHomepage() {
        if (!isset($_REQUEST['user']) || $_REQUEST['user']['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden. Admin access required.']);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON payload.']);
            return;
        }

        try {
            $this->pdo->beginTransaction();
            $stmtOld = $this->pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (:skey, :sval) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
            $stmtTheme = $this->pdo->prepare("INSERT INTO settings_theme (setting_key, setting_value) VALUES (:skey, :sval) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");

            $allowed = ['heroSlides', 'featuredCategories', 'announcementBar'];
            foreach ($allowed as $key) {
                if (array_key_exists($key, $data)) {
                    $val = is_array($data[$key]) ? json_encode($data[$key]) : (string)$data[$key];
                    if (strpos($val, 'data:image') !== false) {
                        require_once __DIR__ . '/../../helpers/CloudinaryHelper.php';
                        $val = preg_replace_callback('/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+\/=]+/', function ($matches) use ($key) {
                            $uploadedUrl = CloudinaryHelper::uploadImageBase64($matches[0], 'homepage_' . preg_replace('/[^a-zA-Z0-9_]/', '', $key));
                            return $uploadedUrl ?: $matches[0];
                        }, $val);
                    }
                    $stmtOld->execute([':skey' => $key, ':sval' => $val]);
                    $stmtTheme->execute([':skey' => $key, ':sval' => $val]);
                }
            }

            $this->pdo->commit();
            CacheHelper::invalidate('settings');
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Homepage content updated successfully.']);
        } catch (\PDOException $e) {
            if ($this->pdo->inTransaction()) $this->pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * GET /settings/support-pages
     * Fetch the list of support / help pages from cms_pages table.
     */
    public function getSupportPages() {
        try {
            $stmt = $this->pdo->query("SELECT id, title, slug, is_published FROM cms_pages WHERE is_published = 1 ORDER BY id ASC");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!empty($rows)) {
                $pages = array_map(function($r) {
                    return [
                        'id'          => (int)$r['id'],
                        'title'       => $r['title'],
                        'slug'        => $r['slug'],
                        'isPublished' => (bool)$r['is_published']
                    ];
                }, $rows);

                http_response_code(200);
                echo json_encode($pages);
                return;
            }

            // Default support pages if empty
            $defaults = [
                ['id' => 1, 'title' => 'FAQs',            'slug' => 'faqs',            'isPublished' => true],
                ['id' => 2, 'title' => 'About Us',         'slug' => 'about-us',        'isPublished' => true],
                ['id' => 3, 'title' => 'Shipping Policy',  'slug' => 'shipping-policy', 'isPublished' => true],
                ['id' => 4, 'title' => 'Return Policy',    'slug' => 'return-policy',   'isPublished' => true],
            ];
            http_response_code(200);
            echo json_encode($defaults);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }

    /**
     * GET /cms/:slug
     * Fetch static CMS page by slug (L1/L2 Cached for 24 hours).
     */
    public function getCmsPage($slug) {
        try {
            $cacheKey = 'cms_page_' . md5($slug);
            $cached = CacheHelper::get($cacheKey);
            if ($cached !== null) {
                header('Cache-Control: public, max-age=3600, stale-while-revalidate=86400');
                http_response_code(200);
                echo json_encode($cached);
                return;
            }

            $stmt = $this->pdo->prepare("SELECT id, title, slug, content_json, updated_at FROM cms_pages WHERE slug = ? AND is_published = 1");
            $stmt->execute([$slug]);
            $page = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$page) {
                http_response_code(404);
                echo json_encode(['error' => 'Page not found']);
                return;
            }

            $decoded = json_decode($page['content_json'], true);
            $page['content'] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $page['content_json'];
            unset($page['content_json']);

            CacheHelper::set($cacheKey, $page, 86400);

            header('Cache-Control: public, max-age=3600, stale-while-revalidate=86400');
            http_response_code(200);
            echo json_encode($page);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        }
    }
}
