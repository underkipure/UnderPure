import React from "react";
import { Plus, Save } from "lucide-react";
import ProductImagesManager from "./ProductImagesManager";
import ProductColorGroupItem from "./ProductColorGroupItem";
import ProductFormSidebar from "./ProductFormSidebar";

export default function ProductModalEditor({
  editingId,
  formData,
  setFormData,
  handleSave,
  onClose,
  handleMainDragStart,
  handleMainDragOver,
  handleMainDrop,
  draggedMainIndex,
  removeImage,
  handleImageUpload,
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
  draggedColorGroupImage,
  sizeClasses,
  safeGlobalSizes,
  topLevelCategories,
  subCategoryMap,
  safeGlobalBadges,
  toggleBadge,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl mb-1">
            {editingId ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            Fill in all the details below
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-xs uppercase tracking-widest border border-black/20 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto bg-black text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gray-800 flex justify-center items-center gap-2 cursor-pointer"
          >
            <Save size={14} /> {editingId ? "Update" : "Create"} Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white border border-black/10 p-6 space-y-4">
            <h2 className="font-serif text-lg border-b border-black/10 pb-2">
              Basic Information
            </h2>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Lily Embroidery Balconette Bra"
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the product in detail..."
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black leading-relaxed"
              />
            </div>
          </div>

          {/* Images */}
          <ProductImagesManager
            formData={formData}
            handleMainDragStart={handleMainDragStart}
            handleMainDragOver={handleMainDragOver}
            handleMainDrop={handleMainDrop}
            draggedMainIndex={draggedMainIndex}
            removeImage={removeImage}
            handleImageUpload={handleImageUpload}
          />

          {/* Unified Color Variants, Images & Stock Section */}
          <div className="bg-white border border-black/10 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/10 pb-3 gap-2">
              <div>
                <h2 className="font-serif text-lg">
                  Color Variants, Images &amp; Stock
                </h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                  Select a color once, add its specific images, and set size
                  stock quantities
                </p>
              </div>
              <button
                type="button"
                onClick={addColorGroup}
                className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-1.5 font-semibold self-start sm:self-auto rounded-xs cursor-pointer"
              >
                <Plus size={14} /> Add Color Group
              </button>
            </div>

            {(formData.colorGroups || []).length === 0 ? (
              <div className="text-center py-8 border border-dashed border-black/10 text-gray-400">
                <p className="text-xs uppercase tracking-widest mb-2">
                  No color variants added yet
                </p>
                <button
                  type="button"
                  onClick={addColorGroup}
                  className="text-xs uppercase tracking-widest text-black font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Add your first color variant
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {(formData.colorGroups || []).map((cg, gIdx) => (
                  <ProductColorGroupItem
                    key={gIdx}
                    cg={cg}
                    gIdx={gIdx}
                    formData={formData}
                    updateColorGroupField={updateColorGroupField}
                    removeColorGroup={removeColorGroup}
                    handleColorGroupImageUpload={handleColorGroupImageUpload}
                    removeColorGroupImage={removeColorGroupImage}
                    toggleMainImageToColorGroup={toggleMainImageToColorGroup}
                    handleColorGroupImageDragStart={
                      handleColorGroupImageDragStart
                    }
                    handleColorGroupImageDrop={handleColorGroupImageDrop}
                    draggedColorGroupImage={draggedColorGroupImage}
                    sizeClasses={sizeClasses}
                    addPresetSizesToColorGroup={addPresetSizesToColorGroup}
                    addSizeToColorGroup={addSizeToColorGroup}
                    removeSizeFromColorGroup={removeSizeFromColorGroup}
                    updateColorGroupSizeField={updateColorGroupSizeField}
                    safeGlobalSizes={safeGlobalSizes}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <ProductFormSidebar
          formData={formData}
          setFormData={setFormData}
          topLevelCategories={topLevelCategories}
          subCategoryMap={subCategoryMap}
          safeGlobalBadges={safeGlobalBadges}
          toggleBadge={toggleBadge}
        />
      </div>
    </div>
  );
}
