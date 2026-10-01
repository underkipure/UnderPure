import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const Section = ({ title, children }) => (
  <div className="bg-white border border-black/10 p-6 space-y-5">
    <h3 className="font-serif text-lg border-b border-black/10 pb-3">
      {title}
    </h3>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const LoyaltyBannersHeroEditor = ({ d, update, uploadImage }) => {
  return (
    <Section title="Hero & Banner Settings">
      <Field label="Hero Title">
        <input
          type="text"
          value={d.heroTitle}
          onChange={(e) => update({ heroTitle: e.target.value })}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-serif italic"
        />
      </Field>
      <Field label="Hero Subtitle">
        <textarea
          rows={3}
          value={d.heroSubtitle}
          onChange={(e) => update({ heroSubtitle: e.target.value })}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-none font-serif"
        />
      </Field>
      <div className="flex flex-wrap gap-6 mt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={d.showHeroButtons !== false}
            onChange={(e) => update({ showHeroButtons: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-[12px] uppercase tracking-wider">
            Show Buttons on Top Banner
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={d.showFaqButtons !== false}
            onChange={(e) => update({ showFaqButtons: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-[12px] uppercase tracking-wider">
            Show Buttons on Mid Banner
          </span>
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Field label="Top Hero Background Image">
          <div className="flex items-start gap-4">
            {d.heroImage && (
              <img
                loading="lazy"
                src={d.heroImage}
                alt="Hero"
                className="h-24 w-auto object-cover border border-black/10"
              />
            )}
            <label className="border border-black/20 px-4 py-2 text-[10px] uppercase tracking-widest cursor-pointer hover:border-black flex items-center gap-2">
              <ImageIcon size={12} /> Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      toast.info("Uploading...");
                      const url = await uploadImage(file);
                      update({ heroImage: url });
                      toast.success("Done!");
                    } catch {
                      toast.error("Failed");
                    }
                  }
                }}
              />
            </label>
          </div>
        </Field>
        <Field label="Mid-Page Background Image (Above FAQs)">
          <div className="flex items-start gap-4">
            {d.faqBannerImage && (
              <img
                loading="lazy"
                src={d.faqBannerImage}
                alt="FAQ Banner"
                className="h-24 w-auto object-cover border border-black/10"
              />
            )}
            <label className="border border-black/20 px-4 py-2 text-[10px] uppercase tracking-widest cursor-pointer hover:border-black flex items-center gap-2">
              <ImageIcon size={12} /> Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      toast.info("Uploading...");
                      const url = await uploadImage(file);
                      update({ faqBannerImage: url });
                      toast.success("Done!");
                    } catch {
                      toast.error("Failed");
                    }
                  }
                }}
              />
            </label>
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-black/10">
        <Field label="Mid Banner Title">
          <input
            type="text"
            value={d.faqBannerTitle || ""}
            placeholder="e.g. fleur with benefits"
            onChange={(e) => update({ faqBannerTitle: e.target.value })}
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-serif italic"
          />
        </Field>
        <Field label="Mid Banner Subtitle">
          <textarea
            rows={3}
            value={d.faqBannerSubtitle || ""}
            placeholder="Join our loyalty program to access exclusive benefits..."
            onChange={(e) => update({ faqBannerSubtitle: e.target.value })}
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-none font-serif"
          />
        </Field>
      </div>

      <div className="mt-4 pt-6 border-t border-black/10">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={d.showBalanceSection !== false}
            onChange={(e) => update({ showBalanceSection: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-[12px] uppercase tracking-wider font-semibold">
            Show Black Current Balance Section
          </span>
        </label>
        <p className="text-[11px] text-gray-500 mt-1">
          If enabled, this will show the user's current tier and UPcoins below
          the top hero banner.
        </p>
      </div>
    </Section>
  );
};

export default LoyaltyBannersHeroEditor;
