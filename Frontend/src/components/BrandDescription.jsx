import React, { useState } from "react";
import { useSiteSettingsStore, DEFAULTS } from "../store/siteSettingsStore";

const BrandDescription = () => {
  const [showMore, setShowMore] = useState(false);
  const brandDescription = useSiteSettingsStore((s) => s.brandDescription);
  const storeName = useSiteSettingsStore((s) => s.storeName);
  const data = brandDescription;

  if (!data || (!data.p1 && !data.heading && !data.p2)) {
    return null;
  }

  // Using a coral/salmon color
  const highlightColor = "#e86b5c";

  return (
    <>
      <section className="pt-[6vw] pb-[3vw] px-[6vw] md:px-[20vw] w-full border-t border-gray-200 text-center md:text-left">
        {data.heading && (
          <h2
            className="text-[4.5vw] md:text-[1.2vw] font-dala-roman text-black mb-[2vw] md:mb-[1vw]"
          >
            {data.heading}
          </h2>
        )}
        {data.p1 && (
          <p className="text-[3vw] md:text-[0.75vw] font-sans font-bold text-black leading-[2] mb-[2vw] md:mb-[1vw] tracking-wide">
            {(() => {
              const text = data.p1;
              const firstSpace = text.indexOf(" ");
              if (firstSpace === -1) return text;
              const firstWord = text.substring(0, firstSpace);
              const rest = text.substring(firstSpace);
              return (
                <>
                  <span
                    className="text-[#e86b5c] underline decoration-current underline-offset-[3px] cursor-pointer hover:opacity-70"
                  >
                    {firstWord}
                  </span>
                  {rest}
                </>
              );
            })()}
          </p>
        )}
        {data.p2 && (
          <p className="text-[2.5vw] md:text-[0.7vw] font-sans font-bold text-black leading-[2] mb-[4vw] md:mb-[2vw] tracking-wide">
            {data.p2}
          </p>
        )}

        {showMore && (data.p3 || data.p4) && (
          <div className="text-[2.5vw] md:text-[0.7vw] font-sans font-bold text-black leading-[2] mb-[4vw] md:mb-[2vw] tracking-wide animate-in fade-in duration-300">
            {data.p3 && (
              <p className="mb-[4vw] md:mb-[2vw]">
                {data.p3}
              </p>
            )}
            {data.p4 && (
              <p>
                {data.p4}
              </p>
            )}
          </div>
        )}

        {(data.p3 || data.p4) && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-[3vw] md:text-[0.8vw] font-sans text-[#e86b5c] hover:opacity-70 transition-opacity"
          >
            {showMore ? "Show Less <" : "Show More >"}
          </button>
        )}
      </section>
    </>
  );
};

export default BrandDescription;
