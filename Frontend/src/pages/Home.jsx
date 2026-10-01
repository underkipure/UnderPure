import React, { lazy, Suspense } from 'react';
import HeroSection from '../components/HeroSection';
import CategoryBanners from '../components/CategoryBanners';
import LazySection from '../components/common/LazySection';
import { useSiteSettingsStore, DEFAULTS } from '../store/siteSettingsStore';

// Code-split below-the-fold sections
const SportBanner = lazy(() => import('../components/SportBanner'));
const FeaturedBanners = lazy(() => import('../components/FeaturedBanners'));
const NewArrivalsCarousel = lazy(() => import('../components/NewArrivalsCarousel'));
const PleasureSwimBanners = lazy(() => import('../components/PleasureSwimBanners'));
const BestSellersCarousel = lazy(() => import('../components/BestSellersCarousel'));
const ShopTheFeed = lazy(() => import('../components/ShopTheFeed'));
const BrandDescription = lazy(() => import('../components/BrandDescription'));

const Home = ({ addToCart }) => {
  const homeSectionToggles = useSiteSettingsStore((s) => s.homeSectionToggles);
  const toggles = homeSectionToggles || DEFAULTS.homeSectionToggles;

  return (
    <div>
      {/* Hero section - Immediate above-the-fold render */}
      {toggles.hero !== false && <HeroSection />}

      {/* Category banners - Immediate critical catalog navigation */}
      {toggles.categoryBanners !== false && <CategoryBanners />}

      {/* Below-the-fold sections - Lazy loaded as user scrolls within 300px */}
      {toggles.sportBanner !== false && (
        <LazySection minHeight="250px">
          <Suspense fallback={<div className="min-h-[250px]" />}>
            <SportBanner />
          </Suspense>
        </LazySection>
      )}

      {toggles.featuredBanners !== false && (
        <LazySection minHeight="400px">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <FeaturedBanners />
          </Suspense>
        </LazySection>
      )}

      {toggles.newArrivals !== false && (
        <LazySection minHeight="450px">
          <Suspense fallback={<div className="min-h-[450px]" />}>
            <NewArrivalsCarousel />
          </Suspense>
        </LazySection>
      )}

      {toggles.pleasureSwimBanners !== false && (
        <LazySection minHeight="350px">
          <Suspense fallback={<div className="min-h-[350px]" />}>
            <PleasureSwimBanners />
          </Suspense>
        </LazySection>
      )}

      {toggles.bestSellers !== false && (
        <LazySection minHeight="450px">
          <Suspense fallback={<div className="min-h-[450px]" />}>
            <BestSellersCarousel />
          </Suspense>
        </LazySection>
      )}

      {toggles.shopTheFeed !== false && (
        <LazySection minHeight="300px">
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <ShopTheFeed />
          </Suspense>
        </LazySection>
      )}

      {toggles.brandDescription !== false && (
        <LazySection minHeight="200px">
          <Suspense fallback={<div className="min-h-[200px]" />}>
            <BrandDescription />
          </Suspense>
        </LazySection>
      )}
    </div>
  );
};

export default Home;
