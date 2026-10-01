<?php

require_once __DIR__ . '/LuxuryEmailLayout.php';
require_once __DIR__ . '/EmailComponents.php';

class EmailTemplates {
    public static function getButtonHtml($url, $text) {
        return EmailComponents::button($url, $text);
    }

    public static function getBaseTemplate($title, $content) {
        return LuxuryEmailLayout::render($title, $content);
    }
}
