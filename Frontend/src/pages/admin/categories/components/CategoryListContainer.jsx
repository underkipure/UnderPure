import React from 'react';
import CategoryMobileCard from './CategoryMobileCard';
import CategoryDesktopRow from './CategoryDesktopRow';

export default function CategoryListContainer({
  topLevel,
  subMap,
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
  return (
    <div className="bg-white border border-black/10 overflow-hidden rounded-sm shadow-xs">
      {topLevel.length === 0 && (
        <div className="py-16 text-center text-gray-400 text-xs tracking-widest uppercase border-b border-dashed border-black/10">
          No categories yet — create your first one above
        </div>
      )}

      {/* Mobile View (Cards View - md:hidden) */}
      <div className="md:hidden space-y-4 p-4">
        {topLevel.map((cat, index) => (
          <CategoryMobileCard
            key={cat.id}
            cat={cat}
            index={index}
            totalCategories={topLevel.length}
            subs={subMap[cat.id] || []}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            editingCategory={editingCategory}
            setEditingCategory={setEditingCategory}
            showNewSubcategoryFor={showNewSubcategoryFor}
            setShowNewSubcategoryFor={setShowNewSubcategoryFor}
            newSubName={newSubName}
            setNewSubName={setNewSubName}
            newSubSlug={newSubSlug}
            setNewSubSlug={setNewSubSlug}
            handleMoveCategory={handleMoveCategory}
            handleToggleVisibility={handleToggleVisibility}
            handleToggleHeader={handleToggleHeader}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            handleAddSubcategory={handleAddSubcategory}
            handleImageUpload={handleImageUpload}
            generateSlug={generateSlug}
          />
        ))}
      </div>

      {/* Desktop View (Table View - hidden md:block) */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-[800px] flex flex-col">
          {topLevel.map((cat, index) => (
            <CategoryDesktopRow
              key={cat.id}
              cat={cat}
              index={index}
              totalCategories={topLevel.length}
              subs={subMap[cat.id] || []}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              editingSubcategory={editingSubcategory}
              setEditingSubcategory={setEditingSubcategory}
              showNewSubcategoryFor={showNewSubcategoryFor}
              setShowNewSubcategoryFor={setShowNewSubcategoryFor}
              newSubName={newSubName}
              setNewSubName={setNewSubName}
              newSubSlug={newSubSlug}
              setNewSubSlug={setNewSubSlug}
              newSubImage={newSubImage}
              setNewSubImage={setNewSubImage}
              handleMoveCategory={handleMoveCategory}
              handleToggleVisibility={handleToggleVisibility}
              handleToggleHeader={handleToggleHeader}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              handleAddSubcategory={handleAddSubcategory}
              handleImageUpload={handleImageUpload}
              generateSlug={generateSlug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
