import React from "react";

/**
 * Reusable ColorSwatchSelector for product cards, product details, and quick-shop modals.
 *
 * @param {Object} props
 * @param {Array} props.colors - Array of color objects { hex, name, images } or hex strings
 * @param {number|null} props.selectedIndex - Index of currently selected color
 * @param {Function} props.onSelectColor - Handler called with (index, colorObj)
 * @param {boolean} [props.showLabel=true] - Display the color name label above swatches
 * @param {string} [props.selectedColorName] - Optional override for the selected color name
 * @param {string} [props.swatchSize="w-7 h-7"] - Tailwind size class for swatches
 * @param {string} [props.className] - Additional wrapper classes
 */
export function ColorSwatchSelector({
  colors = [],
  selectedIndex = null,
  onSelectColor,
  showLabel = true,
  selectedColorName,
  swatchSize = "w-7 h-7",
  className = "",
}) {
  if (!Array.isArray(colors) || colors.length === 0) return null;

  const currentColor =
    selectedColorName ||
    (selectedIndex !== null && colors[selectedIndex]
      ? colors[selectedIndex].name || colors[selectedIndex]
      : "Color");

  return (
    <div className={`text-left ${className}`}>
      {showLabel && (
        <div className="text-[13px] font-sans text-black mb-3">
          <span className="font-normal text-gray-900">{currentColor}</span>
        </div>
      )}

      <div className="flex justify-start gap-2.5">
        {colors.map((colorItem, idx) => {
          const hex = typeof colorItem === "object" ? colorItem.hex : colorItem;
          const name = typeof colorItem === "object" ? colorItem.name : colorItem;
          const isSelected = selectedIndex === idx;

          return (
            <button
              key={`color-${idx}`}
              type="button"
              onClick={() => onSelectColor && onSelectColor(idx, colorItem)}
              title={name}
              aria-label={`Select color ${name}`}
              className={`${swatchSize} rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? "ring-1 ring-black ring-offset-2 scale-105"
                  : "hover:opacity-80"
              }`}
            >
              <span
                className={`${swatchSize} rounded-full block border border-black shadow-inner`}
                style={{ backgroundColor: hex || "#000000" }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
