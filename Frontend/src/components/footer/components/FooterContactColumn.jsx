import React from "react";
import { Link } from "react-router-dom";

const FooterContactColumn = ({
  fd = {},
  contactEmail,
  contactPhone,
}) => {
  const emailStr = typeof contactEmail === "string" ? contactEmail : "";
  const phoneStr = typeof contactPhone === "string" ? contactPhone : "";
  const contactTitle = fd.contactTitle || "CONTACT US";
  const returnsText = fd.contactReturnsText || "Returns Center";
  const returnsLink =
    typeof fd.contactReturnsLink === "string" && fd.contactReturnsLink
      ? fd.contactReturnsLink
      : "/returns";

  return (
    <div className="hidden md:flex md:w-[18%] flex-col text-left">
      <h4 className="text-[0.8vw] font-sans font-bold uppercase tracking-[0.06em] text-black mb-[1vw]">
        {contactTitle}
      </h4>
      <div className="mb-[0.5vw]">
        <p className="text-[0.75vw] font-bold text-black tracking-[0.03em]">
          Customer Service Hours
        </p>
        <p className="text-[0.75vw] text-black font-medium tracking-[0.01em]">
          {fd.contactServiceHours || "M-F, 10AM-6PM EST"}
        </p>
      </div>
      {emailStr && (
        <div className="mb-[1vw]">
          <p className="text-[0.75vw] font-bold text-black mb-[0vw]">
            Email us
          </p>
          <a
            href={`mailto:${emailStr}`}
            className="text-[0.75vw] text-black font-medium hover:opacity-70"
          >
            {emailStr}
          </a>
        </div>
      )}
      {phoneStr && (
        <div className="mb-[0.5vw]">
          <p className="text-[0.75vw] font-bold text-black mb-[0vw]">
            Call or text us
          </p>
          <p className="text-[0.75vw] text-black font-medium">
            {phoneStr}
          </p>
        </div>
      )}
      <div className="mt-[0.5vw]">
        <Link
          to={returnsLink}
          className="text-[0.75vw] font-bold text-black hover:opacity-70"
        >
          {returnsText}
        </Link>
      </div>
    </div>
  );
};

export default FooterContactColumn;
