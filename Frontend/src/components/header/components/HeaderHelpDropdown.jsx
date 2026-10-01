import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function HeaderHelpDropdown({ isSolid, hh, contactPhone, contactEmail }) {
  const displayPhone = hh?.phone || contactPhone || "";
  const displayEmail = hh?.email || contactEmail || "";

  return (
    <div className="relative group hidden md:block">
      <div
        className={`flex items-center hover:opacity-70 cursor-pointer py-[0.5vw] ${!isSolid ? "lg:text-white text-black" : "text-black"}`}
      >
        Help
        <ChevronDown
          className="w-[1vw] h-[1vw] ml-[0.2vw]"
          strokeWidth={1.5}
        />
      </div>
      <div className="absolute top-full right-[-0.5vw] w-[16vw] bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col p-[0.8vw]">
        <div
          className="grid grid-cols-[5vw_1fr] gap-y-[0.8vw] text-[0.7vw] font-sans text-black tracking-subtle"
        >
          <div className="font-bold">Chat :</div>
          <div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(
                  new CustomEvent("open-chat-widget"),
                );
              }}
              className="underline hover:opacity-70 text-left p-0 bg-transparent border-0 cursor-pointer text-inherit font-inherit"
            >
              {hh?.chatText || "Let's chat!"}
            </button>
          </div>
          {displayPhone && (
            <>
              <div className="font-bold">Call/Text :</div>
              <div>
                <a
                  href={`tel:${displayPhone.replace(/[^0-9+]/g, "")}`}
                  className="underline hover:opacity-70"
                >
                  {displayPhone}
                </a>
              </div>
            </>
          )}
          {displayEmail && (
            <>
              <div className="font-bold">Email :</div>
              <div>
                <a
                  href={`mailto:${displayEmail}`}
                  className="underline hover:opacity-70"
                >
                  {displayEmail}
                </a>
              </div>
            </>
          )}
          <div className="font-bold">Returns :</div>
          <div>
            <Link
              to={hh?.returnsLink || "/returns"}
              className="underline hover:opacity-70"
            >
              {hh?.returnsText || "Returns center"}
            </Link>
          </div>
          <div className="font-bold">Help :</div>
          <div>
            <Link
              to={hh?.faqLink || "/faqs"}
              className="underline hover:opacity-70"
            >
              {hh?.faqText || "FAQ"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
