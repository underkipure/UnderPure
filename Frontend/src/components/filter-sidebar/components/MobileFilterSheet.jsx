import React from 'react';
import SortFilterSection from './SortFilterSection';
import TypeFilterSection from './TypeFilterSection';
import SizeFilterSection from './SizeFilterSection';
import ColorFilterSection from './ColorFilterSection';
import PriceFilterSection from './PriceFilterSection';

export default function MobileFilterSheet({
  isOpen,
  onClose,
  filters,
  sortOptions = [],
  filtersToShow = [],
  availableTypes = [],
  availableSizes = [],
  availableColors = [],
  filteredCount = 0,
  hasActiveFilters,
  onSortChange,
  onToggleFilter,
  onPriceChange,
  onClearFilters
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Bottom Sheet */}
      <aside
        className={`
          fixed bottom-0 left-0 right-0 w-full bg-white z-[65] flex flex-col lg:hidden
          rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)]
          transition-transform duration-300 ease-in-out max-h-[97vh]
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-center py-4 px-5 border-b border-[#ccc] relative flex-shrink-0">
          <span className="text-[15px] font-sans font-bold text-black tracking-[0.001em]">
            Filter & Sort
          </span>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 text-xl text-black-500 font-bold leading-none"
            aria-label="Close filters"
          >
            ×
          </button>
        </div>

        {/* Mobile Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent">
          {/* Sorting */}
          <SortFilterSection
            sortOptions={sortOptions}
            selectedSort={filters.sort}
            onSortChange={onSortChange}
            isMobile={true}
            defaultOpen={false}
          />

          {/* Type */}
          {filtersToShow.includes('Category') && (
            <TypeFilterSection
              availableTypes={availableTypes}
              selectedTypes={filters.types || []}
              onToggleType={onToggleFilter}
              isMobile={true}
              defaultOpen={true}
            />
          )}

          {/* Size */}
          {filtersToShow.includes('Size') && (
            <SizeFilterSection
              availableSizes={availableSizes}
              selectedSizes={filters.sizes || []}
              onToggleSize={onToggleFilter}
              isMobile={true}
              defaultOpen={false}
            />
          )}

          {/* Colors */}
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
        </div>

        {/* Mobile Sticky Footer */}
        <div className="border-t border-gray-200 p-4 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClearFilters}
            className={`flex-1 py-3 text-[13px] font-sans font-bold uppercase rounded-sm transition-colors ${
              hasActiveFilters ? 'bg-[#f5f5f5] text-black' : 'bg-gray-100 text-gray-400'
            }`}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-[2] bg-black text-white py-3 text-[13px] font-sans font-bold uppercase rounded-sm transition-colors hover:bg-black/90"
          >
            See {filteredCount} Items
          </button>
        </div>
      </aside>
    </>
  );
}
