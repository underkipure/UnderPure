import React, { useEffect } from "react";
import SEO from "../components/SEO";
import { useSiteSettingsStore, DEFAULTS } from "../store/siteSettingsStore";

const CookieDeclaration = () => {
  const settings = useSiteSettingsStore();
  const data = settings.cookieDeclarationData || DEFAULTS.cookieDeclarationData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-5 md:pt-11 px-2 lg:px-12 xl:px-4 max-w-[1430px] mx-auto min-h-[60vh]">
      <SEO
        title={`${data.title || "Cookie Declaration"} - UnderPure`}
        description={data.introText || "Cookie Declaration"}
      />

      <h1 className="text-[39px] md:text-[52px] font-serif text-black mb-4 md:mb-20">
        {data.title || "Cookie Declaration"}
      </h1>

      <div className="px-2">
        {data.metaText && (
          <p className="text-[10px] text-black font-medium italic tracking-[0] font-sans">
            {data.metaText}
          </p>
        )}

        {data.introText && (
          <p className="text-[13px] text-black tracking-[0] font-sans leading-[1.8] max-w-[1400px]">
            {data.introText}
          </p>
        )}

        {(data.sections || []).map((section, idx) => (
          <div key={idx} className="mb-12">
            {section.heading && (
              <h2 className="text-[30px] md:text-3xl font-serif text-black mb-1">
                {section.heading}
              </h2>
            )}

            {section.description && (
              <p className="text-[13px] text-black pb-1 font-sans tracking-[0] leading-[1.5] md:leading-[1] max-w-[1400px]">
                {section.description}
              </p>
            )}

            {(section.cookies || []).length > 0 && (
              <div className="overflow-x-auto border border-black/30">
                <table className="w-full text-left border-collapse text-[10px] font-sans table-fixed">
                  <thead>
                    <tr className="border-b border-black/30 bg-white">
                      <th className="p-2 font-bold text-black border-r border-black/30 w-1/6 break-all">
                        Name
                      </th>
                      <th className="p-2 font-bold text-black border-r border-black/30 w-1/6 break-all">
                        Domain
                      </th>
                      <th className="p-2 font-bold text-black border-r border-black/30 w-1/6 break-all">
                        Retention
                      </th>
                      <th className="p-2 font-bold text-black border-r border-black/30 w-1/6 break-all">
                        Type
                      </th>
                      <th className="p-2 font-bold text-black border-r border-black/30 w-1/6 break-all">
                        Provider
                      </th>
                      <th className="p-2 font-bold text-black w-1/6 break-all">
                        Purpose
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.cookies.map((cookie, cIdx) => (
                      <tr
                        key={cIdx}
                        className="border-b border-black/30 last:border-b-0 hover:bg-gray-50/50"
                      >
                        <td className="p-2 border-r border-black/30 text-black break-all">
                          {cookie.name}
                        </td>
                        <td className="p-2 border-r border-black/30 text-black break-all">
                          {cookie.domain}
                        </td>
                        <td className="p-2 border-r border-black/30 text-black break-all">
                          {cookie.retention}
                        </td>
                        <td className="p-2 border-r border-black/30 text-black break-all">
                          {cookie.type}
                        </td>
                        <td className="p-2 border-r border-black/30 text-black break-all">
                          {cookie.provider}
                        </td>
                        <td className="p-2 text-black leading-[1.6] break-all">
                          {cookie.purpose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CookieDeclaration;
