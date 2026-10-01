import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../lib/api";
import ProductCard from "./ProductCard";
import { useSiteSettingsStore, DEFAULTS } from "../store/siteSettingsStore";
import { useProductStore } from "../store/productStore";

const filterProds = (prods, config) => {
  let list = [...prods];
  if (config.categorySlug && !config.badge) {
    list = list.filter(p => p.category_slug === config.categorySlug || p.category === config.categorySlug);
  }
  if (config.badge) {
    const targetBadge = config.badge.toLowerCase().replace(/[^a-z0-9]/g, '');
    list = list.filter(p => {
      const bList = Array.isArray(p.badges)
        ? p.badges.map(b => typeof b === 'object' ? b.name : b)
        : (p.badge ? p.badge.split(',').map(b => b.trim()) : []);
      return bList.some(b => {
        const bStr = (typeof b === 'string' ? b : '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return bStr === targetBadge;
      });
    });
  }
  return list.slice(0, config.limit || 8);
};

const BestSellersCarousel = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const storeProducts = useProductStore((s) => s.products);
  const homeCarousels = useSiteSettingsStore((s) => s.homeCarousels);
  const config =
    homeCarousels?.bestSellers || DEFAULTS.homeCarousels.bestSellers;

  // Initialize immediately from cached store products
  const [bestSellers, setBestSellers] = useState(() => filterProds(storeProducts || [], config));
  const [loading, setLoading] = useState(!storeProducts || storeProducts.length === 0);

  useEffect(() => {
    if (storeProducts && storeProducts.length > 0) {
      setBestSellers(filterProds(storeProducts, config));
      setLoading(false);
      return;
    }

    const fetchBestSellers = async () => {
      try {
        const limit = config.limit || 8;
        const query = { sort: "newest", limit: Math.max(limit * 2, 16) };

        if (!config.badge && config.categorySlug) {
          query.category = config.categorySlug;
        }

        const res = await fetchProducts(null, query);
        const prods = filterProds(res.products || [], config);
        setBestSellers(prods);
      } catch (err) {
        console.error("Failed to fetch best sellers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, [storeProducts, config.categorySlug, config.badge, config.limit]);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(".carousel-card")?.offsetWidth || 400;
    // Add gap to scroll amount
    const scrollAmount =
      direction === "left" ? -(cardWidth + 32) : cardWidth + 32;

    // Custom smooth scroll animation for slower speed
    const start = el.scrollLeft;
    const end = start + scrollAmount;
    const duration = 600; // Slower speed (600ms)
    let startTime = null;

    // Temporarily disable snapping during animation
    el.style.scrollSnapType = "none";

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // easeInOutCubic
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      el.scrollLeft = start + (end - start) * ease;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        el.style.scrollSnapType = ""; // Restore snapping
        checkScroll();
      }
    };

    requestAnimationFrame(animateScroll);
  };

  if (loading) {
    return (
      <section className="py-[6vw] md:py-[2.3vw] relative min-h-[380px] md:min-h-[420px]">
        <div className="text-center mb-[4vw] md:mb-[1vw]">
          {config.title && (
            <h2
              className="text-[6vw] md:text-[2vw] font-dala-italic lowercase leading-none"
              style={{
                color: config.textColor || "#000000",
              }}
            >
              {config.title}
            </h2>
          )}
        </div>
        <div className="w-full px-[4vw] md:px-[3.5vw] flex gap-[4.5vw] md:gap-[2.4vw] overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[calc((100%-2vw)/2)] md:w-[calc((100%-4.8vw)/3)]"
            >
              <div className="aspect-[3/4.2] md:aspect-[3/4.5] bg-[#f5f5f5] animate-pulse"></div>
              <div className="h-[3.3vw] md:h-[0.9vw] bg-[#f0f0f0] animate-pulse mt-3 w-3/4 mx-auto rounded"></div>
              <div className="h-[3vw] md:h-[0.8vw] bg-[#f0f0f0] animate-pulse mt-2 w-1/2 mx-auto rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (bestSellers.length === 0) return null;

  return (
    <section className="py-[6vw] md:py-[2.3vw] relative">
      {/* Heading */}
      <div className="text-center mb-[4vw] md:mb-[1vw]">
        {config.title && (
          <h2
            className="text-[6vw] md:text-[2vw] font-dala-italic lowercase leading-none"
            style={{
              color: config.textColor || "#000000",
            }}
          >
            {config.title}
          </h2>
        )}
        {config.subtitle && (
          <p
            className="text-[5.5vw] md:text-[1.3vw] font-dala-roman lowercase leading-none mt-[2vw] md:mt-[1vw]"
          >
            {config.subtitle}
          </p>
        )}
      </div>

      <div className="relative group/carousel w-full px-[4vw] md:px-[3.5vw]">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Previous slide"
          className={`absolute left-[3.25vw] md:left-[3vw] top-[40%] md:top-[50%] -translate-y-1/2 z-10 w-[8vw] h-[8vw] md:w-[2vw] md:h-[2vw] flex items-center justify-center bg-black/20 text-white hover:bg-black/30 rounded-full transition-all duration-300 ${canScrollLeft ? "cursor-pointer opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <ChevronLeft
            className="w-[7vw] h-[7vw] md:w-[1.5vw] md:h-[1.5vw]"
            strokeWidth={2}
          />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Next slide"
          className={`absolute right-[3.5vw] md:right-[3vw] top-[40%] md:top-[50%] -translate-y-1/2 z-10 w-[8vw] h-[8vw] md:w-[2vw] md:h-[2vw] flex items-center justify-center bg-black/20 text-white hover:bg-black/30 rounded-full transition-all duration-300 ${canScrollRight ? "cursor-pointer opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <ChevronRight
            className="w-[7vw] h-[7vw] md:w-[1.8vw] md:h-[1.8vw]"
            strokeWidth={2}
          />
        </button>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-[4.5vw] md:gap-[2.4vw] snap-x snap-mandatory no-scrollbar"
        >
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="carousel-card flex-shrink-0 w-[calc((100%-2vw)/2)] md:w-[calc((100%-4.8vw)/3)] snap-start md:snap-center"
            >
              <ProductCard product={product} cardStyle="carousel" contextBadge={config.badge || undefined} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellersCarousel;
