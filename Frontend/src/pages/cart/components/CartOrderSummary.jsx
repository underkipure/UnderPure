import React from "react";
import { Link } from "react-router-dom";
import { OrderPricingBreakdown } from "../../../components/shared/orders";

export default function CartOrderSummary({
  subtotal,
  basic,
}) {
  const shippingNotice =
    basic?.shippingNotice !== undefined
      ? basic.shippingNotice
      : "Free Shipping on U.S. Orders Rs. 195+ and easy returns. Some items may ship separately.";

  return (
    <div className="lg:col-span-5 w-full lg:w-[95%] lg:pr-10">
      <div className="sticky top-24">
        <h2 className="text-[14px] font-bold uppercase tracking-wide border-b border-gray-200 pb-3 text-black mb-3 font-sans">
          ORDER SUMMARY
        </h2>

        <div className="mb-5">
          <OrderPricingBreakdown
            subtotal={subtotal}
            total={subtotal}
            variant="cart"
          />
        </div>

        <Link
          to="/checkout"
          className="w-full bg-[#111] text-white flex items-center justify-center py-4 text-[12px] font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors mb-3"
        >
          PROCEED TO CHECKOUT
        </Link>

        {/* Payment Policy Notice */}
        {shippingNotice && shippingNotice.trim() ? (
          <p className="text-[13px] text-black leading-tight tracking-[0.0001em] mb-5 pr-4 font-sans whitespace-pre-line">
            {shippingNotice}
          </p>
        ) : null}
      </div>
    </div>
  );
}
