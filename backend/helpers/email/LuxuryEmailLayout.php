<?php

/**
 * LuxuryEmailLayout
 * Master responsive layout engine for UnderPure luxury transactional emails.
 * Engineered for cross-client fidelity across Gmail (Web, iOS, Android), Apple Mail, Outlook, and Yahoo.
 * Incorporates linear-gradient inversion defense for Android Gmail and dual-mode high-contrast tokens.
 */
class LuxuryEmailLayout {
    /**
     * Wrap content in the master UnderPure responsive email layout
     *
     * @param string $title Email title / headline
     * @param string $bodyHtml Inner HTML body
     * @param string $preheader Invisible preview text for inbox list
     * @param string|null $badge Optional status badge in hero banner (e.g. "CONFIRMED", "SHIPPED", "EXCLUSIVE")
     * @return string Fully compiled HTML email document
     */
    public static function render(string $title, string $bodyHtml, string $preheader = '', ?string $badge = null): string {
        $year = date('Y');
        $preheaderHtml = !empty($preheader) ? '
            <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
                ' . htmlspecialchars($preheader) . '
                &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
            </div>' : '';

        $badgeHtml = '';
        if ($badge) {
            $badgeHtml = '
                <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
                    <tr>
                        <td align="center" style="background-color: #FAF5F0; border: 1px solid #E6DCD3; padding: 5px 14px; border-radius: 2px;">
                            <span style="font-family: \'Inter\', -apple-system, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #9A7B56; display: block;">
                                ' . htmlspecialchars($badge) . '
                            </span>
                        </td>
                    </tr>
                </table>';
        }

        return '<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>' . htmlspecialchars($title) . ' | UnderPure</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
        }
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; display: block; }

        /* Base Reset */
        body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: #F7F7F6;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #111111;
        }

        /* Hover Transitions */
        .btn-luxury:hover {
            opacity: 0.92 !important;
        }
        .footer-link:hover {
            color: #FFFFFF !important;
            text-decoration: underline !important;
        }

        /* Dark Mode Media Query */
        @media (prefers-color-scheme: dark) {
            body, .email-canvas {
                background-color: #0E0E0E !important;
            }
            .email-card {
                background-color: #181818 !important;
                border-color: #282828 !important;
            }
            .header-bar {
                background-color: #111111 !important;
                background-image: linear-gradient(#111111, #111111) !important;
                border-color: #282828 !important;
            }
            .text-headline {
                color: #FFFFFF !important;
            }
            .text-primary {
                color: #F0EDE8 !important;
            }
            .text-secondary {
                color: #A5A19C !important;
            }
            .text-muted {
                color: #7A7672 !important;
            }
            .box-card {
                background-color: #141414 !important;
                border-color: #262626 !important;
            }
            .table-border {
                border-color: #282828 !important;
            }
            .table-head {
                color: #8C8782 !important;
                border-color: #282828 !important;
            }
            .footer-bar {
                background-color: #0A0A0A !important;
                border-color: #202020 !important;
            }
            .btn-luxury {
                background-color: #FFFFFF !important;
                background-image: linear-gradient(#FFFFFF, #FFFFFF) !important;
                color: #111111 !important;
            }
        }

        /* Outlook / Windows Mail Dark Mode Overrides */
        [data-ogsc] body, [data-ogsc] .email-canvas { background-color: #0E0E0E !important; }
        [data-ogsc] .email-card { background-color: #181818 !important; border-color: #282828 !important; }
        [data-ogsc] .text-headline { color: #FFFFFF !important; }
        [data-ogsc] .text-primary { color: #F0EDE8 !important; }
        [data-ogsc] .text-secondary { color: #A5A19C !important; }
        [data-ogsc] .box-card { background-color: #141414 !important; border-color: #262626 !important; }

        /* Responsive Mobile Breakpoint */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .email-card {
                border-radius: 0 !important;
                border-left: none !important;
                border-right: none !important;
            }
            .content-padding {
                padding: 32px 20px !important;
            }
            .header-padding {
                padding: 30px 20px 24px 20px !important;
            }
            .footer-padding {
                padding: 32px 20px !important;
            }
            .mobile-stack {
                display: block !important;
                width: 100% !important;
                text-align: left !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F7F6; -webkit-font-smoothing: antialiased;">
    ' . $preheaderHtml . '
    <!-- Canvas Wrapper -->
    <table class="email-canvas" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F7F7F6; margin: 0; padding: 40px 0;">
        <tr>
            <td align="center" valign="top">
                <!-- Master 600px Container -->
                <table class="email-container" width="600" border="0" cellpadding="0" cellspacing="0" style="width: 600px; max-width: 600px; margin: 0 auto;">
                    <tr>
                        <td align="center" valign="top">
                            <!-- Card Container with subtle border -->
                            <table class="email-card" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #ECEAE7; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.04);">
                                
                                <!-- 1. Brand Header (Linear Gradient Protected for Android Gmail) -->
                                <tr>
                                    <td class="header-bar header-padding" align="center" style="background-color: #111111; background-image: linear-gradient(#111111, #111111); padding: 38px 24px 30px 24px; border-bottom: 2px solid #E6DCD3; text-align: center;">
                                        <a href="https://www.underpure.com" target="_blank" style="text-decoration: none; display: inline-block;">
                                            <span style="font-family: \'Cormorant Garamond\', Georgia, \'Times New Roman\', serif; font-size: 28px; font-weight: 500; letter-spacing: 0.24em; text-transform: uppercase; color: #FFFFFF; display: block; line-height: 1.1;">
                                                UNDERPURE
                                            </span>
                                            <span style="font-family: \'Inter\', -apple-system, sans-serif; font-size: 9px; font-weight: 400; letter-spacing: 0.28em; text-transform: uppercase; color: #E6DCD3; display: block; margin-top: 6px;">
                                                Haute Couture &bull; Luxury Essentials
                                            </span>
                                        </a>
                                    </td>
                                </tr>

                                <!-- 2. Main Content Body -->
                                <tr>
                                    <td class="content-padding" style="padding: 44px 44px 36px 44px; text-align: left;">
                                        ' . $badgeHtml . '
                                        <h1 class="text-headline" style="font-family: \'Cormorant Garamond\', Georgia, serif; font-size: 26px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #111111; margin: 0 0 20px 0; text-align: center; line-height: 1.3;">
                                            ' . htmlspecialchars($title) . '
                                        </h1>
                                        <div style="width: 40px; height: 1px; background-color: #E6DCD3; margin: 0 auto 28px auto;"></div>

                                        <div class="text-primary" style="font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; font-size: 14px; line-height: 1.75; color: #2B2826;">
                                            ' . $bodyHtml . '
                                        </div>
                                    </td>
                                </tr>

                                <!-- 3. Concierge Contact Box -->
                                <tr>
                                    <td style="padding: 0 44px 32px 44px;">
                                        <table class="box-card" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F8; border: 1px solid #ECEAE7; border-radius: 2px;">
                                            <tr>
                                                <td style="padding: 18px 22px; text-align: center;">
                                                    <span class="text-secondary" style="font-family: \'Inter\', -apple-system, sans-serif; font-size: 12px; color: #6E6864; line-height: 1.6;">
                                                        Questions regarding your experience? Our dedicated client care team is at your service.<br>
                                                        Email us at <a href="mailto:underpure18@gmail.com" style="color: #111111; font-weight: 500; text-decoration: underline;">underpure18@gmail.com</a>
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- 4. Editorial Footer -->
                                <tr>
                                    <td class="footer-bar footer-padding" align="center" style="background-color: #111111; background-image: linear-gradient(#111111, #111111); padding: 36px 30px; text-align: center; border-top: 1px solid #222222;">
                                        <span style="font-family: \'Cormorant Garamond\', Georgia, serif; font-size: 17px; letter-spacing: 0.2em; text-transform: uppercase; color: #FFFFFF; display: block; margin-bottom: 8px;">
                                            UNDERPURE
                                        </span>
                                        <span style="font-family: \'Inter\', -apple-system, sans-serif; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #9A948E; display: block; margin-bottom: 20px;">
                                            Pure Elegance &bull; Unmatched Comfort
                                        </span>

                                        <!-- Quick Navigation Links -->
                                        <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 22px auto;">
                                            <tr>
                                                <td align="center">
                                                    <a href="https://www.underpure.com" class="footer-link" target="_blank" style="font-family: \'Inter\', sans-serif; font-size: 11px; color: #D1CBC6; text-decoration: none; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 10px;">Collection</a>
                                                    <span style="color: #444444; font-size: 10px;">&bull;</span>
                                                    <a href="https://www.underpure.com/account" class="footer-link" target="_blank" style="font-family: \'Inter\', sans-serif; font-size: 11px; color: #D1CBC6; text-decoration: none; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 10px;">My Account</a>
                                                    <span style="color: #444444; font-size: 10px;">&bull;</span>
                                                    <a href="https://www.underpure.com/faqs" class="footer-link" target="_blank" style="font-family: \'Inter\', sans-serif; font-size: 11px; color: #D1CBC6; text-decoration: none; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 10px;">Help Center</a>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Legal / Copyright -->
                                        <p style="font-family: \'Inter\', sans-serif; font-size: 11px; line-height: 1.6; color: #736E6A; margin: 0 0 6px 0;">
                                            &copy; ' . $year . ' UnderPure Ltd. All rights reserved.<br>
                                            This email was sent to you because you are an esteemed client of UnderPure.
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
    }
}
