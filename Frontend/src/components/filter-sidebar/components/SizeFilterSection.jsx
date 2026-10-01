import React, { useState } from 'react';
import FilterSection from './FilterSection';

export default function SizeFilterSection({
  availableSizes = [],
  selectedSizes = [],
  onToggleSize,
  isMobile = false,
  defaultOpen = false
}) {
  const [showAll, setShowAll] = useState(false);

  if (!availableSizes || availableSizes.length === 0) return null;

  return (
    <FilterSection title="Band + Cup" defaultOpen={defaultOpen}>
      {isMobile ? (
        /* Mobile View: Pill Buttons */
        <div>
          <div className="grid grid-cols-4 gap-8">
            {availableSizes.slice(0, showAll ? undefined : 8).map((size) => {
              const sizeName = typeof size === 'object' ? size.name : size;
              if (!sizeName) return null;
              const isChecked = selectedSizes.includes(sizeName);
              return (
                <button
                  type="button"
                  key={sizeName}
                  onClick={() => onToggleSize('sizes', sizeName)}
                  className={`w-full py-2 px-1 border ${
                    isChecked
                      ? 'border-black font-bold text-black border-[1.5px]'
                      : 'border-gray-200 text-[#000]'
                  } text-[13px] font-sans text-center font-medium rounded-sm uppercase`}
                >
                  {sizeName}
                </button>
              );
            })}
          </div>
          {availableSizes.length > 8 && (
            <div className="w-full border-b border-gray-300 mt-6 pb-2">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="text-[13px] font-sans text-black underline underline-offset-4"
              >
                {showAll ? 'Show less' : 'Show more'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Desktop View: Checkboxes */
        <div className="flex flex-col gap-2.5">
          {availableSizes.slice(0, showAll ? undefined : 8).map((size) => {
            const sizeName = typeof size === 'object' ? size.name : size;
            if (!sizeName) return null;
            const isChecked = selectedSizes.includes(sizeName);
            return (
              <div
                key={sizeName}
                onClick={() => onToggleSize('sizes', sizeName)}
                className="flex items-center gap-3 cursor-pointer group select-none py-1"
              >
                <span
                  className={`w-[16px] h-[16px] border-[2px] rounded-[4px] flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'border-black border-[1.5px]'
                      : 'border-gray-400 group-hover:border-black'
                  }`}
                >
                  {isChecked && <span className="w-[8px] h-[8px] bg-black" />}
                </span>
                <span className="text-[14px] font-sans font-medium text-[#000] cursor-pointer uppercase">
                  {sizeName}
                </span>
              </div>
            );
          })}
          {availableSizes.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="text-[14px] font-sans font-medium text-black underline underline-offset-2 text-left mt-2 tracking-[0.001em]"
            >
              {showAll ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
    </FilterSection>
  );
}
