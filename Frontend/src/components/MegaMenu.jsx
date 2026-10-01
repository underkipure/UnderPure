import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSiteSettingsStore } from "../store/siteSettingsStore";
import { useCategoryStore } from "../store/categoryStore";

const MegaMenu = ({ isHeaderHovered }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const megaMenuData = useSiteSettingsStore((s) => s.megaMenuData);
  const { categories } = useCategoryStore();

  const headerCats = megaMenuData?.menus || [];
  const hoveredCat = hoveredIndex !== null ? headerCats[hoveredIndex] : null;

  return (
    <nav
      className="w-full pb-[1.2vw] pt-[0.5vw]"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="flex flex-wrap justify-center gap-x-[2vw] px-[0vw] transition-colors duration-300 relative">
        {headerCats.map((cat, index) => {
          const isSale = cat.isRed;
          return (
            <div
              key={cat.id}
              className="group relative tracking-subtle"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              <Link
                to={cat.url || "#"}
                className={`text-[0.87vw] font-sans  tracking-[0.001em] transition-opacity whitespace-nowrap py-[1vw] ${
                  isSale
                    ? "text-red-600"
                    : isHeaderHovered
                      ? "text-black"
                      : "text-white"
                }`}
              >
                {cat.name.toUpperCase()}
              </Link>
              {/* Active indicator underline */}
              {hoveredIndex === index && (
                <div className="absolute left-0 bottom-[0vw] w-full h-[1px] bg-black" />
              )}
            </div>
          );
        })}
      </div>

      {/* Full-width Mega Menu Dropdown */}
      <div
        className={`absolute top-full left-0 w-full bg-white transition-all duration-300 transform origin-top z-40 ${
          hoveredIndex !== null && hoveredCat?.hasDropdown
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        {hoveredCat && hoveredCat.hasDropdown && (
          <div className="w-fit max-w-[95vw] mx-auto px-[3vw] py-[1.5vw] flex justify-center gap-[1vw]">
            {/* Left: Links */}
            <div className="flex shrink-0 gap-[1vw]">
              {hoveredCat.linkGroups && hoveredCat.linkGroups.length > 0 ? (
                hoveredCat.linkGroups.map((group, gIdx) => (
                  <div key={gIdx} className="w-[10vw] shrink-0">
                    <h3 className="font-bold text-[0.9vw] font-sans text-black mb-[0.5vw] uppercase tracking-[0.01em]">
                      {group.title}
                    </h3>
                    <ul className="space-y-[0.8vw] tracking-[-0.01em]">
                      {group.links.map((link) => {
                        if (link.isDivider) {
                          return (
                            <li
                              key={link.id || Math.random()}
                              className="pt-[0.1vw] pb-[0.1vw]"
                            >
                              <div className="w-[1.2vw] h-[1px] bg-black"></div>
                            </li>
                          );
                        }
                        return (
                          <li key={link.id || Math.random()}>
                            <Link
                              to={link.url}
                              className={`text-[0.85vw] font-sans hover:opacity-70 transition-opacity ${
                                link.isSpecial
                                  ? "font-bold text-black"
                                  : "text-black"
                              }`}
                            >
                              {link.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="w-[12vw] shrink-0">
                  <h3 className="font-bold text-[0.9vw] font-sans text-black mb-[0.5vw] uppercase tracking-[0.01em]">
                    {hoveredCat.name}
                  </h3>
                  <ul className="space-y-[0.8vw] tracking-[-0.01em]">
                    {/* Dynamic ALL Link */}
                    <li>
                      <Link
                        to={hoveredCat.url || "#"}
                        className="text-[0.85vw] font-sans hover:opacity-70 transition-opacity text-black capitalize"
                      >
                        All {hoveredCat.name.toLowerCase()}
                      </Link>
                    </li>
                    {(hoveredCat.links || []).map((link) => {
                      if (link.isDivider) {
                        return (
                          <li key={link.id || Math.random()}>
                            <div className="w-[1.2vw] h-[1px] bg-black"></div>
                          </li>
                        );
                      }
                      return (
                        <li key={link.id || Math.random()}>
                          <Link
                            to={link.url}
                            className={`text-[0.85vw] font-sans hover:opacity-70 transition-opacity ${
                              link.isSpecial
                                ? "font-bold text-black"
                                : "text-black"
                            }`}
                          >
                            {link.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: Promo images */}
            <div className="flex justify-start gap-[1.5vw] shrink-0">
              {(hoveredCat.promos || []).map((promo) => {
                const linkedCat = promo.categoryId
                  ? categories.find((c) => String(c.id) === String(promo.categoryId))
                  : null;
                const promoImg = promo.hasCustomImage
                  ? (promo.customImage || promo.image)
                  : (promo.image || linkedCat?.image || "");

                return (
                  <Link
                    to={promo.url}
                    key={promo.id}
                    className="group block w-[16vw] shrink-0"
                  >
                    <div className="w-full bg-[#f9f9f9] overflow-hidden">
                      {promoImg ? (
                        <img
                          loading="lazy"
                          src={promoImg}
                          className="w-[16vw] h-[17vw] object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={promo.title}
                          onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.classList.add(
                            "flex",
                            "items-center",
                            "justify-center",
                          );
                          e.target.parentElement.innerHTML =
                            '<span class="text-gray-400 text-[0.8vw] italic">No Image</span>';
                        }}
                      />
                    ) : (
                      <div className="w-[16vw] h-[17vw] flex items-center justify-center text-gray-400 text-[0.8vw] italic">
                        No Image
                      </div>
                    )}
                  </div>
                  <h4
                    className="text-[0.9vw] font-medium font-sans text-black mt-[0.8vw] mb-[0.2vw] flex items-center tracking-subtle"
                  >
                    {promo.title}
                    <svg
                      viewBox="0 0 200 100"
                      className="ml-[0.4vw] w-[1.2vw] h-[1.2vw] rotate-90"
                      fill="currentColor"
                    >
                      <path d="M 0,100 C 60,100 85,50 100,0 C 115,50 140,100 200,100 Z" />
                    </svg>
                  </h4>
                  {promo.description && (
                    <p className="text-[0.75vw] font-sans text-black mt-[0.2vw] leading-snug pr-[1vw]">
                      {promo.description}
                    </p>
                  )}
                </Link>
                );
              })}
              {(hoveredCat.promos || []).length === 0 && (
                <>
                  {hoveredCat.links
                    ?.filter((l) => l.image && !l.isDivider)
                    .slice(0, 3)
                    .map((subLink, idx) => (
                      <Link
                        to={subLink.url}
                        key={"subimg-" + idx}
                        className="group block w-[16vw] shrink-0"
                      >
                        <div className="w-[16vw] h-[17vw] bg-[#f9f9f9] overflow-hidden">
                          <img
                            loading="lazy"
                            src={subLink.image}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            alt={subLink.name}
                          />
                        </div>
                        <h4
                          className="text-[0.9vw] font-medium font-sans text-black mt-[0.8vw] flex items-center tracking-subtle"
                        >
                          {subLink.name}
                          <svg
                            viewBox="0 0 200 100"
                            className="ml-[0.4vw] w-[1.2vw] h-[1.2vw] rotate-90"
                            fill="currentColor"
                          >
                            <path d="M 0,100 C 60,100 85,50 100,0 C 115,50 140,100 200,100 Z" />
                          </svg>
                        </h4>
                      </Link>
                    ))}
                  {hoveredCat.links?.filter((l) => l.image && !l.isDivider)
                    .length === 0 && (
                    <div className="text-[1.2vw] text-gray-400 italic pt-[1vw]">
                      No promotional images or subcategory images found.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MegaMenu;
