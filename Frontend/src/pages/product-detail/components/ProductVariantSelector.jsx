import React from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { StarRatingDisplay } from "../../../components/ui/StarRating";
import {
  ColorSwatchSelector,
  VariantSizeSelector,
} from "../../../components/shared/products";

export default function ProductVariantSelector({
  product,
  title,
  price,
  uniqueColors,
  selectedColorIndex,
  selectedColorObj,
  selectedColorName,
  handleColorClick,
  allSizesArr,
  selectedSize,
  handleSizeClick,
  getStockCount,
  canAddToCart,
  addToCartButtonText,
  handleAddToCart,
  isInWishlist,
  isWishlistLoading,
  toggleWishlist,
  setIsSizeGuideOpen,
  productDetailSettings,
}) {
  return (
    <>
      {/* Product Badge */}
      {product?.badge && product.badge.split(",").length > 0 && (
        <div className="mb-1 text-left">
          <span className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-gray-700">
            {product.badge.split(",")[0].trim()}
          </span>
        </div>
      )}

      {/* Title & Heart (Desktop) */}
      <div className="flex justify-between items-start mb-2 text-left">
        <h1 className="text-[20px] md:text-[24px] font-serif text-black font-normal leading-snug">
          {title}
        </h1>
        <button
          disabled={isWishlistLoading}
          onClick={toggleWishlist}
          className={`hidden md:block p-1 transition-opacity ${
            isWishlistLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-60"
          } ${isInWishlist ? "text-red-500" : "text-black"}`}
          aria-label="Wishlist"
        >
          <Heart
            className={`w-5 h-5 stroke-[1.5] ${isInWishlist ? "fill-current" : ""}`}
          />
        </button>
      </div>

      {/* Reviews */}
      <div className="flex items-center gap-2 mb-3 text-left">
        <StarRatingDisplay rating={5} size={13} maxRating={5} />
        <span className="text-[11px] font-bold font-sans underline cursor-pointer">
          {product.reviewsCount || 0} Reviews
        </span>
      </div>

      {/* Price */}
      <div className="text-[18px] font-bold font-sans text-black mb-5 text-left flex items-center gap-3">
        {product.originalPrice &&
        Number(product.originalPrice) > Number(price) ? (
          <>
            <span className="text-gray-400 line-through">
              Rs. {Number(product.originalPrice).toLocaleString()}
            </span>
            <span className="text-black">
              Rs. {Number(price).toLocaleString()}
            </span>
          </>
        ) : (
          <span>Rs. {Number(price).toLocaleString()}</span>
        )}
      </div>

      {/* Colors using shared ColorSwatchSelector */}
      <ColorSwatchSelector
        colors={uniqueColors}
        selectedIndex={selectedColorIndex}
        onSelectColor={handleColorClick}
        selectedColorName={selectedColorObj?.name}
        className="mb-5"
      />

      {/* Sizes using shared VariantSizeSelector */}
      <VariantSizeSelector
        sizes={allSizesArr}
        selectedSize={selectedSize}
        onSelectSize={handleSizeClick}
        getStockCount={getStockCount}
        selectedColorName={selectedColorName}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        showSizeGuide={productDetailSettings?.sizeGuide?.enabled !== false}
        sizeGuideLinkText={
          productDetailSettings?.sizeGuide?.linkText || "Size Guide"
        }
        className="mb-5"
      />

      {/* Add to Bag Button */}
      <div className="mb-6">
        <button
          disabled={!canAddToCart}
          onClick={() => {
            if (!selectedSize && allSizesArr.length > 0) {
              toast.error("Please select a size first");
              return;
            }
            handleAddToCart();
          }}
          className={`w-full py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] transition-colors border ${
            !canAddToCart
              ? "bg-[#d1d5db] text-[#4b5563] border-transparent cursor-not-allowed"
              : "bg-black text-white border-black hover:bg-neutral-800 cursor-pointer"
          }`}
        >
          {addToCartButtonText}
        </button>
      </div>
    </>
  );
}
