/**
 * Pure calculation functions for Checkout Totals & Discounts
 */

export function calculateCheckoutTotals({
  cartItems = [],
  user = null,
  shippingRates = [],
  taxRate = 0,
  freeShippingThreshold = 0,
  pointsUsed = 0,
  appliedPromo = null,
  hasShippingProtection = true,
  checkoutSettings = {},
  loyaltySettings = {},
}) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const isVip = user?.isVip === true;
  const isFirstOrder = user?.isFirstOrder === true;

  const selectedShipping =
    shippingRates && shippingRates.length > 0
      ? shippingRates[0]
      : { name: "Standard", price: 250 };

  const isFreeShipping =
    (Number(freeShippingThreshold) > 0 &&
      subtotal >= Number(freeShippingThreshold)) ||
    isVip;

  const shipping = isFreeShipping ? 0 : Number(selectedShipping.price) || 250;
  const taxes = subtotal * ((Number(taxRate) || 0) / 100);
  const duties = 0;

  const maxPoints = user?.loyaltyPoints || 0;
  const redemptionRatio = loyaltySettings?.redemptionRatio || 0.1;
  const maxRedeemableValue = maxPoints * redemptionRatio;

  const maxPointsToUse = Math.min(
    maxPoints,
    Math.floor(subtotal / redemptionRatio)
  );

  const pointsDiscount = pointsUsed * redemptionRatio;
  const promoDiscount = appliedPromo ? Number(appliedPromo.amount) || 0 : 0;
  const vipDiscount = isVip ? Math.round(subtotal * 0.1) : 0;
  const firstOrderDiscount =
    isFirstOrder && !isVip ? Math.round(subtotal * 0.15) : 0;

  const protectionFee = hasShippingProtection
    ? Number(checkoutSettings?.shippingProtectionFee ?? 1.95)
    : 0;

  const total = Math.max(
    0,
    subtotal +
      shipping +
      duties +
      taxes +
      protectionFee -
      pointsDiscount -
      promoDiscount -
      vipDiscount -
      firstOrderDiscount
  );

  return {
    subtotal,
    isVip,
    isFirstOrder,
    selectedShipping,
    isFreeShipping,
    shipping,
    taxes,
    duties,
    maxPoints,
    maxRedeemableValue,
    maxPointsToUse,
    pointsDiscount,
    promoDiscount,
    vipDiscount,
    firstOrderDiscount,
    protectionFee,
    total,
  };
}
