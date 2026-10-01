<?php

/**
 * EmailComponents
 * Reusable, high-contrast, modular partials for UnderPure luxury transactional emails.
 * Uses bulletproof email table structures and inline styles compatible with Gmail, Apple Mail, and Outlook.
 */
class EmailComponents {
    /**
     * Primary luxury call-to-action button
     */
    public static function button(string $url, string $label, string $align = 'center'): string {
        return '
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0 24px 0;">
            <tr>
                <td align="' . htmlspecialchars($align) . '">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="' . htmlspecialchars($url) . '" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="4%" stroke="f" fillcolor="#111111">
                    <w:anchorlock/>
                    <center>
                    <![endif]-->
                    <a href="' . htmlspecialchars($url) . '" target="_blank" class="btn-luxury" style="background-color: #111111; background-image: linear-gradient(#111111, #111111); border: 1px solid #111111; color: #FFFFFF !important; display: inline-block; font-family: \'Inter\', -apple-system, sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.22em; line-height: 48px; padding: 0 34px; text-align: center; text-decoration: none; text-transform: uppercase; border-radius: 2px; -webkit-text-size-adjust: none; box-shadow: 0 4px 12px rgba(0,0,0,0.12);">
                        ' . htmlspecialchars($label) . '
                    </a>
                    <!--[if mso]>
                    </center>
                    </v:roundrect>
                    <![endif]-->
                </td>
            </tr>
        </table>';
    }

    /**
     * High-security 6-digit OTP verification code card
     */
    public static function otpBox(string $otp, int $expiryMinutes = 10): string {
        return '
        <table class="box-card" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F8; border: 1px dashed #D4A59A; border-radius: 4px; margin: 28px 0;">
            <tr>
                <td align="center" style="padding: 28px 20px;">
                    <span style="font-family: \'Inter\', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #8F6B58; display: block; margin-bottom: 10px;">
                        One-Time Verification Code
                    </span>
                    <div style="font-family: \'Cormorant Garamond\', Georgia, \'Courier New\', serif; font-size: 42px; font-weight: 600; letter-spacing: 10px; color: #111111; line-height: 1.1; margin: 8px 0;">
                        ' . htmlspecialchars($otp) . '
                    </div>
                    <span style="font-family: \'Inter\', sans-serif; font-size: 12px; color: #7A7470; display: block; margin-top: 10px;">
                        Valid for the next <strong>' . $expiryMinutes . ' minutes</strong>. Never share this code with anyone.
                    </span>
                </td>
            </tr>
        </table>';
    }

