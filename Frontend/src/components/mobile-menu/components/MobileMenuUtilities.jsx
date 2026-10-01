import React from "react";
import { Link } from "react-router-dom";

const MobileMenuUtilities = ({
  openUtilSection,
  toggleUtil,
  isAuthenticated,
  user,
  logout,
  toggleMenu,
}) => {
  return (
    <>
      <div className="bg-[#f5f5f5] w-full">
        {/* MY ACCOUNT */}
        <div className="border-b border-[#e8e8e8]">
          <button
            onClick={() => toggleUtil("account")}
            className="flex justify-between items-center w-full px-[5vw] py-[4.5vw] md:px-[2.5vw] md:py-[2.2vw] text-[3vw] md:text-[1.5vw] bg-transparent border-0 cursor-pointer font-sans font-bold tracking-[0.01em] uppercase text-black"
          >
            MY ACCOUNT
            <span className="text-[4.5vw] md:text-[2.2vw] font-light leading-none">
              {openUtilSection === "account" ? "−" : "+"}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openUtilSection === "account"
                ? "max-h-[80vw] md:max-h-[40vw] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[10vw] pr-[5vw] pb-[5vw] pt-0 md:pl-[5vw] md:pr-[2.5vw] md:pb-[2.5vw] space-y-[4vw] md:space-y-[2vw]">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="block text-[3vw] md:text-[1.5vw] no-underline font-sans font-medium tracking-[0.01em] text-[#000] uppercase hover:opacity-70"
                >
                  SIGN IN
                </Link>
              ) : (
                <Link
                  to="/account"
                  onClick={toggleMenu}
                  className="block text-[3vw] md:text-[1.5vw] no-underline font-sans font-medium tracking-[0.01em] text-[#000] uppercase hover:opacity-70"
                >
                  MY ACCOUNT
                </Link>
              )}
              <Link
                to={isAuthenticated ? "/account?tab=orders" : "/login"}
                onClick={toggleMenu}
                className="block text-[3vw] md:text-[1.5vw] no-underline font-sans font-medium tracking-[0.01em] text-[#000] uppercase hover:opacity-70"
              >
                MY ORDERS
              </Link>
              <Link
                to="/loyalty-program"
                onClick={toggleMenu}
                className="block text-[3vw] md:text-[1.5vw] no-underline font-sans font-medium tracking-[0.01em] text-[#000] uppercase hover:opacity-70"
              >
                {isAuthenticated
                  ? user?.loyalty_points > 0
                    ? `${user.loyalty_points} UP`
                    : "UP POINTS"
                  : "LOYALTY PROGRAM"}
              </Link>
              <Link
                to="/account?tab=lovelist"
                onClick={toggleMenu}
                className="block text-[3vw] md:text-[1.5vw] no-underline font-sans font-medium tracking-[0.01em] text-[#000] uppercase hover:opacity-70"
              >
                LOVELIST
              </Link>
              <Link
                to="/account?tab=returns"
                onClick={toggleMenu}
                className="block text-[3vw] md:text-[1.5vw] no-underline font-sans font-medium tracking-[0.01em] text-[#000] uppercase hover:opacity-70"
              >
                START A RETURN
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="block text-[3vw] md:text-[1.5vw] font-sans font-medium tracking-[0.01em] text-[#000] bg-transparent border-0 p-0 cursor-pointer hover:opacity-70 text-left w-full uppercase"
                >
                  LOGOUT
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LOYALTY */}
        <div className="border-b border-[#e8e8e8]">
          <button
            onClick={() => toggleUtil("loyalty")}
            className="flex justify-between items-center w-full px-[5vw] py-[4.5vw] md:px-[2.5vw] md:py-[2.2vw] text-[3vw] md:text-[1.5vw] bg-transparent border-0 cursor-pointer font-sans font-bold tracking-[0.12em] uppercase text-black"
          >
            LOYALTY
            <span className="text-[4.5vw] md:text-[2.2vw] font-light leading-none">
              {openUtilSection === "loyalty" ? "−" : "+"}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openUtilSection === "loyalty"
                ? "max-h-[40vw] md:max-h-[20vw] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[10vw] pr-[5vw] pb-[5vw] pt-0 md:pl-[5vw] md:pr-[2.5vw] md:pb-[2.5vw] space-y-[4vw] md:space-y-[2vw]">
              <Link
                to="/loyalty-program"
                onClick={toggleMenu}
                className="block text-[3vw] md:text-[1.5vw] no-underline font-sans font-medium tracking-[0.01em] text-[#000] uppercase hover:opacity-70"
              >
                {isAuthenticated
                  ? user?.loyalty_points > 0
                    ? `${user.loyalty_points} UP`
                    : "UP POINTS"
                  : "LOYALTY PROGRAM"}
              </Link>
            </div>
          </div>
        </div>

        {/* GET HELP */}
        <div className="border-b border-[#efefef]">
          <button
            onClick={() => toggleUtil("help")}
            className="flex justify-between items-center w-full px-[5vw] py-[4.5vw] md:px-[2.5vw] md:py-[2.2vw] text-[3vw] md:text-[1.5vw] bg-transparent border-0 cursor-pointer font-sans font-bold tracking-[0.12em] uppercase text-black"
          >
            GET HELP
            <span className="text-[4.5vw] md:text-[2.2vw] font-light leading-none">
              {openUtilSection === "help" ? "−" : "+"}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openUtilSection === "help"
                ? "max-h-[60vw] md:max-h-[30vw] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-[8vw] pr-[5vw] pb-[5vw] pt-0 md:pl-[4vw] md:pr-[2.5vw] md:pb-[2.5vw] space-y-[4vw] md:space-y-[2vw]">
              <Link
                to="/contact-us"
                onClick={toggleMenu}
                className="block text-[3vw] md:text-[1.5vw] no-underline font-sans font-medium tracking-[0.01em] text-[#000] uppercase hover:opacity-70"
              >
                CONTACT
              </Link>
              <Link
                to="/faqs"
                onClick={toggleMenu}
                className="block text-[3vw] md:text-[1.5vw] no-underline font-sans font-medium tracking-[0.01em] text-[#000] uppercase hover:opacity-70"
              >
                FAQ
              </Link>
              <Link
                to="/returns"
                onClick={toggleMenu}
                className="block text-[3vw] md:text-[1.5vw] no-underline font-sans font-medium tracking-[0.01em] text-[#000] uppercase hover:opacity-70"
              >
                RETURNS CENTER
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-[5vw] py-[5vw] md:px-[2.5vw] md:py-[2.5vw] bg-[#f5f5f5]">
        <p
          className="text-[2.8vw] md:text-[1.4vw] text-[#333] m-0 leading-[1.6] italic font-serif"
        >
          Free shipping on Pakistan orders above Rs 2500 &amp; easy returns
        </p>
      </div>
    </>
  );
};

export default MobileMenuUtilities;
