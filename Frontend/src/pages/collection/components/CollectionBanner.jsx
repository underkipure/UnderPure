import React from 'react';
import { fixImageUrl, optimizeImage } from '../../../lib/productUtils';

export default function CollectionBanner({
  showBanner,
  hasBackground,
  bannerConfig,
  currentCategory,
  title
}) {
  if (showBanner) {
    return (
      <div
        className={`w-full relative mb-10 ${
          !hasBackground
            ? 'bg-white py-12 flex flex-col items-center justify-center'
            : bannerConfig.height === 'small'
              ? 'h-[200px]'
              : bannerConfig.height === 'large'
                ? 'h-[500px]'
                : 'h-[350px]'
        }`}
      >
        {hasBackground && (
          <img
            loading="eager"
            decoding="async"
            src={optimizeImage(fixImageUrl(currentCategory?.image || bannerConfig.image), 1600)}
            alt={title}
            className="w-full h-full object-cover absolute inset-0 z-0"
          />
        )}

        {hasBackground ? (
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-4 z-10">
            <h1 className="text-3xl md:text-5xl font-serif mb-3 text-center">
              {currentCategory ? currentCategory.name : bannerConfig.title}
            </h1>
            <p className="text-sm tracking-widest uppercase max-w-xl text-center">
              {currentCategory?.description || bannerConfig.description}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-serif mb-3 text-center text-black">
              {currentCategory ? currentCategory.name : bannerConfig.title}
            </h1>
            <p className="text-sm tracking-widest uppercase text-gray-600 max-w-xl text-center">
              {currentCategory?.description || bannerConfig.description}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center mb-6">
      <h1
        className="text-[32px] md:text-[42px] font-dala-italic lowercase text-[#333333]"
      >
        {title}
      </h1>
    </div>
  );
}
