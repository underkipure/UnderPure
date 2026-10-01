import React from "react";
import { X } from "lucide-react";

const CartDrawerHeader = ({ cartSettings, cartItems, itemCount, toggleCart }) => {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-2 shrink-0 border-b border-black">
      <h2
        className="text-[20px] sm:text-[22px] font-dala-roman tracking-normal normal-case m-0 text-black flex items-baseline gap-1"
      >
        {cartSettings?.basic?.title || "Your bag"}
        {cartItems.length > 0 && (
          <span
            className="tracking-normal font-dala-roman text-[20px] sm:text-[22px]"
          >
            ({itemCount})
          </span>
        )}
      </h2>
      <button
        onClick={toggleCart}
        aria-label="Close shopping bag"
        className="text-black hover:opacity-50 transition-opacity p-1"
      >
        <X className="w-[22px] h-[22px]" strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default CartDrawerHeader;
