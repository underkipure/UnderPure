import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { optimizeImage } from '../../../lib/productUtils';

export default function CollectionCategorySlider({
  subCategories = [],
  categoryId
}) {
  const sliderScrollRef = useRef(null);

  if (subCategories.length === 0) return null;

  const scrollSlider = (direction) => {
    if (sliderScrollRef.current) {
      const scrollAmount = 240;
      sliderScrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto mb-16">
      <div className="relative">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => scrollSlider('left')}
          className="absolute -left-2 top-[40%] -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-10 h-10 text-black" strokeWidth={1.5} />
        </button>

        {/* Scrollable Container */}
        <div
          ref={sliderScrollRef}
          className="overflow-x-auto no-scrollbar flex gap-5 px-8 snap-x snap-mandatory"
        >
          {subCategories.map((item, idx) => (
            <Link
              to={`/collections/${item.slug}`}
              key={item.id || item.slug || idx}
              className="flex-shrink-0 flex flex-col items-center group snap-start w-[calc((100%-80px)/5)] min-w-[180px]"
            >
              <div className="w-full aspect-[1/1.1] bg-[#f5f5f5] overflow-hidden mb-3">
                <img
                  loading="lazy"
                  decoding="async"
                  src={optimizeImage(item.image, 400) || ''}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span
                className={`text-[12px] font-sans font-bold uppercase tracking-[0.12em] text-black transition-opacity whitespace-nowrap ${
                  item.slug === categoryId
                    ? 'underline underline-offset-4 decoration-[2px]'
                    : 'hover:opacity-70'
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => scrollSlider('right')}
          className="absolute -right-2 top-[40%] -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-10 h-10 text-black" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
