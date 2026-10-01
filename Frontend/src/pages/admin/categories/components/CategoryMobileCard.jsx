import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  FolderTree,
  Plus,
  Image as ImageIcon,
} from 'lucide-react';
import EditCategoryInline from './EditCategoryInline';
import SubcategoryMobileCard from './SubcategoryMobileCard';

export default function CategoryMobileCard({
  cat,
  index,
  totalCategories,
  subs = [],
  expandedId,
  setExpandedId,
  editingCategory,
  setEditingCategory,
  showNewSubcategoryFor,
  setShowNewSubcategoryFor,
  newSubName,
  setNewSubName,
  newSubSlug,
  setNewSubSlug,
  handleMoveCategory,
  handleToggleVisibility,
  handleToggleHeader,
  handleUpdate,
  handleDelete,
  handleAddSubcategory,
  handleImageUpload,
  generateSlug,
}) {
  const inHeader = cat.showInHeader !== false;
  const isExpanded = expandedId === cat.id;

  return (
    <div className="bg-white border border-black/10 rounded-sm p-4 space-y-3 shadow-2xs">
      {/* Header Row: Reorder + Thumbnail + Category Name */}
      <div className="flex items-center gap-3 border-b border-black/10 pb-3">
        {/* Reorder Buttons */}
        <div className="flex flex-col gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleMoveCategory(index, -1)}
            disabled={index === 0}
            className="p-1 border border-black/10 bg-gray-50 text-gray-600 rounded-xs disabled:opacity-20 hover:bg-gray-100 cursor-pointer"
            title="Move Up"
          >
            <ChevronDown size={12} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => handleMoveCategory(index, 1)}
            disabled={index === totalCategories - 1}
            className="p-1 border border-black/10 bg-gray-50 text-gray-600 rounded-xs disabled:opacity-20 hover:bg-gray-100 cursor-pointer"
            title="Move Down"
          >
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Thumbnail */}
        <div className="w-12 h-12 bg-gray-100 border border-black/10 overflow-hidden shrink-0 rounded-xs">
          {cat.image ? (
            <img
              loading="lazy"
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={18} className="text-gray-300" />
            </div>
          )}
        </div>

        {/* Name & Slug */}
        <div className="flex-1 min-w-0">
          {editingCategory === cat.id ? (
            <EditCategoryInline
              category={cat}
              onSave={updates => handleUpdate(cat.id, updates)}
              onCancel={() => setEditingCategory(null)}
            />
          ) : (
            <>
              <h3 className="font-serif text-base font-bold text-black truncate">
                {cat.name}
              </h3>
              <p className="text-[10px] text-gray-400 tracking-wider font-mono">
                /collections/{cat.slug}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Status Toggles & Expand Subcategories */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleToggleVisibility(cat.id)}
            className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-xs transition-colors cursor-pointer ${
              cat.isVisible
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-600'
            }`}
          >
            {cat.isVisible ? 'Visible' : 'Hidden'}
          </button>

          <button
            type="button"
            onClick={() => handleToggleHeader(cat.id)}
            className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border rounded-xs transition-all flex items-center gap-1 cursor-pointer ${
              inHeader
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-gray-50 text-gray-400'
            }`}
          >
            Header {inHeader ? '✓' : '—'}
          </button>
        </div>

        {/* Actions (Edit / Delete) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditingCategory(cat.id)}
            className="p-1.5 border border-black/10 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xs flex items-center gap-1 text-[10px] uppercase font-bold cursor-pointer"
          >
            <Edit2 size={13} /> Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(cat.id)}
            className="p-1.5 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 rounded-xs flex items-center gap-1 text-[10px] uppercase font-bold cursor-pointer"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* Subcategory Accordion Button */}
      <button
        type="button"
        onClick={() => setExpandedId(isExpanded ? null : cat.id)}
        className="w-full mt-2 py-2 px-3 bg-gray-50 border border-black/5 text-gray-700 hover:bg-gray-100 flex items-center justify-between text-xs font-medium rounded-xs cursor-pointer"
      >
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold">
          <FolderTree size={14} className="text-gray-500" />
          {subs.length} Subcategories
        </span>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Expanded Subcategories Card Panel */}
      {isExpanded && (
        <div className="mt-3 border-t border-black/10 pt-3 space-y-3">
          {/* Category Banner Image */}
          <div className="p-3 bg-gray-50 rounded-xs border border-black/5 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">
              Banner Image
            </span>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 border border-black/10 overflow-hidden shrink-0 relative group">
                {cat.image ? (
                  <>
                    <img
                      loading="lazy"
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdate(cat.id, { image: '' })}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={16} className="text-gray-300" />
                  </div>
                )}
              </div>
              <label className="px-3 py-1.5 border border-black/20 text-[10px] uppercase font-bold tracking-widest cursor-pointer bg-white hover:bg-gray-100 rounded-xs">
                Upload Banner
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(f, url => handleUpdate(cat.id, { image: url }));
                  }}
                />
              </label>
            </div>
          </div>

          {/* Add Subcategory Controls */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
              Subcategories List
            </span>
            <button
              type="button"
              onClick={() => setShowNewSubcategoryFor(cat.id)}
              className="text-[10px] uppercase font-bold tracking-widest bg-black text-white px-2.5 py-1 rounded-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> Add Sub
            </button>
          </div>

          {/* New Subcategory Mobile Form */}
          {showNewSubcategoryFor === cat.id && (
            <div className="p-3 bg-white border border-black/10 rounded-xs space-y-2">
              <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-bold">
                New Subcategory
              </label>
              <input
                value={newSubName}
                onChange={e => {
                  setNewSubName(e.target.value);
                  setNewSubSlug(generateSlug(e.target.value));
                }}
                placeholder="Subcategory Name"
                className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black rounded-xs"
              />
              <input
                value={newSubSlug}
                onChange={e => setNewSubSlug(e.target.value)}
                placeholder="Subcategory Slug"
                className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black text-gray-500 rounded-xs"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowNewSubcategoryFor(null)}
                  className="px-3 py-1 text-xs border border-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSubcategory(cat.id)}
                  className="px-3 py-1 text-xs bg-black text-white font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Subcategories mobile list */}
          {subs.length === 0 ? (
            <p className="text-xs text-gray-400 italic text-center py-2">
              No subcategories found.
            </p>
          ) : (
            <div className="space-y-2">
              {subs.map(sub => (
                <SubcategoryMobileCard
                  key={sub.id}
                  sub={sub}
                  onStartEdit={id => setEditingCategory(id)}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
