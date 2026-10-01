<?php

class RateLimiter {
    private static function getClientIp(): string {
        $remoteAddr = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

        // Check if request is forwarded by Cloudflare edge
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            $cfIp = trim($_SERVER['HTTP_CF_CONNECTING_IP']);
            if (filter_var($cfIp, FILTER_VALIDATE_IP)) {
                return $cfIp;
            }
        }

        // Only trust X-Forwarded-For if REMOTE_ADDR is an internal reverse proxy/load balancer
        $isLocalProxy = in_array($remoteAddr, ['127.0.0.1', '::1', 'localhost']) 
            || preg_match('/^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/', $remoteAddr);

        if ($isLocalProxy && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $firstIp = trim($parts[0]);
            if (filter_var($firstIp, FILTER_VALIDATE_IP)) {
                return $firstIp;
            }
        }

        return filter_var($remoteAddr, FILTER_VALIDATE_IP) ? $remoteAddr : '127.0.0.1';
    }

    /**
     * Enforce rate limit for an action.
     * @param string $actionKey Unique action name (e.g. 'login', 'checkout', 'register')
     * @param int $maxAttempts Maximum allowed requests per window
     * @param int $decaySeconds Time window in seconds (default 60s)
     */
    public static function check($actionKey, $maxAttempts = 10, $decaySeconds = 60) {
        $ip = self::getClientIp();
        $cacheDir = __DIR__ . '/../cache';
        if (!is_dir($cacheDir)) {
            @mkdir($cacheDir, 0777, true);
        }

        $hash = md5($ip . '_' . $actionKey);
        $file = $cacheDir . '/rl_' . $hash . '.cache';
        $now = time();

        $attempts = [];
        if (file_exists($file)) {
            $content = @file_get_contents($file);
            if ($content) {
                $decoded = @json_decode($content, true);
                if (is_array($decoded)) {
                    // Keep only attempts within decaySeconds window
                    $attempts = array_filter($decoded, function($t) use ($now, $decaySeconds) {
                        return ($now - $t) < $decaySeconds;
                    });
                }
            }
        }

        if (count($attempts) >= $maxAttempts) {
            http_response_code(429);
            header('Retry-After: ' . $decaySeconds);
            echo json_encode([
                'error' => 'Too many requests. Please slow down and try again after ' . $decaySeconds . ' seconds.'
            ]);
            exit();
        }

        // Record current attempt timestamp
        $attempts[] = $now;
        @file_put_contents($file, json_encode(array_values($attempts)), LOCK_EX);
    }
}
