import React from 'react';

const DEFAULT_LINKS = [
  { id: 1, label: "Refund policy", url: "/policies/refund-policy" },
  { id: 2, label: "Shipping", url: "/policies/shipping-policy" },
  { id: 3, label: "Privacy policy", url: "/policies/privacy-policy" },
  { id: 4, label: "Terms of service", url: "/policies/terms-of-service" },
  { id: 5, label: "Contact information", url: "/pages/contact" },
];

const AccountFooterLinksEditor = ({ footerLinks, update }) => {
  const currentLinks = footerLinks?.links || DEFAULT_LINKS;

  const handleAddLink = () => {
    const updated = [...currentLinks, { id: Date.now(), label: "New Link", url: "#" }];
    update({ footerLinks: { ...(footerLinks || {}), links: updated } });
  };

  const handleUpdateLabel = (index, label) => {
    const updated = currentLinks.map((l, idx) => idx === index ? { ...l, label } : l);
    update({ footerLinks: { ...(footerLinks || {}), links: updated } });
  };

  const handleUpdateUrl = (index, url) => {
    const updated = currentLinks.map((l, idx) => idx === index ? { ...l, url } : l);
    update({ footerLinks: { ...(footerLinks || {}), links: updated } });
  };

  const handleRemoveLink = (index) => {
    const updated = currentLinks.filter((_, idx) => idx !== index);
    update({ footerLinks: { ...(footerLinks || {}), links: updated } });
  };

  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">Account Footer Links & Country</h3>
      
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Display Country Name</label>
        <input
          type="text"
          value={footerLinks?.country ?? 'United States'}
          onChange={e => update({ footerLinks: { ...(footerLinks || {}), country: e.target.value } })}
          placeholder="e.g. United States or Pakistan"
          className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
        />
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500">Account Footer Links</label>
          <button
            type="button"
            onClick={handleAddLink}
            className="text-xs uppercase tracking-widest bg-black text-white px-3 py-1.5 hover:bg-gray-800 cursor-pointer"
          >
            + Add Link
          </button>
        </div>

        {currentLinks.map((link, index) => (
          <div key={link.id || index} className="flex flex-col sm:flex-row gap-2 items-center bg-gray-50 p-3 border border-black/10">
            <input
              type="text"
              value={link.label}
              onChange={e => handleUpdateLabel(index, e.target.value)}
              placeholder="Link Text (e.g. Refund policy)"
              className="flex-1 border border-black/20 p-2 text-xs focus:outline-none focus:border-black"
            />
            <input
              type="text"
              value={link.url}
              onChange={e => handleUpdateUrl(index, e.target.value)}
              placeholder="URL (e.g. /policies/refund-policy)"
              className="flex-1 border border-black/20 p-2 text-xs focus:outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={() => handleRemoveLink(index)}
              className="text-red-500 text-xs hover:underline uppercase px-2 py-1 cursor-pointer"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountFooterLinksEditor;
