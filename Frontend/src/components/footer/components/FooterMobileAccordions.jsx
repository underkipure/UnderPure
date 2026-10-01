import React from "react";
import { Link } from "react-router-dom";
import CustomArrow from "./CustomArrow";

const FooterMobileAccordions = ({
  openAccordion,
  toggleAccordion,
  fd = {},
  contactEmail,
  contactPhone,
  companyInfoTitle,
  companyInfoLinks = [],
  getHelpTitle = "GET HELP",
  getHelpLinks = [],
  isAuthenticated,
  columns = [],
}) => {
  const emailStr = typeof contactEmail === "string" ? contactEmail : "";
  const phoneStr = typeof contactPhone === "string" ? contactPhone : "";
  const contactTitle = fd?.contactTitle || "CONTACT US";
  const returnsText = (fd?.contactReturnsText || "RETURNS CENTER").toUpperCase();
  const returnsLink =
    typeof fd?.contactReturnsLink === "string" && fd?.contactReturnsLink
      ? fd?.contactReturnsLink
      : "/returns";

  // Filter out any redundant columns in case legacy columns contained 'Get Help' or 'Company Info'
  const filteredColumns = columns.filter((col) => {
    const title = (col?.title || "").toLowerCase();
    return title !== "get help" && title !== "company info";
  });

  return (
    <div className="block md:hidden w-full mb-[8vw]">
      {/* 1. Contact Us */}
      <div className="border-b border-black">
        <button
          type="button"
          onClick={() => toggleAccordion("contact")}
          className="w-full py-[4vw] flex justify-between items-center text-[3.5vw] font-bold uppercase tracking-widest text-black"
        >
          {contactTitle}
          <CustomArrow isOpen={openAccordion === "contact"} />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openAccordion === "contact"
              ? "max-h-[50vw] opacity-100 pb-[4vw]"
              : "max-h-0 opacity-0"
          }`}
        >
          {fd?.contactServiceHours && (
            <div className="mb-[3vw] text-left">
              <p className="text-[3vw] uppercase font-bold text-gray-500 mb-[0.5vw]">
                Service Hours
              </p>
              <p className="text-[3.5vw] text-black font-medium">
                {fd.contactServiceHours}
              </p>
            </div>
          )}
          {emailStr && (
            <div className="mb-[3vw] text-left">
              <p className="text-[3.5vw] font-bold text-black mb-[1vw]">
                Email us
              </p>
              <a
                href={`mailto:${emailStr}`}
                className="text-[3.5vw] text-black font-medium hover:underline"
              >
                {emailStr}
              </a>
            </div>
          )}
          {phoneStr && (
            <div className="text-left">
              <p className="text-[3.5vw] font-bold text-black mb-[1vw]">
                Call or text us
              </p>
              <p className="text-[3.5vw] text-black font-medium">
                {phoneStr}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Returns Center */}
      <div className="border-b border-black">
        <Link
          to={returnsLink}
          className="w-full py-[4vw] flex justify-between items-center text-[3.5vw] font-bold uppercase tracking-widest text-black"
        >
          {returnsText}
        </Link>
      </div>

      {/* 3. Company Info Mobile Accordion */}
      <div className="border-b border-black">
        <button
          type="button"
          onClick={() => toggleAccordion("company_info")}
          className="w-full py-[4vw] flex justify-between items-center text-[3.5vw] font-bold uppercase tracking-widest text-black"
        >
          {companyInfoTitle}
          <CustomArrow isOpen={openAccordion === "company_info"} />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openAccordion === "company_info"
              ? "max-h-[60vw] opacity-100 pb-[4vw]"
              : "max-h-0 opacity-0"
          }`}
        >
          <ul className="space-y-[3vw] text-left">
            {companyInfoLinks.map((link) => {
              const label =
                typeof link?.label === "string"
                  ? link.label
                  : typeof link?.name === "string"
                  ? link.name
                  : "";
              if (!label) return null;
              return (
                <li key={link.id || label}>
                  <Link
                    to={typeof link.url === "string" ? link.url : "#"}
                    className="text-[3.5vw] font-medium text-black hover:opacity-70"
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 4. Get Help Mobile Accordion */}
      <div className="border-b border-black">
        <button
          type="button"
          onClick={() => toggleAccordion("get_help")}
          className="w-full py-[4vw] flex justify-between items-center text-[3.5vw] font-bold uppercase tracking-widest text-black"
        >
          {getHelpTitle}
          <CustomArrow isOpen={openAccordion === "get_help"} />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openAccordion === "get_help"
              ? "max-h-[70vw] opacity-100 pb-[4vw]"
              : "max-h-0 opacity-0"
          }`}
        >
          <ul className="space-y-[3vw] text-left">
            {getHelpLinks.map((link) => {
              const label =
                typeof link?.label === "string"
                  ? link.label
                  : typeof link?.name === "string"
                  ? link.name
                  : "";
              if (!label) return null;

              const rawUrl = typeof link?.url === "string" ? link.url : "#";

              if (
                rawUrl === "chat:open" ||
                rawUrl === "chat" ||
                label.toLowerCase().includes("chat with a stylist")
              ) {
                return (
                  <li key={link.id || label}>
                    <button
                      type="button"
                      onClick={() =>
                        window.dispatchEvent(new CustomEvent("open-chat-widget"))
                      }
                      className="text-[3.5vw] font-medium text-black hover:opacity-70 text-left"
                    >
                      {label}
                    </button>
                  </li>
                );
              }

              let targetUrl = rawUrl;
              let displayLabel = label;
              if (
                rawUrl === "/account" ||
                rawUrl === "/login" ||
                label.toLowerCase() === "my account" ||
                label.toLowerCase() === "sign in"
              ) {
                targetUrl = isAuthenticated ? "/account" : "/login";
                displayLabel = isAuthenticated ? "My Account" : "Sign In";
              }

              return (
                <li key={link.id || label}>
                  <Link
                    to={targetUrl}
                    className="text-[3.5vw] font-medium text-black hover:opacity-70"
                  >
                    {displayLabel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 5. Additional Dynamic Columns */}
      {filteredColumns.map((col) => {
        const colLinks = Array.isArray(col.links)
          ? col.links
          : col.links && typeof col.links === "object"
          ? Object.values(col.links)
          : [];
        return (
          <div key={col.id} className="border-b border-black">
            <button
              type="button"
              onClick={() => toggleAccordion(col.id)}
              className="w-full py-[4vw] flex justify-between items-center text-[3.5vw] font-bold uppercase tracking-widest text-black"
            >
              {col.title}
              <CustomArrow isOpen={openAccordion === col.id} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openAccordion === col.id
                  ? "max-h-[60vw] opacity-100 pb-[4vw]"
                  : "max-h-0 opacity-0"
              }`}
            >
              <ul className="space-y-[3vw] text-left">
                {colLinks.map((link) => {
                  const label =
                    typeof link?.name === "string"
                      ? link.name
                      : typeof link?.label === "string"
                      ? link.label
                      : "";
                  if (!label) return null;
                  return (
                    <li key={link.id || label}>
                      <Link
                        to={typeof link.url === "string" ? link.url : "#"}
                        className="text-[3.5vw] font-medium text-black hover:opacity-70"
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FooterMobileAccordions;
