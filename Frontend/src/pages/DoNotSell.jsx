import React from "react";
import { useSiteSettingsStore, DEFAULTS } from "../store/siteSettingsStore";
import SEO from "../components/SEO";
const renderFormattedText = (text) => {
  if (!text) return null;
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs.map((para, idx) => {
    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p
        key={idx}
        className="text-[13px] md:text-[14px] leading-[1.8] text-black mb-5 block"
      >
        {parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-bold text-black">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </p>
    );
  });
};

const DoNotSell = () => {
  const { doNotSellData } = useSiteSettingsStore();
  const data = doNotSellData || DEFAULTS.doNotSellData || {};

  return (
    <div className="bg-white pb-10">
      <SEO title={data.heading || "Do Not Sell My Data"} />
      <div className="max-w-[1430px] mx-auto px-2 md:px-12 lg:px-[20px] pt-6 lg:pt-12">
        {data.heading && (
          <h1 className="text-[35px] md:text-[50px] font-serif text-black mb-8 md:mb-14 tracking-tight font-normal leading-tight">
            {data.heading}
          </h1>
        )}

        <div className="max-w-none text-black font-sans">
          {renderFormattedText(data.content || "")}
        </div>
      </div>
    </div>
  );
};

export default DoNotSell;
