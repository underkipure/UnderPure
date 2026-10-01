import React from "react";
import { Plus } from "lucide-react";
import MegaMenuLinkGroupColumn from "./MegaMenuLinkGroupColumn";
import MegaMenuPromoCard from "./MegaMenuPromoCard";

export default function MegaMenuDropdownEditor({
  editForm,
  setEditForm,
  categories = [],
  globalBadges = [],
  activeCategories = [],
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
    <div className="border-t border-black/10 pt-6 space-y-8">
      {/* Columns (Link Groups) */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs uppercase tracking-widest text-gray-800 font-semibold">
            Dropdown Columns (Link Groups)
          </label>
          <button
            type="button"
            onClick={onAddGroup}
            className="text-[10px] uppercase tracking-widest text-black hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus size={12} /> Add Column
          </button>
        </div>

        <div className="space-y-4">
          {(editForm.linkGroups || []).map((group, gIdx) => (
            <MegaMenuLinkGroupColumn
              key={gIdx}
              group={group}
              gIdx={gIdx}
              editForm={editForm}
              setEditForm={setEditForm}
              categories={categories}
              globalBadges={globalBadges}
              onUpdateGroup={onUpdateGroup}
              onDeleteGroup={onDeleteGroup}
              onAddLinkToGroup={onAddLinkToGroup}
              onUpdateLinkInGroup={onUpdateLinkInGroup}
              onDeleteLinkInGroup={onDeleteLinkInGroup}
            />
          ))}
        </div>

        {/* Legacy flat links migration */}
        {editForm.links &&
          editForm.links.length > 0 &&
          (editForm.linkGroups || []).length === 0 && (
            <div className="mt-4 p-3 border border-yellow-400 bg-yellow-50 flex items-center justify-between">
              <p className="text-xs text-yellow-700">
                You have old unstructured links. Click to convert them into a
                column.
              </p>
              <button
                type="button"
                onClick={onMigrateLinksToGroup}
                className="text-[10px] uppercase font-bold bg-yellow-400 text-black px-3 py-1 hover:bg-yellow-500 cursor-pointer"
              >
                Convert to Column
              </button>
            </div>
          )}
      </div>

      {/* Promos */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs uppercase tracking-widest text-gray-800 font-semibold">
            Dropdown Promos (Images)
          </label>
          <button
            type="button"
            onClick={onAddPromo}
            className="text-[10px] uppercase tracking-widest text-black hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus size={12} /> Add Promo
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(editForm.promos || []).map((promo) => (
            <MegaMenuPromoCard
              key={promo.id}
              promo={promo}
              activeCategories={activeCategories}
              onSelectCategory={onSelectPromoCategory}
              onRevertToCatImage={onRevertToCategoryImage}
              onUpdatePromo={onUpdatePromo}
              onDeletePromo={onDeletePromo}
              onImageUpload={onPromoImageUpload}
            />
          ))}
        </div>
        {(!editForm.promos || editForm.promos.length === 0) && (
          <div className="text-[10px] text-gray-400 italic">
            No promotional images added.
          </div>
        )}
      </div>
    </div>
  );
}
