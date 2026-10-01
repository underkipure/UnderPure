import React from "react";
import { Link } from "react-router-dom";

const FooterGetHelpColumn = ({
  fd = {},
  getHelpTitle = "GET HELP",
  getHelpLinks = [],
  isAuthenticated,
  affiliates,
  careers,
}) => {
  return (
    <div className="hidden md:flex md:w-[18%] flex-col text-left">
      <h4 className="text-[0.8vw] font-sans font-bold uppercase tracking-[0.06em] text-black mb-[1vw]">
        {getHelpTitle}
      </h4>
      <ul className="space-y-[0.4vw] tracking-[0.005vw]">
        {getHelpLinks.map((link) => {
          const label =
            typeof link?.label === "string"
              ? link.label
              : typeof link?.name === "string"
              ? link.name
              : "";
          if (!label) return null;

          const rawUrl = typeof link?.url === "string" ? link.url : "#";

          // Special Chat Widget Trigger
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
                  className="text-[0.8vw] font-medium text-black hover:opacity-70 text-left cursor-pointer"
                >
                  {label}
                </button>
              </li>
            );
          }

          // Special My Account / Sign In Auth URL
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

          // Affiliates toggle check
          if (
            targetUrl === "/affiliates" &&
            affiliates?.enabledInGetHelp === false
          ) {
            return null;
          }

          // Careers toggle check
          if (targetUrl === "/careers" && careers?.enabledInFooter === false) {
            return null;
          }

          return (
            <li key={link.id || label}>
              <Link
                to={targetUrl}
                className="text-[0.8vw] font-medium text-black hover:opacity-70"
              >
                {displayLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FooterGetHelpColumn;
