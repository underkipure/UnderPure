import React, { useState, useEffect } from "react";

export default function LoyaltyTierProgressBar({
  pts,
  tier2Threshold,
  tier3Threshold,
  tier4Threshold,
  tier5Threshold,
}) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  const tierDefs = [
    { id: 1, label: "T1", name: "Tier 1", min: 0, max: tier2Threshold },
    { id: 2, label: "T2", name: "Tier 2", min: tier2Threshold, max: tier3Threshold },
    { id: 3, label: "T3", name: "Tier 3", min: tier3Threshold, max: tier4Threshold },
    { id: 4, label: "T4", name: "Tier 4", min: tier4Threshold, max: tier5Threshold },
    { id: 5, label: "T5", name: "Tier 5", min: tier5Threshold, max: null },
  ];

  const currentTierIndex = tierDefs.reduce((acc, t, idx) => (pts >= t.min ? idx : acc), 0);
  const nextTier = tierDefs[currentTierIndex + 1];
  const nextTarget = nextTier ? nextTier.min : null;

  // Exact piecewise progress across 4 intervals (0-25%, 25-50%, 50-75%, 75-100%)
  let targetProgress = 0;
  if (pts >= tier5Threshold) {
    targetProgress = 100;
  } else if (pts >= tier4Threshold) {
    const range = tier5Threshold - tier4Threshold;
    const inRange = pts - tier4Threshold;
    targetProgress = 75 + (range > 0 ? (inRange / range) * 25 : 0);
  } else if (pts >= tier3Threshold) {
    const range = tier4Threshold - tier3Threshold;
    const inRange = pts - tier3Threshold;
    targetProgress = 50 + (range > 0 ? (inRange / range) * 25 : 0);
  } else if (pts >= tier2Threshold) {
    const range = tier3Threshold - tier2Threshold;
    const inRange = pts - tier2Threshold;
    targetProgress = 25 + (range > 0 ? (inRange / range) * 25 : 0);
  } else {
    const range = tier2Threshold || 500;
    const inRange = Math.max(0, pts);
    targetProgress = range > 0 ? (inRange / range) * 25 : 0;
  }
  targetProgress = Math.min(100, Math.max(0, targetProgress));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(targetProgress);
    }, 50);
    return () => clearTimeout(timer);
  }, [targetProgress]);

  const milestones = [
    { id: 1, label: "T1", threshold: 0, percent: 0, hasDot: false },
    { id: 2, label: `T2 (${tier2Threshold})`, threshold: tier2Threshold, percent: 25, hasDot: true },
    { id: 3, label: `T3 (${tier3Threshold})`, threshold: tier3Threshold, percent: 50, hasDot: true },
    { id: 4, label: `T4 (${tier4Threshold})`, threshold: tier4Threshold, percent: 75, hasDot: true },
    { id: 5, label: `T5 (${tier5Threshold})`, threshold: tier5Threshold, percent: 100, hasDot: true },
  ];

  return (
    <div>
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-sans text-gray-500 uppercase tracking-widest">
          {nextTarget
            ? `${(nextTarget - pts).toLocaleString()} UPcoins to ${nextTier.name}`
            : "Maximum Tier Reached 🎉"}
        </span>
        <span className="text-[11px] font-sans text-black font-bold">
          {pts.toLocaleString()} / {nextTarget ? nextTarget.toLocaleString() : pts.toLocaleString()}
        </span>
      </div>

      {/* Progress Track with Milestone Markers */}
      <div className="relative pt-2 pb-6 px-0.5">
        {/* Background Track Line */}
        <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden relative">
          {/* Active Solid Black Progress Bar with smooth cubic bezier animation */}
          <div
            className="h-full bg-black rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${animatedWidth}%` }}
          />
        </div>

        {/* Milestone Checkpoint Dots & Labels */}
        {milestones.map((m) => {
          const isReached = pts >= m.threshold;
          const isStart = m.percent === 0;
          const isEnd = m.percent === 100;

          return (
            <div
              key={m.id}
              className={`absolute top-2 flex flex-col items-center pointer-events-none ${
                isStart ? "translate-x-0" : isEnd ? "-translate-x-full" : "-translate-x-1/2"
              }`}
              style={{ left: `${m.percent}%` }}
            >
              {/* Only render checkpoint dot if hasDot is true (start dot removed) */}
              {m.hasDot ? (
                <div
                  className={`w-2.5 h-2.5 -mt-2.5 rounded-full transition-all duration-500 z-10 ${
                    isReached
                      ? "bg-black ring-2 ring-white"
                      : "bg-white border-2 border-gray-300"
                  }`}
                />
              ) : (
                <div className="h-2.5 -mt-2.5" />
              )}

              {/* Label directly below */}
              <div className={`mt-2 whitespace-nowrap ${isStart ? "text-left" : isEnd ? "text-right" : "text-center"}`}>
                <span
                  className={`text-[9px] font-sans tracking-wider uppercase block transition-colors duration-300 ${
                    isReached
                      ? "font-bold text-black"
                      : "text-gray-400 font-normal"
                  }`}
                >
                  {m.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
