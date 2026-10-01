import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Section, Toggle } from "./FormControls";

const SocialLinksEditor = ({ fd, update }) => {
  const socials = fd.socialLinks || {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    pinterest: "https://pinterest.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  };

  const isGloballyEnabled = fd.socialLinksEnabled !== false;
  const visibility = fd.socialLinksVisibility || {};

  return (
    <Section title="Social Media Links">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
        <Toggle
          enabled={isGloballyEnabled}
          onChange={(v) => update({ socialLinksEnabled: v })}
          label={
            isGloballyEnabled
              ? "Social Media Links: Enabled in Footer"
              : "Social Media Links: Disabled in Footer"
          }
        />
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">
          {isGloballyEnabled ? "Showing active links" : "All links hidden in footer"}
        </span>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${
          isGloballyEnabled ? "opacity-100" : "opacity-40 pointer-events-none"
        }`}
      >
        {Object.entries(socials).map(([platform, url]) => {
          const isVisible = visibility[platform] !== false;

          return (
            <div
              key={platform}
              className={`p-3 border transition-colors ${
                isVisible ? "border-black/15 bg-white" : "border-gray-200 bg-gray-50/70"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-black capitalize">
                  {platform}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    update({
                      socialLinksVisibility: {
                        ...visibility,
                        [platform]: !isVisible,
                      },
                    })
                  }
                  className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isVisible
                      ? "bg-black text-white border-black hover:bg-gray-800"
                      : "bg-white text-gray-400 border-gray-300 hover:text-black hover:border-black"
                  }`}
                  title={isVisible ? "Click to Disable" : "Click to Enable"}
                >
                  {isVisible ? (
                    <>
                      <Eye size={12} />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff size={12} />
                      <span>Disabled</span>
                    </>
                  )}
                </button>
              </div>

              <input
                type="text"
                value={url}
                disabled={!isVisible}
                onChange={(e) =>
                  update({
                    socialLinks: {
                      ...socials,
                      [platform]: e.target.value,
                    },
                  })
                }
                placeholder={`https://${platform}.com/...`}
                className={`w-full border p-2 text-sm focus:outline-none focus:border-black transition-opacity ${
                  isVisible
                    ? "border-black/20 bg-white"
                    : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              />
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default SocialLinksEditor;
