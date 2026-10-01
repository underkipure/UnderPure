import React from "react";

export default function MegaMenuItemTopSettings({
  editForm,
  setEditForm,
  categories = [],
  globalBadges = [],
}) {
  const handleLoadCategory = (catId) => {
    if (!catId) return;
    const cat = categories.find(
      (c) => String(c.id) === String(catId) || c.name === catId
    );
    if (!cat) return;

    const slug =
      cat.slug ||
      cat.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const subs = categories.filter((c) => c.parentId === cat.id);
    const allLink = {
      id: Date.now() - 1,
      name: `All ${cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase()}`,
      url: `/collections/${slug}`,
      image: "",
      isSpecial: false,
      isDivider: false,
    };
    const newLinks = [
      allLink,
      ...subs.map((sub, idx) => ({
        id: Date.now() + idx,
        name: sub.name,
        url: `/collections/${
          sub.slug ||
          sub.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        }`,
        image: sub.image || "",
        isSpecial: false,
        isDivider: false,
      })),
    ];

    const newPromos = subs
      .filter((sub) => sub.image)
      .slice(0, 3)
      .map((sub, idx) => ({
        id: Date.now() + 1000 + idx,
        image: sub.image,
        title: sub.name,
        url: `/collections/${
          sub.slug ||
          sub.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        }`,
      }));

    setEditForm({
      ...editForm,
      name: cat.name,
      url: `/collections/${slug}`,
      hasDropdown:
        newLinks.length > 0 || newPromos.length > 0
          ? true
          : editForm.hasDropdown,
      linkGroups:
        newLinks.length > 0 ? [{ title: "COLLECTION", links: newLinks }] : [],
      promos: newPromos.length > 0 ? newPromos : editForm.promos,
      links: [],
    });
  };

  const handleLoadBadge = (bName) => {
    if (!bName) return;
    setEditForm({
      ...editForm,
      name: bName.toUpperCase(),
      url: `/collections/all?badge=${encodeURIComponent(bName)}`,
      isRed: true,
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Level Presets and Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 bg-gray-50 p-3 border border-black/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 whitespace-nowrap">
              Load Category:
            </label>
            <select
              className="flex-1 border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
              onChange={(e) => {
                handleLoadCategory(e.target.value);
                e.target.value = "";
              }}
            >
              <option value="">-- Choose Category --</option>
              {categories
                .filter((c) => !c.parentId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 whitespace-nowrap">
              Load Badge:
            </label>
            <select
              className="flex-1 border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
              onChange={(e) => {
                handleLoadBadge(e.target.value);
                e.target.value = "";
              }}
            >
              <option value="">-- Choose Badge --</option>
              {(globalBadges || []).map((b) => {
                const name = typeof b === "object" ? b.name : b;
                return (
                  <option key={name} value={name}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={editForm.name}
            onChange={(e) =>
              setEditForm({ ...editForm, name: e.target.value })
            }
            className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Target URL
          </label>
          <input
            type="text"
            value={editForm.url}
            onChange={(e) =>
              setEditForm({ ...editForm, url: e.target.value })
            }
            className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={editForm.hasDropdown}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                hasDropdown: e.target.checked,
              })
            }
            className="w-4 h-4 accent-black"
          />
          <span className="text-[10px] uppercase tracking-widest font-semibold">
            Has Mega Menu Dropdown
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={editForm.isRed}
            onChange={(e) =>
              setEditForm({ ...editForm, isRed: e.target.checked })
            }
            className="w-4 h-4 accent-red-600"
          />
          <span className="text-[10px] uppercase tracking-widest font-semibold text-red-600">
            Highlight Red (Sale)
          </span>
        </label>
      </div>
    </div>
  );
}
