import React from "react";

export default function ProductCardSwatches({
  uniqueColors = [],
  extraColorsText,
  onColorHover,
  onColorLeave,
}) {
  const colors = Array.isArray(uniqueColors) ? uniqueColors : [];
  const maxColors = 3;
  const visibleColors = colors.slice(0, maxColors);
  const remainingCount = colors.length > maxColors ? colors.length - maxColors : 0;
  const remainingColorNames = remainingCount > 0
    ? colors.slice(maxColors).map((c) => c.name).filter(Boolean).join(", ")
    : "";

  return (
    <div className="flex items-center justify-center gap-[1vw] md:gap-[0.5vw] mb-[1vw] md:mb-[0.5vw] min-h-[5vw] md:min-h-[1.5vw]">
      {visibleColors.map((colorObj, idx) => (
        <button
          key={idx}
          aria-label={`Color: ${colorObj.name}`}
          className="w-[5vw] h-[5vw] md:w-[1.5vw] md:h-[1.5vw] rounded-full border border-black hover:scale-110 transition-transform"
          style={{ backgroundColor: colorObj.hex }}
          title={colorObj.name}
          onMouseEnter={() => onColorHover(colorObj)}
          onMouseLeave={onColorLeave}
        />
      ))}
      {remainingCount > 0 && (
        <span
          className="text-[2.8vw] md:text-[0.75vw] text-neutral-800 font-sans font-medium leading-none ml-[0.3vw] md:ml-[0.1vw] select-none self-center"
          title={remainingColorNames ? `+${remainingCount} more: ${remainingColorNames}` : `+${remainingCount} more colors`}
        >
          +{remainingCount}
        </span>
      )}
      {extraColorsText && remainingCount === 0 && (
        <span className="text-[2.5vw] md:text-[0.6vw] text-[#888888] font-sans italic ml-[0.5vw] md:ml-[0.2vw]">
          {extraColorsText}
        </span>
      )}
    </div>
  );
}
