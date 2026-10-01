import React from 'react';

export default function ProductRecommendationsEditor({
  data,
  onChange,
  categories = [],
  safeGlobalBadges = []
}) {
  const titles = data.titles || {};
  const relatedConfig = data.relatedProductsConfig || {};

  return (
    <div className="border-t border-black/10 pt-6 space-y-4">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest">
          &quot;Selected For You, Lover&quot; (Recommended Products)
        </h3>
        <p className="text-xs text-gray-500">
          Decide which products appear at the bottom of the product page by category, badge, or automatic recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Section Heading Title
          </label>
          <input
            type="text"
            value={titles.relatedProducts ?? 'Selected For You, Lover'}
            onChange={e =>
              onChange({
                ...data,
                titles: { ...titles, relatedProducts: e.target.value }
              })
            }
            placeholder="e.g. Selected For You, Lover"
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Product Recommendation Source
          </label>
          <select
            value={relatedConfig.sourceType || 'same-category'}
            onChange={e =>
              onChange({
                ...data,
                relatedProductsConfig: {
                  ...relatedConfig,
                  sourceType: e.target.value
                }
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black bg-white cursor-pointer"
          >
            <option value="same-category">Automatic (Same Category as Current Product)</option>
            <option value="category-map">Category-Wise Rules (Decide Per Category)</option>
            <option value="badge">Filter by Badge (e.g. Bestseller, Trending, etc.)</option>
            <option value="category">Filter by Specific Category (Global)</option>
            <option value="both">Filter by Category + Badge</option>
          </select>
        </div>
      </div>

      {relatedConfig.sourceType === 'category-map' && (
        <div className="border border-black/15 bg-neutral-50/70 p-4 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/10">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                Category-Wise Recommendation Rules
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Choose which category's products to show in &quot;You May Also Like&quot; when a user views a product in each category.
              </p>
            </div>
            {Object.keys(relatedConfig.categoryMappings || {}).length > 0 && (
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...data,
                    relatedProductsConfig: {
                      ...relatedConfig,
                      categoryMappings: {}
                    }
                  })
                }
                className="text-[10px] uppercase tracking-widest text-red-600 hover:text-black underline font-semibold cursor-pointer self-start sm:self-auto"
              >
                Reset All to Automatic
              </button>
            )}
          </div>

          {categories.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-2">No categories available in the store.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const catSlug = (cat.slug || cat.id || '').toString().toLowerCase();
                const currentTarget = (relatedConfig.categoryMappings || {})[catSlug] || '';

                return (
                  <div
                    key={cat.id || cat.slug}
                    className="flex flex-col p-3 bg-white border border-black/10 rounded-lg shadow-2xs gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-black flex items-center gap-1.5">
                        {cat.name || cat.label || cat.slug}
                        {cat.parentId && (
                          <span className="text-[9px] font-normal uppercase bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            Sub
                          </span>
                        )}
                      </span>
                      {currentTarget && (
                        <button
                          type="button"
                          onClick={() => {
                            const newMappings = { ...(relatedConfig.categoryMappings || {}) };
                            delete newMappings[catSlug];
                            onChange({
                              ...data,
                              relatedProductsConfig: {
                                ...relatedConfig,
                                categoryMappings: newMappings
                              }
                            });
                          }}
                          className="text-[10px] text-gray-400 hover:text-red-600 cursor-pointer"
                          title="Reset to Same Category"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider shrink-0">Shows:</span>
                      <select
                        value={currentTarget}
                        onChange={(e) => {
                          const newTarget = e.target.value;
                          const newMappings = { ...(relatedConfig.categoryMappings || {}) };
                          if (!newTarget || newTarget === 'same') {
                            delete newMappings[catSlug];
                          } else {
                            newMappings[catSlug] = newTarget;
                          }
                          onChange({
                            ...data,
                            relatedProductsConfig: {
                              ...relatedConfig,
                              categoryMappings: newMappings
                            }
                          });
                        }}
                        className={`w-full border p-2 text-xs rounded cursor-pointer transition-colors ${
                          currentTarget
                            ? 'border-black bg-white font-medium text-black'
                            : 'border-black/20 bg-gray-50/50 text-gray-500'
                        }`}
                      >
                        <option value="">-- Automatic (Same Category) --</option>
                        {categories
                          .filter((c) => (c.slug || c.id) !== cat.slug)
                          .map((targetCat) => (
                            <option key={targetCat.id || targetCat.slug} value={targetCat.slug}>
                              {targetCat.name || targetCat.label || targetCat.slug}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {(relatedConfig.sourceType === 'badge' || relatedConfig.sourceType === 'both') && (
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Select Badge to Show
          </label>
          <select
            value={relatedConfig.badge || ''}
            onChange={e =>
              onChange({
                ...data,
                relatedProductsConfig: {
                  ...relatedConfig,
                  badge: e.target.value
                }
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black bg-white cursor-pointer max-w-md"
          >
            <option value="">-- All Badges / Any --</option>
            {safeGlobalBadges.map(b => {
              const bName = typeof b === 'object' ? b.name : b;
              return (
                <option key={bName} value={bName}>
                  {bName}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {(relatedConfig.sourceType === 'category' || relatedConfig.sourceType === 'both') && (
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Select Category to Show
          </label>
          <select
            value={relatedConfig.categorySlug || ''}
            onChange={e =>
              onChange({
                ...data,
                relatedProductsConfig: {
                  ...relatedConfig,
                  categorySlug: e.target.value
                }
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black bg-white cursor-pointer max-w-md"
          >
            <option value="">-- Select Category --</option>
            {categories.map(c => (
              <option key={c.id || c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Max Products to Show
          </label>
          <input
            type="number"
            min="2"
            max="12"
            value={relatedConfig.limit || 4}
            onChange={e =>
              onChange({
                ...data,
                relatedProductsConfig: {
                  ...relatedConfig,
                  limit: parseInt(e.target.value) || 4
                }
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black max-w-xs"
          />
        </div>
      </div>
    </div>
  );
}
