<?php

/**
 * TransactionalEmails
 * Business logic and payload assembler for all UnderPure luxury email dispatches.
 * Delegates layout rendering to LuxuryEmailLayout and EmailComponents for flawless Dark/Light mode cross-client fidelity.
 */

require_once __DIR__ . '/EmailTransport.php';
require_once __DIR__ . '/LuxuryEmailLayout.php';
require_once __DIR__ . '/EmailComponents.php';

use PHPMailer\PHPMailer\Exception;

class TransactionalEmails {
    /**
     * 1. Welcome & Onboarding Email
     */
    public static function sendWelcomeEmail($to, $name, $signupBonus) {
        $mail = EmailTransport::getMailer();
        if (!$mail) return false;

        try {
            $nameStr = trim((string)$name);
            $mail->addAddress($to, $nameStr);
            $mail->Subject = 'Welcome to UnderPure | Your Journey Begins';

            $bonusCard = $signupBonus > 0 
                ? EmailComponents::calloutCard(
                    'Your welcome reward has been deposited into your account. Redeemable against your very first order at checkout.',
                    'Exclusive Member Bonus',
                    '+' . number_format($signupBonus) . ' UP Points'
                ) 
                : '';

            $content = '
                <p>Dear ' . htmlspecialchars($nameStr) . ',</p>
                <p>We are delighted to welcome you to the world of <strong>UnderPure</strong>. Designed for the modern muse, our couture collections harmoniously blend sublime craftsmanship, timeless silhouettes, and effortless everyday comfort.</p>
                ' . $bonusCard . '
                <p>Explore our newest arrivals and experience what makes UnderPure uniquely exceptional.</p>
                ' . EmailComponents::button('https://www.underpure.com/collections/new-arrivals', 'Explore New Arrivals') . '
            ';

            $mail->Body = LuxuryEmailLayout::render(
                'Welcome, Lover',
                $content,
                'Welcome to UnderPure. We are delighted to have you join our inner circle.',
                'Member Privilege'
            );

            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send Welcome email to $to: {$mail->ErrorInfo}");
            return false;
        }
    }

    /**
     * 2. Order Placed Successfully Email (Customer Checkout)
     */
    public static function sendOrderPlaced($to, $name, $orderId, $orderTotal, $items, $details = []) {
        $mail = EmailTransport::getMailer();
        if (!$mail) return false;

        try {
            $nameStr = trim((string)$name);
            $mail->addAddress($to, $nameStr);
            $mail->Subject = 'Order Placed Successfully #' . $orderId . ' | UnderPure';

            $itemsList = is_array($items) ? $items : [];
            $orderTableHtml = EmailComponents::orderTable($itemsList, (float)$orderTotal);

            $destinationHtml = '';
            if (!empty($details['shipping_address'])) {
                $destinationHtml = '
                    <p style="margin: 0; font-weight: 600; color: #111111;">' . htmlspecialchars($details['shipping_name'] ?? $nameStr) . '</p>
                    <p style="margin: 3px 0; color: #6E6864;">' . htmlspecialchars($details['shipping_address']) . '</p>
                    <p style="margin: 3px 0; color: #6E6864;">' . htmlspecialchars($details['shipping_city'] ?? '') . ', Pakistan</p>
                    ' . (!empty($details['shipping_phone']) ? '<p style="margin: 3px 0; color: #6E6864;">Phone: ' . htmlspecialchars($details['shipping_phone']) . '</p>' : '') . '
                ';
            }

            $destCard = !empty($destinationHtml) ? EmailComponents::calloutCard($destinationHtml, 'Delivery Destination') : '';

            $content = '
                <p>Dear ' . htmlspecialchars($nameStr) . ',</p>
                <p>Thank you for choosing <strong>UnderPure</strong>. Your order has been placed successfully and is currently under review by our atelier concierge.</p>
                
                <table class="box-card" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F8; border: 1px solid #ECEAE7; border-radius: 2px; margin: 18px 0 10px 0;">
                    <tr>
                        <td style="padding: 14px 20px;">
                            <span style="font-family: \'Inter\', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #7A7470;">Order Reference:</span>
                            <span style="font-family: \'Inter\', sans-serif; font-size: 13px; font-weight: 700; color: #111111; margin-left: 8px;">#' . htmlspecialchars($orderId) . '</span>
                            <span style="font-family: \'Inter\', sans-serif; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; background-color: #EFECE9; color: #8F6B58; padding: 3px 8px; border-radius: 2px; margin-left: 10px;">Pending Verification</span>
                        </td>
                    </tr>
                </table>

                ' . $orderTableHtml . '
                ' . $destCard . '

                <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">Once your order is confirmed by our concierge team, you will receive an official confirmation notice with courier dispatch details.</p>
                ' . EmailComponents::button('https://www.underpure.com/account?tab=orders', 'View Order Details') . '
            ';

            $mail->Body = LuxuryEmailLayout::render(
                'Order Placed Successfully',
                $content,
                'Thank you for your order #' . $orderId . '. Your selection has been received and is pending confirmation.',
                'Order Received'
            );

            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send Order Placed to $to: {$mail->ErrorInfo}");
            return false;
        }
    }

