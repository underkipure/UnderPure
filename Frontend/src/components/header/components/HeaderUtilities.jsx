import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import HeaderHelpDropdown from './HeaderHelpDropdown';
import HeaderAccountDropdown from './HeaderAccountDropdown';
import HeaderSearch from './HeaderSearch';

export default function HeaderUtilities({
  isSolid,
  hh,
  contactPhone,
  contactEmail,
  isAuthenticated,
  logout,
  navigate,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  handleSearch,
  isHome,
  toggleCart,
  cartCount
}) {
  return (
    <div
      className={`flex-1 flex items-center justify-end space-x-[4vw] md:space-x-[1vw] font-sans text-[3vw] md:text-[0.9vw] tracking-[0.001em] ${!isSolid ? "lg:text-white text-black" : "text-black"}`}
    >
      <Link
        to="/loyalty-program"
        className={`hidden md:block hover:opacity-70 no-underline ${!isSolid ? "lg:text-white text-black" : "text-black"}`}
      >
        Loyalty
      </Link>

      {/* Help Dropdown */}
      <HeaderHelpDropdown 
        isSolid={isSolid} 
        hh={hh} 
        contactPhone={contactPhone} 
        contactEmail={contactEmail} 
      />

      {/* Account Dropdown */}
      <HeaderAccountDropdown 
        isSolid={isSolid} 
        isAuthenticated={isAuthenticated} 
        logout={logout} 
        navigate={navigate} 
      />

      {/* Search Input & Button */}
      <HeaderSearch 
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isHome={isHome}
        isSolid={isSolid}
      />

      {/* Cart Button */}
      <button
        aria-label="Shopping Cart"
        className="hover:opacity-70 relative flex items-center"
        onClick={toggleCart}
      >
        <ShoppingBag
          className="w-[5.5vw] h-[5.5vw] md:w-[1.5vw] md:h-[1.5vw]"
          strokeWidth={1.5}
        />
        <span
          className={`ml-[0.5vw] md:ml-[0.2vw] text-[3.5vw] md:text-[0.9vw] font-bold ${isSolid ? "text-[#d893a3]" : "text-[#d893a3]"}`}
        >
          {cartCount}
        </span>
      </button>
    </div>
  );
}
