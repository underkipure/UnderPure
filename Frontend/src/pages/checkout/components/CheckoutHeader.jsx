import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export const CheckoutHeader = ({ storeName, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="flex justify-center items-center py-5 px-3 relative border-b border-gray-100 bg-white">
        <Link to="/" className="w-full text-center block">
          <h1
            className="text-[1.85rem] sm:text-[2.1rem] leading-[1.05] tracking-widest text-black text-center break-words uppercase font-dala-roman hover:opacity-80 transition-opacity"
          >
            {storeName?.toUpperCase() || "UNDERPURE"}
          </h1>
        </Link>
        <Link
          to="/cart"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#90134a] hover:text-black transition-colors flex items-center justify-center p-1"
          aria-label="Shopping bag"
        >
          <ShoppingBag size={20} className="stroke-[#90134a]" strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center mb-6 relative border-b border-gray-100 pb-5">
      <Link to="/" className="w-full text-center block">
        <h1
          className="text-[2rem] lg:text-[2.2rem] tracking-widest text-black text-center break-words uppercase font-dala-roman hover:opacity-80 transition-opacity"
        >
          {storeName?.toUpperCase() || "UNDERPURE"}
        </h1>
      </Link>
      <Link
        to="/cart"
        className="absolute right-0 text-black hover:text-[#90134a] transition-colors flex items-center justify-center p-1"
        aria-label="Shopping bag"
      >
        <ShoppingBag size={22} strokeWidth={1.5} />
      </Link>
    </div>
  );
};
