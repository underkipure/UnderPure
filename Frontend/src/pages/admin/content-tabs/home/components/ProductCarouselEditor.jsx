import React from 'react';
import { Save } from 'lucide-react';

export default function ProductCarouselEditor({
  carouselKey,
  carousels,
  setCarousels,
  activeCategories = [],
  globalBadges = [],
  onSave,
}) {
  const current = carousels[carouselKey] || {
    title: '',
    textColor: '#000000',
    limit: 10,
    categorySlug: '',
    badge: '',
  };

  const updateField = (field, value) => {
    setCarousels({
      ...carousels,
      [carouselKey]: {
        ...current,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={current.title || ''}
            onChange={e => updateField('title', e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Title Text Color
          </label>
          <div className="flex items-center border border-black/20 h-[46px] p-1 px-2 bg-white">
            <input
              type="color"
              value={current.textColor || '#000000'}
              onChange={e => updateField('textColor', e.target.value)}
              className="w-8 h-8 cursor-pointer border-0 p-0"
            />
            <span className="ml-3 text-sm text-gray-600 uppercase tracking-widest">
              {current.textColor || '#000000'}
            </span>
          </div>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Number of Products to Show
          </label>
          <input
            type="number"
            value={current.limit ?? 10}
            onChange={e => updateField('limit', parseInt(e.target.value, 10) || 0)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Select Collection (Optional)
          </label>
          <select
            value={current.categorySlug || ''}
            onChange={e => updateField('categorySlug', e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          >
            <option value="">-- All Collections (Global) --</option>
            {activeCategories.map(c => (
              <option key={c.id || c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Filter by Badge (Optional)
          </label>
          <select
            value={current.badge || ''}
            onChange={e => updateField('badge', e.target.value)}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          >
            <option value="">-- All Badges --</option>
            {(globalBadges || []).map(b => {
              const bName = typeof b === 'object' ? b.name : b;
              return (
                <option key={bName} value={bName}>
                  {bName}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-black/10">
        <button
          type="button"
          onClick={() => onSave('homeCarousels', carousels)}
          className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
        >
          <Save size={14} /> Save Carousel
        </button>
      </div>
    </div>
  );
}
