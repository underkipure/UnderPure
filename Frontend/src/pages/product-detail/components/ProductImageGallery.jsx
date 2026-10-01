import React from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { optimizeImage } from "../../../lib/productUtils";

export default function ProductImageGallery({
  gallery,
  title,
  productDetailSettings,
  galleryScrollRef,
  scrollGallery,
  setSliderIndex,
  isInWishlist,
  isWishlistLoading,
  toggleWishlist,
}) {
  return (
    <div className="w-[100%] md:w-[55%] flex gap-4 relative md:sticky md:top-[100px] md:h-[calc(100vh-100px)]">
      {/* Heart Icon (Mobile overlaid on image) */}
      <button
        disabled={isWishlistLoading}
        onClick={toggleWishlist}
        className={`absolute top-4 right-4 md:hidden z-20 transition-opacity ${
          isWishlistLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-60"
        } ${isInWishlist ? "text-red-500" : "text-black"}`}
      >
        <Heart
          className={`w-6 h-6 stroke-[1.5] ${isInWishlist ? "fill-current" : ""}`}
        />
      </button>

      {/* Sticky Thumbnails (Desktop) */}
      {productDetailSettings?.galleryStyle !== "grid" && (
        <div className="hidden md:flex flex-col gap-4 w-[90px] h-full overflow-y-auto no-scrollbar shrink-0">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                const el = document.getElementById(`prod-img-${idx}`);
                if (el) {
                  el.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="w-full aspect-[3/4] border border-transparent hover:border-black transition-colors"
            >
              <img
                loading="lazy"
                src={optimizeImage(img, 200)}
                alt={`Thumb ${idx}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Images */}
      <div
        ref={galleryScrollRef}
        className={`flex-1 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden snap-x snap-mandatory flex ${
          productDetailSettings?.galleryStyle === "grid"
            ? "md:grid md:grid-cols-2 md:gap-4"
            : "md:flex md:flex-col md:gap-6"
        } md:h-full no-scrollbar`}
      >
        {gallery.map((img, idx) => (
          <div
            key={idx}
            id={`prod-img-${idx}`}
            className="w-full shrink-0 snap-start aspect-[3/4] md:aspect-[3/4] bg-[#f5f5f5] relative"
          >
            <img
              loading="lazy"
              src={img}
              alt={`${title} ${idx}`}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setSliderIndex(idx)}
            />
          </div>
        ))}
      </div>

      {/* Mobile Arrows (Overlay) */}
      {gallery.length > 1 && (
        <>
          <button
            onClick={() => scrollGallery("left")}
            className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-white drop-shadow-md z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-11 h-11" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => scrollGallery("right")}
            className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-white drop-shadow-md z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-11 h-11" strokeWidth={1.5} />
          </button>
        </>
      )}
    </div>
  );
}
