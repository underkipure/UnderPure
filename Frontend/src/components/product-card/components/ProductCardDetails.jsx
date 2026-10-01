import React from "react";
import { Link } from "react-router-dom";
import ProductCardSwatches from "./ProductCardSwatches";

export default function ProductCardDetails({
  cardStyle,
  idOrSlug,
  title,
  price,
  originalPrice,
  uniqueColors,
  extraColorsText,
  hideSwatches,
  pullQuickShopUp,
  onColorHover,
  onColorLeave,
  onQuickShop,
}) {
  return (
    <div
      className={`flex flex-col items-center text-center flex-grow bg-white ${
        cardStyle === "carousel"
          ? "pt-[3vw] md:pt-[1.2vw] pb-[1vw] md:pb-[0.5vw] px-[1vw] md:px-[0.5vw]"
          : "px-[2vw] md:px-[0.8vw] pt-[3vw] md:pt-[1.5vw] pb-[3vw] md:pb-[1vw]"
      }`}
    >
      <Link
        to={`/product/${idOrSlug}`}
        className="hover:opacity-70 transition-opacity flex flex-col items-center no-underline"
      >
        {/* Title */}
        {cardStyle === "editorial" ? (
          <h3
            className="text-[3.5vw] md:text-[1vw] font-dala-italic lowercase text-black mb-[1vw] md:mb-[0.3vw]"
          >
            {title}
          </h3>
        ) : (
          <h3
            className={`font-sans font-bold text-black ${
              cardStyle === "carousel"
                ? "text-[3.3vw] md:text-[0.9vw]"
                : "text-[3vw] md:text-[0.8vw] tracking-[0.001em]"
            }`}
          >
            {title}
          </h3>
        )}

        {/* Price */}
        <div
          className={`flex justify-center items-center gap-[1vw] md:gap-[0.6vw] font-sans text-black ${
            cardStyle === "carousel"
              ? "text-[3.3vw] md:text-[0.9vw] font-bold mb-[1vw] md:mb-[0.5vw]"
              : "text-[3vw] md:text-[0.8vw] font-bold mb-[1vw] md:mb-[0.5vw]"
          }`}
        >
          {originalPrice && Number(originalPrice) > Number(price) ? (
            <>
              <span className="text-gray-400 line-through">
                Rs {Number(originalPrice).toLocaleString()}
              </span>
              <span className="text-red-black tracking-[0.001em]">
                Rs {Number(price).toLocaleString()}
              </span>
            </>
          ) : (
            <span>Rs {Number(price).toLocaleString()}</span>
          )}
        </div>
      </Link>

      {/* Swatches */}
      {cardStyle !== "carousel" && !hideSwatches && (
        <ProductCardSwatches
          uniqueColors={uniqueColors}
          extraColorsText={extraColorsText}
          onColorHover={onColorHover}
          onColorLeave={onColorLeave}
        />
      )}

      {/* Quick Shop */}
      {cardStyle !== "carousel" && (
        <div className={`${pullQuickShopUp ? "mt-0" : "mt-0"} hidden md:block`}>
          <button
            onClick={onQuickShop}
            className="text-[3vw] md:text-[0.8vw] font-sans font-bold uppercase tracking-[0.001em] text-black underline underline-offset-2 hover:opacity-70"
          >
            QUICK SHOP
          </button>
        </div>
      )}
    </div>
  );
}
