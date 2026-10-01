import React from "react";
import { Trash2 } from "lucide-react";

export default function LovelistRecommendationsSettings({
  d,
  update,
  availableProducts,
}) {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <div className="flex justify-between items-center border-b border-black/10 pb-2 mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest">
          Recommendations Section
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={d.recommendations?.enabled ?? true}
            onChange={(e) =>
              update({
                recommendations: {
                  ...d.recommendations,
                  enabled: e.target.checked,
                },
              })
            }
          />
          <span className="text-xs">
            Show <span className="hidden sm:inline">Recommendations</span>
          </span>
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Title
          </label>
          <input
            type="text"
            value={d.recommendations?.title || ""}
            onChange={(e) =>
              update({
                recommendations: {
                  ...d.recommendations,
                  title: e.target.value,
                },
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Recommendation Mode
          </label>
          <select
            value={d.recommendations?.mode || "auto"}
            onChange={(e) =>
              update({
                recommendations: {
                  ...d.recommendations,
                  mode: e.target.value,
                },
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black bg-white"
          >
            <option value="auto">Auto (Latest Store Products)</option>
            <option value="custom">Custom (Hand-Picked Products)</option>
          </select>
        </div>
        {(d.recommendations?.mode === "auto" || !d.recommendations?.mode) && (
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
              Number of Products to Show
            </label>
            <input
              type="number"
              value={d.recommendations?.limit || 4}
              onChange={(e) =>
                update({
                  recommendations: {
                    ...d.recommendations,
                    limit: parseInt(e.target.value) || 4,
                  },
                })
              }
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
        )}
      </div>

      {d.recommendations?.mode === "custom" && (
        <div className="mt-4 pt-4 border-t border-black/10">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Selected Custom Products
          </label>
          <div className="space-y-2 mb-4">
            {(d.recommendations?.customProducts || []).map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 border border-black/10"
              >
                <span className="text-xs font-bold">
                  {product.name} ({product.price})
                </span>
                <button
                  onClick={() => {
                    const updated = d.recommendations.customProducts.filter(
                      (_, i) => i !== index
                    );
                    update({
                      recommendations: {
                        ...d.recommendations,
                        customProducts: updated,
                      },
                    });
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {(d.recommendations?.customProducts || []).length === 0 && (
              <p className="text-xs text-gray-400 italic">
                No custom products selected yet.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              className="border border-black/20 p-2 text-sm focus:outline-none focus:border-black flex-1 bg-white"
              onChange={(e) => {
                if (!e.target.value) return;
                const selectedProduct = availableProducts.find(
                  (p) => p.id.toString() === e.target.value
                );
                if (selectedProduct) {
                  const newProd = {
                    id: selectedProduct.id,
                    slug: selectedProduct.slug,
                    name: selectedProduct.name,
                    price:
                      typeof selectedProduct.price === "number"
                        ? `Rs. ${selectedProduct.price.toLocaleString()}`
                        : selectedProduct.price || "Rs. 0",
                    image:
                      selectedProduct.images?.[0]?.image_url ||
                      selectedProduct.image ||
                      "",
                  };
                  update({
                    recommendations: {
                      ...d.recommendations,
                      customProducts: [
                        ...(d.recommendations?.customProducts || []),
                        newProd,
                      ],
                    },
                  });
                }
                e.target.value = "";
              }}
            >
              <option value="">
                + Add Existing Product to Recommendations
              </option>
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - Rs. {p.price}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