    /**
     * Itemized order receipt table with variants, price calculations, and luxury totals
     */
    public static function orderTable(array $items, float $orderTotal, ?float $subtotal = null, ?float $shipping = null, float $discount = 0.0): string {
        $computedSubtotal = 0;
        $itemsHtml = '';

        foreach ($items as $item) {
            $name = htmlspecialchars($item['product_name'] ?? $item['name'] ?? 'Luxury Selection');
            $price = (float)($item['price'] ?? 0);
            $qty = (int)($item['quantity'] ?? 1);
            $itemTotal = $price * $qty;
            $computedSubtotal += $itemTotal;

            $meta = [];
            if (!empty($item['size'])) $meta[] = 'Size: ' . htmlspecialchars($item['size']);
            if (!empty($item['color'])) $meta[] = 'Color: ' . htmlspecialchars($item['color']);
            $metaString = !empty($meta) ? implode(' &bull; ', $meta) : '';

            $itemsHtml .= '
            <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #ECEAE7; vertical-align: top;">
                    <div style="font-family: \'Inter\', sans-serif; font-size: 13px; font-weight: 600; color: #111111; margin-bottom: 4px;">
                        ' . $name . '
                    </div>
                    ' . (!empty($metaString) ? '<div style="font-family: \'Inter\', sans-serif; font-size: 11px; color: #7A7470;">' . $metaString . '</div>' : '') . '
                </td>
                <td align="center" style="padding: 16px 8px; border-bottom: 1px solid #ECEAE7; font-family: \'Inter\', sans-serif; font-size: 13px; color: #555555; vertical-align: top;">
                    &times; ' . $qty . '
                </td>
                <td align="right" style="padding: 16px 0; border-bottom: 1px solid #ECEAE7; font-family: \'Inter\', sans-serif; font-size: 13px; font-weight: 500; color: #111111; vertical-align: top;">
                    Rs. ' . number_format($itemTotal) . '
                </td>
            </tr>';
        }

        $finalSubtotal = $subtotal !== null ? $subtotal : $computedSubtotal;
        $finalShipping = $shipping !== null ? $shipping : max(0, $orderTotal - $finalSubtotal + $discount);
        $shippingLabel = $finalShipping <= 0 ? '<span style="color: #2E7D32; font-weight: 600;">Complimentary</span>' : 'Rs. ' . number_format($finalShipping);

        $discountHtml = '';
        if ($discount > 0) {
            $discountHtml = '
            <tr>
                <td colspan="2" style="padding: 6px 0; font-family: \'Inter\', sans-serif; font-size: 12px; color: #8F6B58;">Discount Applied</td>
                <td align="right" style="padding: 6px 0; font-family: \'Inter\', sans-serif; font-size: 12px; font-weight: 600; color: #8F6B58;">- Rs. ' . number_format($discount) . '</td>
            </tr>';
        }

        return '
        <table class="table-container" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0 20px 0; border-collapse: collapse;">
            <thead>
                <tr>
                    <th align="left" style="padding-bottom: 10px; border-bottom: 2px solid #111111; font-family: \'Inter\', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #6E6864;">Item</th>
                    <th align="center" style="padding-bottom: 10px; border-bottom: 2px solid #111111; font-family: \'Inter\', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #6E6864; width: 60px;">Qty</th>
                    <th align="right" style="padding-bottom: 10px; border-bottom: 2px solid #111111; font-family: \'Inter\', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #6E6864; width: 110px;">Price</th>
                </tr>
            </thead>
            <tbody>
                ' . $itemsHtml . '
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="padding-top: 14px;"></td>
                </tr>
                <tr>
                    <td colspan="2" style="padding: 4px 0; font-family: \'Inter\', sans-serif; font-size: 12px; color: #7A7470;">Subtotal</td>
                    <td align="right" style="padding: 4px 0; font-family: \'Inter\', sans-serif; font-size: 12px; color: #333333;">Rs. ' . number_format($finalSubtotal) . '</td>
                </tr>
                <tr>
                    <td colspan="2" style="padding: 4px 0; font-family: \'Inter\', sans-serif; font-size: 12px; color: #7A7470;">Standard Shipping</td>
                    <td align="right" style="padding: 4px 0; font-family: \'Inter\', sans-serif; font-size: 12px;">' . $shippingLabel . '</td>
                </tr>
                ' . $discountHtml . '
                <tr>
                    <td colspan="3" style="padding-top: 10px;">
                        <div style="height: 1px; background-color: #ECEAE7; width: 100%;"></div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="padding: 14px 0 0 0; font-family: \'Cormorant Garamond\', Georgia, serif; font-size: 18px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #111111;">
                        Total (PKR)
                    </td>
                    <td align="right" style="padding: 14px 0 0 0; font-family: \'Inter\', sans-serif; font-size: 18px; font-weight: 700; color: #111111;">
                        Rs. ' . number_format($orderTotal) . '
                    </td>
                </tr>
            </tfoot>
        </table>';
    }

    /**
     * Hero callout card for rewards, birthday messages, or VIP tier features
     */
    public static function calloutCard(string $contentHtml, ?string $title = null, ?string $highlightValue = null): string {
        $titleHtml = $title ? '
            <span style="font-family: \'Inter\', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #8F6B58; display: block; margin-bottom: 8px;">
                ' . htmlspecialchars($title) . '
            </span>' : '';

        $highlightHtml = $highlightValue ? '
            <div style="font-family: \'Cormorant Garamond\', Georgia, serif; font-size: 34px; font-weight: 600; color: #111111; line-height: 1.1; margin: 8px 0 12px 0;">
                ' . htmlspecialchars($highlightValue) . '
            </div>' : '';

        return '
        <table class="box-card" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F8; border: 1px solid #ECEAE7; border-radius: 4px; margin: 26px 0;">
            <tr>
                <td align="center" style="padding: 26px 24px;">
                    ' . $titleHtml . '
                    ' . $highlightHtml . '
                    <div style="font-family: \'Inter\', sans-serif; font-size: 13px; line-height: 1.65; color: #524E4B;">
                        ' . $contentHtml . '
                    </div>
                </td>
            </tr>
        </table>';
    }

    /**
     * Clean label-value metadata grid (e.g. Order #, Courier, Tracking #)
     */
    public static function infoGrid(array $pairs): string {
        $rowsHtml = '';
        foreach ($pairs as $label => $val) {
            $rowsHtml .= '
            <tr>
                <td style="padding: 6px 0; font-family: \'Inter\', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #7A7470; width: 40%; vertical-align: top;">
                    ' . htmlspecialchars($label) . '
                </td>
                <td align="right" style="padding: 6px 0; font-family: \'Inter\', sans-serif; font-size: 13px; font-weight: 500; color: #111111; vertical-align: top;">
                    ' . $val . '
                </td>
            </tr>';
        }

        return '
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0; border-collapse: collapse;">
            ' . $rowsHtml . '
        </table>';
    }
}
