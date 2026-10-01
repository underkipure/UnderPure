import React from "react";
import { Link } from "react-router-dom";
import { FooterSocialLinks } from "./FooterSocialIcons";

const FooterBottomBar = ({
  year,
  storeName,
  socialLinks,
  affiliates,
  customerDataReq,
  doNotSell,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center pt-[2vw] pb-[6vw] md:pb-[1vw] gap-[4vw] md:gap-0">
      <div className="flex justify-center items-center w-full md:w-[30%] text-center md:text-left">
        <div className="text-[3vw] md:text-[0.7vw] font-medium text-black whitespace-nowrap tracking-[0.01em]">
          © {year},{" "}
          <span className="underline underline-offset-2 hover:opacity-70 cursor-pointer">
            {storeName}
          </span>{" "}
          All Rights Reserved.
        </div>
      </div>

      {/* Social Icons (Desktop only) */}
      <FooterSocialLinks
        socialLinks={socialLinks}
        className="hidden md:flex w-[40%] justify-center space-x-[1vw]"
      />

      <div className="flex flex-wrap justify-center md:justify-end gap-x-[4vw] md:gap-x-[1vw] gap-y-[2vw] text-[3vw] md:text-[0.7vw] font-medium text-black w-full md:w-[80%] underline md:no-underline underline-offset-2 tracking-[0.01em]">
        <Link
          to="/privacy"
          className="hover:opacity-70 decoration-black/30 hover:decoration-black"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          className="hover:opacity-70 decoration-black/30 hover:decoration-black"
        >
          Terms Of Use
        </Link>
        {affiliates?.enabledInFooter !== false && (
          <Link
            to="/affiliates"
            className="hover:opacity-70 decoration-black/30 hover:decoration-black"
          >
            Affiliates
          </Link>
        )}
        <Link
          to="/cookie-declaration"
          className="hover:opacity-70 decoration-black/30 hover:decoration-black"
        >
          Cookie Declaration
        </Link>
        {customerDataReq?.enabledInFooter !== false && (
          <Link
            to="/data-requests"
            className="hover:opacity-70 decoration-black/30 hover:decoration-black"
          >
            Customer Data Requests
          </Link>
        )}
        {doNotSell?.enabledInFooter !== false && (
          <Link
            to="/do-not-sell"
            className="hover:opacity-70 decoration-black/30 hover:decoration-black"
          >
            Do Not Sell My Data
          </Link>
        )}
      </div>
    </div>
  );
};

export default FooterBottomBar;
