<?php

/**
 * Interface ShippingGatewayInterface
 * Defines contract for all courier and shipping integrations (PostEx, TCS, Leopards, etc.)
 */
interface ShippingGatewayInterface {
    /**
     * Create a shipment booking with the courier
     *
     * @param array $orderData Order details (id, customer name, phone, address, city, items, total, pickup)
     * @return array Result containing ['success' => bool, 'tracking_number' => ?string, 'error' => ?string]
     */
    public function createShipment(array $orderData): array;

    /**
     * Query live tracking events for a shipment
     *
     * @param string $trackingNumber Courier tracking identifier
     * @return array Result containing ['success' => bool, 'status' => ?string, 'history' => array, 'error' => ?string]
     */
    public function trackShipment(string $trackingNumber): array;

    /**
     * Return gateway provider name
     *
     * @return string
     */
    public function getGatewayName(): string;
}
