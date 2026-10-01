<?php

require_once __DIR__ . '/ShippingGatewayInterface.php';
require_once __DIR__ . '/../PostExHelper.php';

/**
 * Class PostExShippingGateway
 * Concrete courier adapter for PostEx v3 shipping integration.
 */
class PostExShippingGateway implements ShippingGatewayInterface {

    public function createShipment(array $orderData): array {
        return PostExHelper::createShipment($orderData);
    }

    public function trackShipment(string $trackingNumber): array {
        return PostExHelper::trackShipment($trackingNumber);
    }

    public function getGatewayName(): string {
        return 'PostEx';
    }
}
