import React, { useState } from 'react';
import { Edit2, Trash2, Image as ImageIcon, Save, X } from 'lucide-react';

export default function SubcategoryDesktopRow({
  sub,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onUpdate,
  onDelete,
  handleImageUpload,
  generateSlug,
}) {
  const [editName, setEditName] = useState(sub.name || '');

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 pl-14 border-b border-black/5 hover:bg-white transition-colors group/sub">
      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full shrink-0" />
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            value={editName}
            onChange={e => setEditName(e.target.value)}
            className="flex-1 border border-black/20 p-1.5 text-sm focus:outline-none focus:border-black"
          />
          <button
            type="button"
            onClick={() => {
              onSaveEdit(sub.id, { name: editName, slug: generateSlug(editName) });
            }}
            className="text-green-600 hover:text-green-800 cursor-pointer"
            title="Save"
          >
            <Save size={14} />
          </button>
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-gray-400 hover:text-black cursor-pointer"
            title="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <div className="w-8 h-8 bg-gray-100 border border-black/10 shrink-0 flex items-center justify-center relative overflow-hidden group/subimg">
            {sub.image ? (
              <>
                <img src={sub.image} className="w-full h-full object-cover" alt={sub.name} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/subimg:opacity-100 flex items-center justify-center transition-opacity">
                  <label className="cursor-pointer text-white p-1" title="Change Image">
                    <Edit2 size={10} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(f, url => onUpdate(sub.id, { image: url }));
                      }}
                    />
                  </label>
                </div>
              </>
            ) : (
              <label
                className="cursor-pointer w-full h-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="Upload Image"
              >
                <ImageIcon size={12} className="text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(f, url => onUpdate(sub.id, { image: url }));
                  }}
                />
              </label>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm">{sub.name}</span>
            <span className="text-[10px] text-gray-400 ml-2 tracking-wider">/{sub.slug}</span>
          </div>
          {/* Subcategory Header toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !(sub.showInHeader !== false);
              onUpdate(sub.id, { showInHeader: next });
            }}
            title={sub.showInHeader !== false ? 'Click to hide from header nav' : 'Click to show in header nav'}
            className={`px-2 py-1 text-[8px] uppercase tracking-widest border transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
              sub.showInHeader !== false
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-gray-50 text-gray-400'
            }`}
          >
            <span className="hidden sm:inline">Header</span>
            <span>{sub.showInHeader !== false ? '✓' : '—'}</span>
          </button>
          <div className="flex items-center gap-2 opacity-0 group-hover/sub:opacity-100 transition-opacity ml-2">
            <button
              type="button"
              onClick={() => onStartEdit(sub.id)}
              className="text-gray-400 hover:text-black cursor-pointer"
              title="Edit"
            >
              <Edit2 size={13} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(sub.id)}
              className="text-gray-400 hover:text-red-600 cursor-pointer"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
