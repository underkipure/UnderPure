<?php

require_once __DIR__ . '/LuxuryEmailLayout.php';
require_once __DIR__ . '/EmailComponents.php';

/**
 * EmailPreviewService
 * Generates sample HTML payloads for all 8 UnderPure luxury transactional templates.
 * Used by test suites and live preview harnesses.
 */
class EmailPreviewService {
    public static function getTemplateList(): array {
        return [
            'welcome' => '1. Welcome & Member Onboarding',
            'order_placed' => '2. Order Placed Successfully (Checkout)',
            'order_confirmed' => '3. Order Confirmed by Atelier (Admin)',
            'order_shipped' => '4. Order Status: In Transit (Shipped)',
            'order_delivered_with_points' => '5. Order Delivered & UP Points Awarded',
            'order_undelivered' => '6. Order Not Received (UP Points Not Assigned)',
            'order_cancelled' => '7. Order Cancelled Notice',
            'password_reset' => '8. Password Reset & OTP Code',
            'loyalty_points' => '9. UP Loyalty Points Credited',
            'birthday' => '10. Birthday Celebration Gift',
            'promo' => '11. Exclusive Private Voucher',
            'vip_upgrade' => '12. VIP Tier Elite Invitation'
        ];
    }

    public static function render(string $templateKey, bool $darkMode = false): string {
        $name = "Sarah Jenkins";
        $mockItems = [
            ['product_name' => 'Lace Balconette Bra', 'size' => '34B', 'color' => 'Noir Black', 'price' => 4500, 'quantity' => 1],
            ['product_name' => 'Matching Silk Thong', 'size' => 'Small', 'color' => 'Noir Black', 'price' => 2200, 'quantity' => 2],
            ['product_name' => 'Satin Lounge Slip Dress', 'size' => 'Medium', 'color' => 'Champagne Rose', 'price' => 6500, 'quantity' => 1]
        ];

        switch ($templateKey) {
            case 'welcome':
                $bonusCard = EmailComponents::calloutCard(
                    'Your welcome reward has been deposited into your account. Redeemable against your very first order at checkout.',
                    'Exclusive Member Bonus',
                    '+500 UP Points'
                );
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>We are delighted to welcome you to the world of <strong>UnderPure</strong>. Designed for the modern muse, our couture collections harmoniously blend sublime craftsmanship, timeless silhouettes, and effortless everyday comfort.</p>
                    ' . $bonusCard . '
                    <p>Explore our newest arrivals and experience what makes UnderPure uniquely exceptional.</p>
                    ' . EmailComponents::button('https://www.underpure.com/collections/new-arrivals', 'Explore New Arrivals') . '
                ';
                $html = LuxuryEmailLayout::render('Welcome, Lover', $content, 'Welcome to UnderPure. We are delighted to have you join our inner circle.', 'Member Privilege');
                break;

            case 'order_placed':
                $orderTable = EmailComponents::orderTable($mockItems, 15400, 15400, 0, 0);
                $destCard = EmailComponents::calloutCard(
                    '<p style="margin: 0; font-weight: 600; color: #111111;">Sarah Jenkins</p>
                    <p style="margin: 3px 0; color: #6E6864;">House #14, Sector F-7/2</p>
                    <p style="margin: 3px 0; color: #6E6864;">Islamabad, Pakistan</p>
                    <p style="margin: 3px 0; color: #6E6864;">Phone: +92 300 1234567</p>',
                    'Delivery Destination'
                );
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>Thank you for choosing <strong>UnderPure</strong>. Your order has been placed successfully and is currently under review by our atelier concierge.</p>
                    
                    <table class="box-card" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F8; border: 1px solid #ECEAE7; border-radius: 2px; margin: 18px 0 10px 0;">
                        <tr>
                            <td style="padding: 14px 20px;">
                                <span style="font-family: \'Inter\', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #7A7470;">Order Reference:</span>
                                <span style="font-family: \'Inter\', sans-serif; font-size: 13px; font-weight: 700; color: #111111; margin-left: 8px;">#UP-84920</span>
                                <span style="font-family: \'Inter\', sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; background-color: #EFECE9; color: #8F6B58; padding: 3px 8px; border-radius: 2px; margin-left: 10px;">Pending Verification</span>
                            </td>
                        </tr>
                    </table>

                    ' . $orderTable . '
                    ' . $destCard . '

                    <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">Once your order is confirmed by our concierge team, you will receive an official confirmation notice with courier dispatch details.</p>
                    ' . EmailComponents::button('https://www.underpure.com/account?tab=orders', 'View Order Details') . '
                ';
                $html = LuxuryEmailLayout::render('Order Placed Successfully', $content, 'Thank you for your order #UP-84920. Your selection has been received and is pending confirmation.', 'Order Received');
                break;

            case 'order_confirmed':
                $orderTable = EmailComponents::orderTable($mockItems, 15400, 15400, 0, 0);
                $trackingCard = EmailComponents::calloutCard(
                    '<p style="margin: 0;">Courier: <strong>PostEx Express</strong></p>' .
                    '<p style="margin: 4px 0;">Tracking Number: <strong style="color: #8F6B58; letter-spacing: 1px;">PX-918230</strong></p>' .
                    '<p style="margin: 4px 0;">Estimated Delivery: <strong>2 &ndash; 4 Business Days</strong></p>',
                    'Courier Dispatch Details'
                );
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>Splendid news! Your order <strong>#UP-84920</strong> has been officially verified and confirmed by our atelier team. We have commenced preparing and carefully packaging your selected pieces.</p>
                    
                    <table class="box-card" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F8; border: 1px solid #ECEAE7; border-radius: 2px; margin: 18px 0 10px 0;">
                        <tr>
                            <td style="padding: 14px 20px;">
                                <span style="font-family: \'Inter\', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #7A7470;">Status:</span>
                                <span style="font-family: \'Inter\', sans-serif; font-size: 12px; font-weight: 700; color: #2E7D32; margin-left: 6px; letter-spacing: 0.08em; text-transform: uppercase;">Confirmed & Processing</span>
                            </td>
                        </tr>
                    </table>

                    ' . $trackingCard . '
                    ' . $orderTable . '

                    <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">Our courier partner will deliver your package in discreet, signature UnderPure luxury packaging. You can track transit milestones directly in your account.</p>
                    ' . EmailComponents::button('https://www.postex.pk/tracking?trackingNumber=PX-918230', 'Track Order Status') . '
                ';
                $html = LuxuryEmailLayout::render('Order Confirmed', $content, 'Splendid news! Your order #UP-84920 has been verified and confirmed by UnderPure Atelier.', 'Order Confirmed');
                break;

            case 'order_cancelled':
                $cancelCard = EmailComponents::calloutCard(
                    '<p style="margin: 0;">Order Reference: <strong>#UP-84920</strong></p>
                    <p style="margin: 4px 0;">Status: <span style="color: #C0392B; font-weight: 700;">CANCELLED</span></p>
                    <p style="margin: 6px 0 0 0; font-size: 12px; color: #7A7470;">Any UP loyalty points redeemed on this order have been automatically refunded to your balance.</p>',
                    'Cancellation Summary'
                );
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>We are writing to confirm that your order <strong>#UP-84920</strong> has been cancelled.</p>
                    ' . $cancelCard . '
                    <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">If this cancellation was unintended, or if you have questions regarding your account or refund, our client concierge is available to assist you at any time.</p>
                    ' . EmailComponents::button('https://wa.me/923001234567?text=' . urlencode("Hello, my order #UP-84920 was cancelled. I would like assistance."), 'Connect with Concierge Care') . '
                ';
                $html = LuxuryEmailLayout::render('Order Cancelled', $content, 'Your order #UP-84920 has been cancelled. Any redeemed UP points have been restored.', 'Order Cancelled');
                break;

            case 'order_delivered_with_points':
                $pointsCard = EmailComponents::calloutCard(
                    'As our heartfelt appreciation, we have credited complimentary UP Points to your account. Your updated wallet balance is <strong>2,450 UP Points</strong>.',
                    'Loyalty Points Gift Credited',
                    '+250 UP Points'
                );
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>Splendid news! Your package for Order <strong>#UP-84920</strong> has been safely and successfully delivered by PostEx Express.</p>
                    <p>We sincerely hope your selected pieces envelop you in pure comfort and timeless beauty. Thank you for making UnderPure a part of your daily ritual.</p>
                    ' . $pointsCard . '
                    <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">Should you have questions about fit, garment care, or styling pairings, our concierge team is always at your service.</p>
                    ' . EmailComponents::button('https://www.underpure.com/loyalty-program', 'Explore Your Tier & Rewards') . '
                ';
                $html = LuxuryEmailLayout::render('Order Delivered Successfully', $content, 'Your order #UP-84920 has been delivered. +250 UP Points have been added to your wallet.', 'Delivered & Rewarded');
                break;

            case 'order_undelivered':
                $warningCard = EmailComponents::calloutCard(
                    'Courier Status: <strong style="color: #C0392B;">Customer Unreachable / Returned to Facility</strong><br>' .
                    'Loyalty UP Points are only earned upon verified delivery. Because this parcel was not received, points have not been credited for this order.<br><br>' .
                    'Any <strong>+150 UP Points</strong> you redeemed at checkout have been restored to your wallet.',
                    'Consignment Return Notice',
                    'UP Points Not Assigned'
                );
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>We are reaching out to inform you that our courier partner (PostEx Express) reported that delivery for your order <strong>#UP-84920</strong> could not be completed, and the consignment is returning to our fulfillment center.</p>
                    ' . $warningCard . '
                    <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">If you missed the courier call or would like us to arrange an expedited re-delivery to an alternative address or convenient date, please contact our concierge team immediately.</p>
                    ' . EmailComponents::button('https://wa.me/923001234567?text=' . urlencode("Hello, my order #UP-84920 was not received by me. Please help arrange re-delivery."), 'Message Concierge on WhatsApp') . '
                ';
                $html = LuxuryEmailLayout::render('Order Not Received', $content, 'Important notice regarding your order #UP-84920. The package was not received and is returning to our facility.', 'Delivery Unsuccessful');
                break;

            case 'order_shipped':
                $infoGrid = EmailComponents::infoGrid([
                    'Order Number' => '#UP-84920',
                    'Current Status' => '<strong style="color: #8F6B58; letter-spacing: 0.1em; text-transform: uppercase;">In Transit</strong>',
                    'Courier Partner' => 'PostEx Express (#PX-918230)',
                    'Est. Delivery' => '2 &ndash; 3 Business Days'
                ]);
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>Your curated selections have completed their final inspection and are officially in transit to your doorstep. We cannot wait for you to experience them.</p>
                    ' . $infoGrid . '
                    <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">Please keep your primary mobile line active so the courier rider can reach you upon arrival.</p>
                    ' . EmailComponents::button('https://www.postex.pk/tracking?trackingNumber=PX-918230', 'Track Your Package') . '
                ';
                $html = LuxuryEmailLayout::render('Order SHIPPED', $content, 'Your order #UP-84920 has officially shipped.', 'In Transit');
                break;

            case 'order_delivered':
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>Your package has arrived! We sincerely hope your chosen pieces envelop you in pure comfort and timeless beauty.</p>
                    ' . EmailComponents::calloutCard(
                        'Thank you for being part of the UnderPure journey. Share your feedback or tag us in your curated look.',
                        'Delivered With Care',
                        'Delivered'
                    ) . '
                    <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">Should you require any fit guidance, size exchange, or concierge assistance, our team remains at your complete disposal.</p>
                    ' . EmailComponents::button('https://www.underpure.com/account', 'Review Your Pieces') . '
                ';
                $html = LuxuryEmailLayout::render('Delivered With Care', $content, 'Your UnderPure order #UP-84920 has been delivered.', 'Delivered');
                break;

            case 'password_reset':
                $otpBoxHtml = EmailComponents::otpBox('849102', 10);
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>We received an authentication request to access or reset the password for your UnderPure account. Please enter the unique one-time code below to verify your identity:</p>
                    ' . $otpBoxHtml . '
                    <p style="font-size: 13px; color: #736E6A; line-height: 1.6;">If you did not initiate this password reset, please disregard this communication or contact our concierge immediately to secure your credentials. UnderPure ambassadors will never ask for your verification code.</p>
                ';
                $html = LuxuryEmailLayout::render('Security Verification', $content, 'Your UnderPure verification code is 849102. Valid for 10 minutes.', 'Security Alert');
                break;

            case 'loyalty_points':
                $pointsCard = EmailComponents::calloutCard(
                    '<strong>Reason:</strong> Delivered Order #UP-84920<br>Every 1,000 points unlocks special savings and tier privileges on future selections.',
                    'Your New Points Balance',
                    '1,850 UP Points'
                );
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>Splendid news! Your account has just been credited with <strong style="color: #8F6B58;">+350 UP Points</strong> in appreciation of your recent activity.</p>
                    ' . $pointsCard . '
                    <p>Keep collecting points to unlock higher membership tiers and elevate your shopping privileges.</p>
                    ' . EmailComponents::button('https://www.underpure.com/loyalty-program', 'Explore Tier Privileges') . '
                ';
                $html = LuxuryEmailLayout::render('Rewards Earned', $content, 'You have earned +350 UP Points. Your new balance is 1,850.', 'UP Loyalty Club');
                break;

            case 'birthday':
                $giftCard = EmailComponents::calloutCard(
                    'As our token of celebration, we have deposited complimentary UP Points into your wallet. May your day be filled with elegance and delight.',
                    'Birthday Gift From UnderPure',
                    '+1,000 UP Points'
                );
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>On behalf of everyone at UnderPure, we wish you a splendid, joyful, and radiant birthday!</p>
                    ' . $giftCard . '
                    <p>Treat yourself to something extraordinary. You deserve nothing less.</p>
                    ' . EmailComponents::button('https://www.underpure.com', 'Claim Your Birthday Gift') . '
                ';
                $html = LuxuryEmailLayout::render('Happy Birthday, Lover', $content, 'Wishing you a radiant birthday. A complimentary gift has been added to your account.', 'Birthday Celebration');
                break;

            case 'promo':
                $promoCard = EmailComponents::calloutCard(
                    'Apply code during checkout to redeem <strong>20% OFF</strong> your total.<br><span style="font-size: 11px; color: #8F6B58;">Valid until October 31, 2026.</span>',
                    'Your Private Voucher Code',
                    'AUTUMN20VIP'
                );
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>As one of our most valued patrons, we are delighted to extend a private promotion curated especially for you.</p>
                    ' . $promoCard . '
                    <p>Browse our curated collections to find your next favorite piece.</p>
                    ' . EmailComponents::button('https://www.underpure.com/collections/all', 'Shop The Collection') . '
                ';
                $html = LuxuryEmailLayout::render('A Private Invitation', $content, 'An exclusive 20% OFF privilege awaits your next selection.', 'Exclusive Privilege');
                break;

            case 'vip_upgrade':
                $perksList = [
                    'Complimentary Express Courier Shipping on all domestic orders',
                    'Priority atelier fulfillment & dedicated client care ambassador',
                    'Private pre-launch access to seasonal drops and limited capsules',
                    'Double UP Points on all purchases during your birthday month'
                ];
                $perksHtml = '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 12px 0;">';
                foreach ($perksList as $perk) {
                    $perksHtml .= '
                    <tr>
                        <td style="padding: 6px 0; font-family: \'Inter\', sans-serif; font-size: 13px; color: #3A3533;">
                            <span style="color: #9A7B56; font-size: 14px; margin-right: 8px;">&bull;</span>' . htmlspecialchars($perk) . '
                        </td>
                    </tr>';
                }
                $perksHtml .= '</table>';

                $vipCard = EmailComponents::calloutCard($perksHtml, 'Your Bespoke VIP Privileges', 'ELITE MEMBER');
                $content = '
                    <p>Dear ' . htmlspecialchars($name) . ',</p>
                    <p>It is our utmost pleasure to formally welcome you to <strong>UnderPure VIP Status</strong>. In celebration of your discerning taste and continued loyalty, you now command our highest level of client care.</p>
                    ' . $vipCard . '
                    <p>Your privileges are automatically linked to your account and active across all future orders.</p>
                    ' . EmailComponents::button('https://www.underpure.com/account', 'Access The VIP Lounge') . '
                ';
                $html = LuxuryEmailLayout::render('Welcome to VIP Status', $content, 'You have been officially upgraded to UnderPure VIP status.', 'VIP Status Unlocked');
                break;

            default:
                $html = LuxuryEmailLayout::render('UnderPure Notification', '<p>Sample notification body.</p>', 'UnderPure update');
                break;
        }

        // If dark mode is simulated for testing preview, inject forced dark mode simulation styles
        if ($darkMode) {
            $darkSimStyles = '
            <style>
                body, .email-canvas { background-color: #0E0E0E !important; }
                .email-card { background-color: #181818 !important; border-color: #282828 !important; }
                .text-headline { color: #FFFFFF !important; }
                .text-primary, p { color: #F0EDE8 !important; }
                .text-secondary { color: #A5A19C !important; }
                .box-card { background-color: #141414 !important; border-color: #262626 !important; }
                .table-container td { color: #E8E4DF !important; border-color: #282828 !important; }
                .table-container th { color: #A5A19C !important; border-color: #333333 !important; }
                .btn-luxury { background-color: #FFFFFF !important; background-image: linear-gradient(#FFFFFF, #FFFFFF) !important; color: #111111 !important; }
            </style>
            ';
            $html = str_replace('</head>', $darkSimStyles . '</head>', $html);
        }

        return $html;
    }
}
