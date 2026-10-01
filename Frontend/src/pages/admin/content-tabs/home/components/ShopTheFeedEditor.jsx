import React from 'react';
import { Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function ShopTheFeedEditor({
  shopTheFeed,
  setShopTheFeed,
  products = [],
  isUploadingGlobal,
  uploadProgress,
  uploadFileToServer,
  setIsUploadingGlobal,
  setUploadProgress,
  onSave,
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg">Shop The Feed Settings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Main Title
          </label>
          <input
            type="text"
            value={shopTheFeed.title || ''}
            onChange={e => setShopTheFeed({ ...shopTheFeed, title: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Subtitle / Handle
          </label>
          <input
            type="text"
            value={shopTheFeed.subtitle || ''}
            onChange={e => setShopTheFeed({ ...shopTheFeed, subtitle: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-600">
          Feed Items ({shopTheFeed.images?.length || 0})
        </span>
        <button
          type="button"
          onClick={() =>
            setShopTheFeed(prev => ({
              ...prev,
              images: [
                ...(prev.images || []),
                { id: Date.now(), productSlug: '', image: '' },
              ],
            }))
          }
          className="text-[10px] uppercase tracking-widest font-semibold text-black hover:underline flex items-center gap-1 bg-gray-100 px-3 py-1.5 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <Plus size={12} /> Add Feed Item
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        {(shopTheFeed.images || []).map(img => {
          const selectedProduct = products.find(p => p.slug === img.productSlug);
          const previewImage = img.image || selectedProduct?.image_url || '';
          return (
            <div
              key={img.id}
              className="border border-black/10 p-2 relative flex flex-col group/card"
            >
              <button
                type="button"
                onClick={() => {
                  setShopTheFeed(prev => ({
                    ...prev,
                    images: prev.images.filter(x => x.id !== img.id),
                  }));
                }}
                className="absolute -top-2 -right-2 z-20 bg-red-600 text-white p-1.5 rounded-full shadow hover:bg-red-700 transition-colors cursor-pointer"
                title="Remove Feed Item"
              >
                <Trash2 size={12} />
              </button>
              <div className="aspect-square bg-gray-100 mb-2 overflow-hidden relative group">
                {previewImage ? (
                  previewImage.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={previewImage}
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      loading="lazy"
                      src={previewImage}
                      className="w-full h-full object-cover"
                      alt="Feed"
                    />
                  )
                ) : (
                  <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />
                )}
                <label
                  className={`absolute inset-0 bg-black/50 ${
                    isUploadingGlobal ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  } flex items-center justify-center text-white text-[10px] uppercase cursor-pointer transition-opacity`}
                >
                  {isUploadingGlobal ? `Uploading ${uploadProgress}%` : 'Upload'}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    disabled={isUploadingGlobal}
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setIsUploadingGlobal(true);
                          setUploadProgress(0);
                          const serverUrl = await uploadFileToServer(file, progress =>
                            setUploadProgress(progress)
                          );
                          setShopTheFeed(prev => ({
                            ...prev,
                            images: prev.images.map(x =>
                              x.id === img.id ? { ...x, image: serverUrl } : x
                            ),
                          }));
                          toast.success('Media uploaded');
                        } catch (err) {
                          toast.error('Media upload failed');
                        } finally {
                          setIsUploadingGlobal(false);
                        }
                      }
                    }}
                  />
                </label>
              </div>
              <select
                value={img.productSlug || ''}
                onChange={e => {
                  setShopTheFeed(prev => ({
                    ...prev,
                    images: prev.images.map(x =>
                      x.id === img.id ? { ...x, productSlug: e.target.value } : x
                    ),
                  }));
                }}
                className="w-full border border-black/20 p-1.5 text-[10px] focus:outline-none focus:border-black mt-auto truncate pr-6"
              >
                <option value="">-- Select Product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end pt-4 border-t border-black/10">
        <button
          type="button"
          onClick={() => onSave('shopTheFeed', shopTheFeed)}
          className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
        >
          <Save size={14} /> Save Shop The Feed
        </button>
      </div>
    </div>
  );
}
