<?php

require_once __DIR__ . '/ShippingGatewayInterface.php';
require_once __DIR__ . '/PostExShippingGateway.php';

/**
 * Class ShippingGatewayFactory
 * Factory for resolving courier gateways dynamically based on configuration.
 */
class ShippingGatewayFactory {
    /**
     * Resolve courier gateway instance
     *
     * @param string|null $courierName Specific courier or null for default
     * @return ShippingGatewayInterface
     */
    public static function create(?string $courierName = null): ShippingGatewayInterface {
        $courier = strtolower($courierName ?? 'postex');

        switch ($courier) {
            case 'postex':
            default:
                return new PostExShippingGateway();
        }
    }
}
