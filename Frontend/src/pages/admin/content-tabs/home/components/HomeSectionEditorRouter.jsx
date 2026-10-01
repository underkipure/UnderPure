import React from 'react';
import HeroSectionEditor from './HeroSectionEditor';
import SportBannerEditor from './SportBannerEditor';
import CategoryBannersEditor from './CategoryBannersEditor';
import ProductCarouselEditor from './ProductCarouselEditor';
import ShopTheFeedEditor from './ShopTheFeedEditor';
import PressQuotesEditor from './PressQuotesEditor';
import BrandDescriptionEditor from './BrandDescriptionEditor';

export default function HomeSectionEditorRouter({
  sectionKey,
  heroData,
  setHeroData,
  uploadingHero,
  uploadProgress,
  handleHeroMediaUpload,
  saveHeroData,
  sportBanner,
  setSportBanner,
  categories,
  isUploadingGlobal,
  uploadFileToServer,
  setIsUploadingGlobal,
  setUploadProgress,
  saveSectionData,
  carousels,
  setCarousels,
  activeCategories,
  globalBadges,
  shopTheFeed,
  setShopTheFeed,
  products,
  categoryBanners,
  setCategoryBanners,
  featuredBanners,
  setFeaturedBanners,
  pleasureSwimBanners,
  setPleasureSwimBanners,
  pressQuotes,
  setPressQuotes,
  brandDescription,
  setBrandDescription,
}) {
  switch (sectionKey) {
    case 'hero':
      return (
        <HeroSectionEditor
          heroData={heroData}
          setHeroData={setHeroData}
          uploadingHero={uploadingHero}
          uploadProgress={uploadProgress}
          handleHeroMediaUpload={handleHeroMediaUpload}
          saveHeroData={saveHeroData}
        />
      );
    case 'sportBanner':
      return (
        <SportBannerEditor
          sportBanner={sportBanner}
          setSportBanner={setSportBanner}
          categories={categories}
          isUploadingGlobal={isUploadingGlobal}
          uploadProgress={uploadProgress}
          uploadFileToServer={uploadFileToServer}
          setIsUploadingGlobal={setIsUploadingGlobal}
          setUploadProgress={setUploadProgress}
          onSave={saveSectionData}
        />
      );
    case 'newArrivals':
    case 'bestSellers':
      return (
        <ProductCarouselEditor
          carouselKey={sectionKey}
          carousels={carousels}
          setCarousels={setCarousels}
          activeCategories={activeCategories}
          globalBadges={globalBadges}
          onSave={saveSectionData}
        />
      );
    case 'shopTheFeed':
      return (
        <ShopTheFeedEditor
          shopTheFeed={shopTheFeed}
          setShopTheFeed={setShopTheFeed}
          products={products}
          isUploadingGlobal={isUploadingGlobal}
          uploadProgress={uploadProgress}
          uploadFileToServer={uploadFileToServer}
          setIsUploadingGlobal={setIsUploadingGlobal}
          setUploadProgress={setUploadProgress}
          onSave={saveSectionData}
        />
      );
    case 'categoryBanners':
      return (
        <CategoryBannersEditor
          banners={categoryBanners}
          setBannersState={setCategoryBanners}
          title="Category Banners"
          settingsKey="categoryBanners"
          categories={categories}
          isUploadingGlobal={isUploadingGlobal}
          uploadProgress={uploadProgress}
          uploadFileToServer={uploadFileToServer}
          setIsUploadingGlobal={setIsUploadingGlobal}
          setUploadProgress={setUploadProgress}
          onSave={saveSectionData}
        />
      );
    case 'featuredBanners':
      return (
        <CategoryBannersEditor
          banners={featuredBanners}
          setBannersState={setFeaturedBanners}
          title="Featured Banners"
          settingsKey="featuredBanners"
          categories={categories}
          isUploadingGlobal={isUploadingGlobal}
          uploadProgress={uploadProgress}
          uploadFileToServer={uploadFileToServer}
          setIsUploadingGlobal={setIsUploadingGlobal}
          setUploadProgress={setUploadProgress}
          onSave={saveSectionData}
        />
      );
    case 'pleasureSwimBanners':
      return (
        <CategoryBannersEditor
          banners={pleasureSwimBanners}
          setBannersState={setPleasureSwimBanners}
          title="Pleasure & Swim Banners"
          settingsKey="pleasureSwimBanners"
          categories={categories}
          isUploadingGlobal={isUploadingGlobal}
          uploadProgress={uploadProgress}
          uploadFileToServer={uploadFileToServer}
          setIsUploadingGlobal={setIsUploadingGlobal}
          setUploadProgress={setUploadProgress}
          onSave={saveSectionData}
        />
      );
    case 'pressQuotes':
      return (
        <PressQuotesEditor
          pressQuotes={pressQuotes}
          setPressQuotes={setPressQuotes}
          onSave={saveSectionData}
        />
      );
    case 'brandDescription':
      return (
        <BrandDescriptionEditor
          brandDescription={brandDescription}
          setBrandDescription={setBrandDescription}
          onSave={saveSectionData}
        />
      );
    default:
      return null;
  }
}
