import React from 'react';

export default function CartGeneralSettings({ basic, onChange }) {
  return (
    <section className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm uppercase tracking-widest font-bold mb-4 border-b border-black/10 pb-2">
        1. General Settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Cart Drawer Title</label>
          <input
            type="text"
            value={basic.title || ''}
            onChange={e => onChange({ ...basic, title: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Empty Cart Message</label>
          <input
            type="text"
            value={basic.emptyMessage || ''}
            onChange={e => onChange({ ...basic, emptyMessage: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Checkout Button Text</label>
          <input
            type="text"
            value={basic.checkoutText || ''}
            onChange={e => onChange({ ...basic, checkoutText: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">View Bag Button Text</label>
          <input
            type="text"
            value={basic.viewBagText || ''}
            onChange={e => onChange({ ...basic, viewBagText: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Subtotal Label Text</label>
          <input
            type="text"
            value={basic.subtotalText || ''}
            onChange={e => onChange({ ...basic, subtotalText: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-bold"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Remove Link Text</label>
          <input
            type="text"
            value={basic.removeText || ''}
            onChange={e => onChange({ ...basic, removeText: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Taxes/Shipping Subtext</label>
          <input
            type="text"
            value={basic.taxShippingText || ''}
            onChange={e => onChange({ ...basic, taxShippingText: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Shipping & Returns Policy Notice (Cart Page)
          </label>
          <textarea
            rows="2"
            value={basic.shippingNotice !== undefined ? basic.shippingNotice : 'Free Shipping on U.S. Orders Rs. 195+ and easy returns. Some items may ship separately.'}
            onChange={e => onChange({ ...basic, shippingNotice: e.target.value })}
            placeholder="e.g. Free Shipping on U.S. Orders Rs. 195+ and easy returns. Some items may ship separately."
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black leading-relaxed"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Appears directly below the "Proceed to Checkout" button on the Cart page. Leave empty to hide or delete.
          </p>
        </div>
      </div>
    </section>
  );
}
