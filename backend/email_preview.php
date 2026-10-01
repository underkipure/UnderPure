<?php
/**
 * UnderPure Luxury Email Live Preview Suite
 * Protected preview harness for inspecting all 8 transactional email templates in Light & Dark modes.
 */

// Localhost Security Barrier
$clientIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$isLocal = in_array($clientIp, ['127.0.0.1', '::1', 'localhost']) || preg_match('/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/', $clientIp);

if (!$isLocal) {
    http_response_code(403);
    die('Forbidden: Preview tool is restricted to local development environments.');
}

require_once __DIR__ . '/helpers/email/EmailPreviewService.php';

$templateKey = $_GET['template'] ?? 'welcome';
$darkMode = isset($_GET['dark']) && $_GET['dark'] === '1';
$viewport = $_GET['viewport'] ?? 'desktop';

// If requested as raw iframe src
if (isset($_GET['raw']) && $_GET['raw'] === '1') {
    header('Content-Type: text/html; charset=UTF-8');
    echo EmailPreviewService::render($templateKey, $darkMode);
    exit();
}

$templates = EmailPreviewService::getTemplateList();
if (!array_key_exists($templateKey, $templates)) {
    $templateKey = 'welcome';
}

$iframeWidth = $viewport === 'mobile' ? '375px' : '650px';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UnderPure | Luxury Email Preview Suite</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background-color: <?= $darkMode ? '#0A0A0A' : '#F4F3F0' ?>;
            color: <?= $darkMode ? '#F0EDE8' : '#111111' ?>;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: background 0.3s ease, color 0.3s ease;
        }

        /* Top Header */
        .topbar {
            height: 64px;
            background-color: <?= $darkMode ? '#141414' : '#FFFFFF' ?>;
            border-bottom: 1px solid <?= $darkMode ? '#242424' : '#E5E2DC' ?>;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            flex-shrink: 0;
        }
        .brand-title {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 20px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            font-weight: 500;
        }
        .controls-group {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .btn-toggle {
            background-color: <?= $darkMode ? '#222222' : '#F0EDE8' ?>;
            color: <?= $darkMode ? '#F0EDE8' : '#111111' ?>;
            border: 1px solid <?= $darkMode ? '#333333' : '#DCD7D0' ?>;
            padding: 8px 14px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
        }
        .btn-toggle:hover {
            border-color: #8F6B58;
        }
        .btn-toggle.active {
            background-color: #111111;
            color: #FFFFFF;
            border-color: #111111;
        }

        /* Main Workspace Layout */
        .workspace {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        /* Sidebar navigation */
        .sidebar {
            width: 300px;
            background-color: <?= $darkMode ? '#111111' : '#FFFFFF' ?>;
            border-right: 1px solid <?= $darkMode ? '#242424' : '#E5E2DC' ?>;
            padding: 20px 12px;
            overflow-y: auto;
            flex-shrink: 0;
        }
        .sidebar-header {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #8F6B58;
            margin: 0 12px 14px 12px;
        }
        .nav-item {
            display: block;
            padding: 11px 14px;
            margin-bottom: 4px;
            font-size: 12.5px;
            color: <?= $darkMode ? '#C8C4BE' : '#4A4643' ?>;
            text-decoration: none;
            border-radius: 4px;
            transition: all 0.15s;
        }
        .nav-item:hover {
            background-color: <?= $darkMode ? '#1E1E1E' : '#F6F5F2' ?>;
            color: <?= $darkMode ? '#FFFFFF' : '#111111' ?>;
        }
        .nav-item.active {
            background-color: <?= $darkMode ? '#262626' : '#111111' ?>;
            color: #FFFFFF !important;
            font-weight: 500;
        }

        /* Preview Canvas */
        .canvas-area {
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 30px 20px 60px 20px;
        }
        .canvas-frame {
            width: <?= $iframeWidth ?>;
            max-width: 100%;
            height: 860px;
            border: 1px solid <?= $darkMode ? '#333333' : '#D8D4CC' ?>;
            border-radius: 6px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.08);
            background-color: <?= $darkMode ? '#0E0E0E' : '#FFFFFF' ?>;
            transition: width 0.3s ease;
        }
        .canvas-meta {
            font-size: 11px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #888888;
            margin-bottom: 14px;
        }
    </style>
</head>
<body>

    <!-- Topbar -->
    <header class="topbar">
        <div class="brand-title">
            UNDERPURE &bull; <span style="font-size: 13px; font-family: 'Inter', sans-serif; letter-spacing: 0.1em; color: #8F6B58;">Email Architecture Suite</span>
        </div>
        
        <div class="controls-group">
            <!-- Viewport Switcher -->
            <a href="?template=<?= urlencode($templateKey) ?>&dark=<?= $darkMode ? '1' : '0' ?>&viewport=desktop" class="btn-toggle <?= $viewport === 'desktop' ? 'active' : '' ?>">
                Desktop (650px)
            </a>
            <a href="?template=<?= urlencode($templateKey) ?>&dark=<?= $darkMode ? '1' : '0' ?>&viewport=mobile" class="btn-toggle <?= $viewport === 'mobile' ? 'active' : '' ?>">
                Mobile (375px)
            </a>

            <!-- Mode Switcher -->
            <a href="?template=<?= urlencode($templateKey) ?>&dark=<?= $darkMode ? '0' : '1' ?>&viewport=<?= $viewport ?>" class="btn-toggle">
                <?= $darkMode ? '☀️ Switch to Light Mode' : '🌙 Simulate Gmail Dark Mode' ?>
            </a>
        </div>
    </header>

    <!-- Workspace -->
    <div class="workspace">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
            <div class="sidebar-header">Core Transactional Templates</div>
            <?php foreach ($templates as $key => $title): ?>
                <a href="?template=<?= urlencode($key) ?>&dark=<?= $darkMode ? '1' : '0' ?>&viewport=<?= $viewport ?>" class="nav-item <?= $templateKey === $key ? 'active' : '' ?>">
                    <?= htmlspecialchars($title) ?>
                </a>
            <?php endforeach; ?>
        </aside>

        <!-- Preview Canvas -->
        <main class="canvas-area">
            <div class="canvas-meta">
                Rendering: <strong><?= htmlspecialchars($templates[$templateKey]) ?></strong> &bull; Mode: <strong><?= $darkMode ? 'Gmail Dark Mode (Simulated)' : 'Light Mode (Standard)' ?></strong> &bull; Viewport: <strong><?= ucfirst($viewport) ?></strong>
            </div>

            <iframe class="canvas-frame" src="?raw=1&template=<?= urlencode($templateKey) ?>&dark=<?= $darkMode ? '1' : '0' ?>" frameborder="0"></iframe>
        </main>
    </div>

</body>
</html>
