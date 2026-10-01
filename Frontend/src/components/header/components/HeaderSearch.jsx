import React from 'react';
import { Search } from 'lucide-react';

export default function HeaderSearch({
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  handleSearch,
  isHome,
  isSolid
}) {
  return (
    <div className="flex items-center">
      {isSearchOpen && (
        <form
          onSubmit={handleSearch}
          className="mr-[1vw] md:mr-[0.5vw] animate-in fade-in slide-in-from-right-4 duration-300"
        >
          <input
            type="text"
            placeholder="SEARCH"
            aria-label="Search site"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`bg-transparent border-b ${isHome && !isSolid ? "border-white/40 text-white placeholder-white/50 focus:border-white" : "border-black/30 text-black placeholder-black/50 focus:border-black"} outline-none w-[24vw] md:w-[10vw] focus:w-[36vw] md:focus:w-[14vw] transition-all duration-300 text-[3vw] md:text-[0.9vw] font-sans px-[1vw] pb-[1vw] md:px-[0.3vw] md:pb-[0.3vw]`}
            autoFocus
          />
        </form>
      )}
      <button
        aria-label="Toggle Search"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className={`hover:opacity-70 flex items-center transition-colors ${isHome && !isSolid ? "lg:text-white text-black" : "text-black"}`}
      >
        <Search
          className="w-[5vw] h-[5vw] md:w-[1.5vw] md:h-[1.5vw]"
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}
