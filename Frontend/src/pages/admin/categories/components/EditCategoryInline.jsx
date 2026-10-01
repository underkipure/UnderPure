import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function EditCategoryInline({ category, onSave, onCancel }) {
  const [name, setName] = useState(category.name || '');
  const [slug, setSlug] = useState(category.slug || '');
  const [subTitle, setSubTitle] = useState(category.subTitle || category.metaDescription || '');
  const [tabTitle, setTabTitle] = useState(category.tabTitle || '');
  const [showImage, setShowImage] = useState(category.showImage !== false);

  return (
    <div className="space-y-2" onClick={e => e.stopPropagation()}>
      <div className="flex gap-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 border border-black/20 p-1.5 text-sm focus:outline-none focus:border-black font-serif"
          placeholder="Name"
        />
        <input
          value={slug}
          onChange={e => setSlug(e.target.value)}
          className="flex-1 border border-black/20 p-1.5 text-sm focus:outline-none focus:border-black text-gray-500"
          placeholder="slug"
        />
      </div>
      <div className="flex gap-2">
        <input
          value={subTitle}
          onChange={e => setSubTitle(e.target.value)}
          className="flex-1 border border-black/20 p-1.5 text-[11px] focus:outline-none focus:border-black"
          placeholder="Sub-label / description"
        />
        <input
          value={tabTitle}
          onChange={e => setTabTitle(e.target.value)}
          className="flex-1 border border-black/20 p-1.5 text-[11px] focus:outline-none focus:border-black"
          placeholder="Tab Title (SEO)"
        />
      </div>
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showImage}
            onChange={e => setShowImage(e.target.checked)}
            className="w-3 h-3 accent-black cursor-pointer"
          />
          <span className="text-[10px] uppercase tracking-widest text-gray-500">
            Show Image
          </span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSave({ name, slug, subTitle, tabTitle, metaDescription: subTitle, showImage })}
            className="bg-black text-white px-3 py-1 text-[10px] uppercase tracking-widest hover:bg-gray-800 flex items-center gap-1 cursor-pointer"
          >
            <Save size={12} /> Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-[10px] uppercase tracking-widest border border-black/20 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
