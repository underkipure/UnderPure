import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function MegaMenuLinkGroupColumn({
  group,
  gIdx,
  editForm,
  setEditForm,
  categories = [],
  globalBadges = [],
  onUpdateGroup,
  onDeleteGroup,
  onAddLinkToGroup,
  onUpdateLinkInGroup,
  onDeleteLinkInGroup,
}) {
  return (
    <div className="border border-black/10 p-3 bg-white space-y-3 shadow-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-black/5 gap-2">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={group.title}
            onChange={(e) => onUpdateGroup(gIdx, "title", e.target.value)}
            placeholder="Column Title (e.g. SHOP BY)"
            className="border border-black/20 p-2 text-sm focus:outline-none focus:border-black font-bold uppercase w-full sm:w-48"
          />
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase font-semibold text-gray-500 whitespace-nowrap">
              Mobile:
            </span>
            <select
              value={group.mobileViewType || (gIdx === 1 ? "redirect_list" : "inline")}
              onChange={(e) => onUpdateGroup(gIdx, "mobileViewType", e.target.value)}
              className="border border-black/20 p-1.5 text-xs focus:outline-none focus:border-black bg-gray-50 font-sans"
              title="Select how this column renders in mobile sidebar"
            >
              <option value="inline">Inline Links (Detail)</option>
              <option value="redirect_list">Redirect Button ❯ (Sub-list)</option>
              <option value="bottom_button">Bottom Featured Link (e.g. New Lingerie ❯)</option>
              <option value="hidden">Hide on Mobile</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onAddLinkToGroup(gIdx)}
            className="text-[10px] text-black font-semibold uppercase hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus size={12} /> Add Link
          </button>
          <button
            type="button"
            onClick={() => onDeleteGroup(gIdx)}
            className="text-[10px] text-red-500 font-semibold uppercase hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={12} /> Remove Column
          </button>
        </div>
      </div>

      <div className="space-y-2 pl-4 border-l-2 border-gray-100">
        {(group.links || []).map((link, lIdx) => (
          <div
            key={link.id || lIdx}
            className="flex flex-col sm:flex-row gap-2 items-start sm:items-center group relative bg-gray-50 p-2 border border-black/5"
          >
            <label className="flex items-center gap-1 text-[10px] uppercase text-gray-500 cursor-pointer mr-2">
              <input
                type="checkbox"
                checked={link.isDivider || false}
                onChange={(e) =>
                  onUpdateLinkInGroup(gIdx, lIdx, "isDivider", e.target.checked)
                }
                className="w-3 h-3 accent-black"
              />{" "}
              Divider
            </label>

            {!link.isDivider ? (
              <>
                <select
                  className="w-full sm:w-1/4 border border-black/20 p-2 text-sm focus:outline-none focus:border-black bg-gray-50/50"
                  onChange={(e) => {
                    if (e.target.value) {
                      const [catName, catUrl] = e.target.value.split("|");
                      const newGroups = [...(editForm.linkGroups || [])];
                      newGroups[gIdx].links[lIdx] = {
                        ...newGroups[gIdx].links[lIdx],
                        name: catName,
                        url: catUrl,
                      };
                      setEditForm({ ...editForm, linkGroups: newGroups });
                      e.target.value = "";
                    }
                  }}
                  title="Quickly fill Name and URL from your existing categories"
                >
                  <option value="">Quick Link...</option>
                  {globalBadges && globalBadges.length > 0 && (
                    <optgroup label="🏷️ BADGES">
                      {globalBadges.map((b) => {
                        const bName = typeof b === "object" ? b.name : b;
                        return (
                          <option
                            key={bName}
                            value={`${bName.toUpperCase()}|/collections/all?badge=${encodeURIComponent(bName)}`}
                          >
                            Badge: {bName}
                          </option>
                        );
                      })}
                    </optgroup>
                  )}
                  {categories
                    .filter((c) => !c.parentId)
                    .map((cat) => (
                      <optgroup key={cat.id} label={cat.name}>
                        <option
                          value={`${cat.name}|/collections/${
                            cat.slug ||
                            cat.name
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/(^-|-$)/g, "")
                          }`}
                        >
                          {cat.name} (Parent)
                        </option>
                        {categories
                          .filter((sub) => sub.parentId === cat.id)
                          .map((sub) => (
                            <option
                              key={sub.id}
                              value={`${sub.name}|/collections/${
                                sub.slug ||
                                sub.name
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, "-")
                                  .replace(/(^-|-$)/g, "")
                              }`}
                            >
                              -- {sub.name}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                </select>
                <input
                  type="text"
                  value={link.name || ""}
                  onChange={(e) =>
                    onUpdateLinkInGroup(gIdx, lIdx, "name", e.target.value)
                  }
                  placeholder="Link Name"
                  className="w-full sm:w-1/3 border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
                />
                <input
                  type="text"
                  value={link.url || ""}
                  onChange={(e) =>
                    onUpdateLinkInGroup(gIdx, lIdx, "url", e.target.value)
                  }
                  placeholder="/url"
                  className="w-full sm:flex-1 border border-black/20 p-2 text-sm focus:outline-none focus:border-black text-gray-500"
                />
                <label className="flex items-center gap-1 text-[10px] uppercase text-gray-500 cursor-pointer ml-2 pr-6">
                  <input
                    type="checkbox"
                    checked={link.isSpecial || false}
                    onChange={(e) =>
                      onUpdateLinkInGroup(gIdx, lIdx, "isSpecial", e.target.checked)
                    }
                    className="w-3 h-3 accent-[#90134a]"
                  />{" "}
                  Bold
                </label>
              </>
            ) : (
              <div className="flex-1 text-[10px] text-gray-400 italic">
                Divider Line (---)
              </div>
            )}

            <button
              type="button"
              onClick={() => onDeleteLinkInGroup(gIdx, lIdx)}
              className="absolute sm:relative top-2 right-2 sm:top-auto sm:right-auto text-gray-300 hover:text-red-500 px-2 cursor-pointer"
              title="Delete Link"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {(!group.links || group.links.length === 0) && (
          <div className="text-[10px] text-gray-400 italic">No links added.</div>
        )}
      </div>
    </div>
  );
}
