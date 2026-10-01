import React from 'react';

export default function CartPoliciesSection({ policies, onChange }) {
  return (
    <section className="space-y-4 border border-black/10 p-5">
      <div className="flex justify-between items-center border-b border-black/10 pb-2 mb-4">
        <h3 className="text-sm uppercase tracking-widest font-bold">5. Policies Accordion</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Enable Section</span>
          <input
            type="checkbox"
            checked={policies.enabled}
            onChange={e => onChange({ ...policies, enabled: e.target.checked })}
            className="w-4 h-4 accent-black"
          />
        </label>
      </div>
      {policies.enabled && (
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Accordion Title</label>
          <input
            type="text"
            value={policies.title || ''}
            onChange={e => onChange({ ...policies, title: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black max-w-md font-serif"
          />
        </div>
      )}
    </section>
  );
}
