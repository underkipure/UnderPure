import React, { useState } from "react";
import { useSiteSettingsStore, DEFAULTS } from "../../store/siteSettingsStore";
import { useAuthStore } from "../../store/authStore";

import { FooterSocialLinks } from "./components/FooterSocialIcons";
import FooterNewsletterBanner from "./components/FooterNewsletterBanner";
import FooterMobileAccordions from "./components/FooterMobileAccordions";
import FooterBoutiquesColumn from "./components/FooterBoutiquesColumn";
import FooterContactColumn from "./components/FooterContactColumn";
import FooterCompanyInfoColumn from "./components/FooterCompanyInfoColumn";
import FooterGetHelpColumn from "./components/FooterGetHelpColumn";
import FooterBigLogo from "./components/FooterBigLogo";
import FooterBottomBar from "./components/FooterBottomBar";

const Footer = () => {
  const storeName = useSiteSettingsStore((s) => s.storeName);
  const storedFooterData = useSiteSettingsStore((s) => s.footerData);
  const rawContactEmail = useSiteSettingsStore((s) => s.contactEmail);
  const rawContactPhone = useSiteSettingsStore((s) => s.contactPhone);
  const contactEmail = typeof rawContactEmail === "string" ? rawContactEmail : "";
  const contactPhone = typeof rawContactPhone === "string" ? rawContactPhone : "";
  const doNotSellData = useSiteSettingsStore((s) => s.doNotSellData);
  const customerDataRequests = useSiteSettingsStore((s) => s.customerDataRequests);
  const affiliatesData = useSiteSettingsStore((s) => s.affiliatesData);
  const careersData = useSiteSettingsStore((s) => s.careersData);
  const { isAuthenticated } = useAuthStore();
  const year = new Date().getFullYear();
  const [openAccordion, setOpenAccordion] = useState(null);

  const fd = storedFooterData || DEFAULTS.footerData;
  const doNotSell = doNotSellData || DEFAULTS.doNotSellData;
  const customerDataReq = customerDataRequests || DEFAULTS.customerDataRequests;
  const affiliates = affiliatesData || DEFAULTS.affiliatesData;
  const careers = careersData || DEFAULTS.careersData;

  // Merge social links respecting socialLinksEnabled and socialLinksVisibility
  const isSocialGloballyEnabled = fd?.socialLinksEnabled !== false;
  const socialVisibility = fd?.socialLinksVisibility || {};
  const defaultSocials = DEFAULTS.footerData?.socialLinks || {};
  const savedSocials = fd?.socialLinks || {};

  const platforms = ["instagram", "tiktok", "pinterest", "facebook", "youtube"];
  const socialLinks = {};

  if (isSocialGloballyEnabled) {
    platforms.forEach((platform) => {
      if (socialVisibility[platform] !== false) {
        const url =
          savedSocials[platform] !== undefined
            ? savedSocials[platform]
            : defaultSocials[platform];
        if (url && typeof url === "string" && url.trim() !== "") {
          socialLinks[platform] = url.trim();
        }
      }
    });
  }

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const defaultCompanyInfoLinks = [
    { id: 1, label: "About Us", url: "/about-us" },
    { id: 2, label: "Boutiques", url: fd?.boutiqueCtaLink || "/boutiques" },
    { id: 3, label: "Loyalty Program", url: "/loyalty-program" },
    { id: 4, label: "Take Our Survey", url: "/survey" },
  ];

  let rawCompanyInfoLinks = fd?.companyInfoLinks;
  if (
    rawCompanyInfoLinks &&
    typeof rawCompanyInfoLinks === "object" &&
    !Array.isArray(rawCompanyInfoLinks)
  ) {
    rawCompanyInfoLinks = Object.values(rawCompanyInfoLinks);
  }
  const companyInfoLinks =
    Array.isArray(rawCompanyInfoLinks) && rawCompanyInfoLinks.length > 0
      ? rawCompanyInfoLinks
      : defaultCompanyInfoLinks;

  let columns = fd?.columns;
  if (columns && typeof columns === "object" && !Array.isArray(columns)) {
    columns = Object.values(columns);
  }
  if (!Array.isArray(columns)) columns = [];

  let boutiqueLocations = fd?.boutiqueLocations;
  if (
    boutiqueLocations &&
    typeof boutiqueLocations === "object" &&
    !Array.isArray(boutiqueLocations)
  ) {
    boutiqueLocations = Object.values(boutiqueLocations);
  }
  if (!Array.isArray(boutiqueLocations)) boutiqueLocations = [];

  const companyInfoTitle = fd.companyInfoTitle || "COMPANY INFO";

  const defaultGetHelpLinks = [
    { id: 1, label: "My Account", url: "/account" },
    { id: 2, label: "Chat with a Stylist", url: "chat:open" },
    { id: 3, label: "Find Your Bra Size", url: "/bra-size" },
    { id: 4, label: "FAQs", url: "/faqs" },
    { id: 5, label: "Affiliates", url: "/affiliates" },
    { id: 6, label: "Careers", url: "/careers" },
  ];

  let rawGetHelpLinks = fd?.getHelpLinks;
  if (
    rawGetHelpLinks &&
    typeof rawGetHelpLinks === "object" &&
    !Array.isArray(rawGetHelpLinks)
  ) {
    rawGetHelpLinks = Object.values(rawGetHelpLinks);
  }
  const getHelpLinks =
    Array.isArray(rawGetHelpLinks) && rawGetHelpLinks.length > 0
      ? rawGetHelpLinks
      : defaultGetHelpLinks;

  const getHelpTitle = fd?.getHelpTitle || "GET HELP";

  return (
    <footer className="w-full font-sans">
      {/* Black Newsletter Banner */}
      <FooterNewsletterBanner
        fd={fd}
        storeName={storeName}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Footer Content */}
      <div className="bg-[#fff] pt-[8vw] md:pt-[3.8vw] overflow-hidden">
        <div className="w-full px-[5vw] md:px-[9.1vw]">
          {/* Mobile Accordions for Links */}
          <FooterMobileAccordions
            openAccordion={openAccordion}
            toggleAccordion={toggleAccordion}
            fd={fd}
            contactEmail={contactEmail}
            contactPhone={contactPhone}
            companyInfoTitle={companyInfoTitle}
            companyInfoLinks={companyInfoLinks}
            getHelpTitle={getHelpTitle}
            getHelpLinks={getHelpLinks}
            isAuthenticated={isAuthenticated}
            columns={columns}
          />

          {/* Top Section: Desktop layout & Boutiques block */}
          <div className="flex flex-col md:flex-row justify-between mb-[6vw] md:mb-[0.3vw] gap-[6vw] md:gap-[4vw] w-full">
            {/* Column 1: Boutiques */}
            <FooterBoutiquesColumn
              fd={fd}
              storeName={storeName}
              boutiqueLocations={boutiqueLocations}
            />

            {/* Desktop Contact Block */}
            <FooterContactColumn
              fd={fd}
              contactEmail={contactEmail}
              contactPhone={contactPhone}
            />

            {/* COMPANY INFO */}
            <FooterCompanyInfoColumn
              companyInfoTitle={companyInfoTitle}
              companyInfoLinks={companyInfoLinks}
            />

            {/* GET HELP */}
            <FooterGetHelpColumn
              fd={fd}
              getHelpTitle={getHelpTitle}
              getHelpLinks={getHelpLinks}
              isAuthenticated={isAuthenticated}
              affiliates={affiliates}
              careers={careers}
            />
          </div>

          {/* Social Icons (Mobile only) */}
          <FooterSocialLinks
            socialLinks={socialLinks}
            className="flex md:hidden justify-center space-x-[4vw] mb-[1vw] mt-[8vw]"
          />

          {/* Big Brand Text */}
          <FooterBigLogo fd={fd} storeName={storeName} />

          {/* Bottom Bar */}
          <FooterBottomBar
            year={year}
            storeName={storeName}
            socialLinks={socialLinks}
            affiliates={affiliates}
            customerDataReq={customerDataReq}
            doNotSell={doNotSell}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
