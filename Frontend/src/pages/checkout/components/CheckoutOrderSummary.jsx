import React from "react";
import { ShieldCheck } from "lucide-react";
import { OrderItemRow, OrderPricingBreakdown } from "../../../components/shared/orders";

export const CheckoutOrderSummary = ({
  cartItems = [],
  hasShippingProtection = false,
  checkoutSettings = {},
  appliedPromo = null,
  promoInput = "",
  setPromoInput,
  isVerifyingPromo = false,
  handleApplyPromo,
  handleRemovePromo,
  user = null,
  maxPoints = 0,
  maxRedeemableValue = 0,
  maxPointsToUse = 0,
  pointsUsed = 0,
  setPointsUsed,
  pointsDiscount = 0,
  subtotal = 0,
  shipping = 0,
  promoDiscount = 0,
  firstOrderDiscount = 0,
  vipDiscount = 0,
  total = 0,
  isMobile = false,
}) => {
  const cs = checkoutSettings || {};
  const totalItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="space-y-3">
      {/* Items list */}
      <div className={`${isMobile ? "max-h-[42vh] overflow-y-auto no-scrollbar" : ""} pt-2.5 pb-1 px-1.5 space-y-3`}>
        {cartItems.map((item) => (
          <OrderItemRow
            key={item.id}
            item={item}
            variant="checkout"
            isMobile={isMobile}
          />
        ))}

        {/* Shipping Protection Item in Summary */}
        {hasShippingProtection && (
          <div className="flex gap-3 items-center pt-0.5">
            <div
              className={`relative ${
                isMobile ? "w-12 h-12 rounded-lg" : "w-[4.25rem] h-[4.25rem] rounded-xl"
              } bg-white border border-gray-200/90 flex items-center justify-center shrink-0 shadow-2xs`}
            >
              <div
                className={`${
                  isMobile ? "w-6 h-6" : "w-8 h-8"
                } rounded-md bg-gray-50 flex items-center justify-center text-gray-700`}
              >
                <ShieldCheck size={isMobile ? 16 : 20} strokeWidth={1.75} />
              </div>
              <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 min-w-[20px] min-h-[20px] rounded-full flex items-center justify-center text-[10px] font-semibold leading-none z-20 shadow-xs ring-2 ring-white">
                1
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`${
                  isMobile ? "text-[12px]" : "text-[11.5px]"
                } text-gray-900 font-normal font-sans leading-snug`}
              >
                {cs.shippingProtectionTitle
                  ? cs.shippingProtectionTitle.replace(/\b(Route|PostEx)\b/gi, "UnderPure")
                  : "Shipping Protection"}
              </h3>
              <p className={`${isMobile ? "text-[11px]" : "text-[10px]"} text-gray-500 mt-0.5 font-sans`}>
                Rs {Number(cs.shippingProtectionFee ?? 1.95).toFixed(2)}
              </p>
            </div>

            <span
              className={`${
                isMobile ? "text-[12px]" : "text-[11.5px]"
              } text-gray-900 font-normal font-sans shrink-0`}
            >
              Rs {Number(cs.shippingProtectionFee ?? 1.95).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Discount input */}
      <div className="pt-0.5">
        {appliedPromo ? (
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200/80 px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-gray-600">Code:</span>
              <span className="text-[11px] font-mono font-bold bg-white px-1.5 py-0.5 border border-gray-200 rounded text-green-700 uppercase">
                {appliedPromo.code}
              </span>
            </div>
            <button
              onClick={handleRemovePromo}
              className="text-[11px] font-medium text-gray-500 hover:text-black hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-1.5 border border-gray-300 rounded-lg p-1 pl-2.5 bg-white items-center shadow-2xs">
            <input
              type="text"
              placeholder="Discount code or gift card"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              disabled={isVerifyingPromo}
              onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
              className="flex-1 text-[11px] text-gray-900 bg-transparent placeholder:text-gray-400 focus:outline-none py-1 font-sans uppercase placeholder:normal-case"
            />
            <button
              onClick={handleApplyPromo}
              disabled={!promoInput.trim() || isVerifyingPromo}
              className="px-3 py-1.5 bg-[#f4f4f4] hover:bg-gray-200 text-gray-600 hover:text-black font-medium text-[10.5px] rounded-md transition-colors disabled:opacity-40 cursor-pointer"
            >
              {isVerifyingPromo ? "Applying..." : "Apply"}
            </button>
          </div>
        )}
      </div>

      {/* Loyalty points if applicable */}
      {user && maxPoints > 0 && (
        <div className="py-1.5 space-y-1 border-t border-gray-100">
          <div className="flex justify-between items-center text-[10.5px]">
            <span className="font-medium text-gray-900">Underpure Points</span>
            <span className="text-gray-500">
              {maxPoints} pts (Worth Rs {Number(maxRedeemableValue).toFixed(2)})
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={maxPointsToUse}
            value={pointsUsed}
            onChange={(e) => setPointsUsed(Number(e.target.value))}
            className="w-full accent-black h-1"
          />
          <div className="flex justify-between items-center text-[10.5px] text-gray-600">
            <span>Redeeming: {pointsUsed} pts</span>
            <span className="font-semibold text-black">- Rs {pointsDiscount.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Reusable Pricing Breakdown */}
      <OrderPricingBreakdown
        subtotal={subtotal}
        itemCount={totalItemCount}
        shipping={shipping}
        pointsDiscount={pointsDiscount}
        promoDiscount={promoDiscount}
        promoCode={appliedPromo?.code}
        firstOrderDiscount={firstOrderDiscount}
        vipDiscount={vipDiscount}
        total={total}
        variant="checkout"
        isMobile={isMobile}
      />
    </div>
  );
};
