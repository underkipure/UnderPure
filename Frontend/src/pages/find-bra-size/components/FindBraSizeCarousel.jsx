import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { optimizeImage } from "../../../lib/productUtils";

export default function FindBraSizeCarousel({ extraSections }) {
  if (!extraSections || extraSections.length === 0) return null;

  return (
    <>
      {extraSections.map((section, idx) => (
        <section
          id={section.anchor || `extra-${idx}`}
          key={idx}
          className="py-20 bg-white"
        >
          <div className="max-w-[1200px] mx-auto px-6 relative">
            {section.headingPrefix && (
              <p className="text-[13px] text-black font-sans text-center mb-10 max-w-[500px] mx-auto leading-[1.8]">
                {section.headingPrefix}{" "}
                <em className="italic">{section.headingItalic}</em>{" "}
                {section.description}
              </p>
            )}
            {(section.items || []).length > 0 && (
              <div className="relative group/carousel max-w-[1200px] mx-auto px-3 md:px-12">
                <style>{`
                  .bra-size-carousel::-webkit-scrollbar { display: none; }
                `}</style>
                {/* Left Arrow */}
                <button
                  onClick={(e) => {
                    const el = e.currentTarget.nextElementSibling;
                    el.scrollBy({ left: -350, behavior: "smooth" });
                  }}
                  className="absolute left-5 md:left-10 top-[50%] -translate-y-1/2 z-10 w-8 h-8 md:w-7 md:h-7 flex items-center justify-center bg-black/15 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:bg-black/30"
                >
                  <ChevronLeft
                    className="w-7 h-7 md:w-8 md:h-8"
                    strokeWidth={2}
                  />
                </button>
                {/* Scrollable Container */}
                <div
                  className="bra-size-carousel flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory py-4 no-scrollbar"
                >
                  {section.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="flex-none w-[280px] lg:w-[320px] snap-center bg-[#f4f4f4] p-8 flex flex-col items-center justify-center min-h-[340px]"
                    >
                      {item.image && (
                        <img
                          loading="lazy"
                          src={optimizeImage(item.image, 600)}
                          alt={item.title || ""}
                          className="w-full h-auto object-contain mix-blend-multiply"
                        />
                      )}
                      {item.title && (
                        <h3 className="text-[14px] font-sans font-bold text-black mt-6 mb-1">
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className="text-[12px] text-gray-500 font-sans leading-[1.5] text-center">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {/* Right Arrow */}
                <button
                  onClick={(e) => {
                    const el = e.currentTarget.previousElementSibling;
                    el.scrollBy({ left: 350, behavior: "smooth" });
                  }}
                  className="absolute right-5 md:right-10 top-[50%] -translate-y-1/2 z-10 w-8 h-8 md:w-7 md:h-7 flex items-center justify-center bg-black/15 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:bg-black/30"
                >
                  <ChevronRight
                    className="w-7 h-7 md:w-7 md:h-7"
                    strokeWidth={2}
                  />
                </button>
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  );
}
