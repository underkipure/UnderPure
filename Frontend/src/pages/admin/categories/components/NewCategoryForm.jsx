import React, { useState } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';

export default function NewCategoryForm({
  onClose,
  onSubmit,
  handleImageUpload,
  generateSlug,
}) {
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatMeta, setNewCatMeta] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [newCatShowImage, setNewCatShowImage] = useState(true);

  const handleSubmit = () => {
    if (!newCatName.trim()) return;
    onSubmit({
      name: newCatName,
      slug: newCatSlug || generateSlug(newCatName),
      subTitle: newCatMeta || `Shop ${newCatName}.`,
      tabTitle: '',
      image: newCatImage || '',
      showImage: newCatShowImage,
      parentId: null,
      showInHeader: true,
    });
  };

  return (
    <div className="bg-white border border-black p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif text-lg">Create New Category</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-black cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Category Name *
            </label>
            <input
              value={newCatName}
              onChange={e => {
                setNewCatName(e.target.value);
                setNewCatSlug(generateSlug(e.target.value));
              }}
              placeholder="e.g. Swimwear"
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              URL Slug
            </label>
            <input
              value={newCatSlug}
              onChange={e => setNewCatSlug(e.target.value)}
              placeholder="swimwear"
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black text-gray-500"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Sub-label
            </label>
            <input
              value={newCatMeta}
              onChange={e => setNewCatMeta(e.target.value)}
              placeholder="Short description"
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Banner Image
          </label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-100 border border-black/10 flex items-center justify-center relative overflow-hidden">
              {newCatImage ? (
                <>
                  <img
                    loading="lazy"
                    src={newCatImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setNewCatImage('')}
                    className="absolute top-1 right-1 bg-white p-1 text-red-500 rounded-full shadow cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <ImageIcon size={24} className="text-gray-300" />
              )}
            </div>
            <label className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest cursor-pointer hover:bg-gray-800 transition-colors inline-block">
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f, setNewCatImage);
                }}
              />
            </label>
          </div>
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newCatShowImage}
                onChange={e => setNewCatShowImage(e.target.checked)}
                className="w-3.5 h-3.5 accent-black"
              />
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                Show Banner Image on Page
              </span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 text-xs uppercase tracking-widest border border-black/20 hover:bg-gray-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
        >
          <Save size={14} /> Create
        </button>
      </div>
    </div>
  );
}
