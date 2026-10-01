import React from "react";
import { useSiteSettingsStore, DEFAULTS } from "../store/siteSettingsStore";
import SEO from "../components/SEO";

const Affiliates = () => {
  const { affiliatesData } = useSiteSettingsStore();
  const data = affiliatesData || DEFAULTS.affiliatesData || {};

  return (
    <div className="bg-white pb-16 md:pb-28">
      <SEO title={data.heading || "Become an Affiliate"} />
      <div className="max-w-[1100px] mx-auto px-2 md:px-6 py-8 lg:pt-12 lg:pb-0">
        {/* Main Heading */}
        {data.heading && (
          <h1
            className="text-[32px] md:text-[46px] text-black text-center mb-8 md:mb-16 font-dala-roman"
          >
            {data.heading}
          </h1>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-18">
          {data.columns?.map((col, index) => (
            <div key={index}>
              {/* Column Title */}
              <h2 className="text-[15px] uppercase tracking-[0.02em] font-semibold text-black mb-8 font-sans">
                {col.title}
              </h2>

              {/* Paragraphs */}
              <div className="space-y-8 mb-8">
                {col.paragraphs?.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-[10] md:text-[10px] md:text-[14px] text-black font-sans leading-relaxed tracking-[0.01em]"
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-5">
                {col.buttons?.map((btn, bIdx) => (
                  <a
                    key={bIdx}
                    href={btn.url || "#"}
                    target={
                      btn.url && btn.url.startsWith("http") ? "_blank" : "_self"
                    }
                    rel="noreferrer"
                    className="inline-block bg-black text-center text-white text-[12px] md:text-[12px] uppercase tracking-[0.1em] font-bold font-sans px-7 py-4 hover:bg-gray-800 transition-colors w-[250px] md:w-[250px]"
                  >
                    {btn.text}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Affiliates;
