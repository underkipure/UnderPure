import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { optimizeImage } from "../../../lib/productUtils";

export default function ProductGallerySliderModal({
  sliderIndex,
  setSliderIndex,
  gallery,
  title,
  selectedColorName,
  isZoomedIn,
  setIsZoomedIn,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) {
  if (sliderIndex === null || !gallery || gallery.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-white text-black flex flex-col select-none animate-in fade-in duration-200"
      onClick={() => {
        setSliderIndex(null);
        setIsZoomedIn(false);
      }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 z-[110] bg-white shrink-0">
        <div className="text-[14px] font-bold tracking-wide truncate max-w-[50%]">
          {title}
          {selectedColorName ? ` — ${selectedColorName}` : ""}
        </div>
        <div className="text-[13px] font-semibold tracking-widest text-gray-500 uppercase">
          {sliderIndex + 1} / {gallery.length}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSliderIndex(null);
            setIsZoomedIn(false);
          }}
          className="p-2 -mr-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Close gallery"
        >
          <X className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Main Slide Area */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center w-full">
        {/* Left Arrow */}
        {gallery.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSliderIndex(
                (sliderIndex - 1 + gallery.length) % gallery.length,
              );
              setIsZoomedIn(false);
            }}
            className="absolute left-4 md:left-8 z-[110] p-3 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-md text-black transition-all hover:scale-105"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
          </button>
        )}

        {/* Slide Container */}
        <div
          className="flex w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${sliderIndex * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {gallery.map((img, idx) => (
            <div
              key={idx}
              className="w-full h-full shrink-0 flex items-center justify-center p-4 md:p-8 overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={img}
                alt={`${title} slide ${idx + 1}`}
                className={`max-w-none w-full md:w-auto md:max-w-[90vw] md:max-h-[80vh] object-contain transition-transform duration-300 ${
                  isZoomedIn && sliderIndex === idx
                    ? "scale-150 cursor-zoom-out"
                    : "cursor-zoom-in"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (sliderIndex === idx) {
                    setIsZoomedIn(!isZoomedIn);
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {gallery.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSliderIndex((sliderIndex + 1) % gallery.length);
              setIsZoomedIn(false);
            }}
            className="absolute right-4 md:right-8 z-[110] p-3 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-md text-black transition-all hover:scale-105"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Bar */}
      {gallery.length > 1 && (
        <div
          className="w-full py-3 px-4 bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar z-[110] shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSliderIndex(idx);
                setIsZoomedIn(false);
              }}
              className={`w-12 h-16 md:w-14 md:h-18 shrink-0 rounded overflow-hidden border-2 transition-all ${
                idx === sliderIndex
                  ? "border-black scale-105 opacity-100 shadow-sm"
                  : "border-transparent opacity-50 hover:opacity-100 hover:border-gray-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <img
                loading="lazy"
                src={optimizeImage(img, 150)}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
