import React from 'react';
import SortFilterSection from './SortFilterSection';
import TypeFilterSection from './TypeFilterSection';
import SizeFilterSection from './SizeFilterSection';
import ColorFilterSection from './ColorFilterSection';
import PriceFilterSection from './PriceFilterSection';

export default function DesktopFilterSidebar({
  isOpen,
  filters,
  sortOptions = [],
  filtersToShow = [],
  availableTypes = [],
  availableSizes = [],
  availableColors = [],
  hasActiveFilters,
  onSortChange,
  onToggleFilter,
  onPriceChange,
  onClearFilters
}) {
  return (
    <aside
      className={`
        hidden lg:block sticky top-[10px] self-start flex-shrink-0
        transition-all duration-500 ease-in-out overflow-hidden
        ${isOpen ? 'w-[260px] opacity-100' : 'w-0 opacity-0'}
      `}
    >
      {/* Single scrollable container for desktop */}
      <div className="overflow-y-auto max-h-[calc(100vh-30px)] pr-1 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
        {/* Sort */}
        <SortFilterSection
          sortOptions={sortOptions}
          selectedSort={filters.sort}
          onSortChange={onSortChange}
          isMobile={false}
          defaultOpen={true}
        />

        {/* Type / Category */}
        {filtersToShow.includes('Category') && (
          <TypeFilterSection
            availableTypes={availableTypes}
            selectedTypes={filters.types || []}
            onToggleType={onToggleFilter}
            isMobile={false}
            defaultOpen={true}
          />
        )}

        {/* Size */}
        {filtersToShow.includes('Size') && (
          <SizeFilterSection
            availableSizes={availableSizes}
            selectedSizes={filters.sizes || []}
            onToggleSize={onToggleFilter}
            isMobile={false}
            defaultOpen={false}
          />
        )}

        {/* Color */}
        {filtersToShow.includes('Color') && (
          <ColorFilterSection
            availableColors={availableColors}
            selectedColors={filters.colors || []}
            onToggleColor={onToggleFilter}
            defaultOpen={false}
          />
        )}

        {/* Price */}
        {filtersToShow.includes('Price Range') && (
          <PriceFilterSection
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onPriceChange={onPriceChange}
            defaultOpen={false}
          />
        )}

        {/* Clear All */}
        {hasActiveFilters && (
          <div className="pt-6">
            <button
              type="button"
              onClick={onClearFilters}
              className="text-[12px] font-sans font-bold uppercase underline underline-offset-4 text-black hover:opacity-70 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
