import React from "react";
import { Search, X } from "lucide-react";

/**
 * Universal Admin Search & Action Toolbar.
 * Standardizes search inputs, action buttons, and filter chip containers across admin tables.
 */
export default function AdminToolbar({
  searchTerm = "",
  onSearchChange,
  placeholder = "Search...",
  children,
  actionButton,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 ${className}`}
    >
      <div className="relative flex-1 max-w-md">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2 text-xs md:text-sm bg-white border border-black/15 rounded-sm focus:outline-none focus:border-black transition-colors"
        />
        {searchTerm && onSearchChange && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {children}
        {actionButton}
      </div>
    </div>
  );
}
