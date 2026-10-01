<?php

/**
 * NotificationEmailTemplate
 * Compatibility bridge delegating to the unified LuxuryEmailLayout engine.
 * Eliminates duplicate template engines and guarantees store visual consistency.
 */

require_once __DIR__ . '/../email/LuxuryEmailLayout.php';

class NotificationEmailTemplate {
    /**
     * Legacy template generator bridged to LuxuryEmailLayout
     *
     * @param string $title Email title
     * @param string $headerText Subtitle / Badge text
     * @param string $bodyHtml Inner HTML message
     * @return string Fully styled HTML email
     */
    public static function getHtmlTemplate($title, $headerText, $bodyHtml) {
        return LuxuryEmailLayout::render($headerText ?: $title, $bodyHtml, $title, $headerText ?: null);
    }
}
