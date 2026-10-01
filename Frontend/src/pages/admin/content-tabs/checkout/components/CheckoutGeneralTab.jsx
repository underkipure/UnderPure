import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const DEFAULT_SUPPORTED_COUNTRIES = [
  'Pakistan'
];

const CheckoutGeneralTab = ({
  formData,
  setFormData,
  shippingRate,
  setShippingRate,
  globalContactEmail,
  setGlobalContactEmail,
  globalContactPhone,
  setGlobalContactPhone,
}) => {
  const [newCountry, setNewCountry] = useState('');
  const countries = formData.supportedCountries || DEFAULT_SUPPORTED_COUNTRIES;

  const handleAddCountry = (e) => {
    e?.preventDefault();
    const trimmed = newCountry.trim();
    if (!trimmed || countries.includes(trimmed)) return;
    setFormData({
      ...formData,
      supportedCountries: [...countries, trimmed],
    });
    setNewCountry('');
  };

  const handleRemoveCountry = (cToRemove) => {
    setFormData({
      ...formData,
      supportedCountries: countries.filter(c => c !== cToRemove),
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Returns Section Title</label>
          <input
            type="text"
            value={formData.returnsTitle || ''}
            onChange={e => setFormData({ ...formData, returnsTitle: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-wider"
            placeholder="RETURNS"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Default Country Option</label>
          <input
            type="text"
            value={formData.defaultCountry || ''}
            onChange={e => setFormData({ ...formData, defaultCountry: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            placeholder="Pakistan"
          />
        </div>
      </div>

      {/* Supported Shipping Countries */}
      <div className="border border-black/10 rounded-lg p-5 bg-gray-50/50">
        <label className="block text-[10px] uppercase tracking-widest text-gray-700 font-bold mb-1">
          Supported Shipping Countries
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Manage the countries available for selection in the checkout delivery address dropdown.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {countries.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black text-white"
            >
              {c}
              <button
                type="button"
                onClick={() => handleRemoveCountry(c)}
                className="hover:text-red-300 transition-colors cursor-pointer"
                aria-label={`Remove ${c}`}
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCountry();
              }
            }}
            placeholder="Add country name (e.g. Germany)..."
            className="flex-1 border border-black/20 p-2.5 text-xs bg-white focus:outline-none focus:border-black"
          />
          <button
            type="button"
            onClick={handleAddCountry}
            className="px-4 py-2.5 bg-black text-white text-xs font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Returns Policy Text (Sidebar)</label>
        <textarea
          rows={4}
          value={formData.returnsText || ''}
          onChange={e => setFormData({ ...formData, returnsText: e.target.value })}
          className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black leading-relaxed"
          placeholder="We accept returns within 30 days..."
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Guarantee Banner Text</label>
        <input
          type="text"
          value={formData.guaranteeText || ''}
          onChange={e => setFormData({ ...formData, guaranteeText: e.target.value })}
          className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
          placeholder="GUARANTEED SAFE CHECKOUT"
        />
      </div>

      <div className="border-t border-black/10 pt-6">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Shipping / Delivery Rate</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Shipping Name</label>
            <input
              type="text"
              value={shippingRate.name || ''}
              onChange={e => setShippingRate({ ...shippingRate, name: e.target.value })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              placeholder="Standard Courier"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Delivery Charges (Rs)</label>
            <input
              type="number"
              value={shippingRate.price || 0}
              onChange={e => setShippingRate({ ...shippingRate, price: Number(e.target.value) })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Min Delivery Days</label>
            <input
              type="number"
              value={shippingRate.minDays || 0}
              onChange={e => setShippingRate({ ...shippingRate, minDays: Number(e.target.value) })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Max Delivery Days</label>
            <input
              type="number"
              value={shippingRate.maxDays || 0}
              onChange={e => setShippingRate({ ...shippingRate, maxDays: Number(e.target.value) })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-black/10 pt-6">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Contact Information Block (Sidebar)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Contact Block Title</label>
            <input
              type="text"
              value={formData.contactTitle || ''}
              onChange={e => setFormData({ ...formData, contactTitle: e.target.value })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
              placeholder="CONTACT US"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Support Email</label>
            <input
              type="email"
              value={globalContactEmail}
              onChange={e => setGlobalContactEmail(e.target.value)}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              placeholder="hello@underpure.com"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Support Phone</label>
            <input
              type="tel"
              value={globalContactPhone}
              onChange={e => setGlobalContactPhone(e.target.value)}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              placeholder="+92 300 0000000"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Customer Service Hours</label>
            <input
              type="text"
              value={formData.contactServiceHours || ''}
              onChange={e => setFormData({ ...formData, contactServiceHours: e.target.value })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              placeholder="M-F, 10AM-6PM EST"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutGeneralTab;
