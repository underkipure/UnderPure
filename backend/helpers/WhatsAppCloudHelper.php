<?php
/**
 * Official WhatsApp Cloud API Helper (Meta/Facebook)
 * Requirements:
 *  1. Meta Developer Account (developers.facebook.com)
 *  2. WhatsApp Business Account + Phone Number ID
 *  3. Permanent Access Token
 *  4. For outbound messages to users who haven't messaged you in 24h:
 *     - You need a pre-approved Message Template from Meta
 *     - Template name format: e.g. "order_confirmation"
 *
 * First 1000 conversations/month are free.
 */
class WhatsAppCloudHelper {
    private $pdo;
    private $settings = [];

    // WhatsApp Cloud API base URL
    private $apiBase = 'https://graph.facebook.com/v18.0';

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->loadSettings();
    }

    private function loadSettings() {
        $stmt = $this->pdo->query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key LIKE 'wa_cloud_%'");
        while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            $this->settings[$row['setting_key']] = $row['setting_value'];
        }
    }

    private function getPhoneNumberId() {
        return $this->settings['wa_cloud_phone_number_id'] ?? '';
    }

    private function getAccessToken() {
        return $this->settings['wa_cloud_access_token'] ?? '';
    }

    private function normalizePhone($phone) {
        $phone = preg_replace('/\D/', '', $phone);
        if (strlen($phone) === 11 && $phone[0] === '0') {
            $phone = '92' . substr($phone, 1);
        }
        return $phone;
    }

    /**
     * Send a free-form text message (ONLY works if user has messaged you in last 24 hours)
     */
    public function sendText($phone, $message) {
        $phoneNumberId = $this->getPhoneNumberId();
        $accessToken = $this->getAccessToken();

        if (empty($phoneNumberId) || empty($accessToken)) {
            error_log("WhatsAppCloudHelper: Missing phone_number_id or access_token in site_settings.");
            return false;
        }

        $to = $this->normalizePhone($phone);
        $url = "{$this->apiBase}/{$phoneNumberId}/messages";

        $payload = [
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $to,
            'type' => 'text',
            'text' => [
                'body' => $message,
                'preview_url' => false
            ]
        ];

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $accessToken
            ],
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => false,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            error_log("WhatsAppCloudHelper cURL Error: " . $error);
            return false;
        }

        $respData = json_decode($response, true);
        if ($httpCode >= 200 && $httpCode < 300 && isset($respData['messages'][0]['id'])) {
            return true;
        } else {
            error_log("WhatsAppCloudHelper API Error: HTTP $httpCode, Response: $response");
            return false;
        }
    }

    /**
     * Send a pre-approved Template message (works anytime, but template must be approved by Meta first)
     */
    public function sendTemplate($phone, $templateName, $languageCode = 'en', $components = []) {
        $phoneNumberId = $this->getPhoneNumberId();
        $accessToken = $this->getAccessToken();

        if (empty($phoneNumberId) || empty($accessToken)) {
            error_log("WhatsAppCloudHelper: Missing phone_number_id or access_token in site_settings.");
            return false;
        }

        $to = $this->normalizePhone($phone);
        $url = "{$this->apiBase}/{$phoneNumberId}/messages";

        $payload = [
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $to,
            'type' => 'template',
            'template' => [
                'name' => $templateName,
                'language' => [
                    'code' => $languageCode
                ],
                'components' => $components
            ]
        ];

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $accessToken
            ],
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => false,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            error_log("WhatsAppCloudHelper cURL Error: " . $error);
            return false;
        }

        $respData = json_decode($response, true);
        if ($httpCode >= 200 && $httpCode < 300 && isset($respData['messages'][0]['id'])) {
            return true;
        } else {
            error_log("WhatsAppCloudHelper API Error: HTTP $httpCode, Response: $response");
            return false;
        }
    }
}
