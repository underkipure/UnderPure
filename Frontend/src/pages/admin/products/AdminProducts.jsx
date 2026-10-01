import React, { useRef, useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { useAuthStore } from "../../../store/authStore";
import ConfirmModal from "../../../components/ConfirmModal";
import ProductListToolbar from "./components/ProductListToolbar";
import ProductTableView from "./components/ProductTableView";
import ProductPagination from "./components/ProductPagination";
import ProductModalEditor from "./components/ProductModalEditor";

// Custom Hooks & Helpers
import { useAdminProductsState } from "./hooks/useAdminProductsState";
import { useProductFormManager } from "./hooks/useProductFormManager";
import {
  DEFAULT_GLOBAL_SIZES,
  getProductStatus,
  buildCategoryHierarchy,
} from "./utils/adminProductHelpers";

export default function AdminProducts() {
  const { categories, globalSizes, globalBadges, sizeClasses } = useAdmin();
  const safeGlobalSizes =
    globalSizes && globalSizes.length > 0
      ? globalSizes
      : DEFAULT_GLOBAL_SIZES;
  const safeGlobalBadges = globalBadges || [];
  const { token } = useAuthStore();

  const { activeCategories, topLevelCategories, subCategoryMap } =
    buildCategoryHierarchy(categories);

  const {
    adminProducts,
    filtered,
    loading,
    isLoadingMore,
    totalCount,
    hasMore,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    productToDelete,
    setProductToDelete,
    handleLoadMore,
    handleDelete,
    confirmDelete,
    refreshProducts,
  } = useAdminProductsState({ token });

  const scrollPosRef = useRef(0);
  const lastEditedIdRef = useRef(null);
  const [highlightedProductId, setHighlightedProductId] = useState(null);

  const handleSaveSuccess = async (info) => {
    await refreshProducts(info);
    if (info?.isEdit && info?.editingId) {
      setHighlightedProductId(info.editingId);
      setTimeout(() => {
        setHighlightedProductId(null);
      }, 2500);
    }
  };

  const {
    showForm,
    editingId,
    formData,
    setFormData,
    draggedMainIndex,
    draggedColorGroupImage,
    openNewForm,
    openEditForm,
    closeForm,
    handleSave,
    addColorGroup,
    removeColorGroup,
    updateColorGroupField,
    addSizeToColorGroup,
    addPresetSizesToColorGroup,
    removeSizeFromColorGroup,
    updateColorGroupSizeField,
    handleColorGroupImageUpload,
    removeColorGroupImage,
    toggleMainImageToColorGroup,
    handleColorGroupImageDragStart,
    handleColorGroupImageDrop,
    handleImageUpload,
    removeImage,
    handleMainDragStart,
    handleMainDragOver,
    handleMainDrop,
    toggleBadge,
  } = useProductFormManager({
    token,
    categories,
    safeGlobalSizes,
    onSaveSuccess: handleSaveSuccess,
  });

  const handleOpenEdit = (product) => {
    scrollPosRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    lastEditedIdRef.current = product.id;
    openEditForm(product);
  };

  const handleOpenNew = () => {
    scrollPosRef.current = 0;
    lastEditedIdRef.current = null;
    openNewForm();
  };

  // Restore scroll position and center row after closing/saving the form
  useEffect(() => {
    if (!showForm && scrollPosRef.current > 0) {
      const targetY = scrollPosRef.current;
      const targetId = lastEditedIdRef.current;

      const restore = () => {
        if (targetId) {
          const el =
            document.getElementById(`product-row-${targetId}`) ||
            document.getElementById(`product-card-${targetId}`);
          if (el) {
            el.scrollIntoView({ behavior: "instant", block: "center" });
            return;
          }
        }
        window.scrollTo({ top: targetY, behavior: "instant" });
      };

      requestAnimationFrame(restore);
      const timer = setTimeout(restore, 60);
      return () => clearTimeout(timer);
    }
  }, [showForm]);

  if (showForm) {
    return (
      <ProductModalEditor
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        handleSave={handleSave}
        onClose={closeForm}
        handleMainDragStart={handleMainDragStart}
        handleMainDragOver={handleMainDragOver}
        handleMainDrop={handleMainDrop}
        draggedMainIndex={draggedMainIndex}
        removeImage={removeImage}
        handleImageUpload={handleImageUpload}
        addColorGroup={addColorGroup}
        removeColorGroup={removeColorGroup}
        updateColorGroupField={updateColorGroupField}
        addSizeToColorGroup={addSizeToColorGroup}
        addPresetSizesToColorGroup={addPresetSizesToColorGroup}
        removeSizeFromColorGroup={removeSizeFromColorGroup}
        updateColorGroupSizeField={updateColorGroupSizeField}
        handleColorGroupImageUpload={handleColorGroupImageUpload}
        removeColorGroupImage={removeColorGroupImage}
        toggleMainImageToColorGroup={toggleMainImageToColorGroup}
        handleColorGroupImageDragStart={handleColorGroupImageDragStart}
        handleColorGroupImageDrop={handleColorGroupImageDrop}
        draggedColorGroupImage={draggedColorGroupImage}
        sizeClasses={sizeClasses}
        safeGlobalSizes={safeGlobalSizes}
        topLevelCategories={topLevelCategories}
        subCategoryMap={subCategoryMap}
        safeGlobalBadges={safeGlobalBadges}
        toggleBadge={toggleBadge}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {productToDelete && (
        <ConfirmModal
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setProductToDelete(null)}
          confirmText="Delete"
        />
      )}

      {/* Toolbar & Status Filters */}
      <ProductListToolbar
        totalCount={totalCount}
        openNewForm={handleOpenNew}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        activeCategories={activeCategories}
        adminProducts={adminProducts}
        getProductStatus={getProductStatus}
      />

      {/* Responsive Product Table & Cards */}
      <ProductTableView
        loading={loading}
        adminProducts={adminProducts}
        filtered={filtered}
        getProductStatus={getProductStatus}
        categories={categories}
        openEditForm={handleOpenEdit}
        handleDelete={handleDelete}
        highlightedProductId={highlightedProductId}
      />

      {/* Pagination & Load More */}
      <ProductPagination
        adminProducts={adminProducts}
        totalCount={totalCount}
        hasMore={hasMore}
        handleLoadMore={handleLoadMore}
        isLoadingMore={isLoadingMore}
      />
    </div>
  );
}
