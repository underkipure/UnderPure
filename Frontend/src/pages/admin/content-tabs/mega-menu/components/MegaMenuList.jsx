import React from "react";
import MegaMenuItemRow from "./MegaMenuItemRow";
import MegaMenuItemForm from "./MegaMenuItemForm";

export default function MegaMenuList({
  menuItems,
  editingId,
  editForm,
  setEditForm,
  categories,
  globalBadges,
  activeCategories,
  onSave,
  onCancel,
  onMoveItem,
  onEdit,
  onDelete,
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
    <div className="space-y-3">
      {menuItems.map((item, index) => (
        <div
          key={item.id}
          className="border border-black/10 p-3 relative group"
        >
          {editingId === item.id && editForm ? (
            <MegaMenuItemForm
              editForm={editForm}
              setEditForm={setEditForm}
              categories={categories}
              globalBadges={globalBadges}
              activeCategories={activeCategories}
              onSave={onSave}
              onCancel={onCancel}
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
          ) : (
            <MegaMenuItemRow
              item={item}
              index={index}
              totalItems={menuItems.length}
              onMoveItem={onMoveItem}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </div>
      ))}
      {menuItems.length === 0 && (
        <p className="text-sm text-gray-500 py-4 text-center">
          No menu items added.
        </p>
      )}
    </div>
  );
}
