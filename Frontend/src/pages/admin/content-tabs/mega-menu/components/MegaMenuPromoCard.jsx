import React from "react";
import { Plus, Image as ImageIcon } from "lucide-react";

export default function MegaMenuPromoCard({
  promo,
  activeCategories = [],
  onSelectCategory,
  onRevertToCatImage,
  onUpdatePromo,
  onDeletePromo,
  onImageUpload,
}) {
  const linkedCat = activeCategories.find(
    (c) => String(c.id) === String(promo.categoryId)
  );
  const displayImage = promo.hasCustomImage
    ? promo.customImage || promo.image
    : promo.image || linkedCat?.image || "";
  const isUsingCatImage = !promo.hasCustomImage && Boolean(linkedCat?.image);
  const isUsingCustomImage = Boolean(promo.hasCustomImage);

  return (
    <div className="border border-black/10 p-4 bg-gray-50 flex flex-col sm:flex-row gap-4 relative rounded-xs shadow-xs">
      {/* Left: Image preview & Upload */}
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <div className="w-28 h-28 bg-gray-200 border border-black/10 flex items-center justify-center shrink-0 overflow-hidden relative group rounded-xs">
          {displayImage ? (
            <img
              loading="lazy"
              src={displayImage}
              className="w-full h-full object-cover"
              alt={promo.title || "Promo preview"}
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400 p-2 text-center">
              <ImageIcon size={22} className="mb-1" />
              <span className="text-[9px] uppercase tracking-wider">
                No Image
              </span>
            </div>
          )}
          <label className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center text-[10px] font-semibold uppercase tracking-wider cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus size={16} className="mb-0.5" />
            Upload New
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onImageUpload(promo.id, e)}
            />
          </label>
        </div>

        {/* Source Badges & Revert button */}
        {isUsingCustomImage && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-black text-white rounded-xs">
              Custom Upload
            </span>
            {linkedCat?.image && (
              <button
                type="button"
                onClick={() => onRevertToCatImage(promo.id)}
                className="text-[9px] text-blue-600 hover:underline hover:text-blue-800 tracking-wide font-medium cursor-pointer"
              >
                ↺ Use Cat Image
              </button>
            )}
          </div>
        )}
        {isUsingCatImage && (
          <span className="text-[9px] uppercase font-semibold tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xs">
            Category Image
          </span>
        )}
      </div>

      {/* Right: Category Selector & Fields */}
      <div className="flex-1 space-y-2">
        {/* Category Dropdown */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-gray-700 font-bold block mb-1">
            Category (Active Database Categories)
          </label>
          <select
            value={promo.categoryId || ""}
            onChange={(e) => onSelectCategory(promo.id, e.target.value)}
            className="w-full border border-black/20 p-2 text-xs bg-white focus:outline-none focus:border-black font-medium transition-colors"
          >
            <option value="">
              -- Link Category (Auto-fills Title, URL & Image) --
            </option>
            {activeCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.slug}){cat.image ? " ✓ Has Image" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Title input */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block mb-0.5">
            Promo Title
          </label>
          <input
            type="text"
            value={promo.title || ""}
            onChange={(e) => onUpdatePromo(promo.id, "title", e.target.value)}
            placeholder="Promo Title (e.g. New Arrivals ▸)"
            className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black bg-white"
          />
        </div>

        {/* Target URL input */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block mb-0.5">
            Target URL
          </label>
          <input
            type="text"
            value={promo.url || ""}
            onChange={(e) => onUpdatePromo(promo.id, "url", e.target.value)}
            placeholder="Target URL (e.g. /collections/bras)"
            className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black bg-white text-gray-700"
          />
        </div>

        <label className="flex items-center gap-1.5 text-[10px] uppercase font-medium text-gray-700 cursor-pointer pt-0.5">
          <input
            type="checkbox"
            checked={promo.mobileViewType === "bottom_button"}
            onChange={(e) =>
              onUpdatePromo(
                promo.id,
                "mobileViewType",
                e.target.checked ? "bottom_button" : ""
              )
            }
            className="w-3.5 h-3.5 accent-black"
          />
          Show as Featured Link at Bottom on Mobile (e.g. New Lingerie ❯)
        </label>

        <div className="pt-0.5">
          <button
            type="button"
            onClick={() => onDeletePromo(promo.id)}
            className="text-[10px] text-red-500 uppercase tracking-widest hover:underline hover:text-red-700 font-medium cursor-pointer"
          >
            Remove Promo
          </button>
        </div>
      </div>
    </div>
  );
}
