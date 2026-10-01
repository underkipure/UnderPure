import React, { useState, useEffect } from "react";
import { useSiteSettingsStore } from "../../store/siteSettingsStore";
import { useAuthStore } from "../../store/authStore";
import { useCategoryStore } from "../../store/categoryStore";

import MobileMenuHeader from "./components/MobileMenuHeader";
import MobileMenuNavList from "./components/MobileMenuNavList";
import MobileMenuUtilities from "./components/MobileMenuUtilities";
import MobileMenuCategoryPanel from "./components/MobileMenuCategoryPanel";
import MobileMenuGroupPanel from "./components/MobileMenuGroupPanel";

const MobileMenuDrawer = ({ isOpen, toggleMenu }) => {
  const megaMenuData = useSiteSettingsStore((s) => s.megaMenuData);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { categories } = useCategoryStore();
  const [activeCat, setActiveCat] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [openUtilSection, setOpenUtilSection] = useState(null);

  const getPromoImage = (promo) => {
    if (!promo) return "";
    const linkedCat = promo.categoryId
      ? categories.find((c) => String(c.id) === String(promo.categoryId))
      : null;
    return promo.hasCustomImage
      ? promo.customImage || promo.image
      : promo.image || linkedCat?.image || "";
  };

  const headerCats = megaMenuData?.menus || [];

  const toggleUtil = (section) => {
    setOpenUtilSection(openUtilSection === section ? null : section);
  };

  // Reset to main menu when drawer closes and handle body scroll
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.overflow = "";
      setTimeout(() => {
        setActiveCat(null);
        setActiveGroup(null);
      }, 300);
    } else {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998] transition-opacity lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={`fixed top-0 left-0 h-full w-[80vw] md:w-[40vw] bg-white z-[999] transform transition-transform duration-300 ease-in-out flex flex-col lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <MobileMenuHeader
          activeCat={activeCat}
          activeGroup={activeGroup}
          setActiveCat={setActiveCat}
          setActiveGroup={setActiveGroup}
          isAuthenticated={isAuthenticated}
          logout={logout}
          toggleMenu={toggleMenu}
        />

        {/* Scrollable Area */}
        <div className="relative flex-1 overflow-hidden bg-white">
          {/* Main Menu Panel */}
          <div
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out overflow-y-auto no-scrollbar ${
              activeCat ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            {/* Navigation Items */}
            <MobileMenuNavList
              headerCats={headerCats}
              setActiveCat={setActiveCat}
              toggleMenu={toggleMenu}
            />

            {/* Utility Accordion Sections */}
            <MobileMenuUtilities
              openUtilSection={openUtilSection}
              toggleUtil={toggleUtil}
              isAuthenticated={isAuthenticated}
              user={user}
              logout={logout}
              toggleMenu={toggleMenu}
            />
          </div>

          {/* Sub Menu Panel (Category Panel) */}
          <div
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out overflow-y-auto no-scrollbar bg-white pb-[10vw] md:pb-[5vw] ${
              activeCat && !activeGroup
                ? "translate-x-0"
                : activeCat && activeGroup
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <MobileMenuCategoryPanel
              activeCat={activeCat}
              activeGroup={activeGroup}
              setActiveGroup={setActiveGroup}
              getPromoImage={getPromoImage}
              toggleMenu={toggleMenu}
            />
          </div>

          {/* Sub-Group Panel (Redirect Sub-List Panel) */}
          <div
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out overflow-y-auto no-scrollbar bg-white pb-[10vw] md:pb-[5vw] ${
              activeGroup ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <MobileMenuGroupPanel
              activeGroup={activeGroup}
              toggleMenu={toggleMenu}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenuDrawer;
