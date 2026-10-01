import React from "react";

export default function ProductFormSidebar({
  formData,
  setFormData,
  topLevelCategories,
  subCategoryMap,
  safeGlobalBadges,
  toggleBadge,
}) {
  return (
    <div className="space-y-6">
      {/* Pricing */}
      <div className="bg-white border border-black/10 p-6 space-y-4">
        <h2 className="font-serif text-lg border-b border-black/10 pb-2">
          Pricing
        </h2>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Selling Price (Rs.) *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => {
              setFormData({ ...formData, price: e.target.value });
            }}
            placeholder="Final Selling Price"
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div className="border-t border-black/10 pt-4 mt-4 space-y-4">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold mb-1">
              Discounting (Optional)
            </h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              Set an original price to show a strikethrough discount.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                Original Price (Compare At)
              </label>
              <input
                type="number"
                value={formData.compareAtPrice || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    compareAtPrice: e.target.value,
                  });
                }}
                placeholder="Original Price"
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                Discount %
              </label>
              <input
                type="number"
                value={
                  formData.compareAtPrice &&
                  formData.price &&
                  Number(formData.compareAtPrice) > Number(formData.price)
                    ? Math.round(
                        ((Number(formData.compareAtPrice) -
                          Number(formData.price)) /
                          Number(formData.compareAtPrice)) *
                          100,
                      )
                    : ""
                }
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val > 0 && formData.compareAtPrice) {
                    const orig = parseFloat(formData.compareAtPrice);
                    const newPrice = orig - orig * (val / 100);
                    setFormData({
                      ...formData,
                      price: newPrice.toFixed(2),
                    });
                  } else if (
                    !isNaN(val) &&
                    val > 0 &&
                    formData.price &&
                    !formData.compareAtPrice
                  ) {
                    const current = parseFloat(formData.price);
                    const origPrice = current / (1 - val / 100);
                    setFormData({
                      ...formData,
                      compareAtPrice: origPrice.toFixed(2),
                    });
                  } else {
                    setFormData({ ...formData, compareAtPrice: "" });
                  }
                }}
                placeholder="e.g. 10"
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Organization */}
      <div className="bg-white border border-black/10 p-6 space-y-4">
        <h2 className="font-serif text-lg border-b border-black/10 pb-2">
          Organization
        </h2>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-3">
            Categories (Select Multiple)
          </label>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {topLevelCategories.map((parentCat) => {
              const isParentSelected = formData.categoryIds?.includes(
                parentCat.id,
              );
              const subCats = subCategoryMap[parentCat.id] || [];

              return (
                <div
                  key={parentCat.id}
                  className="border border-black/10 p-3 bg-gray-50/50 space-y-2 rounded-xs"
                >
                  <label
                    className={`flex items-center gap-2 border px-3 py-1.5 cursor-pointer transition-colors w-fit rounded-xs ${
                      isParentSelected
                        ? "border-black bg-black text-white"
                        : "border-black/20 hover:border-black/50 text-gray-800 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isParentSelected || false}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        let newIds = [...(formData.categoryIds || [])];
                        if (isChecked) newIds.push(parentCat.id);
                        else
                          newIds = newIds.filter(
                            (id) => id !== parentCat.id,
                          );
                        setFormData({ ...formData, categoryIds: newIds });
                      }}
                      className="hidden"
                    />
                    <span className="text-[11px] uppercase tracking-widest font-bold">
                      {parentCat.name}
                    </span>
                  </label>

                  {subCats.length > 0 && (
                    <div className="pl-3 flex flex-wrap gap-1.5 pt-1.5 border-t border-black/5">
                      {subCats.map((subCat) => {
                        const isSubSelected = formData.categoryIds?.includes(
                          subCat.id,
                        );
                        return (
                          <label
                            key={subCat.id}
                            className={`flex items-center gap-1 border px-2.5 py-1 cursor-pointer transition-colors text-[9px] uppercase tracking-widest rounded-xs ${
                              isSubSelected
                                ? "border-black bg-black text-white font-semibold"
                                : "border-black/20 hover:border-black/50 text-gray-600 bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSubSelected || false}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                let newIds = [
                                  ...(formData.categoryIds || []),
                                ];
                                if (isChecked) newIds.push(subCat.id);
                                else
                                  newIds = newIds.filter(
                                    (id) => id !== subCat.id,
                                  );
                                setFormData({
                                  ...formData,
                                  categoryIds: newIds,
                                });
                              }}
                              className="hidden"
                            />
                            <span>↳ {subCat.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isFeatured: e.target.checked,
                })
              }
              className="w-4 h-4 accent-black"
            />
            <span className="text-sm uppercase tracking-widest">
              Featured Product
            </span>
          </label>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white border border-black/10 p-6 space-y-4">
        <h2 className="font-serif text-lg border-b border-black/10 pb-2">
          Badges
        </h2>
        <div className="flex flex-wrap gap-2">
          {safeGlobalBadges.map((badgeObj) => {
            const badgeName =
              typeof badgeObj === "object" ? badgeObj.name : badgeObj;
            if (!badgeName) return null;
            return (
              <button
                key={badgeName}
                type="button"
                onClick={() => toggleBadge(badgeName)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-colors ${
                  (formData.badges || []).includes(badgeName)
                    ? "bg-black text-white border-black"
                    : "border-black/20 text-gray-500 hover:border-black/50"
                }`}
              >
                {badgeName}
              </button>
            );
          })}
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white border border-black/10 p-6 space-y-4">
        <h2 className="font-serif text-lg border-b border-black/10 pb-2">
          SEO
        </h2>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Meta Title
          </label>
          <input
            type="text"
            value={formData.metaTitle || ""}
            onChange={(e) =>
              setFormData({ ...formData, metaTitle: e.target.value })
            }
            placeholder="Product page title"
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Meta Description
          </label>
          <textarea
            rows={2}
            value={formData.metaDescription || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                metaDescription: e.target.value,
              })
            }
            placeholder="Brief product description for search engines"
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>
    </div>
  );
}
