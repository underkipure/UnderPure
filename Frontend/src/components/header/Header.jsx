import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import MegaMenu from "../MegaMenu";
import MobileMenuDrawer from "../MobileMenuDrawer";
import { useSiteSettingsStore } from "../../store/siteSettingsStore";
import { useAuthStore } from "../../store/authStore";
import AnnouncementBar from "./components/AnnouncementBar";
import HeaderLogo from "./components/HeaderLogo";
import HeaderUtilities from "./components/HeaderUtilities";

const Header = ({ toggleCart, cartCount }) => {
  const storeName = useSiteSettingsStore((s) => s.storeName);
  const footerData = useSiteSettingsStore((s) => s.footerData);
  const contactEmail = useSiteSettingsStore((s) => s.contactEmail);
  const contactPhone = useSiteSettingsStore((s) => s.contactPhone);
  const hh = footerData?.headerHelp || {};
  const { isAuthenticated, logout } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isSolid = isHovered || !isHome;

  const [isAnnouncementSticky, setIsAnnouncementSticky] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 900 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 900);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        setHeaderHidden(true);
        setIsAnnouncementSticky(true);
      } else {
        setHeaderHidden(false);
        setIsAnnouncementSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Announcement bar always visible and sticky */}
      <div className="sticky top-0 z-[100] w-full">
        <AnnouncementBar hasShadow={isAnnouncementSticky} />
      </div>

      <div className="relative w-full">
        <div
          className={`w-full z-[60] ${isHome ? "relative lg:absolute lg:top-0 lg:left-0" : "relative"}`}
        >
          <div
            className={`w-full flex flex-col transition-colors duration-300 ${
              !isSolid
                ? "lg:bg-transparent lg:border-none bg-white border-b border-gray-200"
                : "bg-white border-b border-gray-200"
            }`}
          >
            <header
              className={`w-full transition-transform duration-300 ease-out z-10 ${!isSolid ? "lg:bg-transparent lg:shadow-none bg-white shadow-sm text-black" : "bg-white shadow-sm text-black"} relative ${headerHidden ? "-translate-y-full" : "translate-y-0"}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className={`px-[4vw] md:px-[6vw] transition-colors duration-300 ${!isSolid ? "lg:bg-transparent bg-white" : "bg-white"}`}
              >
                {/* Top Row: Advisor, Logo, Utilities */}
                <div className="w-full mx-auto flex justify-between items-center h-[14vw] md:h-[4vw] md:pt-[1vw] md:mb-[0.5vw]">
                  {/* Left: Mobile Hamburger & Menu */}
                  <div className="flex-1 flex items-center">
                    <button
                      aria-label="Toggle Menu"
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="lg:hidden hover:opacity-70 flex items-center transition-colors text-black"
                    >
                      <Menu
                        className="w-[5vw] h-[5vw] md:w-[1.5vw] md:h-[1.5vw]"
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>

                  {/* Center: Logo */}
                  <HeaderLogo storeName={storeName} isSolid={isSolid} />

                  {/* Right: Utilities */}
                  <HeaderUtilities
                    isSolid={isSolid}
                    hh={hh}
                    contactPhone={contactPhone}
                    contactEmail={contactEmail}
                    isAuthenticated={isAuthenticated}
                    logout={logout}
                    navigate={navigate}
                    isSearchOpen={isSearchOpen}
                    setIsSearchOpen={setIsSearchOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                    isHome={isHome}
                    toggleCart={toggleCart}
                    cartCount={cartCount}
                  />
                </div>

                {/* Bottom Row: Navigation (Desktop Only) */}
                {isDesktop && (
                  <div className="hidden lg:flex justify-center">
                    <MegaMenu isHeaderHovered={isSolid} />
                  </div>
                )}
              </div>
            </header>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
    </>
  );
};

export default Header;
