import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import MobileMenuPromoCard from "./MobileMenuPromoCard";

const MobileMenuCategoryPanel = ({
  activeCat,
  activeGroup,
  setActiveGroup,
  getPromoImage,
  toggleMenu,
}) => {
  if (!activeCat) return null;

  return (
    <ul className="flex flex-col m-0 p-0 list-none">
      {activeCat.linkGroups && activeCat.linkGroups.length > 0 ? (
        (() => {
          const inlineGroups = activeCat.linkGroups.filter(
            (g, idx) =>
              (g.mobileViewType || (idx === 1 ? "redirect_list" : "inline")) ===
              "inline"
          );
          const redirectGroups = activeCat.linkGroups.filter(
            (g, idx) =>
              (g.mobileViewType || (idx === 1 ? "redirect_list" : "inline")) ===
              "redirect_list"
          );
          const bottomGroups = activeCat.linkGroups.filter(
            (g) => g.mobileViewType === "bottom_button"
          );
          const bottomPromos = (activeCat.promos || []).filter(
            (p) => p.mobileViewType === "bottom_button"
          );
          const normalPromos = (activeCat.promos || []).filter(
            (p) => p.mobileViewType !== "bottom_button"
          );

          return (
            <>
              {/* Inline column links */}
              {inlineGroups.map((group, gIdx) => (
                <React.Fragment key={"inline-" + gIdx}>
                  {group.links?.map((link) => {
                    if (link.isDivider)
                      return (
                        <li
                          key={link.id}
                          className="w-full h-px bg-[#e8e8e8] my-0"
                        ></li>
                      );
                    return (
                      <li key={link.id} className="border-b border-[#e8e8e8]">
                        <Link
                          to={link.url}
                          onClick={toggleMenu}
                          className="block px-[5vw] py-[4.5vw] md:px-[2.5vw] md:py-[2.2vw] no-underline text-[3.2vw] md:text-[1.6vw] font-sans font-bold uppercase tracking-[0.08em] text-black hover:opacity-70"
                        >
                          {link.name}
                        </Link>
                      </li>
                    );
                  })}
                </React.Fragment>
              ))}

              {/* Redirect column items (opens sub-list panel) */}
              {redirectGroups.map((group, gIdx) => (
                <li
                  key={"redirect-" + gIdx}
                  className="border-b border-[#e8e8e8]"
                >
                  <button
                    onClick={() => setActiveGroup(group)}
                    className="flex justify-between items-center w-full px-[5vw] py-[4.5vw] md:px-[2.5vw] md:py-[2.2vw] text-[3.2vw] md:text-[1.6vw] bg-transparent border-0 cursor-pointer font-sans font-bold tracking-[0.08em] uppercase text-black hover:opacity-70"
                  >
                    {group.title}
                    <ChevronRight
                      className="w-[4vw] h-[4vw] md:w-[2vw] md:h-[2vw] text-black"
                      strokeWidth={1.5}
                    />
                  </button>
                </li>
              ))}

              {/* Bottom featured buttons/links */}
              {(bottomGroups.length > 0 || bottomPromos.length > 0) && (
                <div className="pt-[4vw] pb-[2vw] px-[5vw] space-y-[3vw] border-t border-[#e8e8e8] mt-[4vw]">
                  {bottomGroups.map((group, gIdx) => (
                    <div key={"bg-" + gIdx}>
                      <button
                        onClick={() => setActiveGroup(group)}
                        className="flex items-center text-[4vw] md:text-[2vw] font-dala-roman text-black no-underline tracking-wide bg-transparent border-0 p-0 cursor-pointer hover:opacity-70"
                      >
                        <span>{group.title}</span>
                        <span className="ml-[1.5vw] text-[3.2vw] font-sans">
                          ❯
                        </span>
                      </button>
                    </div>
                  ))}
                  {bottomPromos.map((promo) => (
                    <div key={"bp-" + promo.id}>
                      <Link
                        to={promo.url || "#"}
                        onClick={toggleMenu}
                        className="flex items-center text-[4vw] md:text-[2vw] font-dala-roman text-black no-underline tracking-wide hover:opacity-70"
                      >
                        <span>{promo.title}</span>
                        <span className="ml-[1.5vw] text-[3.2vw] font-sans">
                          ❯
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Normal Promos */}
              {normalPromos.length > 0 && (
                <div className="px-[8vw] py-[6vw] md:px-[4vw] md:py-[3vw] space-y-[8vw] md:space-y-[4vw]">
                  {normalPromos.map((promo) => (
                    <MobileMenuPromoCard
                      key={promo.id}
                      promo={promo}
                      imageSrc={getPromoImage(promo)}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </div>
              )}
            </>
          );
        })()
      ) : (
        <>
          <li className="border-b border-[#e8e8e8]">
            <Link
              to={activeCat.url || "#"}
              onClick={toggleMenu}
              className="block px-[5vw] py-[4.5vw] md:px-[2.5vw] md:py-[2.2vw] no-underline text-[3.2vw] md:text-[1.6vw] font-sans font-bold uppercase tracking-[0.08em] text-black hover:opacity-70"
            >
              ALL {activeCat.name}
            </Link>
          </li>
          {activeCat.links?.map((link) => {
            if (link.isDivider)
              return (
                <li
                  key={link.id}
                  className="w-full h-px bg-[#e8e8e8] my-0"
                ></li>
              );
            return (
              <li key={link.id} className="border-b border-[#e8e8e8]">
                <Link
                  to={link.url}
                  onClick={toggleMenu}
                  className="block px-[5vw] py-[4.5vw] md:px-[2.5vw] md:py-[2.2vw] no-underline text-[3.2vw] md:text-[1.6vw] font-sans font-bold uppercase tracking-[0.08em] text-black hover:opacity-70"
                >
                  {link.name}
                </Link>
              </li>
            );
          })}

          {/* Promos */}
          {activeCat.promos && activeCat.promos.length > 0 && (
            <div className="px-[8vw] py-[6vw] md:px-[4vw] md:py-[3vw] space-y-[8vw] md:space-y-[4vw]">
              {activeCat.promos.map((promo) => (
                <MobileMenuPromoCard
                  key={promo.id}
                  promo={promo}
                  imageSrc={getPromoImage(promo)}
                  toggleMenu={toggleMenu}
                />
              ))}
            </div>
          )}
        </>
      )}
    </ul>
  );
};

export default MobileMenuCategoryPanel;
