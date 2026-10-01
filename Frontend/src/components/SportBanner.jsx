import React from "react";
import { Link } from "react-router-dom";
import { useSiteSettingsStore } from "../store/siteSettingsStore";
import { useCategoryStore } from "../store/categoryStore";
import { fixImageUrl, optimizeImage } from "../lib/productUtils";

const SportBanner = () => {
  const sportBanner = useSiteSettingsStore((s) => s.sportBanner);
  const { categories = [] } = useCategoryStore();

  if (!sportBanner) return null;

  const category = categories.find((c) => c.slug === sportBanner.categorySlug);
  if (category && (category.isVisible === false || category.isVisible === 0)) {
    return null;
  }

  const rawImage = sportBanner.image || category?.image || "";
  if (!rawImage) return null;

  const isLegacyTitle = sportBanner.title?.trim()?.toLowerCase() === "sport collection";
  const title = (sportBanner.title && sportBanner.title.trim() !== "" && !isLegacyTitle)
    ? sportBanner.title
    : (category?.name || sportBanner.categorySlug || "");
  const image = optimizeImage(fixImageUrl(rawImage), { width: 1600 });
  const link = category?.slug
    ? `/collections/${category.slug}`
    : (sportBanner.categorySlug
        ? `/collections/${sportBanner.categorySlug}`
        : (sportBanner.link || "/collections/all"));

  const isVid = image?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <Link
      to={link}
      className="block relative w-full aspect-square md:aspect-[2.5/1] bg-[#e8e8e8] overflow-hidden cursor-pointer group mb-[1vw] md:mb-[0.5vw]"
    >
      {isVid ? (
        <video
          src={image}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <img
          loading="lazy"
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Text on the left */}
      {(title || sportBanner.buttonText) && (
        <div className="absolute bottom-[12vw] md:bottom-[4vw] left-[8vw] md:left-[5vw] z-10 text-black">
          {title && (
            <h3
              className="text-[8vw] md:text-[3vw] leading-none mb-[3vw] md:mb-[0.8vw] lowercase italic font-dala-italic"
              style={{
                color: sportBanner.buttonColor || '#000000',
              }}
            >
              {title}
            </h3>
          )}
          {sportBanner.buttonText && (
            <button
              className="text-[3vw] md:text-[0.8vw] font-sans font-bold uppercase tracking-[0.15em] border-b-[0.5vw] md:border-b-[0.1vw] pb-[0.5vw] md:pb-[0.2vw] hover:opacity-70 transition-opacity"
              style={{
                color: sportBanner.buttonColor || '#000000',
                borderColor: sportBanner.buttonColor || '#000000',
              }}
            >
              {sportBanner.buttonText}
            </button>
          )}
        </div>
      )}
    </Link>
  );
};

export default SportBanner;
