import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function GlobalSizesManager({
  globalSizes = [],
  setGlobalSizes
}) {
  const [newSize, setNewSize] = useState('');

  const handleAddSize = (e) => {
    e.preventDefault();
    const trimmed = newSize.trim();
    if (!trimmed || globalSizes.includes(trimmed)) return;
    setGlobalSizes([...globalSizes, trimmed]);
    setNewSize('');
  };

  const handleRemoveSize = (sizeToRemove) => {
    setGlobalSizes(globalSizes.filter((s) => s !== sizeToRemove));
  };

  return (
    <div>
      <h3 className="text-sm uppercase tracking-widest font-semibold mb-3">
        Manage Sizes
      </h3>

      <form onSubmit={handleAddSize} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          placeholder="e.g. XXL, 38D"
          className="flex-1 border border-black/20 p-2 text-sm focus:outline-none focus:border-black uppercase"
        />
        <button
          type="submit"
          className="bg-black text-white px-3 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {globalSizes.map((size) => (
          <div
            key={size}
            className="flex items-center gap-1 px-3 py-1.5 border border-black/20 bg-gray-50"
          >
            <span className="text-xs uppercase tracking-widest">{size}</span>
            <button
              type="button"
              onClick={() => handleRemoveSize(size)}
              className="text-gray-400 hover:text-red-500 ml-1"
              title="Remove Size"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {globalSizes.length === 0 && (
          <span className="text-xs text-gray-400 italic">No sizes added.</span>
        )}
      </div>
    </div>
  );
}
