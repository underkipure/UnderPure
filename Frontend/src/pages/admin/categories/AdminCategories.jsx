import React from 'react';
import ConfirmModal from '../../../components/ConfirmModal';
import CategoryStatusLegend from './components/CategoryStatusLegend';
import NewCategoryForm from './components/NewCategoryForm';
import AdminCategoriesHeader from './components/AdminCategoriesHeader';
import CategoryListContainer from './components/CategoryListContainer';
import { generateCategorySlug, readImageAsDataUrl } from './utils/categoryHelpers';
import { useAdminCategoriesState } from './hooks/useAdminCategoriesState';

export default function AdminCategories() {
  const {
    topLevel,
    subMap,
    expandedId,
    setExpandedId,
    editingCategory,
    setEditingCategory,
    editingSubcategory,
    setEditingSubcategory,
    showNewCategoryForm,
    setShowNewCategoryForm,
    showNewSubcategoryFor,
    setShowNewSubcategoryFor,
    categoryToDelete,
    setCategoryToDelete,
    newSubName,
    setNewSubName,
    newSubSlug,
    setNewSubSlug,
    newSubImage,
    setNewSubImage,
    handleAddCategory,
    handleDelete,
    confirmDelete,
    handleUpdate,
    handleToggleVisibility,
    handleToggleHeader,
    handleAddSubcategory,
    handleMoveCategory,
  } = useAdminCategoriesState();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {categoryToDelete && (
        <ConfirmModal
          title="Delete Category"
          message="Are you sure you want to delete this category? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setCategoryToDelete(null)}
          confirmText="Delete"
        />
      )}

      {/* Page header */}
      <AdminCategoriesHeader
        onOpenNewCategoryForm={() => setShowNewCategoryForm(true)}
      />

      {/* Legend */}
      <CategoryStatusLegend />

      {/* New Category Form */}
      {showNewCategoryForm && (
        <NewCategoryForm
          onClose={() => setShowNewCategoryForm(false)}
          onSubmit={handleAddCategory}
          handleImageUpload={readImageAsDataUrl}
          generateSlug={generateCategorySlug}
        />
      )}

      {/* Category List Container */}
      <CategoryListContainer
        topLevel={topLevel}
        subMap={subMap}
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
        handleImageUpload={readImageAsDataUrl}
        generateSlug={generateCategorySlug}
      />
    </div>
  );
}
