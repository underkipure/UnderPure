<?php

class PushNotificationHelper {
    public static function send($title, $body, $url = null, $userIds = null) {
        $appId = $_ENV['ONESIGNAL_APP_ID'] ?? null;
        $apiKey = $_ENV['ONESIGNAL_API_KEY'] ?? null;

        if (!$appId || !$apiKey) {
            error_log("PushNotificationHelper: ONESIGNAL_APP_ID or ONESIGNAL_API_KEY is not defined in .env");
            return false;
        }

        $payload = [
            'app_id' => $appId,
            'headings' => ['en' => $title],
            'contents' => ['en' => $body]
        ];

        if ($url) {
            $payload['url'] = $url;
        }

        if ($userIds !== null) {
            // Target specific users by database ID (string format)
            $ids = is_array($userIds) ? $userIds : [$userIds];
            $stringIds = array_map('strval', $ids);
            $payload['include_aliases'] = [
                'external_id' => $stringIds
            ];
            $payload['target_channel'] = 'push';
        } else {
            // Broadcast to all
            $payload['included_segments'] = ['Total Subscriptions'];
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json; charset=utf-8",
            "Authorization: Basic " . $apiKey
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            error_log("OneSignal push notification failed. Response: " . $response);
            return false;
        }

        return true;
    }
}
