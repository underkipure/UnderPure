<?php
/**
 * WhatsApp Helper supporting multiple free providers:
 *  1. Generic URL Template (any HTTP GET API like WATI, UltraMsg, etc.)
 *  2. CallMeBot (Free - https://www.callmebot.com/blog/free-api-whatsapp-messages/)
 *
 * For CallMeBot Setup:
 *  - Save your phone number in site_settings as: whatsapp_bot_phone
 *  - Save your API key in site_settings as: whatsapp_api_key
 *  - Set provider: whatsapp_provider = callmebot
 *
 * How to get CallMeBot API Key:
 *  1. Open WhatsApp on your phone
 *  2. Send this exact message to +34 603 21 25 00:
 *     "I allow callmebot to send me messages"
 *  3. You will receive your API key in reply
 *  4. Save that API key in site_settings (whatsapp_api_key)
 *  5. Save your phone number in site_settings (whatsapp_bot_phone) - the number that received the API key
 */
class WhatsAppHelper {
    private $pdo;
    private $settings = [];

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->loadSettings();
    }

    private function loadSettings() {
        $stmt = $this->pdo->query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key LIKE 'whatsapp_%' OR setting_key LIKE 'wa_%'");
        while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            $this->settings[$row['setting_key']] = $row['setting_value'];
        }
    }

    private function normalizePhone($phone) {
        $phone = preg_replace('/\D/', '', $phone);
        if (strlen($phone) === 11 && $phone[0] === '0') {
            $phone = '92' . substr($phone, 1);
        }
        return $phone;
    }

    public function send($phone, $message) {
        $provider = strtolower($this->settings['whatsapp_provider'] ?? 'local_bridge');

        if ($provider === 'callmebot') {
            return $this->sendViaCallMeBot($phone, $message);
        } elseif ($provider === 'template') {
            return $this->sendViaTemplate($phone, $message);
        } else {
            return $this->sendViaLocalBridge($phone, $message);
        }
    }

    /**
     * Local Baileys Bridge
     * Connects to the local Node.js whatsapp-bridge running on port 3001
     */
    private function sendViaLocalBridge($phone, $message) {
        $url = 'http://127.0.0.1:3001/send';
        
        $payload = json_encode([
            'phone' => $phone,
            'message' => $message
        ]);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($payload)
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            error_log("WhatsAppHelper LocalBridge cURL Error: " . $error);
            return false;
        }

        if ($httpCode >= 200 && $httpCode < 300) {
            return true;
        } else {
            error_log("WhatsAppHelper LocalBridge API Error: HTTP $httpCode, Response: $response");
            return false;
        }
    }

    /**
     * Generic URL Template method (WATI, UltraMsg, etc.)
     * URL must contain placeholders: {phone}, {message}, {apikey}
     */
    private function sendViaTemplate($phone, $message) {
        $apiUrl = $this->settings['whatsapp_api_url'] ?? '';
        $apiKey = $this->settings['whatsapp_api_key'] ?? '';

        if (empty($apiUrl)) {
            error_log("WhatsAppHelper: API URL not configured in site_settings.");
            return false;
        }

        $to = $this->normalizePhone($phone);

        if (strlen($to) < 10 || strlen($to) > 15) {
            error_log("WhatsAppHelper: Invalid phone number format: $to");
            return false;
        }

        $url = str_replace(
            ['{phone}', '{message}', '{apikey}'],
            [urlencode($to), urlencode($message), urlencode($apiKey)],
            $apiUrl
        );

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FOLLOWLOCATION => true,
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            error_log("WhatsAppHelper cURL Error: " . $error);
            return false;
        }

        if ($httpCode >= 200 && $httpCode < 300) {
            return true;
        } else {
            error_log("WhatsAppHelper API Error: HTTP $httpCode, Response: $response, URL: $url");
            return false;
        }
    }

    /**
     * CallMeBot Free WhatsApp API
     * Docs: https://www.callmebot.com/blog/free-api-whatsapp-messages/
     *
     * IMPORTANT: The API key is tied to the sender phone (whatsapp_bot_phone).
     * The sender must have sent "I allow callmebot to send me messages" to +34 603 21 25 00.
     * You can send messages to ANY phone number, not just your own.
     */
    private function sendViaCallMeBot($phone, $message) {
        $apiKey = $this->settings['whatsapp_api_key'] ?? '';
        $botPhone = $this->settings['whatsapp_bot_phone'] ?? '';

        if (empty($apiKey)) {
            error_log("WhatsAppHelper CallMeBot: API key not configured in site_settings (whatsapp_api_key).");
            return false;
        }

        if (empty($botPhone)) {
            error_log("WhatsAppHelper CallMeBot: Bot phone not configured in site_settings (whatsapp_bot_phone).");
            return false;
        }

        $to = $this->normalizePhone($phone);
        $from = $this->normalizePhone($botPhone);

        $url = 'https://api.callmebot.com/whatsapp.php'
            . '?phone=' . urlencode($to)
            . '&text=' . urlencode($message)
            . '&apikey=' . urlencode($apiKey);

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FOLLOWLOCATION => true,
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            error_log("WhatsAppHelper CallMeBot cURL Error: " . $error);
            return false;
        }

        // CallMeBot returns plain text. Success usually contains a simple confirmation.
        if ($httpCode >= 200 && $httpCode < 300) {
            return true;
        } else {
            error_log("WhatsAppHelper CallMeBot API Error: HTTP $httpCode, Response: $response");
            return false;
        }
    }
}
