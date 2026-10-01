import React from 'react';
import { Save, X } from 'lucide-react';

export default function HeaderPlacementModal({
  badge,
  targetType,
  setTargetType,
  targetMenuId,
  setTargetMenuId,
  menus,
  onClose,
  onConfirm,
}) {
  if (!badge) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-6 space-y-4 shadow-xl border border-black animate-in fade-in">
        <div className="flex justify-between items-center border-b border-black/10 pb-3">
          <h3 className="font-serif text-lg">Add "{badge.name}" to Header</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black cursor-pointer"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-[11px] uppercase tracking-widest text-gray-500 font-medium">
            Select Header Location:
          </label>

          <div className="space-y-2">
            <label
              className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                targetType === 'main'
                  ? 'border-black bg-black/5 font-semibold'
                  : 'border-black/20 hover:border-black/50'
              }`}
            >
              <input
                type="radio"
                name="targetType"
                value="main"
                checked={targetType === 'main'}
                onChange={() => setTargetType('main')}
                className="accent-black cursor-pointer"
              />
              <span className="text-xs uppercase tracking-wider">
                Top-Level Main Menu Tab (e.g. SALE)
              </span>
            </label>

            <label
              className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                targetType === 'sub'
                  ? 'border-black bg-black/5 font-semibold'
                  : 'border-black/20 hover:border-black/50'
              }`}
            >
              <input
                type="radio"
                name="targetType"
                value="sub"
                checked={targetType === 'sub'}
                onChange={() => setTargetType('sub')}
                className="accent-black cursor-pointer"
              />
              <span className="text-xs uppercase tracking-wider">
                Sub-Link inside Category Dropdown
              </span>
            </label>
          </div>

          {targetType === 'sub' && (
            <div className="pt-2 space-y-1">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500">
                Target Parent Menu Category *
              </label>
              <select
                value={targetMenuId}
                onChange={(e) => setTargetMenuId(e.target.value)}
                className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
              >
                <option value="">-- Select Parent Menu Item --</option>
                {(menus || []).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-black/10">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs uppercase tracking-widest border border-black/20 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-black text-white px-5 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
          >
            <Save size={14} /> Add To Header
          </button>
        </div>
      </div>
    </div>
  );
}
