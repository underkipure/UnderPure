import React from "react";
import { Link } from "react-router-dom";
import CartDrawerPolicies from "./CartDrawerPolicies";

const CartDrawerFooter = ({
  cartItems,
  cartSettings,
  itemCount,
  subtotal,
  toggleCart,
}) => {
  return (
    <div className="px-4 sm:px-6 pt-4 pb-6 bg-white shrink-0 z-20 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] border-t border-gray-100">
      {cartItems.length === 0 ? (
        <button
          onClick={toggleCart}
          className="w-full bg-black text-white h-[48px] flex items-center justify-center text-[12px] font-bold uppercase tracking-[0.18em] hover:bg-gray-800 transition-colors rounded-none"
        >
          CONTINUE SHOPPING
        </button>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 pt-4">
            <span className="font-sans text-black">
              <strong className="text-[16px] tracking-[0.0001em]">
                {cartSettings?.basic?.subtotalText || "Subtotal"}
              </strong>{" "}
              <span className="text-[13px] ml-0.5 tracking-[0.0001em] font-medium">
                ({itemCount} item{itemCount > 1 ? "s" : ""})
              </span>
            </span>
            <span className="font-sans font-bold text-[16px] text-black tracking-[0.0001em]">
              Rs. {subtotal % 1 === 0 ? subtotal : subtotal.toFixed(2)}
            </span>
          </div>
          <Link
            to="/checkout"
            onClick={toggleCart}
            className="w-full bg-black text-white flex items-center justify-center text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors mb-2 h-[48px]"
          >
            {cartSettings?.basic?.checkoutText || "CONTINUE TO CHECKOUT"}
          </Link>
          <div className="text-center mb-2">
            <Link
              to="/cart"
              onClick={toggleCart}
              className="text-[13px] font-bold font-sans text-black uppercase tracking-[0.01em] underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              {cartSettings?.basic?.viewBagText || "VIEW BAG"}
            </Link>
          </div>
          <CartDrawerPolicies cartSettings={cartSettings} />
        </>
      )}
    </div>
  );
};

export default CartDrawerFooter;
