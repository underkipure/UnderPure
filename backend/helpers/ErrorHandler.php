<?php

class ErrorHandler {
    /**
     * Return a sanitized HTTP error response.
     * Masks internal SQL syntax, file paths, and stack traces in production environments.
     * @param int $httpCode HTTP Response Code (e.g. 500, 400, 403)
     * @param string $publicMessage User-friendly error message
     * @param \Throwable|null $e Exception or Error instance for logging
     */
    public static function respondWithError($httpCode = 500, $publicMessage = 'An error occurred while processing your request.', \Throwable $e = null) {
        if ($e !== null) {
            error_log(sprintf(
                "[ERROR %d] %s in %s:%d\nStack Trace:\n%s",
                $httpCode,
                $e->getMessage(),
                $e->getFile(),
                $e->getLine(),
                $e->getTraceAsString()
            ));
        }

        $isDebug = (!empty($_ENV['APP_DEBUG']) && filter_var($_ENV['APP_DEBUG'], FILTER_VALIDATE_BOOLEAN))
            || (isset($_ENV['APP_ENV']) && in_array(strtolower($_ENV['APP_ENV']), ['development', 'local', 'debug']));

        $response = ['error' => $publicMessage];

        if ($isDebug && $e !== null) {
            $response['debug'] = [
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine()
            ];
        }

        http_response_code($httpCode);
        echo json_encode($response);
        exit();
    }
}
