import React from "react";

/**
 * Reusable VariantSizeSelector for product size selection with stock detection and size guide trigger.
 *
 * @param {Object} props
 * @param {Array<string>} props.sizes - Available size options
 * @param {string|null} props.selectedSize - Currently selected size
 * @param {Function} props.onSelectSize - Handler called with selected size string
 * @param {Function} [props.getStockCount] - Function (colorName, size) => number to check stock
 * @param {string} [props.selectedColorName] - Current color name for stock query
 * @param {Function} [props.onOpenSizeGuide] - Callback to open size guide modal
 * @param {boolean} [props.showSizeGuide=true] - Toggle size guide link visibility
 * @param {string} [props.sizeGuideLinkText="Size Guide"] - Text for size guide button
 * @param {string} [props.className] - Optional extra wrapper classes
 */
export function VariantSizeSelector({
  sizes = [],
  selectedSize = null,
  onSelectSize,
  getStockCount,
  selectedColorName = null,
  onOpenSizeGuide,
  showSizeGuide = true,
  sizeGuideLinkText = "Size Guide",
  className = "",
}) {
  return (
    <div className={`text-left ${className}`}>
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[13px] font-sans text-black font-semibold">
          Select a Size
        </span>
        {showSizeGuide && onOpenSizeGuide && (
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="text-[12px] font-sans text-black underline underline-offset-4 hover:opacity-70 cursor-pointer font-medium"
          >
            {sizeGuideLinkText}
          </button>
        )}
      </div>

      {sizes.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const sizeStock =
              typeof getStockCount === "function"
                ? getStockCount(selectedColorName, size)
                : 999;
            const isOOS = sizeStock <= 0;
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                type="button"
                onClick={() => onSelectSize && onSelectSize(size)}
                className={`min-w-[46px] h-[36px] px-3 flex items-center justify-center text-[12px] font-medium uppercase tracking-wider transition-all relative border ${
                  isSelected
                    ? "border-black bg-black text-white shadow-xs"
                    : isOOS
                      ? "border-gray-200 bg-gray-50/70 text-gray-300 cursor-pointer hover:border-gray-400"
                      : "border-gray-300 bg-white text-gray-900 hover:border-black cursor-pointer"
                }`}
                title={isOOS ? `${size} (Out of Stock)` : `${size} (In Stock)`}
                aria-label={`Size ${size}${isOOS ? " Out of stock" : ""}`}
              >
                <span className="relative z-10">{size}</span>
                {isOOS && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                    <div className="w-[140%] h-[1px] bg-gray-300 transform -rotate-45" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-xs text-gray-500 uppercase tracking-widest">
          One Size
        </div>
      )}
    </div>
  );
}
