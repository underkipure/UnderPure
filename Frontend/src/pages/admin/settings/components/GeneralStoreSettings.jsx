import React from 'react';
import { X } from 'lucide-react';

export default function GeneralStoreSettings({
  storeName,
  setStoreName,
  metaTitle,
  setMetaTitle,
  favicon,
  setFavicon,
  setLogo,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  freeShippingThreshold,
  setFreeShippingThreshold
}) {
  const handleFaviconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFavicon(reader.result);
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFavicon = () => {
    setFavicon('');
    setLogo('');
  };

  return (
    <section>
      <h2 className="font-serif text-xl mb-4 border-b border-black/10 pb-2">
        General Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Store Name (Logo Text)
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Browser Tab Name (Site Title)
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            placeholder="e.g. UNDERPURE - Luxury Lingerie"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Browser Tab &amp; PWA Logo (Favicon)
          </label>
          {favicon && (
            <div className="mb-2 relative w-12 h-12 bg-gray-100 border border-gray-200">
              <img
                src={favicon}
                alt="Favicon Preview"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={handleRemoveFavicon}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer"
                title="Remove Favicon"
              >
                <X size={10} />
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFaviconUpload}
            className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Contact Phone
          </label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Free Shipping Threshold (Rs.)
          </label>
          <input
            type="number"
            value={freeShippingThreshold}
            onChange={(e) => setFreeShippingThreshold(e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>
    </section>
  );
}
