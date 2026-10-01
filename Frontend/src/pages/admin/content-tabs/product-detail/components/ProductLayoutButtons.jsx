import React from 'react';

export default function ProductLayoutButtons({ data, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2">
        Layout & Buttons
      </h3>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
          Image Gallery Style
        </label>
        <select
          value={data.galleryStyle || 'side-scroll'}
          onChange={e => onChange({ ...data, galleryStyle: e.target.value })}
          className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black max-w-sm"
        >
          <option value="side-scroll">Vertical Scroll (Left Thumbnails)</option>
          <option value="grid">Image Grid</option>
          <option value="carousel">Carousel Slider</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Add to Cart Button Text
          </label>
          <input
            type="text"
            value={data.buttonTexts?.addToCart || ''}
            onChange={e =>
              onChange({
                ...data,
                buttonTexts: { ...data.buttonTexts, addToCart: e.target.value }
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Out of Stock Button Text
          </label>
          <input
            type="text"
            value={data.buttonTexts?.outOfStock || ''}
            onChange={e =>
              onChange({
                ...data,
                buttonTexts: { ...data.buttonTexts, outOfStock: e.target.value }
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
          />
        </div>
      </div>
    </div>
  );
}
