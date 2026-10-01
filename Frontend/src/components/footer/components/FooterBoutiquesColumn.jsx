import React from "react";
import { Link } from "react-router-dom";
import { fixImageUrl, optimizeImage } from "../../../lib/productUtils";

const FooterBoutiquesColumn = ({ fd, storeName, boutiqueLocations }) => {
  const boutiqueImg = fd?.boutiqueImage ? optimizeImage(fixImageUrl(fd.boutiqueImage), { width: 400, height: 500 }) : null;

  return (
    <div className="flex flex-row gap-[4vw] md:gap-[1vw] md:w-[40%] text-left items-start">
      {boutiqueImg && (
        <div className="w-[35vw] h-[45vw] md:w-[13vw] md:h-[16vw] bg-gray-100 shrink-0 overflow-hidden">
          <img
            loading="lazy"
            src={boutiqueImg}
            alt="Boutiques"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {fd?.boutiquesEnabled && (
        <div className="flex-1 md:w-[40%] flex flex-col justify-start tracking-[0.001em]">
          <h4
            className="font-dala-roman text-[6vw] md:text-[1.5vw] text-black mb-[3vw] md:mb-[0.5vw] font-normal tracking-wide"
          >
            {storeName || "UnderPure"}
          </h4>
          {fd?.boutiqueDescription && (
            <p className="text-[3.5vw] md:text-[0.8vw] text-black leading-relaxed mb-[4vw] md:mb-[1vw] font-bold md:font-medium">
              {fd.boutiqueDescription}
            </p>
          )}
          {boutiqueLocations && boutiqueLocations.length > 0 && (
            <div className="text-[3.5vw] md:text-[0.8vw] text-black leading-relaxed mb-[6vw] md:mb-[1.5vw] font-bold md:font-medium">
              {boutiqueLocations.map((loc, idx) => (
                <React.Fragment key={loc.id || idx}>
                  {loc.city ? `${loc.city} | ` : ""}{loc.address}
                  <br />
                </React.Fragment>
              ))}
            </div>
          )}
          {fd?.boutiqueCta && (
            <div>
              <Link
                to={fd.boutiqueCtaLink || "/boutiques"}
                className="text-[3.5vw] md:text-[0.8vw] font-bold md:font-medium uppercase underline underline-offset-4 decoration-black tracking-[0.01em] hover:opacity-70"
              >
                {fd.boutiqueCta}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FooterBoutiquesColumn;
