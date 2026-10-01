import React from "react";
import { useSiteSettingsStore, DEFAULTS } from "../store/siteSettingsStore";
import SEO from "../components/SEO";

const TermsOfService = () => {
  const { termsOfServiceData } = useSiteSettingsStore();
  const data = termsOfServiceData || DEFAULTS.termsOfServiceData || {};

  return (
    <div className="min-h-screen bg-white pb-20">
      <SEO title={data.heading || "Terms of Service"} />
      <div className="max-w-[1440px] mx-auto px-2 md:px-6 py-6 lg:py-10">
        {/* Main Heading */}
        {data.heading && (
          <h1 className="text-[40px] md:text-[52px] font-serif text-black mb-0 md:mb-10 tracking-[0.01em]">
            {data.heading}
          </h1>
        )}

        {/* Sections */}
        <div>
          {data.sections?.map((section, index) => (
            <div key={index}>
              {index > 0 && <hr className="my-12 border-t border-black/10" />}
              <div className="py-4">
                {section.title && (
                  <h3 className="text-[18px] md:text-[18px] text-black mb-5">
                    {section.title}
                  </h3>
                )}
                {section.paragraphs?.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-[13px] md:text-[13px] text-black font-sans leading-[1.8] tracking-[0.01em] md:mb-4 last:mb-0"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
