import React from "react";

export const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6c1.05 0 2.05.2 2.5.31v2.71h-1.6c-1.25 0-1.6.76-1.6 1.76V12h3.2l-.5 3h-2.7v6.8C18.56 20.87 22 16.84 22 12z" />
  </svg>
);

export const InstagramIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const YoutubeIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.5 15.5v-7l6.5 3.5-6.5 3.5z" />
  </svg>
);

export const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
  </svg>
);

export const TikTokIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.1a8.27 8.27 0 004.85 1.56V11.2a4.83 4.83 0 01-.73.06 4.84 4.84 0 01-2.54-.72V2h3.45v.44a4.83 4.83 0 004.55 4.25z" />
  </svg>
);

export const PinterestIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0a12 12 0 00-4.37 23.17c-.1-.94-.2-2.4.04-3.44.22-.92 1.4-5.94 1.4-5.94s-.36-.72-.36-1.78c0-1.66.97-2.9 2.17-2.9 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-.99 3.99-.28 1.19.6 2.16 1.77 2.16 2.13 0 3.76-2.25 3.76-5.49 0-2.87-2.06-4.87-5-4.87-3.41 0-5.41 2.56-5.41 5.2 0 1.03.4 2.13.89 2.73.1.12.11.22.08.34-.09.37-.29 1.19-.33 1.35-.05.22-.18.26-.41.16-1.54-.72-2.5-2.97-2.5-4.78 0-3.89 2.83-7.46 8.15-7.46 4.28 0 7.6 3.05 7.6 7.12 0 4.25-2.68 7.67-6.4 7.67-1.25 0-2.43-.65-2.83-1.42l-.77 2.93c-.28 1.08-1.04 2.43-1.55 3.25A12 12 0 0012 0z" />
  </svg>
);

export default function ProductSocialShare({
  productDetailSettings,
  footerData,
  globalSocials,
}) {
  if (productDetailSettings?.showSocialShare === false) return null;

  const tiktokUrl =
    footerData?.socialLinks?.tiktok ||
    globalSocials?.tiktok ||
    "https://tiktok.com";
  const instagramUrl =
    footerData?.socialLinks?.instagram ||
    globalSocials?.instagram ||
    "https://instagram.com";
  const pinterestUrl =
    footerData?.socialLinks?.pinterest ||
    globalSocials?.pinterest ||
    "https://pinterest.com";

  return (
    <div className="flex items-center gap-5 mb-8 text-left">
      {tiktokUrl && (
        <a
          href={tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:opacity-60 transition-opacity"
          aria-label="TikTok"
        >
          <TikTokIcon />
        </a>
      )}
      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:opacity-60 transition-opacity"
          aria-label="Instagram"
        >
          <InstagramIcon />
        </a>
      )}
      {pinterestUrl && (
        <a
          href={pinterestUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:opacity-60 transition-opacity"
          aria-label="Pinterest"
        >
          <PinterestIcon />
        </a>
      )}
    </div>
  );
}