    /**
     * 3. Order Confirmed Email (Admin Confirmation / PostEx Booking)
     */
    public static function sendOrderConfirmed($to, $name, $orderId, $orderTotal, $items, $trackingNumber = null) {
        $mail = EmailTransport::getMailer();
        if (!$mail) return false;

        try {
            $nameStr = trim((string)$name);
            $mail->addAddress($to, $nameStr);
            $mail->Subject = 'Order Confirmed #' . $orderId . ' | UnderPure Atelier';

            $itemsList = is_array($items) ? $items : [];
            $orderTableHtml = EmailComponents::orderTable($itemsList, (float)$orderTotal);

            $trackingCardHtml = '';
            if (!empty($trackingNumber)) {
                $trackingCardHtml = EmailComponents::calloutCard(
                    '<p style="margin: 0;">Courier: <strong>PostEx Express</strong></p>' .
                    '<p style="margin: 4px 0;">Consignment / Tracking Number: <strong style="color: #8F6B58; letter-spacing: 1px;">' . htmlspecialchars($trackingNumber) . '</strong></p>' .
                    '<p style="margin: 4px 0;">Estimated Delivery: <strong>2 &ndash; 4 Business Days</strong></p>',
                    'Courier Dispatch Details'
                );
            }

            $content = '
                <p>Dear ' . htmlspecialchars($nameStr) . ',</p>
                <p>Splendid news! Your order <strong>#' . htmlspecialchars($orderId) . '</strong> has been officially verified and confirmed by our atelier team. We have commenced preparing and carefully packaging your selected pieces.</p>
                
                <table class="box-card" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF9F8; border: 1px solid #ECEAE7; border-radius: 2px; margin: 18px 0 10px 0;">
                    <tr>
                        <td style="padding: 14px 20px;">
                            <span style="font-family: \'Inter\', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #7A7470;">Status:</span>
                            <span style="font-family: \'Inter\', sans-serif; font-size: 12px; font-weight: 700; color: #2E7D32; margin-left: 6px; letter-spacing: 0.08em; text-transform: uppercase;">Confirmed & Processing</span>
                        </td>
                    </tr>
                </table>

                ' . $trackingCardHtml . '
                ' . $orderTableHtml . '

                <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">Our courier partner will deliver your package in discreet, signature UnderPure luxury packaging. You can track transit milestones directly in your account.</p>
                ' . EmailComponents::button(!empty($trackingNumber) ? 'https://www.postex.pk/tracking?trackingNumber=' . urlencode($trackingNumber) : 'https://www.underpure.com/account?tab=orders', 'Track Order Status') . '
            ';

            $mail->Body = LuxuryEmailLayout::render(
                'Order Confirmed',
                $content,
                'Splendid news! Your order #' . $orderId . ' has been verified and confirmed by UnderPure Atelier.',
                'Order Confirmed'
            );

            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send Order Confirmation to $to: {$mail->ErrorInfo}");
            return false;
        }
    }

