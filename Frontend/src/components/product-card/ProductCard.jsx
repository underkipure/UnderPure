import React, { useState, useEffect, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import ProductCardImage from "./components/ProductCardImage";
import ProductCardDetails from "./components/ProductCardDetails";
import {
  extractProductImages,
  extractBadgeList,
  findColorImages,
  extractUniqueColors,
} from "./utils/productCardHelpers";

const ProductCard = ({
  product,
  addToCart,
  contextBadge,
  cardStyle = "standard",
  hideSwatches = false,
  hideBadges = false,
  imageAspect = "aspect-[3/4.5]",
  pullQuickShopUp = false,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredColorImages, setHoveredColorImages] = useState(null);
  const [activeColorImageIndex, setActiveColorImageIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const colorTimerRef = useRef(null);

  const clearColorTimer = () => {
    if (colorTimerRef.current) {
      clearInterval(colorTimerRef.current);
      colorTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearColorTimer();
  }, []);

  // Mapping DB structure to UI variables
  const title = product.name || product.title;
  const price = product.price || 0;
  const idOrSlug = product.slug || product.id;

  const { displayImage, hoverImage, allImages } = extractProductImages(product);
  const badgeList = extractBadgeList(product, contextBadge, hideBadges);
  const uniqueColors = extractUniqueColors(product);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveSlide(newIndex);
  };

  const handleColorHover = (colorObj) => {
    clearColorTimer();
    const resolvedImgs = findColorImages(product, colorObj.name, colorObj.image);
    if (resolvedImgs && resolvedImgs.length > 0) {
      setHoveredColorImages(resolvedImgs);
      setActiveColorImageIndex(0);
      if (resolvedImgs.length > 1) {
        colorTimerRef.current = setInterval(() => {
          setActiveColorImageIndex((prev) => (prev + 1) % resolvedImgs.length);
        }, 1300);
      }
    }
  };

  const handleColorLeave = () => {
    clearColorTimer();
    setActiveColorImageIndex(0);
  };

  const handleQuickShop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${idOrSlug}`);
  };

  const currentDesktopImage =
    hoveredColorImages && hoveredColorImages.length > 0
      ? activeColorImageIndex > 0
        ? hoveredColorImages[activeColorImageIndex % hoveredColorImages.length]
        : isHovered && hoveredColorImages.length > 1
          ? hoveredColorImages[1]
          : hoveredColorImages[0]
      : isHovered && allImages.length > 1
        ? hoverImage
        : displayImage;

  return (
    <div
      className="group flex flex-col cursor-pointer h-full bg-white relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        clearColorTimer();
        setHoveredColorImages(null);
        setActiveColorImageIndex(0);
      }}
    >
      <ProductCardImage
        cardStyle={cardStyle}
        imageAspect={imageAspect}
        idOrSlug={idOrSlug}
        title={title}
        currentDesktopImage={currentDesktopImage}
        allImages={allImages}
        activeSlide={activeSlide}
        handleScroll={handleScroll}
        badgeList={badgeList}
      />

      <ProductCardDetails
        cardStyle={cardStyle}
        idOrSlug={idOrSlug}
        title={title}
        price={price}
        originalPrice={product.originalPrice}
        uniqueColors={uniqueColors}
        extraColorsText={product.extraColorsText}
        hideSwatches={hideSwatches}
        pullQuickShopUp={pullQuickShopUp}
        onColorHover={handleColorHover}
        onColorLeave={handleColorLeave}
        onQuickShop={handleQuickShop}
      />
    </div>
  );
};

export default memo(ProductCard);
