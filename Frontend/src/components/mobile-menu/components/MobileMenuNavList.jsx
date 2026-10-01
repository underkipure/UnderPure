import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const MobileMenuNavList = ({ headerCats, setActiveCat, toggleMenu }) => {
  return (
    <ul className="flex flex-col m-0 p-0 list-none">
      {headerCats.map((cat) => {
        const hasDropdown =
          cat.hasDropdown &&
          (cat.links?.length > 0 ||
            cat.promos?.length > 0 ||
            cat.linkGroups?.length > 0);
        const isSale = cat.isRed;

        return (
          <li key={cat.id} className="border-b border-[#e8e8e8]">
            {hasDropdown ? (
              <button
                onClick={() => setActiveCat(cat)}
                className={`flex justify-between items-center w-full px-[5vw] py-[4vw] md:px-[2.5vw] md:py-[2vw] text-[3.2vw] md:text-[1.6vw] bg-transparent border-0 cursor-pointer font-sans font-bold tracking-[0.08em] uppercase ${
                  isSale ? "text-[#a47a69]" : "text-black"
                }`}
              >
                {cat.name}
                <ChevronRight
                  className="w-[4vw] h-[4vw] md:w-[2vw] md:h-[2vw] text-[#000000]"
                  strokeWidth={1.5}
                />
              </button>
            ) : (
              <Link
                to={cat.url || "#"}
                onClick={toggleMenu}
                className={`block px-[5vw] py-[4vw] md:px-[2.5vw] md:py-[2vw] text-[3.2vw] md:text-[1.6vw] no-underline font-sans font-bold tracking-[0.08em] uppercase ${
                  isSale ? "text-[#a47a69]" : "text-black"
                }`}
              >
                {cat.name}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default MobileMenuNavList;
