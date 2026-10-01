import React from 'react';
import { Camera } from 'lucide-react';

const AccountHeroExtrasEditor = ({
  d,
  update,
  uploadingHero,
  uploadProgress,
  handleHeroMediaUpload,
}) => {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">Additional Sections & Hero Image</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Hero Image</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {d.heroImage ? (
              <img loading="lazy" src={d.heroImage} alt="Hero" className="w-16 h-16 object-cover border border-black/20" />
            ) : null}
            <label className={`px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${uploadingHero ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'} text-white`}>
              {uploadingHero ? (
                <><span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" /> Uploading {uploadProgress}%</>
              ) : (
                <><Camera size={14} /> Upload Media</>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleHeroMediaUpload} disabled={uploadingHero} />
            </label>
          </div>
        </div>
        
        {/* Loyalty */}
        <div className="border border-black/10 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[11px] font-bold uppercase tracking-widest">Loyalty Section</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={d.loyalty?.enabled ?? true} onChange={e => update({ loyalty: { ...d.loyalty, enabled: e.target.checked } })} />
              <span className="text-xs">Show</span>
            </label>
          </div>
          <input type="text" placeholder="Title" value={d.loyalty?.title || ''} onChange={e => update({ loyalty: { ...d.loyalty, title: e.target.value } })} className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black font-serif" />
          <input type="text" placeholder="Status Prefix" value={d.loyalty?.statusPrefix || ''} onChange={e => update({ loyalty: { ...d.loyalty, statusPrefix: e.target.value } })} className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black" />
          <input type="text" placeholder="Status Suffix" value={d.loyalty?.statusSuffix || ''} onChange={e => update({ loyalty: { ...d.loyalty, statusSuffix: e.target.value } })} className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black" />
          <input type="text" placeholder="Earn Text" value={d.loyalty?.earnText || ''} onChange={e => update({ loyalty: { ...d.loyalty, earnText: e.target.value } })} className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black" />
          <input type="text" placeholder="Button Text" value={d.loyalty?.buttonText || ''} onChange={e => update({ loyalty: { ...d.loyalty, buttonText: e.target.value } })} className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black uppercase tracking-widest" />
        </div>

        {/* Store Credit */}
        <div className="border border-black/10 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[11px] font-bold uppercase tracking-widest">Store Credit Section</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={d.storeCredit?.enabled ?? true} onChange={e => update({ storeCredit: { ...d.storeCredit, enabled: e.target.checked } })} />
              <span className="text-xs">Show</span>
            </label>
          </div>
          <input type="text" placeholder="Title" value={d.storeCredit?.title || ''} onChange={e => update({ storeCredit: { ...d.storeCredit, title: e.target.value } })} className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black font-serif" />
          <input type="text" placeholder="Empty Text" value={d.storeCredit?.emptyText || ''} onChange={e => update({ storeCredit: { ...d.storeCredit, emptyText: e.target.value } })} className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black" />
        </div>

        {/* Marketing */}
        <div className="border border-black/10 p-4 space-y-4 md:col-span-2">
          <div className="flex justify-between items-center">
            <h4 className="text-[11px] font-bold uppercase tracking-widest">Marketing Preferences Section</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={d.marketing?.enabled ?? true} onChange={e => update({ marketing: { ...d.marketing, enabled: e.target.checked } })} />
              <span className="text-xs">Show</span>
            </label>
          </div>
          <input type="text" placeholder="Title" value={d.marketing?.title || ''} onChange={e => update({ marketing: { ...d.marketing, title: e.target.value } })} className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black font-serif" />
          <input type="text" placeholder="Email Label" value={d.marketing?.emailLabel || ''} onChange={e => update({ marketing: { ...d.marketing, emailLabel: e.target.value } })} className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black" />
        </div>
      </div>
    </div>
  );
};

export default AccountHeroExtrasEditor;
