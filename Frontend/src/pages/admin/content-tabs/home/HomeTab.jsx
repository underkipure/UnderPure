import React from 'react';
import GlobalUploadOverlay from './components/GlobalUploadOverlay';
import HomeSectionAccordionItem from './components/HomeSectionAccordionItem';
import { HOME_SECTIONS } from './constants/homeTabSections';
import { useHomeTabState } from './hooks/useHomeTabState';

export default function HomeTab() {
  const {
    products,
    categories,
    globalBadges,
    activeCategories,
    expandedSection,
    setExpandedSection,
    uploadingHero,
    uploadProgress,
    isUploadingGlobal,
    setIsUploadingGlobal,
    setUploadProgress,
    sectionToggles,
    toggleSection,
    heroData,
    setHeroData,
    categoryBanners,
    setCategoryBanners,
    sportBanner,
    setSportBanner,
    featuredBanners,
    setFeaturedBanners,
    pleasureSwimBanners,
    setPleasureSwimBanners,
    shopTheFeed,
    setShopTheFeed,
    pressQuotes,
    setPressQuotes,
    brandDescription,
    setBrandDescription,
    carousels,
    setCarousels,
    uploadFileToServer,
    handleHeroMediaUpload,
    saveSectionData,
    saveHeroData,
  } = useHomeTabState();

  const editorProps = {
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
  };

  return (
    <div className="space-y-0 relative">
      {/* Global Progress Overlay */}
      <GlobalUploadOverlay
        isUploading={isUploadingGlobal}
        uploadProgress={uploadProgress}
      />

      {HOME_SECTIONS.map((section) => (
        <HomeSectionAccordionItem
          key={section.key}
          section={section}
          isExpanded={expandedSection === section.key}
          onToggleExpand={() =>
            setExpandedSection(
              expandedSection === section.key ? null : section.key
            )
          }
          isVisible={sectionToggles[section.key] !== false}
          onToggleVisibility={toggleSection}
          editorProps={editorProps}
        />
      ))}
    </div>
  );
}
