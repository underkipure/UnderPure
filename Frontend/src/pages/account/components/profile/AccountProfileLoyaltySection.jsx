import React from "react";
import { getCalculatedLoyaltyTier } from "../../utils/accountProfileHelpers";

export default function AccountProfileLoyaltySection({
  d,
  user,
  tier2Threshold,
  tier3Threshold,
  tier4Threshold,
  tier5Threshold,
  navigate,
}) {
  if (d?.loyalty?.enabled === false) return null;

  const calculatedTier =
    user?.loyaltyTier ||
    getCalculatedLoyaltyTier(user?.loyaltyPoints || 0, {
      tier2Threshold,
      tier3Threshold,
      tier4Threshold,
      tier5Threshold,
    });

  return (
    <div className="w-full md:w-[80%] tracking-[0.0001em]">
      <h2 className="font-serif text-[17px] sm:text-[16px] uppercase tracking-wider text-black mb-2">
        {d?.loyalty?.title || "LOYALTY"}
      </h2>
      <div className="space-y-1">
        <div className="leading-[18px]">
          <p className="text-[11px] font-sans text-black">Tier status</p>
          <p className="text-[11px] font-sans text-black ">
            {d?.loyalty?.statusPrefix || `You are currently in ${calculatedTier} with`}{" "}
            {user?.loyaltyPoints || 0}{" "}
            {d?.loyalty?.statusSuffix || "UPcoins."}
          </p>
          <p className="text-[11px] font-sans text-black mb-2">
            {d?.loyalty?.earnText || "Earn 500 UPcoins to unlock Tier 2."}
          </p>
        </div>
        <button
          onClick={() => navigate("/loyalty-program")}
          className="bg-black text-white text-[11px] uppercase tracking-widest px-5 py-2.5 mt-2 font-sans rounded-lg"
        >
          {d?.loyalty?.buttonText || "DISCOVER"}
        </button>
      </div>
    </div>
  );
}
