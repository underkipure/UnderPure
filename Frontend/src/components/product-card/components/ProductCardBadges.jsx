import React from "react";

export default function ProductCardBadges({ badgeList, cardStyle }) {
  if (!badgeList || badgeList.length === 0) return null;

  return (
    <div
      className="absolute w-full flex justify-center z-20 pointer-events-none flex-wrap px-2 bottom-0 translate-y-1/2 left-0 gap-1"
    >
      {badgeList.map((b, i) => (
        <span
          key={i}
          className={`bg-black text-white whitespace-nowrap font-sans font-bold tracking-widest ${
            cardStyle === "carousel"
              ? "px-[10vw] md:px-[1.8vw] text-[2.2vw] md:text-[0.67vw] py-[0.41vw] md:py-[0.1vw]"
              : "px-[5vw] md:px-[2.5vw] font-bold text-[2.2vw] md:text-[0.55vw] py-[0.25vw] md:py-[0.1vw]"
          } tracking-tight rounded-full capitalize`}
        >
          {b}
        </span>
      ))}
    </div>
  );
}
