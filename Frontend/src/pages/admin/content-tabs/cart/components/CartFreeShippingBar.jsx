import React from 'react';
import { useSiteSettingsStore } from '../../../../../store/siteSettingsStore';

export default function CartFreeShippingBar({ shippingBar, onChange }) {
  const freeShippingThreshold = useSiteSettingsStore((state) => state.freeShippingThreshold) || 5000;

  return (
    <section className="space-y-4 border border-black/10 p-5">
      <div className="flex justify-between items-center border-b border-black/10 pb-2 mb-4">
        <h3 className="text-sm uppercase tracking-widest font-bold">1.5 Free Shipping Bar</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Enable Bar</span>
          <input
            type="checkbox"
            checked={shippingBar.enabled}
            onChange={e => onChange({ ...shippingBar, enabled: e.target.checked })}
            className="w-4 h-4 accent-black"
          />
        </label>
      </div>

      {shippingBar.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Threshold Amount (Rs.)</label>
            <input
              type="number"
              value={freeShippingThreshold}
              disabled
              className="w-full border border-black/20 p-3 text-sm bg-gray-50 text-gray-500 focus:outline-none cursor-not-allowed"
            />
            <p className="text-[10px] text-gray-400 mt-1">Configured in General Settings tab.</p>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Progress Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={shippingBar.progressColor || '#000000'}
                onChange={e => onChange({ ...shippingBar, progressColor: e.target.value })}
                className="w-12 h-11 p-1 border border-black/20 cursor-pointer"
              />
              <input
                type="text"
                value={shippingBar.progressColor || '#000000'}
                onChange={e => onChange({ ...shippingBar, progressColor: e.target.value })}
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Away Message (use $X for amount)</label>
            <input
              type="text"
              value={shippingBar.awayMessage || ''}
              onChange={e => onChange({ ...shippingBar, awayMessage: e.target.value })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Achieved Message</label>
            <input
              type="text"
              value={shippingBar.achievedMessage || ''}
              onChange={e => onChange({ ...shippingBar, achievedMessage: e.target.value })}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>
      )}
    </section>
  );
}
