import React from "react";
import { HelpCircle } from "lucide-react";

/**
 * Reusable OrderPricingBreakdown component for Checkout, Cart, and Account Order details.
 *
 * @param {Object} props
 * @param {number} props.subtotal - Cart or order subtotal
 * @param {number} [props.itemCount] - Total items count (optional)
 * @param {number|null} [props.shipping] - Shipping cost (null or undefined shows placeholder)
 * @param {string} [props.shippingPlaceholder="Enter shipping address"] - Text when shipping is uncalculated
 * @param {number} [props.pointsDiscount=0] - Loyalty points discount
 * @param {number} [props.promoDiscount=0] - Promo discount amount
 * @param {string} [props.promoCode] - Promo code name
 * @param {number} [props.firstOrderDiscount=0] - First order welcome discount
 * @param {number} [props.vipDiscount=0] - VIP discount amount
 * @param {number} [props.customDiscount=0] - Generic discount
 * @param {string} [props.customDiscountLabel] - Generic discount label
 * @param {number} [props.taxes=0] - Estimated tax amount
 * @param {number} props.total - Grand total amount
 * @param {'checkout'|'modal'|'cart'} [props.variant='checkout'] - Display layout styling
 * @param {boolean} [props.isMobile=false] - Responsive text sizing for checkout
 * @param {string} [props.currencyPrefix="Rs"] - Currency string
 */
export function OrderPricingBreakdown({
  subtotal = 0,
  itemCount,
  shipping = null,
  shippingPlaceholder = "Enter shipping address",
  pointsDiscount = 0,
  promoDiscount = 0,
  promoCode = "",
  firstOrderDiscount = 0,
  vipDiscount = 0,
  customDiscount = 0,
  customDiscountLabel = "",
  taxes = 0,
  total = 0,
  variant = "checkout",
  isMobile = false,
  currencyPrefix = "Rs",
}) {
  const formatAmount = (val, decimals = 2) => {
    const num = Number(val) || 0;
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Cart variant (matches CartOrderSummary style)
  if (variant === "cart") {
    return (
      <div className="space-y-3 font-sans">
        <div className="space-y-3 text-[14px] text-black border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="text-[13px] font-medium">
              {currencyPrefix}. {formatAmount(subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Tax/Shipping</span>
            <span className="text-[13px] font-medium text-gray-600">
              {shipping !== null && shipping !== undefined
                ? `${currencyPrefix}. ${formatAmount(shipping)}`
                : "Calculated at checkout"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[15px] font-bold text-black pt-1">
          <span>Estimated total</span>
          <span className="text-[13px]">
            {currencyPrefix}. {formatAmount(total || subtotal)}
          </span>
        </div>
      </div>
    );
  }

  // Account Modal variant (matches AccountOrderDetailModal style)
  if (variant === "modal") {
    const discountVal = customDiscount || promoDiscount;
    const discountCode = customDiscountLabel || promoCode;

    return (
      <div className="border-t border-black/10 pt-4 space-y-2 text-sm font-sans">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>
            {currencyPrefix}. {formatAmount(subtotal)}
          </span>
        </div>

        {shipping !== null && shipping !== undefined && Number(shipping) > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>
              {currencyPrefix}. {formatAmount(shipping)}
            </span>
          </div>
        )}

        {discountVal > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount {discountCode ? `(${discountCode})` : ""}</span>
            <span>
              -{currencyPrefix}. {formatAmount(discountVal)}
            </span>
          </div>
        )}

        {taxes > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Estimated Taxes</span>
            <span>
              {currencyPrefix}. {formatAmount(taxes)}
            </span>
          </div>
        )}

        <div className="flex justify-between font-bold text-lg pt-2 border-t border-black/10 text-black">
          <span>Total</span>
          <span>
            {currencyPrefix}. {formatAmount(total)}
          </span>
        </div>
      </div>
    );
  }

  // Standard Checkout variant (matches CheckoutOrderSummary)
  const textSize = isMobile ? "text-[11.5px]" : "text-[11px]";

  return (
    <div className={`pt-1.5 border-t border-gray-100 space-y-1.5 ${textSize} font-sans`}>
      {/* Subtotal row */}
      <div className="flex justify-between items-center text-gray-700">
        <span>
          Subtotal
          {itemCount !== undefined && itemCount > 0 && ` \u00B7 ${itemCount} items`}
        </span>
        <span className="font-normal text-black">
          {currencyPrefix} {formatAmount(subtotal)}
        </span>
      </div>

      {/* Shipping row */}
      <div className="flex justify-between items-center text-gray-700">
        <span className="flex items-center gap-1">
          Shipping
          <HelpCircle size={11} className="text-gray-400 cursor-help" />
        </span>
        <span className="text-gray-500">
          {shipping !== null && shipping !== undefined && shipping > 0
            ? `${currencyPrefix} ${formatAmount(shipping)}`
            : shipping === 0
            ? "Free"
            : shippingPlaceholder}
        </span>
      </div>

      {/* Underpure Points Discount */}
      {pointsDiscount > 0 && (
        <div className="flex justify-between items-center text-green-700">
          <span>UP Points Discount</span>
          <span>
            - {currencyPrefix} {formatAmount(pointsDiscount)}
          </span>
        </div>
      )}

      {/* Coupon / Promo Discount */}
      {promoDiscount > 0 && (
        <div className="flex justify-between items-center text-green-700">
          <span className="flex items-center gap-1">
            Discount{" "}
            {promoCode && (
              <span className="uppercase text-[9.5px] bg-green-100 px-1 py-0.5 rounded font-mono">
                {promoCode}
              </span>
            )}
          </span>
          <span>
            - {currencyPrefix} {formatAmount(promoDiscount)}
          </span>
        </div>
      )}

      {/* Welcome / First Order Discount */}
      {firstOrderDiscount > 0 && (
        <div className="flex justify-between items-center text-green-700">
          <span>Welcome Discount (15%)</span>
          <span>
            - {currencyPrefix} {formatAmount(firstOrderDiscount)}
          </span>
        </div>
      )}

      {/* VIP Loyalty Discount */}
      {vipDiscount > 0 && (
        <div className="flex justify-between items-center text-[#90134a]">
          <span>VIP Discount (10%)</span>
          <span>
            - {currencyPrefix} {formatAmount(vipDiscount)}
          </span>
        </div>
      )}

      {/* Taxes */}
      {taxes > 0 && (
        <div className="flex justify-between items-center text-gray-700">
          <span>Taxes</span>
          <span className="text-black">
            {currencyPrefix} {formatAmount(taxes)}
          </span>
        </div>
      )}

      {/* Grand Total */}
      <div className="flex justify-between items-baseline pt-2 border-t border-gray-200">
        <span
          className={`${
            isMobile ? "text-[12.5px]" : "text-[12px]"
          } font-normal text-black font-sans`}
        >
          Total
        </span>
        <div className="text-right flex items-baseline gap-1.5">
          <span className="text-[10px] text-gray-500 font-sans">PKR</span>
          <span
            className={`${
              isMobile ? "text-[14px]" : "text-[14px]"
            } font-semibold text-black tracking-tight font-sans`}
          >
            {currencyPrefix} {formatAmount(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
