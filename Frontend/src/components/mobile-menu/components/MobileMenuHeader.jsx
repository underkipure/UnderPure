import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const MobileMenuHeader = ({
  activeCat,
  activeGroup,
  setActiveCat,
  setActiveGroup,
  isAuthenticated,
  logout,
  toggleMenu,
}) => {
  return (
    <div
      className={`flex items-center ${
        activeCat || activeGroup ? "justify-between" : "justify-center"
      } px-[2vw] border-b bg-[#f5f5f5] shrink-0 h-[12vw] md:h-[6vw]`}
    >
      {activeGroup ? (
        <button
          onClick={() => setActiveGroup(null)}
          className="flex items-center text-black hover:opacity-70 p-0 bg-transparent border-0 cursor-pointer"
        >
          <ChevronLeft
            className="w-[5vw] h-[5vw] md:w-[2.5vw] md:h-[2.5vw] mr-[1vw] md:mr-[0.5vw]"
            strokeWidth={1.5}
          />
          <span className="text-[3.5vw] md:text-[1.8vw] uppercase tracking-[0.01em] font-sans font-bold mt-[0.2vw]">
            BACK TO {activeCat?.name || "MENU"}
          </span>
        </button>
      ) : activeCat ? (
        <button
          onClick={() => setActiveCat(null)}
          className="flex items-center text-black hover:opacity-70 p-0 bg-transparent border-0 cursor-pointer"
        >
          <ChevronLeft
            className="w-[5vw] h-[5vw] md:w-[2.5vw] md:h-[2.5vw] mr-[1vw] md:mr-[0.5vw]"
            strokeWidth={1.5}
          />
          <span className="text-[3.5vw] md:text-[1.8vw] uppercase tracking-[0.01em] font-sans font-bold mt-[0.2vw]">
            BACK TO MAIN MENU
          </span>
        </button>
      ) : isAuthenticated ? (
        <button
          onClick={() => {
            logout();
            toggleMenu();
          }}
          className="text-[3.2vw] md:text-[1.6vw] font-sans font-medium tracking-[0.02em] text-black no-underline bg-transparent border-0 p-0 cursor-pointer hover:opacity-70 underline underline-offset-[0.5vw]"
        >
          Sign Out
        </button>
      ) : (
        <Link
          to="/login"
          onClick={toggleMenu}
          className="text-[3.2vw] md:text-[1.6vw] font-sans font-medium tracking-[0.02em] text-black no-underline hover:opacity-70 underline underline-offset-[0.5vw]"
        >
          Sign in
        </Link>
      )}
    </div>
  );
};

export default MobileMenuHeader;
