<?php
/**
 * WhatsApp Helper using a self-hosted Baileys Node.js bridge.
 * This helper calls a local Node.js service that runs a real WhatsApp connection.
 *
 * Prerequisites:
 *  1. cd c:\xampp\htdocs\backend\whatsapp-bridge
 *  2. npm install
 *  3. npm start
 *  4. Scan the QR code with your WhatsApp phone (Settings > Linked Devices)
 *  5. Keep the Node.js server running in the background
 */
class WhatsAppBaileysHelper {
    private $baseUrl = 'http://localhost:3001';

    public function __construct($baseUrl = null) {
        if ($baseUrl) {
            $this->baseUrl = rtrim($baseUrl, '/');
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
        $to = $this->normalizePhone($phone);

        $payload = json_encode([
            'phone' => $to,
            'message' => $message
        ]);

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->baseUrl . '/send',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json'
            ],
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 5,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            error_log("WhatsAppBaileysHelper cURL Error: " . $error);
            return false;
        }

        $data = json_decode($response, true);
        if ($httpCode >= 200 && $httpCode < 300 && !empty($data['success'])) {
            return true;
        } else {
            error_log("WhatsAppBaileysHelper API Error: HTTP $httpCode, Response: $response");
            return false;
        }
    }

    public function isConnected() {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->baseUrl . '/',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 5,
            CURLOPT_CONNECTTIMEOUT => 2,
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            $data = json_decode($response, true);
            return isset($data['status']) && $data['status'] === 'connected';
        }
        return false;
    }
}
