import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteSettingsStore, DEFAULTS } from '../store/siteSettingsStore';
import { fixImageUrl, optimizeImage } from '../lib/productUtils';

const AboutUs = () => {
  const sliderRef = useRef(null);
  const { aboutUsData } = useSiteSettingsStore();
  const d = aboutUsData || DEFAULTS.aboutUsData;

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!d.fataleImages || d.fataleImages.length === 0) return;
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [d.fataleImages]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-24 py-5">

        {/* ── Section 1: About Us ── */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12 md:mb-24 items-center">
          {/* Left Text */}
          <div className="flex-1 md:w-5/12 pr-0 md:pr-10">
            <p className="text-[13px] font-sans font-bold text-black mb-6 uppercase tracking-[0.15em]">
              ABOUT US
            </p>
            <h1
              className="text-[40px] md:text-[52px] font-dala-roman font-bold tracking-normal leading-[1.2] mb-10 text-black"
            >
              {d.heroQuote}
            </h1>
            <div className="space-y-6 text-[14px] font-sans text-black font-medium leading-[1.8]">
              {(d.heroParagraphs || []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Right Image */}
          {d.heroImage && (
            <div className="flex-1 w-full md:w-5/12 relative flex justify-center md:justify-end mt-8 md:mt-0">
              <img loading="lazy" src={optimizeImage(fixImageUrl(d.heroImage), { width: 600 })}
                alt="About Us Campaign"
                className="w-full max-w-[320px] md:max-w-[450px] h-auto object-cover"
              />
            </div>
          )}
        </div>

        {/* ── Section 2: Fatale Slider ── */}
        {(d.fataleImages || []).filter(img => img && img.src).length > 0 && (
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center border-y border-gray-100 py-8 md:py-16">
            {/* Left Title */}
            <div className="md:w-[25%] pr-4 text-center md:text-left">
              <h2
                className="text-[45px] md:text-[60px] font-dala-roman font-bold text-black leading-[1.1]"
              >
                the
              </h2>
              <h2
                className="text-[45px] md:text-[60px] font-dala-roman font-bold text-black leading-[1.1]"
              >
                <span className="text-gray-400 font-light mr-1">#</span>
                {(d.fataleHashtag || '').replace('#', '')}
              </h2>
            </div>

            {/* Right Image Slider */}
            <div className="md:w-[75%] relative group">
              <button
                onClick={slideLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white border border-gray-200 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-8 h-8 text-gray-500 stroke-1" />
              </button>
              <button
                onClick={slideRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white border border-gray-200 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-8 h-8 text-gray-500 stroke-1" />
              </button>

              <div ref={sliderRef} className="flex gap-4 overflow-x-hidden snap-x snap-mandatory">
                {d.fataleImages.filter(img => img && img.src).map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="relative flex-none snap-start group/card cursor-pointer w-[calc((100%-1rem)/3)] md:w-[calc((100%-2rem)/3)]"
                  >
                    <div className="aspect-square w-full">
                      <img loading="lazy" src={optimizeImage(fixImageUrl(img.src), { width: 500 })}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[13px] font-bold uppercase tracking-widest">Learn More</span>
                    </div>
                    {img.hasPlay && (
                      <div className="absolute top-4 right-4 bg-gray-500 bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Section 3: Design Philosophy ── */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
          {/* Left Text */}
          <div className="md:w-[40%] pt-6 pr-0 md:pr-10">
            <p className="text-[16px] font-sans font-bold text-black mb-6 uppercase tracking-[0.15em]">
              {d.designPhilosophyLabel}
            </p>
            <div className="space-y-6 text-[14px] font-sans text-black font-medium leading-[1.8]">
              {(d.designPhilosophyParagraphs || []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Right Image Grid */}
          {(d.philosophyImages || []).filter(img => img && img.src).length > 0 && (
            <div className="md:w-[60%] flex flex-row gap-3 md:gap-6">
              <div className="flex-1 flex flex-col gap-3 md:gap-6">
                {d.philosophyImages.filter(img => img && img.src).filter((_, i) => i % 2 === 0).map((img, idx) => (
                  <img loading="lazy" key={img.id || idx} src={img.src} alt={`Philosophy ${idx}`} className="w-full h-auto object-cover" />
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-3 md:gap-6 mt-6 md:mt-12">
                {d.philosophyImages.filter(img => img && img.src).filter((_, i) => i % 2 === 1).map((img, idx) => (
                  <img loading="lazy" key={img.id || idx} src={img.src} alt={`Philosophy ${idx}`} className="w-full h-auto object-cover" />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
