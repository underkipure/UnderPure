import { useState } from 'react';
import { useCategoryStore } from '../../../store/categoryStore';
import { getCollectionTitle } from '../utils/collectionHelpers';

export function useCollectionLayout(collectionSettings, categoryId, searchQuery, badgeQuery) {
  // Use default layout from settings to initialize gridCols
  const defaultCols =
    collectionSettings?.defaultLayout === 'grid-2'
      ? 2
      : collectionSettings?.defaultLayout === 'grid-4'
        ? 4
        : 3;
  const [gridCols, setGridCols] = useState(defaultCols);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { categories, getBySlug } = useCategoryStore();
  const currentCategory = getBySlug(categoryId);

  // Show subcategories or siblings if current category is already a subcategory
  const parentIdForSlider = currentCategory?.parentId || currentCategory?.id;
  const subCategories = parentIdForSlider
    ? categories.filter((c) => c.parentId === parentIdForSlider)
    : [];

  const pageTitle = getCollectionTitle(
    categoryId,
    searchQuery,
    currentCategory,
    badgeQuery
  );

  // SEO variables
  const seoTitle =
    currentCategory?.tabTitle ||
    pageTitle.replace(/\b\w/g, (l) => l.toUpperCase());
  const seoDescription =
    currentCategory?.description ||
    collectionSettings?.bannerConfig?.description ||
    '';
  const seoImage =
    currentCategory?.image || collectionSettings?.bannerConfig?.image || '';

  const gridClass =
    gridCols === 2
      ? 'grid-cols-2 gap-4 md:gap-4'
      : gridCols === 3
        ? 'grid-cols-2 md:grid-cols-3 gap-4 md:gap-4 px-2'
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-3 px-1';

  // Collection Banner config
  const bannerConfig = collectionSettings?.bannerConfig || {};
  const showBanner =
    categoryId !== 'search' &&
    bannerConfig.height &&
    bannerConfig.height !== 'hidden';
  const hasBackground =
    currentCategory?.showImage !== false &&
    (currentCategory?.image || bannerConfig.image);

  return {
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
  };
}
