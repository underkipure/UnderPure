import React from 'react';
import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

export default function SubcategoryMobileCard({
  sub,
  onStartEdit,
  onUpdate,
  onDelete,
}) {
  const inHeader = sub.showInHeader !== false;

  return (
    <div className="p-2.5 bg-gray-50 border border-black/5 rounded-xs flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 bg-white border border-black/10 shrink-0 overflow-hidden flex items-center justify-center">
          {sub.image ? (
            <img src={sub.image} className="w-full h-full object-cover" alt={sub.name} />
          ) : (
            <ImageIcon size={12} className="text-gray-300" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-black truncate">{sub.name}</p>
          <p className="text-[9px] text-gray-400 font-mono truncate">/{sub.slug}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onUpdate(sub.id, { showInHeader: !inHeader })}
          className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest border cursor-pointer ${
            inHeader
              ? 'border-blue-200 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-400'
          }`}
        >
          Header {inHeader ? '✓' : '—'}
        </button>
        <button
          type="button"
          onClick={() => onStartEdit(sub.id)}
          className="p-1 text-gray-500 hover:text-black cursor-pointer"
          title="Edit"
        >
          <Edit2 size={13} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(sub.id)}
          className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