    /**
     * 4. Order Cancelled Email (Admin or Customer Cancellation)
     */
    public static function sendOrderCancelled($to, $name, $orderId, $reason = null) {
        $mail = EmailTransport::getMailer();
        if (!$mail) return false;

        try {
            $nameStr = trim((string)$name);
            $mail->addAddress($to, $nameStr);
            $mail->Subject = 'Order Cancelled #' . $orderId . ' | UnderPure';

            $cardBody = '<p style="margin: 0;">Order Reference: <strong>#' . htmlspecialchars($orderId) . '</strong></p>' .
                        '<p style="margin: 4px 0;">Status: <span style="color: #C0392B; font-weight: 700;">CANCELLED</span></p>';
            if (!empty($reason)) {
                $cardBody .= '<p style="margin: 4px 0; color: #6E6864;">Reason: ' . htmlspecialchars($reason) . '</p>';
            }
            $cardBody .= '<p style="margin: 6px 0 0 0; font-size: 12px; color: #7A7470;">Any UP loyalty points redeemed on this order have been automatically refunded to your balance.</p>';

            $cancelCard = EmailComponents::calloutCard($cardBody, 'Cancellation Summary');

            $content = '
                <p>Dear ' . htmlspecialchars($nameStr) . ',</p>
                <p>We are writing to confirm that your order <strong>#' . htmlspecialchars($orderId) . '</strong> has been cancelled.</p>
                
                ' . $cancelCard . '

                <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">If this cancellation was unintended, or if you have questions regarding your account or refund, our client concierge is available to assist you at any time.</p>
                ' . EmailComponents::button('https://wa.me/923001234567?text=' . urlencode("Hello, my order #$orderId was cancelled. I would like assistance."), 'Connect with Concierge Care') . '
            ';

            $mail->Body = LuxuryEmailLayout::render(
                'Order Cancelled',
                $content,
                'Your order #' . $orderId . ' has been cancelled. Any redeemed UP points have been restored.',
                'Order Cancelled'
            );

            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send Order Cancelled to $to: {$mail->ErrorInfo}");
            return false;
        }
    }

    /**
     * 5. Order Successfully Delivered & UP Points Credited Email (PostEx Callback / Sync)
     */
    public static function sendOrderDeliveredWithPoints($to, $name, $orderId, $pointsAwarded, $newTotalPoints, $orderTotal = 0) {
        $mail = EmailTransport::getMailer();
        if (!$mail) return false;

        try {
            $nameStr = trim((string)$name);
            $pointsCount = (int)$pointsAwarded;
            $mail->addAddress($to, $nameStr);

            if ($pointsCount > 0) {
                $mail->Subject = 'Order Delivered Successfully & +' . number_format($pointsCount) . ' UP Points Credited! | UnderPure';
                $pointsCard = EmailComponents::calloutCard(
                    'As our heartfelt appreciation, we have credited complimentary UP Points to your account. Your updated wallet balance is <strong>' . number_format($newTotalPoints) . ' UP Points</strong>.',
                    'Loyalty Points Gift Credited',
                    '+' . number_format($pointsCount) . ' UP Points'
                );
            } else {
                $mail->Subject = 'Order #' . $orderId . ' Successfully Delivered | UnderPure';
                $pointsCard = EmailComponents::calloutCard(
                    'Create or sign in to your UnderPure account with this email to earn UP Points on future selections.',
                    'Order Completed',
                    'Delivered with Care'
                );
            }

            $content = '
                <p>Dear ' . htmlspecialchars($nameStr) . ',</p>
                <p>Splendid news! Your package for Order <strong>#' . htmlspecialchars($orderId) . '</strong> has been safely and successfully delivered.</p>
                <p>We sincerely hope your selected pieces envelop you in pure comfort and timeless beauty. Thank you for making UnderPure a part of your daily ritual.</p>
                
                ' . $pointsCard . '

                <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">Should you have questions about fit, garment care, or styling pairings, our concierge team is always at your service.</p>
                ' . EmailComponents::button('https://www.underpure.com/loyalty-program', 'Explore Your Tier & Rewards') . '
            ';

            $mail->Body = LuxuryEmailLayout::render(
                'Order Delivered Successfully',
                $content,
                'Your order #' . $orderId . ' has been delivered. +' . number_format($pointsCount) . ' UP Points have been added to your wallet.',
                'Delivered & Rewarded'
            );

            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send Order Delivered to $to: {$mail->ErrorInfo}");
            return false;
        }
    }

