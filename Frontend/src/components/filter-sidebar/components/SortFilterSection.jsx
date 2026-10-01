import React from 'react';
import FilterSection from './FilterSection';

export default function SortFilterSection({
  sortOptions = [],
  selectedSort,
  onSortChange,
  isMobile = false,
  defaultOpen = true
}) {
  return (
    <FilterSection title={isMobile ? 'Sorting' : 'Sort'} defaultOpen={defaultOpen}>
      <div className="flex flex-col gap-3">
        {sortOptions.map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-3 cursor-pointer group tracking-[0.1em] ${
              isMobile ? 'gap-4 mb-1' : ''
            }`}
          >
            <span
              className={`${
                isMobile ? 'w-[20px] h-[20px]' : 'w-[16px] h-[16px]'
              } border-[2px] flex items-center justify-center rounded-[4px] transition-colors ${
                selectedSort === option.id
                  ? 'border-black border-[1.5px]'
                  : 'border-gray-400 group-hover:border-black'
              }`}
            >
              {selectedSort === option.id && (
                <span className={`${isMobile ? 'w-[12px] h-[12px]' : 'w-[8px] h-[8px]'} bg-black`} />
              )}
            </span>
            <span
              className="text-[13px] font-sans text-[#000] cursor-pointer"
              onClick={() => onSortChange(option.id)}
            >
              {option.name}
            </span>
          </label>
        ))}
      </div>
    </FilterSection>
  );
}
