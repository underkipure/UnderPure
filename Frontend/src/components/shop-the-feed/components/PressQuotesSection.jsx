import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PressQuotesSection({ storedQuotes, displayQuotes }) {
  const quoteSliderRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  // Auto-play for mobile slider (press quotes)
  useEffect(() => {
    if (displayQuotes.length === 0) return;
    const interval = setInterval(() => {
      if (quoteSliderRef.current && window.innerWidth < 768) {
        const { scrollLeft, scrollWidth, clientWidth } = quoteSliderRef.current;
        let nextDot = activeDot + 1;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          quoteSliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
          nextDot = 0;
        } else {
          quoteSliderRef.current.scrollBy({
            left: clientWidth,
            behavior: "smooth",
          });
        }
        setActiveDot(nextDot);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeDot, displayQuotes.length]);

  const handleQuoteScroll = () => {
    if (quoteSliderRef.current) {
      const { scrollLeft, clientWidth } = quoteSliderRef.current;
      const newIndex = Math.round(scrollLeft / clientWidth);
      setActiveDot(newIndex);
    }
  };

  const scrollToQuote = (index) => {
    if (quoteSliderRef.current) {
      const { clientWidth } = quoteSliderRef.current;
      quoteSliderRef.current.scrollTo({
        left: clientWidth * index,
        behavior: "smooth",
      });
      setActiveDot(index);
    }
  };

  if (!displayQuotes || displayQuotes.length === 0) return null;

  return (
    <section className="pt-[1vw] pb-[12vw] md:py-[2vw] px-[2vw] md:px-[9vw] w-full">
      {storedQuotes?.sectionHeading && (
        <h2 className="text-center text-[5vw] md:text-[1.5vw] font-serif text-black mb-[6vw] md:mb-[3vw] tracking-wider uppercase">
          {storedQuotes.sectionHeading}
        </h2>
      )}
      
      {/* Desktop View */}
      <div className={`hidden md:grid grid-cols-${Math.min(displayQuotes.length, 3)} gap-[3vw] items-start justify-center`}>
        {displayQuotes.map((item, index) => (
          <div key={index} className="flex justify-center">
            <div className="flex flex-col justify-start text-center items-center tracking-[0.01em]">
              {item.logoText}
              <p className="text-[3.5vw] md:text-[1.1vw] font-sans text-black leading-relaxed mt-[1vw]">
                "{item.quote}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Press Quotes (Carousel) */}
      <div className="md:hidden relative flex items-center justify-center mt-[8vw] px-[2vw]">
        {displayQuotes.length > 1 && (
          <button
            onClick={() =>
              scrollToQuote(
                activeDot > 0 ? activeDot - 1 : displayQuotes.length - 1,
              )
            }
            aria-label="Previous quote"
            className="absolute left-[2vw] z-10 w-[8vw] h-[8vw] bg-[#e2e2e2] rounded-full flex items-center justify-center text-white hover:bg-[#d0d0d0] transition-colors"
          >
            <ChevronLeft className="w-[5vw] h-[5vw]" strokeWidth={3} />
          </button>
        )}

        <div
          ref={quoteSliderRef}
          onScroll={handleQuoteScroll}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full"
        >
          {displayQuotes.map((item, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 snap-center flex flex-col items-center justify-center text-center px-[10vw]"
            >
              {item.logoText}
              <p className="text-[3.8vw] text-black leading-relaxed font-sans mt-[1vw]">
                "{item.quote}"
              </p>
            </div>
          ))}
        </div>

        {displayQuotes.length > 1 && (
          <button
            onClick={() =>
              scrollToQuote(
                activeDot < displayQuotes.length - 1 ? activeDot + 1 : 0,
              )
            }
            aria-label="Next quote"
            className="absolute right-[2vw] z-10 w-[8vw] h-[8vw] bg-[#e2e2e2] rounded-full flex items-center justify-center text-white hover:bg-[#d0d0d0] transition-colors"
          >
            <ChevronRight className="w-[5vw] h-[5vw]" strokeWidth={3} />
          </button>
        )}
      </div>
    </section>
  );
}
