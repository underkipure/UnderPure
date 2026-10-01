import React from 'react';
import FilterSection from './FilterSection';
import { COLOR_HEX_MAP } from '../constants';

export default function ColorFilterSection({
  availableColors = [],
  selectedColors = [],
  onToggleColor,
  defaultOpen = false
}) {
  if (!availableColors || availableColors.length === 0) return null;

  return (
    <FilterSection title="Colors" defaultOpen={defaultOpen}>
      <div className="grid grid-cols-2 gap-y-4 gap-x-3">
        {availableColors.map((color) => {
          const colorName = typeof color === 'object' ? color.name : color;
          if (!colorName) return null;
          const isChecked = selectedColors.includes(colorName);
          const hexColor =
            typeof color === 'object' && color.hex && color.hex !== '#ccc'
              ? color.hex
              : COLOR_HEX_MAP[colorName.trim().toLowerCase()] || '#070707ff';
          const isWhiteIsh = ['white', 'ivory', 'cream', 'off white'].includes(
            colorName.trim().toLowerCase()
          );

          return (
            <label
              key={colorName}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onToggleColor('colors', colorName)}
            >
              {/* Color Swatch */}
              <span
                className={`w-[24px] h-[24px] rounded-full flex-shrink-0 shadow-sm ${
                  isChecked
                    ? 'ring-2 ring-black ring-offset-2'
                    : isWhiteIsh
                      ? 'border border-gray-300'
                      : ''
                }`}
                style={{
                  background: hexColor,
                }}
              />
              <span
                className={`text-[13px] font-sans text-[#333] cursor-pointer capitalize ${
                  isChecked ? 'font-bold text-black' : ''
                }`}
              >
                {colorName}
              </span>
            </label>
          );
        })}
      </div>
    </FilterSection>
  );
}
