<?php

require_once __DIR__ . '/ErrorHandler.php';

class RequestValidator {
    /**
     * Validate and decode JSON payload from php://input.
     * @param array $requiredFields List of required array keys
     * @return array Decoded data array
     */
    public static function validateJsonBody($requiredFields = []) {
        $rawBody = file_get_contents("php://input");
        if (empty($rawBody)) {
            ErrorHandler::respondWithError(400, "Empty request payload. Expected a JSON body.");
        }

        $data = json_decode($rawBody, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            ErrorHandler::respondWithError(400, "Invalid JSON payload format: " . json_last_error_msg());
        }

        $missing = [];
        foreach ($requiredFields as $field) {
            if (!array_key_exists($field, $data) || $data[$field] === null || (is_string($data[$field]) && trim($data[$field]) === '')) {
                $missing[] = $field;
            }
        }

        if (!empty($missing)) {
            ErrorHandler::respondWithError(400, "Missing or empty required fields: " . implode(', ', $missing));
        }

        return $data;
    }

    /**
     * Sanitize a string value.
     */
    public static function sanitizeString($val, $default = '') {
        if (!is_string($val)) return $default;
        return trim(filter_var($val, FILTER_DEFAULT));
    }
}