    /**
     * 6. Order Not Received / Delivery Failed & UP Points Not Assigned Email (PostEx Callback / Sync)
     */
    public static function sendOrderUndelivered($to, $name, $orderId, $courierStatus = '', $pointsRefunded = 0) {
        $mail = EmailTransport::getMailer();
        if (!$mail) return false;

        try {
            $nameStr = trim((string)$name);
            $mail->addAddress($to, $nameStr);
            $mail->Subject = 'Important Notice: Order #' . $orderId . ' Not Received | UnderPure';

            $statusText = !empty($courierStatus) ? $courierStatus : 'Unsuccessful Delivery Attempt';
            $refundText = ($pointsRefunded > 0)
                ? '<br><br>Any <strong>+' . number_format($pointsRefunded) . ' UP Points</strong> you redeemed at checkout have been restored to your wallet.'
                : '';

            $warningCard = EmailComponents::calloutCard(
                'Courier Status: <strong style="color: #C0392B;">' . htmlspecialchars($statusText) . '</strong><br>' .
                'Loyalty UP Points are only earned upon verified delivery. Because this parcel was not received, points have not been credited for this order.' . $refundText,
                'Consignment Return Notice',
                'UP Points Not Assigned'
            );

            $content = '
                <p>Dear ' . htmlspecialchars($nameStr) . ',</p>
                <p>We are reaching out to inform you that our courier partner (PostEx Express) reported that delivery for your order <strong>#' . htmlspecialchars($orderId) . '</strong> could not be completed, and the consignment is returning to our fulfillment center.</p>
                
                ' . $warningCard . '

                <p style="font-size: 13px; color: #6E6864; line-height: 1.6;">If you missed the courier call or would like us to arrange an expedited re-delivery to an alternative address or convenient date, please contact our concierge team immediately.</p>
                ' . EmailComponents::button('https://wa.me/923001234567?text=' . urlencode("Hello, my order #$orderId was not received by me. Please help arrange re-delivery."), 'Message Concierge on WhatsApp') . '
            ';

            $mail->Body = LuxuryEmailLayout::render(
                'Order Not Received',
                $content,
                'Important notice regarding your order #' . $orderId . '. The package was not received and is returning to our facility.',
                'Delivery Unsuccessful'
            );

            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send Order Undelivered to $to: {$mail->ErrorInfo}");
            return false;
        }
    }

    /**
     * 7. Order Status Updated Email (Generic / In-Transit)
     */
    public static function sendOrderStatusUpdated($to, $name, $orderId, $newStatus) {
        $statusNormalized = strtolower(trim($newStatus));
        if ($statusNormalized === 'cancelled') {
            return self::sendOrderCancelled($to, $name, $orderId);
        }
        if ($statusNormalized === 'returned' || $statusNormalized === 'undelivered') {
            return self::sendOrderUndelivered($to, $name, $orderId, 'Returned to facility');
        }

        $mail = EmailTransport::getMailer();
        if (!$mail) return false;

        try {
            $nameStr = trim((string)$name);
            $statusHeadline = strtoupper(trim($newStatus));

            $mail->addAddress($to, $nameStr);
            $mail->Subject = 'Order #' . $orderId . ' Status: ' . $statusHeadline . ' | UnderPure';

            if ($statusNormalized === 'shipped') {
                $statusMessage = 'Your curated selections have completed their final inspection and are officially in transit to your doorstep with PostEx Express. We cannot wait for you to experience them.';
                $btnText = 'Track Your Package';
            } elseif ($statusNormalized === 'confirmed' || $statusNormalized === 'processing') {
                $statusMessage = 'Your order #' . $orderId . ' has been confirmed by our atelier and is currently being prepared for dispatch.';
                $btnText = 'View Order Details';
            } else {
                $statusMessage = 'The status of your order #' . $orderId . ' has progressed to <strong>' . htmlspecialchars($statusHeadline) . '</strong>.';
                $btnText = 'View Order Status';
            }

            $infoGridHtml = EmailComponents::infoGrid([
                'Order Number' => '#' . htmlspecialchars($orderId),
                'Current Status' => '<span style="font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8F6B58;">' . htmlspecialchars($statusHeadline) . '</span>',
                'Updated On' => date('F j, Y')
            ]);

            $content = '
                <p>Dear ' . htmlspecialchars($nameStr) . ',</p>
                <p>' . $statusMessage . '</p>
                ' . $infoGridHtml . '
                ' . EmailComponents::button('https://www.underpure.com/account?tab=orders', $btnText) . '
            ';

            $mail->Body = LuxuryEmailLayout::render(
                'Order ' . $statusHeadline,
                $content,
                'Your order #' . $orderId . ' status has been updated to ' . $statusHeadline . '.',
                $statusHeadline
            );

            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send Order Status Update to $to: {$mail->ErrorInfo}");
            return false;
        }
    }

