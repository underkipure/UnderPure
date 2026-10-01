import React from 'react';
import { Plus, Trash2, Camera, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoryBannersEditor({
  banners = [],
  setBannersState,
  title,
  settingsKey,
  categories = [],
  isUploadingGlobal,
  uploadProgress,
  uploadFileToServer,
  setIsUploadingGlobal,
  setUploadProgress,
  onSave,
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg">{title} Settings</h3>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            setBannersState([...banners, { id: Date.now(), categorySlug: '' }])
          }
          className="text-[10px] uppercase tracking-widest font-semibold text-black hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus size={12} /> Add Banner
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map(b => {
          const selectedCategory = categories.find(c => c.slug === b.categorySlug);
          const previewImage = b.image || selectedCategory?.image || '';
          return (
            <div
              key={b.id}
              className="border border-black/10 p-4 space-y-3 relative group"
            >
              <div className="w-full h-32 bg-gray-100 overflow-hidden border border-black/10 relative flex items-center justify-center">
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
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <ImageIcon className="text-gray-300" />
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    Select Category
                  </label>
                  <select
                    value={b.categorySlug || ''}
                    onChange={e =>
                      setBannersState(
                        banners.map(x =>
                          x.id === b.id ? { ...x, categorySlug: e.target.value } : x
                        )
                      )
                    }
                    className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    Heading / Title Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={b.title ?? ''}
                    onChange={e =>
                      setBannersState(
                        banners.map(x =>
                          x.id === b.id ? { ...x, title: e.target.value } : x
                        )
                      )
                    }
                    placeholder="e.g. CUSTOM HEADING"
                    className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={b.buttonText ?? ''}
                    onChange={e =>
                      setBannersState(
                        banners.map(x =>
                          x.id === b.id ? { ...x, buttonText: e.target.value } : x
                        )
                      )
                    }
                    placeholder="SHOP NOW"
                    className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black uppercase tracking-widest"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    Text &amp; Button Color
                  </label>
                  <div className="flex items-center border border-black/20 h-[34px] px-1 bg-white">
                    <input
                      type="color"
                      value={b.buttonColor || '#FFFFFF'}
                      onChange={e =>
                        setBannersState(
                          banners.map(x =>
                            x.id === b.id ? { ...x, buttonColor: e.target.value } : x
                          )
                        )
                      }
                      className="w-6 h-6 cursor-pointer border-0 p-0"
                    />
                    <span className="ml-2 text-[10px] text-gray-600 uppercase tracking-widest">
                      {b.buttonColor || '#FFFFFF'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <label className="flex-1 bg-gray-100 p-2 text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
                  <Camera size={14} /> Custom Media
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    disabled={isUploadingGlobal}
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setIsUploadingGlobal(true);
                        setUploadProgress(0);
                        const serverUrl = await uploadFileToServer(file, progress =>
                          setUploadProgress(progress)
                        );
                        setBannersState(
                          banners.map(x =>
                            x.id === b.id ? { ...x, image: serverUrl } : x
                          )
                        );
                        toast.success('Media uploaded');
                      } catch (err) {
                        toast.error('Media upload failed');
                      } finally {
                        setIsUploadingGlobal(false);
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setBannersState(banners.filter(x => x.id !== b.id))
                  }
                  className="px-3 border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer"
                  title="Remove Banner"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end pt-4 border-t border-black/10">
        <button
          type="button"
          onClick={() => onSave(settingsKey, banners)}
          className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
        >
          <Save size={14} /> Save {title}
        </button>
      </div>
    </div>
  );
}
