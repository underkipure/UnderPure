import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  FolderTree,
  Plus,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import EditCategoryInline from './EditCategoryInline';
import SubcategoryDesktopRow from './SubcategoryDesktopRow';

export default function CategoryDesktopRow({
  cat,
  index,
  totalCategories,
  subs = [],
  expandedId,
  setExpandedId,
  editingCategory,
  setEditingCategory,
  editingSubcategory,
  setEditingSubcategory,
  showNewSubcategoryFor,
  setShowNewSubcategoryFor,
  newSubName,
  setNewSubName,
  newSubSlug,
  setNewSubSlug,
  newSubImage,
  setNewSubImage,
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
    <div className="bg-white border-b border-black/10 last:border-b-0">
      {/* Row */}
      <div className="flex items-center gap-3 p-4 hover:bg-gray-50/50 transition-colors group">
        {/* Reorder */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => handleMoveCategory(index, -1)}
            disabled={index === 0}
            className="text-gray-300 hover:text-black p-0.5 disabled:opacity-20 cursor-pointer"
            title="Move Up"
          >
            <ChevronDown size={14} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => handleMoveCategory(index, 1)}
            disabled={index === totalCategories - 1}
            className="text-gray-300 hover:text-black p-0.5 disabled:opacity-20 cursor-pointer"
            title="Move Down"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpandedId(isExpanded ? null : cat.id)}
          className="text-gray-400 hover:text-black shrink-0 cursor-pointer"
        >
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Thumbnail */}
        <div className="w-10 h-10 bg-gray-100 border border-black/10 overflow-hidden shrink-0">
          {cat.image ? (
            <img
              loading="lazy"
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={16} className="text-gray-300" />
            </div>
          )}
        </div>

        {/* Name / slug / edit form */}
        <div className="flex-1 min-w-0">
          {editingCategory === cat.id ? (
            <EditCategoryInline
              category={cat}
              onSave={updates => handleUpdate(cat.id, updates)}
              onCancel={() => setEditingCategory(null)}
            />
          ) : (
            <>
              <div className="font-serif text-base truncate">{cat.name}</div>
              <div className="text-[10px] text-gray-400 tracking-widest uppercase">
                /collections/{cat.slug}
              </div>
            </>
          )}
        </div>

        {/* Sub count */}
        <div className="hidden sm:block text-xs text-gray-400 tracking-widest uppercase shrink-0">
          {subs.length} sub
        </div>

        {/* Visible toggle */}
        <button
          type="button"
          onClick={() => handleToggleVisibility(cat.id)}
          className={`px-2.5 py-1 text-[9px] uppercase tracking-widest border transition-colors shrink-0 cursor-pointer ${
            cat.isVisible
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-600'
          }`}
        >
          {cat.isVisible ? 'Visible' : 'Hidden'}
        </button>

        {/* Header toggle */}
        <button
          type="button"
          onClick={() => handleToggleHeader(cat.id)}
          title={inHeader ? 'Click to hide from header nav' : 'Click to show in header nav'}
          className={`px-2.5 py-1 text-[9px] uppercase tracking-widest border transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
            inHeader
              ? 'border-blue-200 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-gray-50 text-gray-400'
          }`}
        >
          <span className="hidden sm:inline">Header</span>
          <span>{inHeader ? '✓' : '—'}</span>
        </button>

        {/* Edit / delete */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={() => setEditingCategory(cat.id)}
            className="text-gray-400 hover:text-black cursor-pointer"
            title="Edit Category"
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(cat.id)}
            className="text-gray-400 hover:text-red-600 cursor-pointer"
            title="Delete Category"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Expanded subcategories panel */}
      {isExpanded && (
        <div className="border-t border-black/10 bg-gray-50/30">
          {/* Banner upload */}
          <div className="px-4 py-4 border-b border-black/5">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2 block">
              Category Banner Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 border border-black/10 overflow-hidden shrink-0 relative group/img">
                {cat.image ? (
                  <>
                    <img
                      loading="lazy"
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleUpdate(cat.id, { image: '' })}
                        className="bg-white text-red-600 p-1.5 cursor-pointer"
                        title="Remove Banner"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={20} className="text-gray-300" />
                  </div>
                )}
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-black/20 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-50">
                <ImageIcon size={14} /> Upload
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

          {/* Subcategory header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-black/5">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold flex items-center gap-2">
              <FolderTree size={14} /> Subcategories
            </span>
            <button
              type="button"
              onClick={() => setShowNewSubcategoryFor(cat.id)}
              className="text-[10px] uppercase tracking-widest font-semibold text-black hover:underline underline-offset-4 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> Add
            </button>
          </div>

          {/* New subcategory form */}
          {showNewSubcategoryFor === cat.id && (
            <div className="px-4 py-3 border-b border-black/5 bg-white">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1">
                    Name
                  </label>
                  <input
                    value={newSubName}
                    onChange={e => {
                      setNewSubName(e.target.value);
                      setNewSubSlug(generateSlug(e.target.value));
                    }}
                    placeholder="e.g. Balconette Bras"
                    className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1">
                    Slug
                  </label>
                  <input
                    value={newSubSlug}
                    onChange={e => setNewSubSlug(e.target.value)}
                    className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black text-gray-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 flex items-center justify-center relative overflow-hidden border border-black/10">
                    {newSubImage ? (
                      <img src={newSubImage} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <ImageIcon size={12} className="text-gray-300" />
                    )}
                  </div>
                  <label className="text-[9px] uppercase tracking-widest cursor-pointer hover:underline text-gray-500">
                    Upload Img
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(f, setNewSubImage);
                      }}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddSubcategory(cat.id)}
                  className="bg-black text-white px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-gray-800 shrink-0 cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewSubcategoryFor(null)}
                  className="text-gray-400 hover:text-black shrink-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Subcategory rows */}
          {subs.length === 0 && showNewSubcategoryFor !== cat.id && (
            <div className="px-4 py-6 text-center text-xs text-gray-400 tracking-widest uppercase">
              No subcategories yet
            </div>
          )}

          {subs.map(sub => (
            <SubcategoryDesktopRow
              key={sub.id}
              sub={sub}
              isEditing={editingSubcategory === sub.id}
              onStartEdit={id => setEditingSubcategory(id)}
              onCancelEdit={() => setEditingSubcategory(null)}
              onSaveEdit={(id, updates) => {
                handleUpdate(id, updates);
                setEditingSubcategory(null);
              }}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              handleImageUpload={handleImageUpload}
              generateSlug={generateSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
