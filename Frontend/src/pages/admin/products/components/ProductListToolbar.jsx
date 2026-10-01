import React from "react";
import { Plus, Search } from "lucide-react";

export default function ProductListToolbar({
  totalCount,
  openNewForm,
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  activeCategories,
  adminProducts,
  getProductStatus,
}) {
  const statusPills = [
    { label: "All Loaded", val: "" },
    { label: "Active", val: "Active" },
    { label: "Low Stock", val: "Low Stock" },
    { label: "Out of Stock", val: "Out of Stock" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl mb-2 text-black">Products</h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            {totalCount} products in catalog
          </p>
        </div>
        <button
          type="button"
          onClick={openNewForm}
          className="bg-black text-white px-6 py-2.5 uppercase tracking-[0.1em] text-[13px] hover:bg-gray-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Toolbar Search & Selects */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 border border-black/10 rounded-sm">
        <div className="relative w-full lg:w-96">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH PRODUCTS..."
            className="w-full pl-10 pr-4 py-2 border border-black/10 text-xs uppercase tracking-widest focus:outline-none focus:border-black transition-colors rounded-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-center sm:justify-start">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-black/10 px-4 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-black w-full sm:w-auto rounded-sm bg-white cursor-pointer"
          >
            <option value="">All Categories</option>
            {activeCategories.map((c) => (
              <option key={c.id || c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-black/10 px-4 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-black w-full sm:w-auto rounded-sm bg-white cursor-pointer"
          >
            <option value="">All Status ({adminProducts.length})</option>
            <option value="Active">
              Active (
              {
                adminProducts.filter((p) => getProductStatus(p) === "Active")
                  .length
              }
              )
            </option>
            <option value="Low Stock">
              Low Stock (
              {
                adminProducts.filter(
                  (p) => getProductStatus(p) === "Low Stock",
                ).length
              }
              )
            </option>
            <option value="Out of Stock">
              Out of Stock (
              {
                adminProducts.filter(
                  (p) => getProductStatus(p) === "Out of Stock",
                ).length
              }
              )
            </option>
          </select>
        </div>
      </div>

      {/* Quick Status Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {statusPills.map((item) => {
          const count =
            item.val === ""
              ? adminProducts.length
              : adminProducts.filter((p) => getProductStatus(p) === item.val)
                  .length;
          const isSelected = filterStatus === item.val;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setFilterStatus(item.val)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? "bg-black text-white font-semibold shadow-xs"
                  : "bg-white text-gray-600 border border-black/10 hover:border-black"
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
