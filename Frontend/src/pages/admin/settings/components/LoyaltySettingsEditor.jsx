import React from 'react';

export default function LoyaltySettingsEditor({
  signupBonus,
  setSignupBonus,
  pointsPerSpend,
  setPointsPerSpend,
  spendUnit,
  setSpendUnit,
  redemptionRatio,
  setRedemptionRatio,
  birthdayBonus,
  setBirthdayBonus,
  tier2Threshold,
  setTier2Threshold,
  tier3Threshold,
  setTier3Threshold,
  tier4Threshold,
  setTier4Threshold,
  tier5Threshold,
  setTier5Threshold
}) {
  return (
    <section>
      <h2 className="font-serif text-xl mb-4 border-b border-black/10 pb-2">
        Loyalty Program Dynamics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Signup Bonus (Points)
          </label>
          <input
            type="number"
            value={signupBonus}
            onChange={(e) => setSignupBonus(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Points Awarded
          </label>
          <input
            type="number"
            value={pointsPerSpend}
            onChange={(e) => setPointsPerSpend(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Per Amount Spent (Rs.)
          </label>
          <input
            type="number"
            value={spendUnit}
            onChange={(e) => setSpendUnit(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Redemption Ratio (e.g. 0.1 for 10pts=1 Rs)
          </label>
          <input
            type="number"
            step="0.01"
            value={redemptionRatio}
            onChange={(e) => setRedemptionRatio(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Birthday Month Reward (Points)
          </label>
          <input
            type="number"
            value={birthdayBonus}
            onChange={(e) => setBirthdayBonus(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Tier 2 Threshold (Points)
          </label>
          <input
            type="number"
            value={tier2Threshold}
            onChange={(e) => setTier2Threshold(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Tier 3 Threshold (Points)
          </label>
          <input
            type="number"
            value={tier3Threshold}
            onChange={(e) => setTier3Threshold(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Tier 4 Threshold (Points)
          </label>
          <input
            type="number"
            value={tier4Threshold}
            onChange={(e) => setTier4Threshold(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Tier 5 Threshold (Points)
          </label>
          <input
            type="number"
            value={tier5Threshold}
            onChange={(e) => setTier5Threshold(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>
    </section>
  );
}
