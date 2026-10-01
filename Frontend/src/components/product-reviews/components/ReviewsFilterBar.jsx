import React from "react";
import { Star, Search, ChevronDown, ChevronUp } from "lucide-react";
import { AGE_RANGES, SIZES } from "../constants";

const ReviewsFilterBar = ({
  isFiltersOpen,
  setIsFiltersOpen,
  searchQuery,
  setSearchQuery,
  filterRating,
  setFilterRating,
  filterAge,
  setFilterAge,
  filterSizePurchased,
  setFilterSizePurchased,
  filterTrueSize,
  setFilterTrueSize,
}) => {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    filterRating !== null ||
    filterAge !== null ||
    filterSizePurchased !== null ||
    filterTrueSize !== null;

  return (
    <>
      {/* Filters Button */}
      <div className="mb-4">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="bg-black text-white text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          Filters
          {isFiltersOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expandable Filters Section */}
      {isFiltersOpen && (
        <div className="bg-transparent py-6 px-4 mb-10 flex flex-col gap-6 border-y border-gray-200">
          {/* Search */}
          <div>
            <label className="block text-[13px] font-bold font-sans text-black mb-2">
              Search
            </label>
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Reviews"
                className="w-full border border-black p-2 pl-9 text-[13px] rounded-sm outline-none"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[13px] font-bold font-sans text-black mb-2">
              Rating
            </label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() =>
                    setFilterRating(filterRating === star ? null : star)
                  }
                  className={`border border-black rounded-full px-4 py-1.5 flex items-center gap-1 transition-colors ${
                    filterRating === star
                      ? "bg-black text-white"
                      : "hover:bg-black hover:text-white text-black"
                  }`}
                >
                  {[...Array(star)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </button>
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-[13px] font-bold font-sans text-black mb-2">
              Age Range
            </label>
            <div className="flex flex-wrap gap-2">
              {AGE_RANGES.map((age) => (
                <button
                  key={age}
                  onClick={() =>
                    setFilterAge(filterAge === age ? null : age)
                  }
                  className={`border border-black rounded-full px-4 py-1.5 text-[11px] font-bold transition-colors ${
                    filterAge === age
                      ? "bg-black text-white"
                      : "hover:bg-black hover:text-white text-black"
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* Size Purchased */}
          <div>
            <label className="block text-[13px] font-bold font-sans text-black mb-2">
              Size Purchased
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setFilterSizePurchased(
                      filterSizePurchased === size ? null : size
                    )
                  }
                  className={`border border-black rounded-full px-4 py-1.5 text-[11px] font-bold transition-colors min-w-[36px] text-center ${
                    filterSizePurchased === size
                      ? "bg-black text-white"
                      : "hover:bg-black hover:text-white text-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* True Size */}
          <div>
            <label className="block text-[13px] font-bold font-sans text-black mb-2">
              True Size
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setFilterTrueSize(filterTrueSize === size ? null : size)
                  }
                  className={`border border-black rounded-full px-4 py-1.5 text-[11px] font-bold transition-colors min-w-[36px] text-center ${
                    filterTrueSize === size
                      ? "bg-black text-white"
                      : "hover:bg-black hover:text-white text-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterRating(null);
                  setFilterAge(null);
                  setFilterSizePurchased(null);
                  setFilterTrueSize(null);
                }}
                className="text-[12px] font-bold text-gray-500 hover:text-black underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ReviewsFilterBar;
