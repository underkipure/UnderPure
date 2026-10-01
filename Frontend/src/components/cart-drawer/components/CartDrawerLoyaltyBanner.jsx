import React from "react";
import { Link } from "react-router-dom";

const CartDrawerLoyaltyBanner = ({
  cartSettings,
  isAuthenticated,
  toggleCart,
}) => {
  if (!cartSettings?.loyaltyBanner?.enabled || isAuthenticated) {
    return null;
  }

  return (
    <div className="pt-2">
      <div className="border border-black rounded-[12px] p-4 mb-2">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 pr-2">
            <h3
              className="text-[18px] font-dala-roman text-black"
            >
              {cartSettings.loyaltyBanner.title || "UnderPure with Benefits"}
            </h3>
            <p className="text-[13.5px] text-black font-sans leading-tight tracking-[0.0001em]">
              {cartSettings.loyaltyBanner.description ||
                "Join our loyalty program to access exclusive benefits and earn UPcoins every time you shop."}
            </p>
          </div>
          <Link
            to="/signup"
            onClick={toggleCart}
            className="bg-black text-white px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.0001em] shrink-0 hover:bg-gray-800 transition-colors text-center mt-1"
          >
            {cartSettings.loyaltyBanner.buttonText || "SIGN UP"}
          </Link>
        </div>
      </div>
      <div className="text-right mt-2 pr-1">
        <span className="text-[12px] font-sans text-black tracking-[0.0001em]">
          Already a member?{" "}
          <Link
            to="/login"
            onClick={toggleCart}
            className="underline underline-offset-2 hover:opacity-70"
          >
            Log in
          </Link>
        </span>
      </div>
    </div>
  );
};

export default CartDrawerLoyaltyBanner;
