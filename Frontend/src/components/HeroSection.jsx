import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSiteSettingsStore } from "../store/siteSettingsStore";
import { fixImageUrl, optimizeImage } from "../lib/productUtils";

const HeroSection = () => {
  const heroData = useSiteSettingsStore((s) => s.heroData);
  const videoRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [heroData?.mediaUrl]);

  useEffect(() => {
    if (videoRef.current && heroData?.mediaType === "video") {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current
        .play()
        .catch((error) => console.log("Autoplay prevented:", error));
    }
  }, [heroData?.mediaUrl, heroData?.mediaType]);

  const rawUrl = heroData?.mediaUrl;
  if (!rawUrl || imgError) return null;

  const imageSource = optimizeImage(fixImageUrl(rawUrl));
  const link = heroData?.buttonLink || "/collections/all";
  const hasText = !!(heroData?.heading || heroData?.buttonText);

  return (
    <Link
      to={link}
      className="block relative h-[65vh] md:h-screen w-full bg-[#151515] flex items-end pb-[10vw] md:pb-[3vw] justify-center md:justify-end overflow-hidden group cursor-pointer"
    >
      {/* Background Media */}
      {heroData?.mediaType === "video" ? (
        <video
          ref={videoRef}
          src={fixImageUrl(heroData.mediaUrl)}
          poster={imageSource || undefined}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <img
          fetchPriority="high"
          loading="eager"
          decoding="async"
          src={imageSource}
          onError={() => setImgError(true)}
          alt={heroData?.heading || "Hero Campaign"}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/15 transition-opacity"></div>

      {/* Text Content */}
      {hasText && (
        <div className="relative z-10 text-white px-[5vw] md:px-0 md:pr-[10vw] text-center flex flex-col items-center w-full md:w-auto">
          {heroData?.heading && (
            <h2
              className="text-[9.5vw] md:text-[3.5vw] mb-[2vw] md:mb-[0.8vw] tracking-wide leading-none italic lowercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
              style={{
                fontFamily: '"Times New Roman", Times, serif',
                color: heroData?.buttonColor || "#FFFFFF",
              }}
            >
              {heroData.heading}
            </h2>
          )}

          {heroData?.buttonText && (
            <button
              className="uppercase tracking-[0.015em] text-[3.5vw] md:text-[1vw] font-sans font-bold border-b-[0.3vw] md:border-b-[0.1vw] hover:opacity-70 transition-opacity drop-shadow-[0_1px_5px_rgba(0,0,0,0.3)]"
              style={{ 
                color: heroData?.buttonColor || "#FFFFFF",
                borderColor: heroData?.buttonColor || "#FFFFFF",
              }}
            >
              {heroData.buttonText}
            </button>
          )}
        </div>
      )}
    </Link>
  );
};

export default HeroSection;
