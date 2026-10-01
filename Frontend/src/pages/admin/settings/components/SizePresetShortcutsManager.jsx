import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createSizeClass, updateSizeClass, deleteSizeClass } from '../../../../lib/api';
import ConfirmModal from '../../../../components/ConfirmModal';

export default function SizePresetShortcutsManager({
  globalSizes = [],
  sizeClasses = [],
  reloadSizeClasses,
  token
}) {
  const [editingPresetId, setEditingPresetId] = useState(null);
  const [presetName, setPresetName] = useState('');
  const [selectedPresetSizes, setSelectedPresetSizes] = useState([]);
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState(null);

  const togglePresetSize = (size) => {
    if (selectedPresetSizes.includes(size)) {
      setSelectedPresetSizes(selectedPresetSizes.filter((s) => s !== size));
    } else {
      setSelectedPresetSizes([...selectedPresetSizes, size]);
    }
  };

  const handleEditPreset = (sc) => {
    setEditingPresetId(sc.id);
    setPresetName(sc.name || '');
    setSelectedPresetSizes(Array.isArray(sc.sizes) ? sc.sizes : []);
  };

  const handleResetPresetForm = () => {
    setEditingPresetId(null);
    setPresetName('');
    setSelectedPresetSizes([]);
  };

  const handleSavePresetGroup = async (e) => {
    e.preventDefault();
    if (!presetName.trim()) {
      toast.error('Please enter a preset group name');
      return;
    }
    if (selectedPresetSizes.length === 0) {
      toast.error('Please select at least one size from the available sizes');
      return;
    }

    setIsSavingPreset(true);
    try {
      if (editingPresetId) {
        await updateSizeClass(token, editingPresetId, {
          name: presetName.trim(),
          sizes: selectedPresetSizes,
        });
        toast.success('Size preset group updated successfully');
      } else {
        await createSizeClass(token, {
          name: presetName.trim(),
          sizes: selectedPresetSizes,
        });
        toast.success('New size preset group created successfully');
      }
      await reloadSizeClasses();
      handleResetPresetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save size preset group');
    } finally {
      setIsSavingPreset(false);
    }
  };

  const handlePromptDeletePresetGroup = (id) => {
    setPresetToDelete(id);
  };

  const confirmDeletePresetGroup = async () => {
    if (!presetToDelete) return;
    try {
      await deleteSizeClass(token, presetToDelete);
      toast.success('Size preset group deleted');
      await reloadSizeClasses();
      if (editingPresetId === presetToDelete) handleResetPresetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to delete preset');
    } finally {
      setPresetToDelete(null);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-black/10">
      <div className="mb-4">
        <h3 className="text-sm uppercase tracking-widest font-bold text-black flex items-center gap-2">
          <Layers size={16} /> Size Preset Shortcuts (Groups)
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Create shortcut groups of sizes (e.g. 30-40, Standard S-XL, Cup Sizes) by selecting from your available sizes below. In the product edit panel, Admin can click these shortcuts to add multiple sizes at once!
        </p>
      </div>

      {/* Preset Builder Form */}
      <form
        onSubmit={handleSavePresetGroup}
        className="bg-gray-50/80 border border-black/15 p-4 rounded-xs mb-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="w-full sm:w-1/2">
            <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">
              Preset Group Name
            </label>
            <input
              type="text"
              placeholder="e.g. 30-40 Sizes, Standard S-XL, Cup Sizes"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black font-semibold bg-white rounded-xs"
              required
            />
          </div>
          {editingPresetId && (
            <button
              type="button"
              onClick={handleResetPresetForm}
              className="text-[10px] uppercase tracking-wider text-red-600 underline font-bold cursor-pointer"
            >
              Cancel Editing
            </button>
          )}
        </div>

        {/* Select from Available Global Sizes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] uppercase tracking-widest text-gray-600 font-bold">
              Select Sizes to Include in this Preset ({selectedPresetSizes.length} selected):
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedPresetSizes([...globalSizes])}
                className="text-[9px] uppercase tracking-wider text-black border-b border-black font-bold cursor-pointer"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => setSelectedPresetSizes([])}
                className="text-[9px] uppercase tracking-wider text-gray-500 hover:text-black font-semibold cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto p-2 bg-white border border-black/15 rounded-xs">
            {globalSizes.map((size) => {
              const isSelected = selectedPresetSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => togglePresetSize(size)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-bold transition-all rounded-xs cursor-pointer flex items-center gap-1 border ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-2xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-black/50'
                  }`}
                >
                  {isSelected && <span className="text-white text-[10px]">✓</span>}
                  {size}
                </button>
              );
            })}
            {globalSizes.length === 0 && (
              <span className="text-xs text-gray-400 italic p-2">
                No sizes available. Add sizes in &quot;Manage Sizes&quot; above first.
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSavingPreset}
            className="bg-black text-white hover:bg-gray-800 px-4 py-2 text-xs uppercase tracking-widest font-bold transition-colors flex items-center gap-1.5 rounded-xs cursor-pointer disabled:opacity-50"
          >
            <Plus size={13} />
            {isSavingPreset
              ? 'Saving...'
              : editingPresetId
                ? 'Update Size Preset'
                : 'Save Size Preset Group'}
          </button>
        </div>
      </form>

      {/* Created Presets List */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-widest font-bold text-gray-700">
          Active Size Preset Shortcuts ({sizeClasses?.length || 0})
        </h4>

        {!sizeClasses || sizeClasses.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-gray-300 rounded-xs text-xs text-gray-400 italic">
            No size preset groups created yet. Select sizes above and save your first preset group!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sizeClasses.map((sc) => {
              const sizesArr = Array.isArray(sc.sizes) ? sc.sizes : [];
              const isEditingThis = editingPresetId === sc.id;

              return (
                <div
                  key={sc.id}
                  className={`border p-3.5 rounded-xs transition-all flex flex-col justify-between gap-3 ${
                    isEditingThis
                      ? 'border-black bg-gray-50 ring-1 ring-black'
                      : 'border-black/15 bg-white hover:border-black/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider text-black">
                        {sc.name}
                      </span>
                      <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-mono font-bold">
                        {sizesArr.length} sizes
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto">
                      {sizesArr.map((sz, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold bg-gray-100 text-black border border-gray-200 px-2 py-0.5 rounded-xs"
                        >
                          {sz}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleEditPreset(sc)}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 border border-black/20 hover:border-black hover:bg-black hover:text-white transition-colors rounded-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 size={11} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePromptDeletePresetGroup(sc.id)}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors rounded-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {presetToDelete && (
        <ConfirmModal
          title="Delete Size Preset Group"
          message="Are you sure you want to delete this size preset shortcut?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDeletePresetGroup}
          onCancel={() => setPresetToDelete(null)}
        />
      )}
    </div>
  );
}
