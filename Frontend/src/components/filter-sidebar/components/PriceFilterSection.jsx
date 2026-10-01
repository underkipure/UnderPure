import React from 'react';
import FilterSection from './FilterSection';

export default function PriceFilterSection({
  minPrice,
  maxPrice,
  onPriceChange,
  defaultOpen = false
}) {
  return (
    <FilterSection title="Price" defaultOpen={defaultOpen}>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onPriceChange('minPrice', e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-[12px] font-sans focus:outline-none focus:border-black"
          />
        </div>
        <span className="text-gray-400 text-[12px]">—</span>
        <div className="flex-1">
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onPriceChange('maxPrice', e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-[12px] font-sans focus:outline-none focus:border-black"
          />
        </div>
      </div>
    </FilterSection>
  );
}
