import React from "react";
import { Link } from "react-router-dom";

const FooterCompanyInfoColumn = ({ companyInfoTitle, companyInfoLinks }) => {
  return (
    <div className="hidden md:flex md:w-[18%] flex-col text-left">
      <h4 className="text-[0.8vw] font-sans font-bold uppercase tracking-[0.06em] text-black mb-[1vw]">
        {companyInfoTitle}
      </h4>
      <ul className="space-y-[0.4vw] flex-grow tracking-[0.02em]">
        {companyInfoLinks.map((link) => {
          const label = typeof link?.label === "string" ? link.label : (typeof link?.name === "string" ? link.name : "");
          if (!label) return null;
          return (
            <li key={link.id || label}>
              <Link
                to={typeof link.url === "string" ? link.url : "#"}
                className="text-[0.8vw] font-medium text-black hover:opacity-70"
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FooterCompanyInfoColumn;
