import React from "react";
import MegaMenuItemTopSettings from "./MegaMenuItemTopSettings";
import MegaMenuDropdownEditor from "./MegaMenuDropdownEditor";

export default function MegaMenuItemForm({
  editForm,
  setEditForm,
  categories = [],
  globalBadges = [],
  activeCategories = [],
  onSave,
  onCancel,
  onAddGroup,
  onUpdateGroup,
  onDeleteGroup,
  onAddLinkToGroup,
  onUpdateLinkInGroup,
  onDeleteLinkInGroup,
  onMigrateLinksToGroup,
  onAddPromo,
  onSelectPromoCategory,
  onRevertToCategoryImage,
  onUpdatePromo,
  onDeletePromo,
  onPromoImageUpload,
}) {
  return (
    <div className="space-y-6 pt-2">
      {/* Top Level Settings */}
      <MegaMenuItemTopSettings
        editForm={editForm}
        setEditForm={setEditForm}
        categories={categories}
        globalBadges={globalBadges}
      />

      {/* Dropdown Content Editor */}
      {editForm.hasDropdown && (
        <MegaMenuDropdownEditor
          editForm={editForm}
          setEditForm={setEditForm}
          categories={categories}
          globalBadges={globalBadges}
          activeCategories={activeCategories}
          onAddGroup={onAddGroup}
          onUpdateGroup={onUpdateGroup}
          onDeleteGroup={onDeleteGroup}
          onAddLinkToGroup={onAddLinkToGroup}
          onUpdateLinkInGroup={onUpdateLinkInGroup}
          onDeleteLinkInGroup={onDeleteLinkInGroup}
          onMigrateLinksToGroup={onMigrateLinksToGroup}
          onAddPromo={onAddPromo}
          onSelectPromoCategory={onSelectPromoCategory}
          onRevertToCategoryImage={onRevertToCategoryImage}
          onUpdatePromo={onUpdatePromo}
          onDeletePromo={onDeletePromo}
          onPromoImageUpload={onPromoImageUpload}
        />
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-black/10">
        <button
          type="button"
          onClick={onSave}
          className="bg-black text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Save Menu Item
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-black/20 px-6 py-2.5 text-xs uppercase tracking-widest hover:border-black transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
