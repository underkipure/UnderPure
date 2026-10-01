import React from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronDown } from 'lucide-react';

export default function HeaderAccountDropdown({ isSolid, isAuthenticated, logout, navigate }) {
  return (
    <div className="relative group hidden md:block">
      <Link
        aria-label="User Account"
        to={isAuthenticated ? "/account" : "/login"}
        className={`flex items-center hover:opacity-70 no-underline py-[0.5vw] ${!isSolid ? "lg:text-white text-black" : "text-black"}`}
      >
        <User
          className="w-[1.5vw] h-[1.5vw]"
          strokeWidth={1.5}
        />
        <ChevronDown
          className="w-[1.2vw] h-[1.2vw] ml-[0.2vw]"
          strokeWidth={1.5}
        />
      </Link>
      <div className="absolute top-full right-[-0.5vw] w-[15vw] bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="px-[1.5vw] py-[1vw] border-b border-gray-100 text-[0.8vw] font-sans font-bold text-black hover:bg-gray-50 transition-colors tracking-tight-nav"
            >
              Sign In
            </Link>
            <Link
              to="/loyalty-program"
              className="px-[1.5vw] py-[1vw] border-b border-gray-100 text-[0.8vw] font-sans font-bold text-black hover:bg-gray-50 transition-colors tracking-tight-nav"
            >
              Loyalty
            </Link>
            <Link
              to="/lovelist"
              className="px-[1.5vw] py-[1vw] border-b border-gray-100 text-[0.8vw] font-sans font-bold text-black hover:bg-gray-50 transition-colors tracking-tight-nav"
            >
              Lovelist/ Saved for Later
            </Link>
            <Link
              to="/login"
              className="px-[1.5vw] py-[1vw] border-b border-gray-100 text-[0.8vw] font-sans font-bold text-black hover:bg-gray-50 transition-colors tracking-tight-nav"
            >
              My Order
            </Link>
            <Link
              to="/returns"
              className="px-[1.5vw] py-[1vw] border-b border-gray-100 text-[0.8vw] font-sans font-bold text-black hover:bg-gray-50 transition-colors tracking-tight-nav"
            >
              Start a Return
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/account"
              className="px-[1.5vw] py-[1vw] border-b border-gray-100 text-[0.8vw] font-sans font-bold text-black hover:bg-gray-50 transition-colors tracking-tight-nav"
            >
              Profile
            </Link>
            <Link
              to="/loyalty-program"
              className="px-[1.5vw] py-[1vw] border-b border-gray-100 text-[0.8vw] font-sans font-bold text-black hover:bg-gray-50 transition-colors tracking-tight-nav"
            >
              Loyalty
            </Link>
            <Link
              to="/lovelist"
              className="px-[1.5vw] py-[1vw] border-b border-gray-100 text-[0.8vw] font-sans font-bold text-black hover:bg-gray-50 transition-colors tracking-tight-nav"
            >
              Lovelist/ Saved for Later
            </Link>
            <Link
              to="/account?tab=orders"
              className="px-[1.5vw] py-[1vw] border-b border-gray-100 text-[0.8vw] font-sans font-bold text-black hover:bg-gray-50 transition-colors tracking-tight-nav"
            >
              My Order
            </Link>
            <Link
              to="/returns"
              className="px-[1.5vw] py-[1vw] border-b border-gray-100 text-[0.8vw] font-sans font-bold text-black hover:bg-gray-50 transition-colors tracking-tight-nav"
            >
              Start a Return
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full text-left px-[1.5vw] py-[1vw] text-[0.9vw] font-sans font-bold text-black hover:bg-gray-50 transition-colors tracking-tight-nav"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