    /**
     * 4. Password Reset & OTP Verification Email
     */
    public static function sendPasswordReset($to, $name, $otp) {
        $mail = EmailTransport::getMailer('noreply');
        if (!$mail) return false;

        try {
            $nameStr = trim((string)$name);
            $mail->addAddress($to, $nameStr);
            $mail->Subject = 'Your UnderPure Verification Code: ' . $otp;

            $otpBoxHtml = EmailComponents::otpBox($otp, 10);

            $content = '
                <p>Dear ' . htmlspecialchars($nameStr) . ',</p>
                <p>We received an authentication request to access or reset the password for your UnderPure account. Please enter the unique one-time code below to verify your identity:</p>
                
                ' . $otpBoxHtml . '

                <p style="font-size: 13px; color: #736E6A; line-height: 1.6;">If you did not initiate this password reset, please disregard this communication or contact our concierge immediately to secure your credentials. UnderPure ambassadors will never ask for your verification code.</p>
            ';

            $mail->Body = LuxuryEmailLayout::render(
                'Security Verification',
                $content,
                'Your UnderPure verification code is ' . $otp . '. Valid for 10 minutes.',
                'Security Alert'
            );

            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send Password Reset to $to: {$mail->ErrorInfo}");
            return false;
        }
    }

    /**
     * 5. UP Loyalty Points Credited Email
     */
    public static function sendLoyaltyPointsUpdated($to, $name, $pointsAdded, $newTotal, $reason) {
        $mail = EmailTransport::getMailer();
        if (!$mail) return false;

        try {
            $nameStr = trim((string)$name);
            $mail->addAddress($to, $nameStr);
            $mail->Subject = 'You\'ve Earned +' . $pointsAdded . ' UP Points | UnderPure Rewards';

            $pointsCard = EmailComponents::calloutCard(
                '<strong>Reason:</strong> ' . htmlspecialchars($reason) . '<br>Every 1,000 points unlocks special savings and tier privileges on future selections.',
                'Your New Points Balance',
                number_format($newTotal) . ' UP Points'
            );

            $content = '
                <p>Dear ' . htmlspecialchars($nameStr) . ',</p>
                <p>Splendid news! Your account has just been credited with <strong style="color: #8F6B58;">+' . number_format($pointsAdded) . ' UP Points</strong> in appreciation of your recent activity.</p>
                ' . $pointsCard . '
                <p>Keep collecting points to unlock higher membership tiers and elevate your shopping privileges.</p>
                ' . EmailComponents::button('https://www.underpure.com/loyalty-program', 'Explore Tier Privileges') . '
            ';

            $mail->Body = LuxuryEmailLayout::render(
                'Rewards Earned',
                $content,
                'You have earned +' . $pointsAdded . ' UP Points. Your new balance is ' . number_format($newTotal) . '.',
                'UP Loyalty Club'
            );

            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send Loyalty Update to $to: {$mail->ErrorInfo}");
            return false;
        }
    }

