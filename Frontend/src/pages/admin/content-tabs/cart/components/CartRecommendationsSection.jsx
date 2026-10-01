import React from 'react';
import { Trash2 } from 'lucide-react';

export default function CartRecommendationsSection({
  recommendations,
  onChange,
  availableProducts
}) {
  return (
    <section className="space-y-4 border border-black/10 p-5">
      <div className="flex justify-between items-center border-b border-black/10 pb-2 mb-4">
        <h3 className="text-sm uppercase tracking-widest font-bold">3. Bag Slider Products (Recommendations)</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Enable Slider</span>
          <input
            type="checkbox"
            checked={recommendations.enabled ?? true}
            onChange={e => onChange({ ...recommendations, enabled: e.target.checked })}
            className="w-4 h-4 accent-black"
          />
        </label>
      </div>

      {(recommendations.enabled ?? true) && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Section Title (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Suggested Products or Pairs Well With"
                value={recommendations.title || ''}
                onChange={e => onChange({ ...recommendations, title: e.target.value })}
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Recommendation Mode</label>
              <select
                value={recommendations.mode || 'auto'}
                onChange={e => onChange({ ...recommendations, mode: e.target.value })}
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black bg-white"
              >
                <option value="auto">Auto (Latest Store Products)</option>
                <option value="custom">Custom (Hand-Picked Products)</option>
              </select>
            </div>
          </div>

          {(recommendations.mode === 'auto' || !recommendations.mode) && (
            <div className="max-w-xs">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Number of Products to Show</label>
              <input
                type="number"
                min="1"
                max="12"
                value={recommendations.limit || 4}
                onChange={e => onChange({ ...recommendations, limit: parseInt(e.target.value) || 4 })}
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          )}

          {recommendations.mode === 'custom' && (
            <div className="mt-4 pt-4 border-t border-black/10">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Selected Slider Products</label>
              <div className="space-y-2 mb-4">
                {(recommendations.customProducts || []).map((product, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2.5 border border-black/10">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover bg-gray-200 border border-black/10"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-bold border border-black/10">
                          {(product.name || "UP").slice(0, 2)}
                        </div>
                      )}
                      <span className="text-xs font-bold text-black">{product.name} ({product.price})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = recommendations.customProducts.filter((_, i) => i !== index);
                        onChange({ ...recommendations, customProducts: updated });
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 transition-colors rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {(recommendations.customProducts || []).length === 0 && (
                  <p className="text-xs text-gray-400 italic">No custom products selected yet. Select products from the dropdown below.</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black flex-1 bg-white"
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const selectedProduct = availableProducts.find(p => p.id.toString() === e.target.value);
                    if (selectedProduct) {
                      const newProd = {
                        id: selectedProduct.id,
                        slug: selectedProduct.slug,
                        name: selectedProduct.name,
                        price: typeof selectedProduct.price === 'number' ? `Rs. ${selectedProduct.price.toLocaleString()}` : selectedProduct.price || 'Rs. 0',
                        image: selectedProduct.images?.[0]?.image_url || selectedProduct.images?.[0] || selectedProduct.image || ''
                      };
                      onChange({
                        ...recommendations,
                        customProducts: [...(recommendations.customProducts || []), newProd]
                      });
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="">+ Add Existing Product to Bag Slider</option>
                  {availableProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - Rs. {p.price}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
