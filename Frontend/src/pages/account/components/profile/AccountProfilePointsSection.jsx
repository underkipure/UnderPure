import React from "react";
import LoyaltyTierProgressBar from "../LoyaltyTierProgressBar";
import { getCalculatedLoyaltyTier } from "../../utils/accountProfileHelpers";

export default function AccountProfilePointsSection({
  user,
  tier2Threshold,
  tier3Threshold,
  tier4Threshold,
  tier5Threshold,
  signupBonus,
  spendUnit,
  pointsPerSpend,
  birthdayBonus,
  orders,
  navigate,
}) {
  const calculatedTier =
    user?.loyaltyTier ||
    getCalculatedLoyaltyTier(user?.loyaltyPoints || 0, {
      tier2Threshold,
      tier3Threshold,
      tier4Threshold,
      tier5Threshold,
    });

  return (
    <div className="w-full">
      <h2 className="font-serif text-[15px] sm:text-[18px] uppercase tracking-wider text-black mb-3">
        UP Coins
      </h2>

      {/* Points Balance Card */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
        <div className="bg-black px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-1">
              Total Balance
            </p>
            <p className="text-[28px] font-serif text-white font-bold leading-none">
              {(user?.loyaltyPoints || 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400 mt-1 tracking-widest uppercase">
              UPcoins
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">
              Current Tier
            </p>
            <p className="text-[16px] font-serif text-white font-medium">
              {calculatedTier}
            </p>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="px-5 py-5 bg-white">
          <LoyaltyTierProgressBar
            pts={user?.loyaltyPoints || 0}
            tier2Threshold={tier2Threshold}
            tier3Threshold={tier3Threshold}
            tier4Threshold={tier4Threshold}
            tier5Threshold={tier5Threshold}
          />
        </div>
      </div>

      {/* How to Earn */}
      <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 text-[11px] font-sans">
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-gray-500">Signup Bonus</span>
          <span className="font-semibold text-black">
            +{signupBonus} UPcoins
          </span>
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-gray-500">
            Per Rs. {spendUnit.toLocaleString()} spent
          </span>
          <span className="font-semibold text-black">
            +{pointsPerSpend} UPcoins
          </span>
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-gray-500">Birthday Bonus</span>
          <span className="font-semibold text-black">
            +{birthdayBonus} UPcoins
          </span>
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="text-gray-500">Total Orders Placed</span>
          <span className="font-semibold text-black">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate("/loyalty-program")}
        className="mt-3 text-[11px] font-sans text-black underline underline-offset-2 hover:opacity-60 tracking-wide"
      >
        View Loyalty Program →
      </button>
    </div>
  );
}
