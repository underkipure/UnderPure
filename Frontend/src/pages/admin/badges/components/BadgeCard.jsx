import React from 'react';
import { Award, Edit2, Trash2 } from 'lucide-react';

export default function BadgeCard({
  badge,
  inHeader,
  onEdit,
  onDelete,
  onToggleHeader,
}) {
  return (
    <div className="bg-white border border-black/10 p-5 hover:border-black/30 transition-colors group relative flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Award size={20} className="text-gray-400" />
            <div>
              <h3 className="font-serif text-base">{badge.name}</h3>
              <p className="text-[10px] text-gray-400 tracking-wider">{badge.description}</p>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(badge)}
              className="text-gray-400 hover:text-black cursor-pointer"
              title="Edit Badge"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(badge.id)}
              className="text-gray-400 hover:text-red-600 cursor-pointer"
              title="Delete Badge"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-black/5 mt-3">
        <span
          className="px-3 py-1 text-[10px] uppercase tracking-widest font-semibold rounded-xs"
          style={{ backgroundColor: badge.color, color: badge.textColor }}
        >
          {badge.name}
        </span>
        <button
          onClick={() => onToggleHeader(badge, inHeader)}
          className={`px-3 py-1 text-[10px] uppercase tracking-widest border transition-all flex items-center gap-1.5 cursor-pointer rounded-xs ${
            inHeader
              ? 'border-black bg-black text-white font-medium shadow-xs'
              : 'border-black/20 text-gray-600 hover:border-black hover:text-black bg-white'
          }`}
        >
          {inHeader ? 'In Header ✓' : '+ Add to Header'}
        </button>
      </div>
    </div>
  );
}
