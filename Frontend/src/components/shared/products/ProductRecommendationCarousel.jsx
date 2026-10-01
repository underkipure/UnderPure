import React, { useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../../ProductCard";

/**
 * Reusable ProductRecommendationCarousel component for Product Detail, Cart, and Lovelist.
 *
 * @param {Object} props
 * @param {string} [props.title="Selected For You"] - Section heading
 * @param {Array} props.products - Product items array
 * @param {'cards'|'simple'} [props.variant='cards'] - Render full ProductCard or streamlined link cards
 * @param {boolean} [props.showQuickShop=true] - Display Quick Shop button for simple cards
 * @param {string} [props.quickShopText="QUICK SHOP"] - Quick shop button text
 * @param {string} [props.fontFamily] - Custom font styling for heading
 * @param {string} [props.className] - Outer wrapper classes
 */
export function ProductRecommendationCarousel({
  title = "Selected For You",
  products = [],
  variant = "cards",
  showQuickShop = true,
  quickShopText = "QUICK SHOP",
  fontFamily,
  className = "",
}) {
  const sliderRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);

  if (!products || products.length === 0) return null;

  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const width = sliderRef.current.clientWidth;
      const newIndex = Math.round(scrollLeft / width);
      setSlideIndex(newIndex);
    }
  };

  const handleNextSlide = () => {
    if (sliderRef.current) {
      const width = sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({ left: width, behavior: "smooth" });
    }
  };

  const handleGoToDot = (dotIdx) => {
    if (sliderRef.current) {
      const width = sliderRef.current.clientWidth;
      sliderRef.current.scrollTo({ left: dotIdx * width, behavior: "smooth" });
    }
  };

  return (
    <div className={`w-full py-6 md:py-8 ${className}`}>
      {title && (
        <h2
          className="text-[24px] md:text-[34px] font-serif text-center mb-6 tracking-wide text-black"
          style={fontFamily ? { fontFamily } : undefined}
        >
          {title}
        </h2>
      )}

      {/* Mobile: Horizontal snap-scroll with arrow & dots */}
      <div className="md:hidden relative">
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4"
        >
          {products.map((item) => (
            <div
              key={item.id}
              className="w-[calc(50%-6px)] shrink-0 snap-start"
            >
              {variant === "cards" ? (
                <ProductCard
                  product={item}
                  hideSwatches={true}
                  hideBadges={true}
                  imageAspect="aspect-[3/4]"
                  pullQuickShopUp={true}
                  cardStyle="standard"
                />
              ) : (
                <div className="flex flex-col items-center text-center">
                  <Link
                    to={`/product/${item.slug || item.id}`}
                    className="w-full aspect-[3/4] bg-gray-100 mb-3 overflow-hidden block"
                  >
                    <img
                      loading="lazy"
                      src={
                        item.image ||
                        (Array.isArray(item.images) && item.images.length > 0
                          ? item.images[0]?.image_url || item.images[0]
                          : "")
                      }
                      alt={item.name || item.title}
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <Link
                    to={`/product/${item.slug || item.id}`}
                    className="text-[13px] font-sans font-bold text-black hover:opacity-70 truncate max-w-full"
                  >
                    {item.name || item.title}
                  </Link>
                  <p className="text-[12px] font-bold font-sans text-black mt-1">
                    {typeof item.price === "number"
                      ? `Rs. ${item.price.toLocaleString()}`
                      : item.price || "Rs. 0"}
                  </p>
                  {showQuickShop && (
                    <Link
                      to={`/product/${item.slug || item.id}`}
                      className="text-[11px] font-bold font-sans uppercase tracking-wide text-black hover:text-gray-600 transition-colors mt-2"
                    >
                      {quickShopText}
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Arrow on mobile if more than 2 items */}
        {products.length > 2 && (
          <button
            type="button"
            onClick={handleNextSlide}
            className="absolute right-1 top-[35%] -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-600 z-10 bg-white/80 rounded-full shadow-xs cursor-pointer"
            aria-label="Next recommendation"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
          </button>
        )}

        {/* Dots on mobile */}
        {products.length > 2 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: Math.ceil(products.length / 2) }).map(
              (_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => handleGoToDot(dotIdx)}
                  className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                    slideIndex === dotIdx ? "bg-black" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Desktop: 4-Column Responsive Grid */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-8 lg:gap-10 px-4 sm:px-10 lg:px-14">
        {products.map((item) => (
          <div key={item.id}>
            {variant === "cards" ? (
              <ProductCard
                product={item}
                hideSwatches={true}
                hideBadges={true}
                imageAspect="aspect-[3/4]"
                pullQuickShopUp={true}
                cardStyle="standard"
              />
            ) : (
              <div className="flex flex-col items-center text-center">
                <Link
                  to={`/product/${item.slug || item.id}`}
                  className="w-full aspect-[3/4] bg-gray-100 mb-3 overflow-hidden block"
                >
                  <img
                    loading="lazy"
                    src={
                      item.image ||
                      (Array.isArray(item.images) && item.images.length > 0
                        ? item.images[0]?.image_url || item.images[0]
                        : "")
                    }
                    alt={item.name || item.title}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <Link
                  to={`/product/${item.slug || item.id}`}
                  className="text-[14px] md:text-[15px] font-sans font-bold text-black hover:opacity-70 line-clamp-1"
                >
                  {item.name || item.title}
                </Link>
                <p className="text-[13px] md:text-[14px] font-bold font-sans text-black mt-1">
                  {typeof item.price === "number"
                    ? `Rs. ${item.price.toLocaleString()}`
                    : item.price || "Rs. 0"}
                </p>
                {showQuickShop && (
                  <Link
                    to={`/product/${item.slug || item.id}`}
                    className="text-[12px] md:text-[13px] font-bold font-sans uppercase tracking-wide text-black hover:text-gray-600 transition-colors mt-2 inline-block"
                  >
                    {quickShopText}
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
