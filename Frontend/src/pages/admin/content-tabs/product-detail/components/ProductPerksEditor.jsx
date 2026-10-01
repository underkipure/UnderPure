import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ICON_OPTIONS } from '../constants';

export default function ProductPerksEditor({ perks = [], onChange }) {
  const addPerk = () => {
    const newPerk = {
      id: Date.now(),
      enabled: true,
      icon: 'Package',
      text: 'New Perk Item',
      link: '',
      openModal: ''
    };
    onChange([...perks, newPerk]);
  };

  const removePerk = (id) => {
    onChange(perks.filter(p => p.id !== id));
  };

  const updatePerk = (id, field, value) => {
    onChange(perks.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  return (
    <div className="border-t border-black/10 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest">
            Product Perks & Features Highlights
          </h3>
          <p className="text-xs text-gray-500">
            Configure free shipping badges, return info links, gift box options, etc.
          </p>
        </div>
        <button
          onClick={addPerk}
          className="text-xs uppercase tracking-widest font-bold bg-black text-white px-3 py-1.5 flex items-center gap-1 hover:bg-gray-800 transition-colors"
        >
          <Plus size={14} /> Add Perk
        </button>
      </div>

      <div className="space-y-3">
        {perks.map((perk, index) => (
          <div
            key={perk.id || index}
            className="p-4 border border-black/15 bg-gray-50/50 space-y-3 relative group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={perk.enabled !== false}
                  onChange={e => updatePerk(perk.id, 'enabled', e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Perk #{index + 1} {perk.enabled === false ? '(Disabled)' : ''}
                </span>
              </div>
              <button
                onClick={() => removePerk(perk.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Delete Perk"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                  Icon
                </label>
                <select
                  value={perk.icon || 'Package'}
                  onChange={e => updatePerk(perk.id, 'icon', e.target.value)}
                  className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black bg-white"
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                  Perk Text
                </label>
                <input
                  type="text"
                  value={perk.text || ''}
                  onChange={e => updatePerk(perk.id, 'text', e.target.value)}
                  className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black bg-white"
                  placeholder="e.g. Free shipping on orders over Rs. 195+"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                  Link URL (Optional)
                </label>
                <input
                  type="text"
                  value={perk.link || ''}
                  onChange={e => updatePerk(perk.id, 'link', e.target.value)}
                  className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black bg-white"
                  placeholder="e.g. /faqs or /contact"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                  Special Action
                </label>
                <select
                  value={perk.openModal || ''}
                  onChange={e => updatePerk(perk.id, 'openModal', e.target.value)}
                  className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black bg-white"
                >
                  <option value="">None (Standard Link)</option>
                  <option value="returns">Open Return Request Modal</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
