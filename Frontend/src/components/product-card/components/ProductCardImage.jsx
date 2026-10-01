import React from "react";
import { Link } from "react-router-dom";
import ProductCardBadges from "./ProductCardBadges";

export default function ProductCardImage({
  cardStyle,
  imageAspect,
  idOrSlug,
  title,
  currentDesktopImage,
  allImages,
  activeSlide,
  handleScroll,
  badgeList,
}) {
  return (
    <div
      className={`relative block group/image ${
        cardStyle === "carousel"
          ? "aspect-[3/4.2] md:aspect-[3/4.5] bg-[#f5f5f5] w-full"
          : `${imageAspect} bg-[#f5f5f5]`
      }`}
    >
      {/* Desktop View (Hover) */}
      <Link
        to={`/product/${idOrSlug}`}
        className="absolute inset-0 overflow-hidden hidden md:block"
      >
        <img
          loading="lazy"
          decoding="async"
          src={currentDesktopImage}
          alt={title}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover/image:scale-[1.03]"
        />
      </Link>

      {/* Mobile View (Swipeable Slider) */}
      <div
        className="absolute inset-0 overflow-x-auto snap-x snap-mandatory flex md:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onScroll={handleScroll}
      >
        {allImages.map((imgUrl, idx) => (
          <Link
            to={`/product/${idOrSlug}`}
            key={idx}
            className="w-full h-full flex-shrink-0 snap-center"
          >
            <img
              loading="lazy"
              decoding="async"
              src={imgUrl}
              alt={`${title} - ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </Link>
        ))}
      </div>

      {/* Dots (Mobile only indicator) */}
      {allImages.length > 1 && (
        <div className="absolute top-3 left-3 flex gap-1 z-10 md:hidden pointer-events-none">
          {allImages.map((_, idx) => (
            <div
              key={idx}
              className={`w-[4px] h-[4px] rounded-full transition-colors duration-300 ${
                idx === activeSlide ? "bg-white" : "bg-white/40"
              }`}
            ></div>
          ))}
        </div>
      )}

      {/* Badges */}
      <ProductCardBadges badgeList={badgeList} cardStyle={cardStyle} />
    </div>
  );
}
