import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FeedCarouselItem from './FeedCarouselItem';

export default function FeedSlider({ title, validFeedImages }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount =
      direction === "left" ? -el.clientWidth : el.clientWidth;

    const start = el.scrollLeft;
    const end = start + scrollAmount;
    const duration = 500;
    let startTime = null;

    el.style.scrollSnapType = "none";

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      el.scrollLeft = start + (end - start) * ease;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        el.style.scrollSnapType = "";
        checkScroll();
      }
    };
    requestAnimationFrame(animateScroll);
  };

  // Auto-play for feed slider
  useEffect(() => {
    if (!validFeedImages || validFeedImages.length === 0) return;

    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      const scrollAmount = el.clientWidth;

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }

      setTimeout(checkScroll, 600);
    }, 5000);

    return () => clearInterval(interval);
  }, [validFeedImages]);

  return (
    <section className="py-[0vw] md:py-[1vw] relative">
      {/* Heading */}
      {title && (
        <div className="text-center mb-[6vw] md:mb-[1.7vw]">
          <h2
            className="text-[8.5vw] md:text-[1.9vw] font-dala-italic lowercase leading-none text-black"
          >
            {title}
          </h2>
        </div>
      )}

      <div className="w-full pl-[2vw] md:pl-[2.3vw]">
        <div className="relative group/feed">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Previous"
            className="hidden md:flex absolute left-0 top-0 bottom-0 md:w-[3vw] z-20 items-center justify-center text-[#555555] hover:text-black transition-all duration-300 opacity-0 group-hover/feed:opacity-100 cursor-pointer bg-white/70 hover:bg-white/90"
          >
            <ChevronLeft
              className="w-[8vw] h-[8vw] md:w-[2.5vw] md:h-[2.5vw]"
              strokeWidth={1}
            />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Next"
            className="hidden md:flex absolute right-0 top-0 bottom-0 md:w-[3vw] z-20 items-center justify-center text-[#555555] hover:text-black transition-all duration-300 opacity-0 group-hover/feed:opacity-100 cursor-pointer bg-white/70 hover:bg-white/90"
          >
            <ChevronRight
              className="w-[8vw] h-[8vw] md:w-[2.5vw] md:h-[2.5vw]"
              strokeWidth={1}
            />
          </button>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto gap-[2vw] md:gap-[2.6vw] snap-x snap-mandatory no-scrollbar"
          >
            {validFeedImages.map(({ imageSrc, product, index }) => (
              <FeedCarouselItem
                key={index}
                imageSrc={imageSrc}
                product={product}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
