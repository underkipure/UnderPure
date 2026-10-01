import React from "react";
import { Link } from "react-router-dom";
import { useSiteSettingsStore } from "../store/siteSettingsStore";
import { useCategoryStore } from "../store/categoryStore";
import { fixImageUrl, optimizeImage } from "../lib/productUtils";

const PleasureSwimBanners = () => {
  const pleasureSwimBanners = useSiteSettingsStore((s) => s.pleasureSwimBanners);
  const { categories = [] } = useCategoryStore();

  if (!pleasureSwimBanners || pleasureSwimBanners.length === 0) return null;

  const validBanners = pleasureSwimBanners.filter((banner) => {
    const category = categories.find((c) => c.slug === banner.categorySlug);
    if (category && (category.isVisible === false || category.isVisible === 0)) {
      return false;
    }
    const rawImage = banner.image || category?.image;
    return !!rawImage;
  });

  if (validBanners.length === 0) return null;

  return (
    <section className="w-full px-[2.3vw] md:px-[2.3vw] pb-[6vw] md:pb-[1vw]">
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

          // The second banner in the original design uses italic font
          const isSecond = index === 1;
          const isVid = image?.match(/\.(mp4|webm|ogg)$/i);

          return (
            <Link
              key={banner.id || index}
              to={link}
              className={`relative group block cursor-pointer aspect-square md:aspect-[5/4.3] overflow-hidden ${isSecond ? "bg-[#f0f0f0]" : "bg-[#f9f9f9]"}`}
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
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${isSecond ? "bg-black bg-opacity-5 group-hover:bg-opacity-15" : "bg-black bg-opacity-10 group-hover:bg-opacity-20"}`}
              ></div>
              <div
                className={`absolute bottom-[8vw] md:bottom-[3vw] left-0 right-0 text-center text-white`}
              >
                {title && (
                  <h3
                    className={`font-serif text-[8vw] md:text-[3vw] leading-none mb-[2vw] md:mb-[0.8vw] lowercase ${isSecond ? "italic" : ""}`}
                    style={
                      isSecond
                        ? {
                            fontFamily: '"Dala Floda Italic"',
                            color: banner.buttonColor || "#FFFFFF",
                          }
                        : {
                            fontFamily: '"Dala Floda Roman"',
                            color: banner.buttonColor || "#FFFFFF",
                            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                          }
                    }
                  >
                    {title}
                  </h3>
                )}
                <button
                  className={`text-[3vw] md:text-[0.9vw] font-sans font-bold uppercase tracking-[0.01em] border-b-[0.3vw] md:border-b-[0.1vw]`}
                  style={{
                    color: banner.buttonColor || "#FFFFFF",
                    borderColor: banner.buttonColor || "#FFFFFF",
                    ...(isSecond ? {} : { textShadow: "0 1px 5px rgba(0,0,0,0.2)" })
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

export default PleasureSwimBanners;
