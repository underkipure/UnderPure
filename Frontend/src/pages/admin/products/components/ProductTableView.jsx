import React from "react";
import { Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { optimizeImage } from "../../../../lib/productUtils";
import CategoryBadgeList from "./CategoryBadgeList";

export default function ProductTableView({
  loading,
  adminProducts,
  filtered,
  getProductStatus,
  categories,
  openEditForm,
  handleDelete,
  highlightedProductId,
}) {
  if (loading && adminProducts.length === 0) {
    return (
      <div className="p-12 text-center bg-white border border-black/10 text-gray-500 flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs uppercase tracking-widest font-medium">
          Loading products from server...
        </span>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="p-8 text-center bg-white border border-black/10 text-gray-400 italic">
        No products found.
      </div>
    );
  }

  return (
    <>
      {/* Mobile Cards View (md:hidden) */}
      <div className="md:hidden space-y-4">
        {filtered.map((product) => {
          const status = getProductStatus(product);
          const isHighlighted = product.id === highlightedProductId;
          return (
            <div
              key={product.id}
              id={`product-card-${product.id}`}
              className={`bg-white border p-4 space-y-3 rounded-sm shadow-2xs transition-all duration-700 ${
                isHighlighted
                  ? "border-amber-400 bg-amber-50/50 ring-2 ring-amber-300"
                  : "border-black/10"
              }`}
            >
              {/* Top Bar: Image + Title + Status */}
              <div className="flex gap-3 items-start">
                <div className="w-14 h-18 bg-gray-100 overflow-hidden shrink-0 rounded-sm border border-black/10">
                  {product.images[0] ? (
                    <img
                      loading="lazy"
                      src={optimizeImage(product.images[0], 120)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={16} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-serif text-base font-bold text-black truncate">
                      {product.name}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest border font-bold shrink-0 ${
                        status === "Active"
                          ? "border-green-300 bg-green-100 text-green-800"
                          : status === "Low Stock"
                            ? "border-yellow-300 bg-yellow-100 text-yellow-800"
                            : "border-red-300 bg-red-100 text-red-800"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">
                    <CategoryBadgeList
                      categoryIds={product.category_ids}
                      fallbackCategory={product.category}
                      categories={categories}
                    />
                  </div>
                  {product.isFeatured && (
                    <span className="text-[9px] uppercase tracking-widest text-amber-600 block mt-1">
                      ★ Featured
                    </span>
                  )}
                </div>
              </div>

              {/* 2-Column Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-sm border border-black/5">
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase tracking-widest">
                    Selling Price
                  </span>
                  <span className="font-serif text-sm font-bold text-black">
                    Rs {Number(product.price).toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-gray-400 line-through text-[10px] block">
                      Rs {Number(product.compareAtPrice).toLocaleString()}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase tracking-widest">
                    Variants
                  </span>
                  <span className="text-gray-700 font-medium">
                    {(product.variants || []).length} variants
                  </span>
                </div>
              </div>

              {/* Badges */}
              {(product.badges || []).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[8px] uppercase tracking-widest bg-black text-white"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Row */}
              <div className="flex justify-end gap-2 pt-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => openEditForm(product)}
                  className="border border-black/20 px-3 py-1.5 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="border border-red-200 bg-red-50 text-red-700 px-3 py-1.5 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (hidden md:block) */}
      <div className="hidden md:block bg-white border border-black/10 overflow-hidden rounded-sm shadow-2xs w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-[10px] uppercase tracking-[0.15em] text-gray-500 bg-gray-50/80">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold text-right whitespace-nowrap">
                  Price
                </th>
                <th className="p-4 font-semibold text-center whitespace-nowrap">
                  Badges
                </th>
                <th className="p-4 font-semibold text-right whitespace-nowrap">
                  Variants
                </th>
                <th className="p-4 font-semibold text-center whitespace-nowrap">
                  Status
                </th>
                <th className="p-4 font-semibold text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map((product) => {
                const status = getProductStatus(product);
                const isHighlighted = product.id === highlightedProductId;
                return (
                  <tr
                    key={product.id}
                    id={`product-row-${product.id}`}
                    className={`transition-colors group ${
                      isHighlighted
                        ? "bg-amber-50/80 ring-1 ring-amber-400/50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-gray-100 overflow-hidden shrink-0 rounded-xs">
                          {product.images[0] ? (
                            <img
                              loading="lazy"
                              src={optimizeImage(product.images[0], 120)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={16} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-serif text-sm font-bold block truncate max-w-[220px]">
                            {product.name}
                          </span>
                          {product.isFeatured && (
                            <span className="text-[9px] uppercase tracking-widest text-amber-600 font-semibold">
                              ★ Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-[11px] uppercase font-medium max-w-[280px] whitespace-normal leading-relaxed">
                      <CategoryBadgeList
                        categoryIds={product.category_ids}
                        fallbackCategory={product.category}
                        categories={categories}
                      />
                    </td>
                    <td className="p-4 text-right font-medium whitespace-nowrap text-xs">
                      Rs {Number(product.price).toLocaleString()}
                      {product.compareAtPrice && (
                        <span className="text-gray-400 line-through text-[10px] block">
                          Rs {Number(product.compareAtPrice).toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center max-w-[150px]">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {(product.badges || []).map((b, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 text-[8px] uppercase tracking-widest bg-black text-white font-semibold"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right text-xs text-gray-500 whitespace-nowrap">
                      {(product.variants || []).length} variants
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[9px] uppercase tracking-widest border font-bold ${
                          status === "Active"
                            ? "border-green-300 bg-green-100 text-green-800"
                            : status === "Low Stock"
                              ? "border-yellow-300 bg-yellow-100 text-yellow-800"
                              : "border-red-300 bg-red-100 text-red-800"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          className="text-gray-400 hover:text-black transition-colors p-1 cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
