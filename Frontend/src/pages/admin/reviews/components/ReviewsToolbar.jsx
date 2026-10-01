import React from "react";
import { Search } from "lucide-react";

const ReviewsToolbar = ({
  activeTab,
  setActiveTab,
  totalCount,
  serviceCount,
  productCount,
  disabledCount,
  searchQuery,
  setSearchQuery,
}) => {
  const tabs = [
    { id: "all", label: "All Reviews", count: totalCount },
    { id: "service", label: "Overall Service", count: serviceCount },
    { id: "product", label: "Product PDP", count: productCount },
    { id: "disabled", label: "Disabled", count: disabledCount },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-surface-1 border border-brand/10 p-4 rounded-sm">
      {/* Filters Tabs */}
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-[10px] uppercase font-bold tracking-wider rounded-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? "bg-brand text-surface-base"
                : "bg-transparent text-warm-gray hover:text-surface-base hover:bg-brand/5"
            }`}
          >
            {tab.label}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                activeTab === tab.id
                  ? "bg-surface-base/15 text-surface-base"
                  : "bg-brand/10 text-brand"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md w-full">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray"
        />
        <input
          type="text"
          placeholder="Search by ID, Product, or Customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface-base border border-brand/20 focus:border-brand/50 text-xs text-ivory font-sans p-3.5 pl-10 outline-none rounded-sm transition-colors"
        />
      </div>
    </div>
  );
};

export default ReviewsToolbar;
