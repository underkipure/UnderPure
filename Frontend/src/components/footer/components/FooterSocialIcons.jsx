import React from "react";

export const FacebookIcon = () => (
  <svg
    className="w-[5vw] h-[5vw] md:w-[1.2vw] md:h-[1.2vw]"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6c1.05 0 2.05.2 2.5.31v2.71h-1.6c-1.25 0-1.6.76-1.6 1.76V12h3.2l-.5 3h-2.7v6.8C18.56 20.87 22 16.84 22 12z" />
  </svg>
);

export const InstagramIcon = () => (
  <svg
    className="w-[6vw] h-[6vw] md:w-[1.5vw] md:h-[1.5vw]"
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
  <svg
    className="w-[6vw] h-[6vw] md:w-[1.5vw] md:h-[1.5vw]"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.5 15.5v-7l6.5 3.5-6.5 3.5z" />
  </svg>
);

export const TikTokIcon = () => (
  <svg
    className="w-[6vw] h-[6vw] md:w-[1.5vw] md:h-[1.5vw]"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.1a8.27 8.27 0 004.85 1.56V11.2a4.83 4.83 0 01-.73.06 4.84 4.84 0 01-2.54-.72V2h3.45v.44a4.83 4.83 0 004.55 4.25z" />
  </svg>
);

export const PinterestIcon = () => (
  <svg
    className="w-[6vw] h-[6vw] md:w-[1.5vw] md:h-[1.5vw]"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 0a12 12 0 00-4.37 23.17c-.1-.94-.2-2.4.04-3.44.22-.92 1.4-5.94 1.4-5.94s-.36-.72-.36-1.78c0-1.66.97-2.9 2.17-2.9 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-.99 3.99-.28 1.19.6 2.16 1.77 2.16 2.13 0 3.76-2.25 3.76-5.49 0-2.87-2.06-4.87-5-4.87-3.41 0-5.41 2.56-5.41 5.2 0 1.03.4 2.13.89 2.73.1.12.11.22.08.34-.09.37-.29 1.19-.33 1.35-.05.22-.18.26-.41.16-1.54-.72-2.5-2.97-2.5-4.78 0-3.89 2.83-7.46 8.15-7.46 4.28 0 7.6 3.05 7.6 7.12 0 4.25-2.68 7.67-6.4 7.67-1.25 0-2.43-.65-2.83-1.42l-.77 2.93c-.28 1.08-1.04 2.43-1.55 3.25A12 12 0 0012 0z" />
  </svg>
);

export const PlatformIcon = ({ platform }) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <InstagramIcon />;
    case "tiktok":
      return <TikTokIcon />;
    case "pinterest":
      return <PinterestIcon />;
    case "facebook":
      return <FacebookIcon />;
    case "youtube":
      return <YoutubeIcon />;
    default:
      return null;
  }
};

export const FooterSocialLinks = ({ socialLinks, className = "" }) => {
  if (!socialLinks || typeof socialLinks !== "object") return null;
  const entries = Object.entries(socialLinks).filter(
    ([_, url]) => url && typeof url === "string" && url.trim() !== ""
  );
  if (entries.length === 0) return null;

  return (
    <div className={className}>
      {entries.map(([platform, url]) => (
        <a
          key={platform}
          aria-label={`Visit our ${platform}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-black hover:opacity-70"
        >
          <PlatformIcon platform={platform} />
        </a>
      ))}
    </div>
  );
};
