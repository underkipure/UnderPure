import React from "react";
import { useParams } from "react-router-dom";
import ProductReviews from "../../components/ProductReviews";
import { useSiteSettingsStore } from "../../store/siteSettingsStore";
import SEO from "../../components/SEO";
import ReturnRequestModal from "../../components/ReturnRequestModal";

// Sub-components
import ProductSocialShare from "./components/SocialIcons";
import ProductGallerySliderModal from "./components/ProductGallerySliderModal";
import ProductImageGallery from "./components/ProductImageGallery";
import ProductVariantSelector from "./components/ProductVariantSelector";
import ProductInfoAccordion from "./components/ProductInfoAccordion";
import ProductSizeGuideModal from "./components/ProductSizeGuideModal";
import ProductRecommendations from "./components/ProductRecommendations";
import ProductBreadcrumbs from "./components/ProductBreadcrumbs";
import ProductDescriptionSection from "./components/ProductDescriptionSection";
import ProductCompleteTheLookSection from "./components/ProductCompleteTheLookSection";

// Custom Hook & Helpers
import { useProductDetailState } from "./hooks/useProductDetailState";
import {
  extractUniqueColors,
  normalizeInventory,
  extractAllSizes,
  calculateTotalProductStock,
  getVariantStockCount,
  resolveProductGallery,
  calculateAddToCartState,
  buildProductAccordions,
  buildActivePerks,
} from "./utils/productDetailHelpers";

