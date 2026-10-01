import React from "react";
import { useSiteSettingsStore, DEFAULTS } from "../store/siteSettingsStore";
import SEO from "../components/SEO";

const PrivacyPolicy = () => {
  const { privacyPolicyData } = useSiteSettingsStore();
  const data = privacyPolicyData || DEFAULTS.privacyPolicyData || {};

  return (
    <div className="min-h-screen bg-white pb-36">
      <SEO title={data.heading || "Privacy Policy"} />
      <div className="max-w-[750px] mx-auto px-4 md:px-6 py-0 lg:py-1">
        {/* Main Heading — italic serif lowercase */}
        {data.heading && (
          <h1
            className="text-[44px] md:text-[48px] font-dala-roman text-black mb-0 md:mb-4 text-center tracking-tight"
          >
            {data.heading}
          </h1>
        )}

        {/* Last Updated */}
        {data.lastUpdated && (
          <p className="text-[12px] uppercase tracking-[0.015em] text-black font-sans font-medium mb-4 text-start">
            {data.lastUpdated}
          </p>
        )}

        {/* Intro Paragraphs (no title) */}
        {data.introParagraphs?.length > 0 && (
          <div className="mb-6 space-y-4">
            {data.introParagraphs.map((para, idx) => (
              <p
                key={idx}
                className="text-[13px] text-black font-sans tracking-[0.015em] leading-[1.7]"
              >
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Sections */}
        <div className="space-y-8">
          {data.sections?.map((section, index) => (
            <div key={index}>
              {/* Section Title — uppercase bold */}
              {section.title && (
                <h2 className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.015em] text-black mb-1 font-sans">
                  {section.title}
                </h2>
              )}

              {/* Paragraphs before bullets */}
              {section.paragraphs?.map((para, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[13px] text-black font-sans tracking-[0.015em] leading-[1.85] mb-2 pb-2"
                >
                  {para}
                </p>
              ))}

              {/* Bullet List */}
              {section.bullets?.length > 0 && (
                <ul className="space-y-1.5">
                  {section.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-3 text-[13px] text-black font-sans tracking-[0.015em] leading-[1] pl-2"
                    >
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Extra paragraphs after bullets */}
              {section.afterBulletParagraphs?.map((para, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[13px] text-black font-sans tracking-[0.015em] leading-[1.85] mb-3 mt-3"
                >
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
