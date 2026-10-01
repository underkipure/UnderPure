import React from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function CartDiscoverSection({
  discover,
  onChange,
  availableCategories,
  uploadingCollectionIndex,
  onCollectionImageUpload
}) {
  return (
    <section className="space-y-4 border border-black/10 p-5">
      <div className="flex justify-between items-center border-b border-black/10 pb-2 mb-4">
        <h3 className="text-sm uppercase tracking-widest font-bold">Discover Section (Empty Cart)</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Enable Section</span>
          <input
            type="checkbox"
            checked={discover.enabled}
            onChange={e => onChange({ ...discover, enabled: e.target.checked })}
            className="w-4 h-4 accent-black"
          />
        </label>
      </div>

      {discover.enabled && (
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Discover Title</label>
            <input
              type="text"
              value={discover.title || ''}
              onChange={e => onChange({ ...discover, title: e.target.value })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Collections (Max 3)</label>
            <div className="space-y-4">
              {(discover.collections || []).map((collection, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 border border-black/10 p-4 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const newCollections = discover.collections.filter((_, i) => i !== index);
                      onChange({ ...discover, collections: newCollections });
                    }}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="w-20 h-20 bg-gray-100 flex items-center justify-center shrink-0 border border-black/10">
                    {collection.image ? (
                      <img loading="lazy" src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Collection Name (e.g. LINGERIE)"
                        value={collection.name || ''}
                        onChange={e => {
                          const newCollections = [...discover.collections];
                          newCollections[index].name = e.target.value;
                          onChange({ ...discover, collections: newCollections });
                        }}
                        className="flex-1 border border-black/20 p-2 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
                      />
                      <div className="flex-1 flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Image URL or upload"
                          value={collection.image || ''}
                          onChange={e => {
                            const newCollections = [...discover.collections];
                            newCollections[index].image = e.target.value;
                            onChange({ ...discover, collections: newCollections });
                          }}
                          className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
                        />
                        <label className="bg-black text-white px-3 py-2 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-800 transition-colors shrink-0 flex items-center gap-1 font-medium">
                          {uploadingCollectionIndex === index ? 'Uploading...' : 'Upload Image'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingCollectionIndex === index}
                            onChange={(e) => onCollectionImageUpload(e, index)}
                          />
                        </label>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Link URL (e.g. /collections/lingerie)"
                      value={collection.url || ''}
                      onChange={e => {
                        const newCollections = [...discover.collections];
                        newCollections[index].url = e.target.value;
                        onChange({ ...discover, collections: newCollections });
                      }}
                      className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              ))}

              {(discover.collections || []).length < 3 && (
                <div className="flex items-center gap-2 mt-4">
                  <select
                    className="border border-black/20 p-2 text-sm focus:outline-none focus:border-black flex-1"
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const selectedCategory = availableCategories.find(c => c.id.toString() === e.target.value);
                      if (selectedCategory) {
                        onChange({
                          ...discover,
                          collections: [
                            ...(discover.collections || []),
                            {
                              id: Date.now(),
                              name: selectedCategory.name,
                              image: selectedCategory.image || '',
                              url: `/collections/${selectedCategory.slug}`
                            }
                          ]
                        });
                      }
                      e.target.value = "";
                    }}
                  >
                    <option value="">+ Add Existing Collection</option>
                    {availableCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <span className="text-gray-400 text-xs px-2">OR</span>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        ...discover,
                        collections: [...(discover.collections || []), { id: Date.now(), name: '', image: '', url: '' }]
                      });
                    }}
                    className="text-[10px] uppercase tracking-widest text-black flex items-center gap-1 font-bold hover:opacity-70 transition-opacity whitespace-nowrap"
                  >
                    <Plus size={12} /> Add Custom
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
