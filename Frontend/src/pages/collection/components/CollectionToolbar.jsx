import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Grid2Icon, Grid3Icon, Grid4Icon } from './GridIcons';

export default function CollectionToolbar({
  isFilterOpen,
  onToggleFilter,
  totalCount,
  gridCols,
  onChangeGridCols
}) {
  return (
    <div className="flex justify-between items-start md:items-center pb-2 md:pb-4 md:mb-2 md:mt-0">
      <div className="flex flex-col">
        <button
          type="button"
          onClick={onToggleFilter}
          className="flex items-center text-[14px] md:text-[14px] font-bold font-sans uppercase tracking-[0.001em] opacity-90 md:mb-1"
        >
          <span className="hidden md:inline mr-2 uppercase">
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </span>
          <SlidersHorizontal
            className="w-5 h-5 md:w-4 md:h-4 text-black"
            strokeWidth={2}
          />
        </button>
        <span className="text-[16px] md:text-[16px] mt-2 font-bold font-sans text-black">
          {totalCount} results
        </span>
      </div>

      {/* Grid Layout Toggle */}
      <div className="hidden md:flex items-center gap-1">
        <Grid2Icon
          active={gridCols === 2}
          onClick={() => onChangeGridCols(2)}
        />
        <Grid3Icon
          active={gridCols === 3}
          onClick={() => onChangeGridCols(3)}
        />
        <Grid4Icon
          active={gridCols === 4}
          onClick={() => onChangeGridCols(4)}
        />
      </div>
    </div>
  );
}
