import React from 'react';
import { Link } from 'react-router-dom';
import { fixImageUrl, optimizeImage } from '../../../lib/productUtils';

export default function FeedCarouselItem({ imageSrc, product, index }) {
  const isVid = imageSrc?.match(/\.(mp4|webm|ogg)$/i);
  const resolvedSrc = isVid ? imageSrc : optimizeImage(fixImageUrl(imageSrc), 600);

  return (
    <Link
      to={product ? `/product/${product.slug}` : "#"}
      className="shrink-0 w-[calc((100%-4vw)/3)] md:w-[calc((100%-5.2vw)/3)] aspect-square relative group/item bg-[#f5f5f5] overflow-hidden"
    >
      {isVid ? (
        <>
          <video
            src={imageSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"
          />
          {/* Play button icon */}
          <div className="absolute top-[3vw] right-[3vw] md:top-[1.5vw] md:right-[1.5vw] w-[7vw] h-[7vw] md:w-[2.5vw] md:h-[2.5vw] bg-black/50 rounded-full flex items-center justify-center pointer-events-none z-10">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-[3vw] h-[3vw] md:w-[1.2vw] md:h-[1.2vw] ml-[0.5vw] md:ml-[0.2vw]"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </>
      ) : (
        <img
          loading="lazy"
          decoding="async"
          src={resolvedSrc}
          alt={product?.name || `Feed ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"
        />
      )}

      {/* Dark overlay with Learn More on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/70 transition-all duration-500 flex items-center justify-center">
        <span className="text-white text-[3.5vw] md:text-[1vw] font-sans tracking-wider opacity-0 group-hover/item:opacity-100 transition-opacity duration-500">
          Learn More
        </span>
      </div>
    </Link>
  );
}
