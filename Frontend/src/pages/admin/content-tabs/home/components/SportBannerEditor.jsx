import React from 'react';
import { Camera, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SportBannerEditor({
  sportBanner,
  setSportBanner,
  categories = [],
  isUploadingGlobal,
  uploadProgress,
  uploadFileToServer,
  setIsUploadingGlobal,
  setUploadProgress,
  onSave,
}) {
  const selectedCategory = categories.find(c => c.slug === sportBanner.categorySlug);
  const previewImage = sportBanner.image || selectedCategory?.image || '';

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg">Sport Banner Settings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Select Category
          </label>
          <select
            value={sportBanner.categorySlug || ''}
            onChange={e => {
              const slug = e.target.value;
              setSportBanner({
                ...sportBanner,
                categorySlug: slug,
                link: slug ? `/collections/${slug}` : '',
              });
            }}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
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
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Title Override (Optional)
          </label>
          <input
            type="text"
            value={sportBanner.title || ''}
            onChange={e => setSportBanner({ ...sportBanner, title: e.target.value })}
            placeholder={selectedCategory ? `Default: ${selectedCategory.name}` : 'e.g. UNDERPURE SPORT'}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={sportBanner.subtitle || ''}
            onChange={e => setSportBanner({ ...sportBanner, subtitle: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Button Text
          </label>
          <input
            type="text"
            value={sportBanner.buttonText ?? ''}
            onChange={e => setSportBanner({ ...sportBanner, buttonText: e.target.value })}
            placeholder="SHOP ACTIVEWEAR"
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Text &amp; Button Color
          </label>
          <div className="flex items-center border border-black/20 h-[46px] p-1 px-2 bg-white">
            <input
              type="color"
              value={sportBanner.buttonColor || '#000000'}
              onChange={e => setSportBanner({ ...sportBanner, buttonColor: e.target.value })}
              className="w-8 h-8 cursor-pointer border-0 p-0"
            />
            <span className="ml-3 text-sm text-gray-600 uppercase tracking-widest">
              {sportBanner.buttonColor || '#000000'}
            </span>
          </div>
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Banner Image
          </label>
          <label
            className={`p-2 text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
              isUploadingGlobal
                ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                : 'bg-gray-100 cursor-pointer hover:bg-gray-200'
            }`}
          >
            {isUploadingGlobal ? (
              <>
                <span className="animate-spin inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full" />{' '}
                Uploading {uploadProgress}%
              </>
            ) : (
              <>
                <Camera size={14} /> Upload Custom Media
              </>
            )}
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
                  setSportBanner({ ...sportBanner, image: serverUrl });
                  toast.success('Media uploaded');
                } catch (err) {
                  toast.error('Media upload failed');
                } finally {
                  setIsUploadingGlobal(false);
                }
              }}
            />
          </label>
          {previewImage && (
            previewImage.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={previewImage}
                autoPlay
                loop
                muted
                className="mt-2 h-32 object-cover w-full border border-black/10"
              />
            ) : (
              <img
                loading="lazy"
                src={previewImage}
                className="mt-2 h-32 object-cover w-full border border-black/10"
                alt="Preview"
              />
            )
          )}
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-black/10">
        <button
          type="button"
          onClick={() => {
            const toSave = {
              ...sportBanner,
              link: sportBanner.categorySlug
                ? `/collections/${sportBanner.categorySlug}`
                : sportBanner.link || '/collections/all',
            };
            onSave('sportBanner', toSave);
          }}
          className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
        >
          <Save size={14} /> Save Sport Banner
        </button>
      </div>
    </div>
  );
}