export default function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const productDetailSettings = useSiteSettingsStore((s) => s.productDetailSettings);
  const footerData = useSiteSettingsStore((s) => s.footerData);
  const globalSocials = useSiteSettingsStore((s) => s.socialLinks);

  const {
    product,
    loading,
    error,
    selectedColorIndex,
    setSelectedColorIndex,
    selectedSize,
    setSelectedSize,
    expandedAccordion,
    setExpandedAccordion,
    relatedProducts,
    completeTheLookProducts,
    isInWishlist,
    isWishlistLoading,
    toggleWishlist,
    isSizeGuideOpen,
    setIsSizeGuideOpen,
    sliderIndex,
    setSliderIndex,
    isZoomedIn,
    setIsZoomedIn,
    recSlideIndex,
    setRecSlideIndex,
    isReturnModalOpen,
    setIsReturnModalOpen,
    galleryScrollRef,
    recSliderRef,
    galleryLengthRef,
    scrollGallery,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = useProductDetailState(id, productDetailSettings);

  if (loading) {
    return (
      <div className="pt-32 text-center text-sm tracking-widest uppercase">
        Loading Product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 text-center text-sm tracking-widest uppercase text-red-500">
        {error || "Product not found"}
      </div>
    );
  }

  const pageName = product.name || product.title || "Product";
  const title = product.name || product.title;
  const price = product.price || 0;
  const seoDescription = product.description || product.longDescription || "";
  const seoImage = product.image || (product.images && product.images[0]) || "";

  // Data helpers
  const uniqueColors = extractUniqueColors(product);
  const inventory = normalizeInventory(product);
  const allSizesArr = extractAllSizes(product, inventory);
  const totalProductStock = calculateTotalProductStock(inventory, product);
  const isProductOutOfStock =
    totalProductStock <= 0 || product.inStock === false || product.stock === 0;

  const getStockCount = (colorName, sizeName) =>
    getVariantStockCount(inventory, product, colorName, sizeName);

  const selectedColorObj =
    selectedColorIndex !== null
      ? uniqueColors[selectedColorIndex]
      : uniqueColors.length === 1
        ? uniqueColors[0]
        : null;
  const selectedColorName = selectedColorObj ? selectedColorObj.name || "" : "";
  const isColorRequired = uniqueColors.length > 1;

  // Compute button state
  const { canAddToCart, buttonText: addToCartButtonText } =
    calculateAddToCartState({
      isProductOutOfStock,
      selectedColorIndex,
      selectedSize,
      selectedColorName,
      uniqueColors,
      isColorRequired,
      getStockCount,
      productDetailSettings,
    });

  // Resolve gallery images
  const gallery = resolveProductGallery(
    product,
    selectedColorName,
    selectedColorObj,
    inventory
  );
  galleryLengthRef.current = gallery.length;

  const accordions = buildProductAccordions(product, productDetailSettings);
  const activePerks = buildActivePerks(productDetailSettings);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: product.id,
      name: title,
      price: price,
      image: gallery[0],
      size: selectedSize || "Default",
      color: selectedColorObj ? selectedColorObj.name : "Default",
    });
  };

  return (
    <div className="pt-4 pb-8 md:pt-9 md:pb-16 min-h-screen bg-white">
      <SEO
        title={pageName}
        description={seoDescription}
        image={seoImage}
        type="product"
        schema={{
          "@context": "https://schema.org/",
          "@type": "Product",
          name: title || pageName || "Product",
          image: seoImage
            ? [seoImage]
            : gallery && gallery.length > 0
              ? gallery
              : [],
          description:
            seoDescription || "Luxury intimate wear and lingerie by Underpure.",
          sku: product?.sku || product?.id || "",
          offers: {
            "@type": "Offer",
            url: typeof window !== "undefined" ? window.location.href : "",
            priceCurrency: "PKR",
            price: price || product?.price || 0,
            availability:
              product?.stock !== 0 && product?.inStock !== false
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        }}
      />

      {/* Fullscreen Slider / Zoom Modal */}
      <ProductGallerySliderModal
        sliderIndex={sliderIndex}
        setSliderIndex={setSliderIndex}
        gallery={gallery}
        title={title}
        selectedColorName={selectedColorName}
        isZoomedIn={isZoomedIn}
        setIsZoomedIn={setIsZoomedIn}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => onTouchEnd(gallery.length)}
      />

      {/* Top Split Section */}
      <div className="max-w-[1285px] mx-auto px-3 md:px-6">
        {/* Breadcrumbs */}
        <ProductBreadcrumbs category={product.category} title={title} />

        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-9">
          {/* Left: Image Gallery */}
          <ProductImageGallery
            gallery={gallery}
            title={title}
            productDetailSettings={productDetailSettings}
            galleryScrollRef={galleryScrollRef}
            scrollGallery={scrollGallery}
            setSliderIndex={setSliderIndex}
            isInWishlist={isInWishlist}
            isWishlistLoading={isWishlistLoading}
            toggleWishlist={toggleWishlist}
          />

          {/* Right: Product Info & Purchase Controls */}
          <div className="w-full md:w-[42%] flex flex-col pt-0 px-1 md:px-0 text-left">
            <ProductVariantSelector
              product={product}
              title={title}
              price={price}
              uniqueColors={uniqueColors}
              selectedColorIndex={selectedColorIndex}
              selectedColorObj={selectedColorObj}
              selectedColorName={selectedColorName}
              handleColorClick={setSelectedColorIndex}
              allSizesArr={allSizesArr}
              selectedSize={selectedSize}
              handleSizeClick={setSelectedSize}
              getStockCount={getStockCount}
              canAddToCart={canAddToCart}
              addToCartButtonText={addToCartButtonText}
              handleAddToCart={handleAddToCart}
              isInWishlist={isInWishlist}
              isWishlistLoading={isWishlistLoading}
              toggleWishlist={toggleWishlist}
              setIsSizeGuideOpen={setIsSizeGuideOpen}
              productDetailSettings={productDetailSettings}
            />

            {/* Description & Features */}
            <ProductDescriptionSection
              description={product.description}
              longDescription={product.longDescription}
              activePerks={activePerks}
              setIsReturnModalOpen={setIsReturnModalOpen}
            />

            {/* Accordions */}
            <ProductInfoAccordion
              accordions={accordions}
              expandedAccordion={expandedAccordion}
              setExpandedAccordion={setExpandedAccordion}
            />

            {/* Social Share Icons */}
            <ProductSocialShare
              productDetailSettings={productDetailSettings}
              footerData={footerData}
              globalSocials={globalSocials}
            />

            {/* Complete the Look (Same Category Products) */}
            <ProductCompleteTheLookSection
              product={product}
              completeTheLookProducts={completeTheLookProducts}
              addToCart={addToCart}
            />
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <ProductRecommendations
        relatedProducts={relatedProducts}
        productDetailSettings={productDetailSettings}
        recSliderRef={recSliderRef}
        recSlideIndex={recSlideIndex}
        setRecSlideIndex={setRecSlideIndex}
      />

      {/* Reviews Section */}
      <ProductReviews product={product} />

      {/* Size Guide Modal */}
      <ProductSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productDetailSettings={productDetailSettings}
      />

      {/* Return Request Modal */}
      <ReturnRequestModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        modalType="return"
      />
    </div>
  );
}
