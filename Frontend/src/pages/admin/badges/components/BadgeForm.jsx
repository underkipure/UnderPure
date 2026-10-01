import React from 'react';
import { Save, X } from 'lucide-react';

export default function BadgeForm({
  editingId,
  formData,
  setFormData,
  onCancel,
  onSave,
}) {
  return (
    <div className="bg-white border border-black p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif text-lg">{editingId ? 'Edit Badge' : 'Create New Badge'}</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-black cursor-pointer"
          title="Close form"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Badge Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Flash Sale"
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Background Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-10 h-10 border border-black/20 cursor-pointer"
            />
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="flex-1 border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Text Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.textColor}
              onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
              className="w-10 h-10 border border-black/20 cursor-pointer"
            />
            <input
              type="text"
              value={formData.textColor}
              onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
              className="flex-1 border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Short description"
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center gap-4 pt-2 border-t border-black/5 mt-4">
        <span className="text-[10px] uppercase tracking-widest text-gray-500">Preview:</span>
        <span
          className="px-3 py-1 text-[10px] uppercase tracking-widest font-semibold"
          style={{ backgroundColor: formData.color, color: formData.textColor }}
        >
          {formData.name || 'Badge Name'}
        </span>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-xs uppercase tracking-widest border border-black/20 hover:bg-gray-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
        >
          <Save size={14} /> {editingId ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
}
