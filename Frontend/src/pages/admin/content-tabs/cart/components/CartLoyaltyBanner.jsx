import React from 'react';

export default function CartLoyaltyBanner({ loyaltyBanner, onChange }) {
  return (
    <section className="space-y-4 border border-black/10 p-5">
      <div className="flex justify-between items-center border-b border-black/10 pb-2 mb-4">
        <h3 className="text-sm uppercase tracking-widest font-bold">4. Loyalty Upsell Banner</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Enable Banner</span>
          <input
            type="checkbox"
            checked={loyaltyBanner.enabled}
            onChange={e => onChange({ ...loyaltyBanner, enabled: e.target.checked })}
            className="w-4 h-4 accent-black"
          />
        </label>
      </div>
      {loyaltyBanner.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Banner Title</label>
            <input
              type="text"
              value={loyaltyBanner.title || ''}
              onChange={e => onChange({ ...loyaltyBanner, title: e.target.value })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Button Text</label>
            <input
              type="text"
              value={loyaltyBanner.buttonText || ''}
              onChange={e => onChange({ ...loyaltyBanner, buttonText: e.target.value })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Description</label>
            <textarea
              rows="2"
              value={loyaltyBanner.description || ''}
              onChange={e => onChange({ ...loyaltyBanner, description: e.target.value })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Footer Text (Already a member?)</label>
            <input
              type="text"
              value={loyaltyBanner.footerText || ''}
              onChange={e => onChange({ ...loyaltyBanner, footerText: e.target.value })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>
      )}
    </section>
  );
}
