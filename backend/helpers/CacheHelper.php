<?php

class CacheHelper {
    private static $cacheDir = null;
    private static $l1MemoryCache = [];
    private static $l1RawCache = [];

    private static function getCacheDir() {
        if (self::$cacheDir === null) {
            self::$cacheDir = __DIR__ . '/../cache';
            if (!is_dir(self::$cacheDir)) {
                @mkdir(self::$cacheDir, 0777, true);
            }
        }
        return self::$cacheDir;
    }

    /**
     * Retrieve an item from cache (L1 Memory -> L2 File).
     * @param string $key
     * @return mixed|null Returns cached data or null if missed/expired.
     */
    public static function get($key) {
        // L1 Request Memory Cache Check
        if (array_key_exists($key, self::$l1MemoryCache)) {
            $item = self::$l1MemoryCache[$key];
            if ($item['expires'] >= time()) {
                return $item['value'];
            } else {
                unset(self::$l1MemoryCache[$key]);
            }
        }

        try {
            $file = self::getCacheDir() . '/' . md5($key) . '.cache';
            if (!file_exists($file)) {
                return null;
            }

            $content = @file_get_contents($file);
            if (!$content) {
                return null;
            }

            $data = @json_decode($content, true);
            if (!$data || !isset($data['expires']) || !array_key_exists('value', $data)) {
                @unlink($file);
                return null;
            }

            if (time() > $data['expires']) {
                @unlink($file);
                return null;
            }

            // Store in L1 Memory Cache
            self::$l1MemoryCache[$key] = [
                'value' => $data['value'],
                'expires' => $data['expires']
            ];

            return $data['value'];
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Store an item in the cache with a TTL (L1 Memory + L2 File).
     * @param string $key
     * @param mixed $value
     * @param int $ttlSeconds Default 300 seconds (5 minutes)
     */
    public static function set($key, $value, $ttlSeconds = 300) {
        $expires = time() + $ttlSeconds;

        // Populate L1 Memory Cache
        self::$l1MemoryCache[$key] = [
            'value' => $value,
            'expires' => $expires
        ];

        try {
            $dir = self::getCacheDir();
            $hash = md5($key);
            $file = $dir . '/' . $hash . '.cache';

            $data = [
                'created' => time(),
                'expires' => $expires,
                'key'     => $key,
                'value'   => $value
            ];

            $json = json_encode($data);
            if ($json !== false) {
                @file_put_contents($file, $json, LOCK_EX);
            }
        } catch (\Throwable $e) {
            // Gracefully ignore caching errors
        }
    }

    /**
     * Fast pre-serialized raw JSON cache getter (Zero json_decode overhead).
     * @param string $key
     * @return string|null Raw JSON string or null if missed/expired.
     */
    public static function getRaw($key) {
        if (array_key_exists($key, self::$l1RawCache)) {
            $item = self::$l1RawCache[$key];
            if ($item['expires'] >= time()) {
                return $item['json'];
            } else {
                unset(self::$l1RawCache[$key]);
            }
        }

        try {
            $file = self::getCacheDir() . '/' . md5($key) . '.rawcache';
            if (!file_exists($file)) {
                return null;
            }

            $fp = @fopen($file, 'rb');
            if (!$fp) return null;

            $header = fgets($fp);
            if (!$header) {
                @fclose($fp);
                @unlink($file);
                return null;
            }

            $parts = explode('|', trim($header), 2);
            $expires = (int)($parts[0] ?? 0);
            if (time() > $expires) {
                @fclose($fp);
                @unlink($file);
                return null;
            }

            $rawJson = stream_get_contents($fp);
            @fclose($fp);

            if ($rawJson === false || $rawJson === '') {
                return null;
            }

            self::$l1RawCache[$key] = [
                'json' => $rawJson,
                'expires' => $expires
            ];

            return $rawJson;
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Store pre-serialized raw JSON with TTL (Zero json_encode overhead).
     * @param string $key
     * @param string $rawJson
     * @param int $ttlSeconds
     */
    public static function setRaw($key, $rawJson, $ttlSeconds = 300) {
        $expires = time() + $ttlSeconds;

        self::$l1RawCache[$key] = [
            'json' => $rawJson,
            'expires' => $expires
        ];

        try {
            $dir = self::getCacheDir();
            $hash = md5($key);
            $file = $dir . '/' . $hash . '.rawcache';

            $header = $expires . '|' . $key . "\n";
            @file_put_contents($file, $header . $rawJson, LOCK_EX);
        } catch (\Throwable $e) {
            // Gracefully ignore caching errors
        }
    }

    /**
     * Stream pre-serialized raw JSON directly to HTTP response buffer.
     * @param string $key
     * @param array $headers Additional headers to send (e.g. Cache-Control)
     * @return bool True if served from cache, false on cache miss.
     */
    public static function streamRaw($key, array $headers = []) {
        $raw = self::getRaw($key);
        if ($raw === null) {
            return false;
        }

        if (!headers_sent()) {
            header('Content-Type: application/json; charset=utf-8');
            foreach ($headers as $h) {
                header($h);
            }
            http_response_code(200);
        }

        echo $raw;
        return true;
    }

    /**
     * Invalidate cache items by key or prefix across standard & raw caches.
     * @param string $prefix
     */
    public static function invalidate($prefix = '') {
        // Clear L1 Memory Caches for matching keys
        if (empty($prefix)) {
            self::$l1MemoryCache = [];
            self::$l1RawCache = [];
        } else {
            foreach (array_keys(self::$l1MemoryCache) as $k) {
                if (strpos($k, $prefix) === 0) {
                    unset(self::$l1MemoryCache[$k]);
                }
            }
            foreach (array_keys(self::$l1RawCache) as $k) {
                if (strpos($k, $prefix) === 0) {
                    unset(self::$l1RawCache[$k]);
                }
            }
        }

        try {
            $dir = self::getCacheDir();
            if (!is_dir($dir)) return;

            $files = glob($dir . '/*.*cache');
            if (!$files) return;

            foreach ($files as $file) {
                if (empty($prefix)) {
                    @unlink($file);
                    continue;
                }

                if (substr($file, -9) === '.rawcache') {
                    $fp = @fopen($file, 'rb');
                    if ($fp) {
                        $header = fgets($fp);
                        @fclose($fp);
                        if ($header) {
                            $parts = explode('|', trim($header), 2);
                            if (isset($parts[1]) && strpos($parts[1], $prefix) === 0) {
                                @unlink($file);
                            }
                        }
                    }
                } else {
                    $content = @file_get_contents($file);
                    if ($content) {
                        $data = @json_decode($content, true);
                        if ($data && isset($data['key']) && strpos($data['key'], $prefix) === 0) {
                            @unlink($file);
                        }
                    }
                }
            }
        } catch (\Throwable $e) {
            // Gracefully ignore
        }
    }

    /**
     * Clear all cached files and memory.
     */
    public static function clearAll() {
        self::invalidate('');
    }
}

