import React from 'react';
import DesktopFilterSidebar from './components/DesktopFilterSidebar';
import MobileFilterSheet from './components/MobileFilterSheet';

export default function FilterSidebar({
  filters,
  setFilters,
  availableSizes = [],
  availableColors = [],
  availableTypes = [],
  filteredCount = 0,
  isOpen = false,
  onClose,
  collectionSettings
}) {
  const filtersToShow = collectionSettings?.filtersToShow || ['Size', 'Color', 'Price Range', 'Category'];
  const sortOptions = collectionSettings?.sortOptions || [
    { id: 'newest', name: 'New Arrivals' },
    { id: 'trending', name: 'Trending' },
    { id: 'basics', name: 'Basics (A · Z)' },
    { id: 'price-asc', name: 'Price: Low to High' },
    { id: 'price-desc', name: 'Price: High to Low' },
  ];

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleSortChange = (value) => {
    setFilters((prev) => ({ ...prev, sort: value }));
  };

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const handlePriceChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      sort: collectionSettings?.defaultSort || 'newest',
      sizes: [],
      colors: [],
      types: [],
      minPrice: '',
      maxPrice: '',
    });
  };

  const hasActiveFilters =
    (filters.sizes && filters.sizes.length > 0) ||
    (filters.colors && filters.colors.length > 0) ||
    (filters.types && filters.types.length > 0) ||
    (filters.minPrice !== '' && filters.minPrice != null) ||
    (filters.maxPrice !== '' && filters.maxPrice != null);

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopFilterSidebar
        isOpen={isOpen}
        filters={filters}
        sortOptions={sortOptions}
        filtersToShow={filtersToShow}
        availableTypes={availableTypes}
        availableSizes={availableSizes}
        availableColors={availableColors}
        hasActiveFilters={hasActiveFilters}
        onSortChange={handleSortChange}
        onToggleFilter={toggleFilter}
        onPriceChange={handlePriceChange}
        onClearFilters={clearFilters}
      />

      {/* Mobile Bottom Sheet */}
      <MobileFilterSheet
        isOpen={isOpen}
        onClose={onClose}
        filters={filters}
        sortOptions={sortOptions}
        filtersToShow={filtersToShow}
        availableTypes={availableTypes}
        availableSizes={availableSizes}
        availableColors={availableColors}
        filteredCount={filteredCount}
        hasActiveFilters={hasActiveFilters}
        onSortChange={handleSortChange}
        onToggleFilter={toggleFilter}
        onPriceChange={handlePriceChange}
        onClearFilters={clearFilters}
      />
    </>
  );
}
