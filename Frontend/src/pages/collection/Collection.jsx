import React from 'react';
import { useSiteSettingsStore } from '../../store/siteSettingsStore';
import SEO from '../../components/SEO';
import FilterSidebar from '../../components/FilterSidebar';

import CollectionBanner from './components/CollectionBanner';
import CollectionCategorySlider from './components/CollectionCategorySlider';
import CollectionToolbar from './components/CollectionToolbar';
import CollectionProductGrid from './components/CollectionProductGrid';
import { useCollectionProducts, useCollectionLayout } from './hooks';

export default function Collection({ addToCart }) {
  const collectionSettings = useSiteSettingsStore((s) => s.collectionSettings);

  const {
    categoryId,
    searchQuery,
    badgeQuery,
    products,
    loading,
    totalCount,
    hasMore,
    isLoadingMore,
    activeFilters,
    setActiveFilters,
    loadMoreFromServer,
    availableSizes,
    availableColors,
    availableTypes,
    filteredProducts,
  } = useCollectionProducts(collectionSettings);

  const {
    gridCols,
    setGridCols,
    isFilterOpen,
    setIsFilterOpen,
    currentCategory,
    subCategories,
    pageTitle,
    seoTitle,
    seoDescription,
    seoImage,
    gridClass,
    bannerConfig,
    showBanner,
    hasBackground,
  } = useCollectionLayout(collectionSettings, categoryId, searchQuery, badgeQuery);

  return (
    <div className="pt-6 pb-16 min-h-screen">
      <SEO title={seoTitle} description={seoDescription} image={seoImage} />

      {/* Category Banner if enabled */}
      <CollectionBanner
        showBanner={showBanner}
        hasBackground={hasBackground}
        bannerConfig={bannerConfig}
        currentCategory={currentCategory}
        title={pageTitle}
      />

      {/* Category Slider */}
      <CollectionCategorySlider
        subCategories={subCategories}
        categoryId={categoryId}
      />

      {/* Main Content Layout with Sidebar */}
      <div
        className={`max-w-[1350px] mx-auto px-4 md:px-10 flex gap-8 relative items-start transition-all duration-500 ease-in-out ${
          isFilterOpen ? 'lg:gap-14' : 'lg:gap-0'
        }`}
      >
        {/* Sidebar Filter */}
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={activeFilters}
          setFilters={setActiveFilters}
          availableSizes={availableSizes}
          availableColors={availableColors}
          availableTypes={availableTypes}
          filteredCount={filteredProducts.length}
          collectionSettings={collectionSettings}
        />

        {/* Products Section */}
        <div className="flex-1 w-full min-w-0">
          {/* Filters Toolbar */}
          <CollectionToolbar
            isFilterOpen={isFilterOpen}
            onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
            totalCount={totalCount}
            gridCols={gridCols}
            onChangeGridCols={setGridCols}
          />

          {/* Product Grid & Load More */}
          <CollectionProductGrid
            loading={loading}
            products={products}
            gridClass={gridClass}
            emptyMessage={collectionSettings?.emptyMessage}
            addToCart={addToCart}
            contextBadge={currentCategory ? currentCategory.name : pageTitle}
            productsPerPage={collectionSettings?.productsPerPage || 8}
            totalCount={totalCount}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMoreFromServer}
          />
        </div>
      </div>
    </div>
  );
}
