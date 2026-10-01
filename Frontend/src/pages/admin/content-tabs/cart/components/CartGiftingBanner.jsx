import React from 'react';
import { Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';

export default function CartGiftingBanner({
  gifting,
  onChange,
  availableProducts,
  onImageUpload
}) {
  return (
    <section className="space-y-4 border border-black/10 p-5">
      <div className="flex justify-between items-center border-b border-black/10 pb-2 mb-4">
        <h3 className="text-sm uppercase tracking-widest font-bold">2. Gifting Banner</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Enable Section</span>
          <input
            type="checkbox"
            checked={gifting.enabled}
            onChange={e => onChange({ ...gifting, enabled: e.target.checked })}
            className="w-4 h-4 accent-black"
          />
        </label>
      </div>

      {gifting.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Banner Title</label>
              <input
                type="text"
                value={gifting.title || ''}
                onChange={e => onChange({ ...gifting, title: e.target.value })}
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Banner Description</label>
              <input
                type="text"
                value={gifting.description || ''}
                onChange={e => onChange({ ...gifting, description: e.target.value })}
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Gift Box Options</label>
              <div className="space-y-3">
                {(gifting.products || []).map((product, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Name (e.g. HEART)"
                      value={product.name || ''}
                      onChange={e => {
                        const newProducts = [...gifting.products];
                        newProducts[index].name = e.target.value;
                        onChange({ ...gifting, products: newProducts });
                      }}
                      className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={product.price || ''}
                      onChange={e => {
                        const newProducts = [...gifting.products];
                        newProducts[index].price = e.target.value;
                        onChange({ ...gifting, products: newProducts });
                      }}
                      className="w-32 border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newProducts = gifting.products.filter((_, i) => i !== index);
                        onChange({ ...gifting, products: newProducts });
                      }}
                      className="p-2 border border-black/20 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2 mt-4">
                  <select
                    className="border border-black/20 p-2 text-sm focus:outline-none focus:border-black flex-1"
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const selectedProduct = availableProducts.find(p => p.id.toString() === e.target.value);
                      if (selectedProduct) {
                        onChange({
                          ...gifting,
                          products: [
                            ...(gifting.products || []),
                            { id: Date.now(), name: selectedProduct.name, price: selectedProduct.price }
                          ]
                        });
                      }
                      e.target.value = "";
                    }}
                  >
                    <option value="">+ Add Existing Product as Gift</option>
                    {availableProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - Rs. {p.price}</option>
                    ))}
                  </select>
                  <span className="text-gray-400 text-xs px-2">OR</span>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        ...gifting,
                        products: [...(gifting.products || []), { id: Date.now(), name: '', price: 0 }]
                      });
                    }}
                    className="text-[10px] uppercase tracking-widest text-black flex items-center gap-1 font-bold hover:opacity-70 transition-opacity whitespace-nowrap"
                  >
                    <Plus size={12} /> Add Custom
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Banner Image</label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-32 bg-gray-100 border border-black/10 flex items-center justify-center relative overflow-hidden">
                {gifting.image ? (
                  <>
                    <img loading="lazy" src={gifting.image} alt="Gifting preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => onChange({ ...gifting, image: '' })}
                      className="absolute top-1 right-1 bg-white p-1 text-red-500 rounded-full shadow"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <ImageIcon size={24} className="text-gray-300" />
                )}
              </div>
              <div>
                <label className="bg-black text-white px-4 py-2 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-800 transition-colors inline-block">
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
