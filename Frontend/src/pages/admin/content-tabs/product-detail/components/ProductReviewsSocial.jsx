import React from 'react';

export default function ProductReviewsSocial({ data, onChange }) {
  const titles = data.titles || {};

  return (
    <div className="border-t border-black/10 pt-6 space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest">Reviews & Social Links</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            &quot;Reviews&quot; Section Header
          </label>
          <input
            type="text"
            value={titles.reviewsHeader || ''}
            onChange={e =>
              onChange({
                ...data,
                titles: { ...titles, reviewsHeader: e.target.value }
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
          />
        </div>
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.showSocialShare !== false}
            onChange={e => onChange({ ...data, showSocialShare: e.target.checked })}
            className="w-4 h-4 accent-black"
          />
          <span className="text-xs font-bold uppercase tracking-widest">
            Show Social Media Links (TikTok, Instagram, Pinterest)
          </span>
        </label>
      </div>
    </div>
  );
}
