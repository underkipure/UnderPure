import React from "react";
import MegaMenuHeader from "./components/MegaMenuHeader";
import MegaMenuList from "./components/MegaMenuList";
import { useMegaMenuManager } from "./hooks/useMegaMenuManager";

export default function MegaMenuTab() {
  const {
    categories,
    globalBadges,
    activeCategories,
    menuItems,
    editingId,
    setEditingId,
    editForm,
    setEditForm,
    isSaving,
    handlePublish,
    handleAdd,
    handleEdit,
    handleSave,
    handleDelete,
    handleMoveItem,
    handleAddGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    handleAddLinkToGroup,
    handleUpdateLinkInGroup,
    handleDeleteLinkInGroup,
    migrateLinksToGroup,
    handleAddPromo,
    handleSelectPromoCategory,
    handleRevertToCategoryImage,
    handleUpdatePromo,
    handleDeletePromo,
    handlePromoImageUpload,
  } = useMegaMenuManager();

  return (
    <div className="bg-white border border-black/10 p-6 space-y-6">
      <MegaMenuHeader
        onPublish={handlePublish}
        isSaving={isSaving}
        onAdd={handleAdd}
      />

      <MegaMenuList
        menuItems={menuItems}
        editingId={editingId}
        editForm={editForm}
        setEditForm={setEditForm}
        categories={categories}
        globalBadges={globalBadges}
        activeCategories={activeCategories}
        onSave={handleSave}
        onCancel={() => setEditingId(null)}
        onMoveItem={handleMoveItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddGroup={handleAddGroup}
        onUpdateGroup={handleUpdateGroup}
        onDeleteGroup={handleDeleteGroup}
        onAddLinkToGroup={handleAddLinkToGroup}
        onUpdateLinkInGroup={handleUpdateLinkInGroup}
        onDeleteLinkInGroup={handleDeleteLinkInGroup}
        onMigrateLinksToGroup={migrateLinksToGroup}
        onAddPromo={handleAddPromo}
        onSelectPromoCategory={handleSelectPromoCategory}
        onRevertToCategoryImage={handleRevertToCategoryImage}
        onUpdatePromo={handleUpdatePromo}
        onDeletePromo={handleDeletePromo}
        onPromoImageUpload={handlePromoImageUpload}
      />
    </div>
  );
}