    /**
     * 6. Birthday Celebration Email
     */
    public static function sendBirthdayWish($to, $name, $bonusPoints) {
        $mail = EmailTransport::getMailer();
        if (!$mail) return false;

        try {
            $nameStr = trim((string)$name);
            $mail->addAddress($to, $nameStr);
            $mail->Subject = 'Happy Birthday from UnderPure | A Gift for You';

            $giftCard = EmailComponents::calloutCard(
                'As our token of celebration, we have deposited complimentary UP Points into your wallet. May your day be filled with elegance and delight.',
                'Birthday Gift From UnderPure',
                '+' . number_format($bonusPoints) . ' UP Points'
            );

            $content = '
                <p>Dear ' . htmlspecialchars($nameStr) . ',</p>
                <p>On behalf of everyone at UnderPure, we wish you a splendid, joyful, and radiant birthday!</p>
                ' . $giftCard . '
                <p>Treat yourself to something extraordinary. You deserve nothing less.</p>
                ' . EmailComponents::button('https://www.underpure.com', 'Claim Your Birthday Gift') . '
            ';

            $mail->Body = LuxuryEmailLayout::render(
                'Happy Birthday, Lover',
                $content,
                'Wishing you a radiant birthday. A complimentary gift has been added to your account.',
                'Birthday Celebration'
            );

            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send Birthday Wish to $to: {$mail->ErrorInfo}");
            return false;
        }
    }

    /**
     * 7. Exclusive Promo & Private Sale Email
     */
    public static function sendPromoEmail($to, $name, $promoCode, $discountValue, $expiryDate) {
        $mail = EmailTransport::getMailer();
        if (!$mail) return false;

        try {
            $nameStr = trim((string)$name);
            $mail->addAddress($to, $nameStr);
            $mail->Subject = 'A Private Invitation | ' . $discountValue . ' Off Your Next Selection';

            $promoCard = EmailComponents::calloutCard(
                'Apply code during checkout to redeem <strong>' . htmlspecialchars($discountValue) . '</strong> off your total.<br><span style="font-size: 11px; color: #8F6B58;">Valid until ' . htmlspecialchars($expiryDate) . '.</span>',
                'Your Private Voucher Code',
                htmlspecialchars($promoCode)
            );

            $content = '
                <p>Dear ' . htmlspecialchars($nameStr) . ',</p>
                <p>As one of our most valued patrons, we are delighted to extend a private promotion curated especially for you.</p>
                ' . $promoCard . '
                <p>Browse our curated collections to find your next favorite piece.</p>
                ' . EmailComponents::button('https://www.underpure.com/collections/all', 'Shop The Collection') . '
            ';

            $mail->Body = LuxuryEmailLayout::render(
                'A Private Invitation',
                $content,
                'An exclusive ' . $discountValue . ' privilege awaits your next selection.',
                'Exclusive Privilege'
            );

            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send Promo Email to $to: {$mail->ErrorInfo}");
            return false;
        }
    }

    /**
     * 8. VIP Tier Upgrade Email
     */
    public static function sendVipUpgrade($to, $name, $privileges) {
        $mail = EmailTransport::getMailer();
        if (!$mail) return false;

        try {
            $nameStr = trim((string)$name);
            $mail->addAddress($to, $nameStr);
            $mail->Subject = 'Welcome to VIP Status | UnderPure Elite';

            $perksList = !empty($privileges) && is_array($privileges) ? $privileges : [
                'Complimentary Express Shipping on all orders',
                'Priority atelier fulfillment & concierge care',
                'Early access to seasonal drops and private capsules',
                'Double UP Points on special milestone dates'
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

            $vipCard = EmailComponents::calloutCard(
                $perksHtml,
                'Your Bespoke VIP Privileges',
                'ELITE MEMBER'
            );

            $content = '
                <p>Dear ' . htmlspecialchars($nameStr) . ',</p>
                <p>It is our utmost pleasure to formally welcome you to <strong>UnderPure VIP Status</strong>. In celebration of your discerning taste and continued loyalty, you now command our highest level of client care.</p>
                ' . $vipCard . '
                <p>Your privileges are automatically linked to your account and active across all future orders.</p>
                ' . EmailComponents::button('https://www.underpure.com/account', 'Access The VIP Lounge') . '
            ';

            $mail->Body = LuxuryEmailLayout::render(
                'Welcome to VIP Status',
                $content,
                'You have been officially upgraded to UnderPure VIP status.',
                'VIP Status Unlocked'
            );

            return $mail->send();
        } catch (Exception $e) {
            error_log("Failed to send VIP Email to $to: {$mail->ErrorInfo}");
            return false;
        }
    }
}
