import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useSiteSettingsStore, DEFAULTS } from "../store/siteSettingsStore";
import { useAuthStore } from "../store/authStore";

const LoyaltyBanner = ({ imageSrc, title, subtitle, showButtons }) => {
  const { isAuthenticated } = useAuthStore();
  return (
    <div className="relative w-full min-h-[500px] h-[75vh] md:h-[65vh] overflow-hidden flex flex-col justify-center bg-gradient-to-br from-[#222] to-[#111]">
      {imageSrc && (
        <img
          loading="lazy"
          src={imageSrc}
          alt="Loyalty Program Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-[700px] mx-auto w-full">
        {title && (
          <h1
            className="text-[55px] md:text-[75px] text-white leading-none mb-4 font-dala-roman italic"
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <p
            className="text-white text-[16px] md:text-[18px] mb-8 leading-[1.6] max-w-[620px] font-dala-roman"
          >
            {subtitle}
          </p>
        )}
        {showButtons && !isAuthenticated && (
          <div className="flex gap-4">
            <Link
              to="/login?tab=signup"
              className="border border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors text-[13px] font-bold uppercase tracking-[0.15em] px-8 py-3"
            >
              SIGN UP
            </Link>
            <Link
              to="/login"
              className="border border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors text-[13px] font-bold uppercase tracking-[0.15em] px-8 py-3"
            >
              LOG IN
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const LoyaltyProgram = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const { loyaltyData } = useSiteSettingsStore();
  const { user, isAuthenticated } = useAuthStore();
  const data = loyaltyData || DEFAULTS.loyaltyData;

  const upCoins = user?.loyaltyPoints || 0;
  const currentTier = user?.loyaltyTier || "Tier 1";

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Hero Banner */}
      <LoyaltyBanner
        imageSrc={data.heroImage}
        title={data.heroTitle}
        subtitle={data.heroSubtitle}
        showButtons={data.showHeroButtons !== false} // Default to true if undefined
      />

      {/* Current Balance Section */}
      {data.showBalanceSection !== false && (
        <div className="w-full bg-black py-16 md:py-24 flex flex-col items-center text-center px-4">
          <h2
            className="text-[40px] md:text-[55px] text-white leading-none font-dala-roman italic mb-4"
          >
            your current balance
          </h2>
          <p
            className="text-white text-[16px] md:text-[18px] font-dala-roman"
          >
            {isAuthenticated 
              ? `You are currently in ${currentTier} with ${upCoins} UPcoins.` 
              : `Log in or sign up to view your UPcoins and tier status.`}
          </p>
        </div>
      )}

      {/* Tiers Section */}
      <div className="w-full py-16 md:py-24 space-y-24 md:space-y-32 max-w-[1300px] mx-auto px-6 md:px-12">
        {(data.tiers || []).map((tier, idx) => {
          const isEven = idx % 2 !== 0;
          return (
            <div
              key={tier.id || idx}
              className={`flex flex-col ${isEven ? "md:flex-row-reverse" : "md:flex-row"} items-center justify-between gap-12 md:gap-24 lg:gap-32`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <img
                  loading="lazy"
                  src={tier.image}
                  alt={tier.tier}
                  className={`w-full max-w-[450px] md:max-w-[550px] lg:max-w-[600px] h-auto object-cover aspect-square ${isEven ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"} mx-auto`}
                />
              </div>

              {/* Text Content */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                <div className="w-full max-w-[450px] flex flex-col items-center text-center px-4">
                  <h2
                    className="text-[45px] md:text-[60px] text-black leading-none font-dala-roman italic mb-4"
                  >
                    {tier.tier}
                  </h2>
                  <p
                    className="text-[16px] md:text-[20px] text-black whitespace-pre-line font-dala-roman mb-6"
                  >
                    {tier.subtitle}
                  </p>

                  <div className="flex flex-col items-center w-full space-y-2.5">
                    {(tier.benefits || []).map((benefit, bIdx) => (
                      <p
                        key={bIdx}
                        className="text-[12px] md:text-[13px] font-medium font-sans text-black leading-[1.6]"
                      >
                        {benefit}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Second Banner above FAQs */}
      <LoyaltyBanner
        imageSrc={data.faqBannerImage}
        title={data.faqBannerTitle || "UnderPure with benefits"}
        subtitle={data.faqBannerSubtitle || "Join our loyalty program to access exclusive benefits every time you shop. Create an account now to start earning rewards."}
        showButtons={data.showFaqButtons !== false} // Default to true if undefined
      />

      {/* Got Questions Section */}
      <div className="bg-white pt-24 pb-32">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-[45px] md:text-[55px] text-black text-center mb-16 font-serif italic">
            {data.faqTitle || "got questions?"}
          </h2>

          <div className="border-t border-gray-200">
            {(data.faqs || []).map((faq, idx) => (
              <div key={faq.id || idx} className="border-b border-gray-200">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center py-5 text-left bg-transparent border-none cursor-pointer group"
                >
                  <span className="text-[13px] md:text-[16px] text-black group-hover:opacity-70 transition-opacity pr-4 font-serif">
                    {faq.q}
                  </span>
                  <svg
                    viewBox="0 0 200 100"
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? "rotate-0" : "rotate-180"}`}
                    fill="currentColor"
                  >
                    <path d="M 0,100 C 60,100 85,50 100,0 C 115,50 140,100 200,100 Z" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-400 ease-in-out ${
                    openFaq === idx ? "max-h-[300px]" : "max-h-0"
                  }`}
                >
                  <p className="text-[13px] text-gray-600 leading-relaxed pb-6 pl-0 pr-8 font-serif">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;
