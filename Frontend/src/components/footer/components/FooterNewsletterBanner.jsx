import React from "react";
import { Link } from "react-router-dom";

const FooterNewsletterBanner = ({
  fd,
  storeName,
  isAuthenticated,
}) => {
  if (!fd.smsBannerEnabled) return null;

  return (
    <section className="bg-black text-white py-[16vw] md:py-[5.5vw] px-[4vw] text-center">
      <div className="w-[80vw] md:w-[65vw] mx-auto">
        <h2
          className="text-[8vw] md:text-[2.4vw] font-dala-roman mb-[4vw] md:mb-[1vw] tracking-wide leading-[1.3]"
        >
          {fd.smsBannerHeading ||
            `For a good time & 15% off, text LOVER to ${storeName || "UnderPure"} (35387)`}
        </h2>
        <p className="text-[3.5vw] md:text-[0.8vw] font-sans font-bold tracking-[0.001em] leading-snug mb-[5vw] md:mb-[1.5vw] w-full md:w-[40vw] mx-auto">
          {(() => {
            const subtext =
              fd.smsBannerSubtext ||
              "Sign up here for SMS texts and receive 15% off your first purchase. Plus, be the first to know about new arrivals, collaborations, exclusive offers and private events.";
            if (subtext.includes("Sign up here")) {
              const parts = subtext.split("Sign up here");
              return (
                <>
                  {parts[0]}
                  <Link
                    to={isAuthenticated ? "/account" : "/signup"}
                    className="hover:opacity-80 transition-opacity border-b border-current font-normal text-[#e86b5c]"
                  >
                    Sign up here
                  </Link>
                  {parts[1]}
                </>
              );
            }
            return subtext;
          })()}
        </p>
        <p className="text-[2.5vw] md:text-[0.6vw] font-sans text-gray-300 leading-snug w-full md:w-[45vw] mx-auto tracking-[0.01em]">
          {(() => {
            const disclaimer =
              fd.smsBannerDisclaimer ||
              `Valid only in the United States. By signing up via text, you agree to receive recurring automated promotional and personalized marketing text messages (e.g. cart reminders) from ${
                storeName || "UnderPure"
              } at the cell number used when signing up. Consent is not a condition of any purchase. Reply HELP for help and STOP to cancel. Msg frequency varies. Msg and data rates may apply. View terms will open in a new tab & Privacy will open in a new tab.`;
            const regex = /(Terms|terms|Privacy|privacy)/g;
            const parts = disclaimer.split(regex);
            return parts.map((part, i) => {
              if (part.toLowerCase() === "terms") {
                return (
                  <Link
                    key={i}
                    to="/terms"
                    className="underline hover:text-white underline-offset-2"
                  >
                    {part}
                  </Link>
                );
              }
              if (part.toLowerCase() === "privacy") {
                return (
                  <Link
                    key={i}
                    to="/privacy"
                    className="underline hover:text-white underline-offset-2"
                  >
                    {part}
                  </Link>
                );
              }
              return part;
            });
          })()}
        </p>
      </div>
    </section>
  );
};

export default FooterNewsletterBanner;
