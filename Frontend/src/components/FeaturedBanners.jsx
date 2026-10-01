import React from "react";
import { Link } from "react-router-dom";
import { useSiteSettingsStore } from "../store/siteSettingsStore";
import { useCategoryStore } from "../store/categoryStore";
import { fixImageUrl, optimizeImage } from "../lib/productUtils";

const FeaturedBanners = () => {
  const featuredBanners = useSiteSettingsStore((s) => s.featuredBanners);
  const { categories = [] } = useCategoryStore();

  if (!featuredBanners || featuredBanners.length === 0) return null;

  const validBanners = featuredBanners.filter((banner) => {
    const category = categories.find((c) => c.slug === banner.categorySlug);
    if (category && (category.isVisible === false || category.isVisible === 0)) {
      return false;
    }
    const rawImage = banner.image || category?.image;
    return !!rawImage;
  });

  if (validBanners.length === 0) return null;

  return (
    <section className="w-full px-[2.3vw] md:px-[2.3vw] py-[2.5vw] md:py-[2.3vw]">
      <div className={`grid grid-cols-1 ${validBanners.length > 1 ? 'md:grid-cols-2' : ''} gap-[4vw] md:gap-[2.3vw]`}>
        {validBanners.map((banner, index) => {
          const category = categories.find(
            (c) => c.slug === banner.categorySlug,
          );

          const title = banner.title || category?.name || banner.categorySlug || "";
          const rawImage = banner.image || category?.image || "";
          const image = optimizeImage(fixImageUrl(rawImage), { width: 1000 });
          const link = category?.slug
            ? `/collections/${category.slug}`
            : (banner.categorySlug
                ? `/collections/${banner.categorySlug}`
                : (banner.link || "/collections/all"));

          // The second banner uses italic font
          const isSecond = index === 1;
          const isVid = image?.match(/\.(mp4|webm|ogg)$/i);

          return (
            <Link
              key={banner.id || index}
              to={link}
              className="relative group block cursor-pointer aspect-square md:aspect-[5.5/4.7] bg-[#f9f9f9] overflow-hidden"
            >
              {isVid ? (
                <video
                  src={image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  loading="lazy"
                  src={image}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-300 group-hover:bg-opacity-20"></div>
              <div className="absolute bottom-[8vw] md:bottom-[3vw] left-0 right-0 text-center text-white">
                {title && (
                  <h3
                    className={`${isSecond ? 'font-dala-italic' : 'font-dala-roman'} font-medium text-[8vw] md:text-[3vw] leading-none mb-[2vw] md:mb-[0.8vw] lowercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]`}
                    style={{
                      color: banner.buttonColor || "#FFFFFF",
                    }}
                  >
                    {title}
                  </h3>
                )}
                <button
                  className="text-[3vw] md:text-[0.9vw] font-sans font-bold uppercase tracking-subtle border-b-[0.3vw] md:border-b-[0.1vw] pb-[0.5vw] md:pb-[0.2vw] drop-shadow-[0_1px_5px_rgba(0,0,0,0.2)]"
                  style={{ 
                    color: banner.buttonColor || "#FFFFFF",
                    borderColor: banner.buttonColor || "#FFFFFF",
                  }}
                >
                  {banner.buttonText || "SHOP NOW"}
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedBanners;
