import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSiteSettingsStore } from "../../../../../store/siteSettingsStore";
import { useAdmin } from "../../../../../context/AdminContext";

export function useMegaMenuManager() {
  const { megaMenuData, updateSettings } = useSiteSettingsStore();
  const { categories, globalBadges } = useAdmin();
  const activeCategories = (categories || []).filter((c) => c.isVisible !== false);

  const [menuItems, setMenuItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (megaMenuData && megaMenuData.menus) {
      setMenuItems(megaMenuData.menus);
    }
  }, [megaMenuData]);

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      let finalMenuItems = menuItems;
      // Auto-save any currently open edit form before publishing
      if (editingId) {
        finalMenuItems = menuItems.map((m) => (m.id === editingId ? editForm : m));
        setMenuItems(finalMenuItems);
        setEditingId(null);
      }

      const token = localStorage.getItem("auth_token");
      await updateSettings({ megaMenuData: { menus: finalMenuItems } }, token);
      toast.success("Mega Menu settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update Mega Menu settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      name: "NEW CATEGORY",
      hasDropdown: false,
      isRed: false,
      url: "/",
      links: [],
      linkGroups: [],
      promos: [],
    };
    setMenuItems([...menuItems, newItem]);
    setEditingId(newItem.id);
    setEditForm(newItem);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      ...item,
      links: item.links || [],
      linkGroups: item.linkGroups || [],
      promos: item.promos || [],
    });
  };

  const handleSave = async () => {
    const updatedList = menuItems.map((m) => (m.id === editingId ? editForm : m));
    setMenuItems(updatedList);
    setEditingId(null);
    try {
      const token = localStorage.getItem("auth_token");
      await updateSettings({ megaMenuData: { menus: updatedList } }, token);
      toast.success("Menu item & promo images saved successfully!");
    } catch (err) {
      toast.error("Saved locally, but failed to sync to server");
    }
  };

  const handleDelete = (id) => {
    setMenuItems(menuItems.filter((m) => m.id !== id));
  };

  const handleMoveItem = (index, dir) => {
    const arr = [...menuItems];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setMenuItems(arr);
  };

  // --- Sub-links Handlers ---
  const handleAddGroup = () => {
    setEditForm({
      ...editForm,
      linkGroups: [
        ...(editForm.linkGroups || []),
        { title: "NEW COLUMN", links: [] },
      ],
    });
  };

  const handleUpdateGroup = (gIdx, field, value) => {
    const newGroups = [...(editForm.linkGroups || [])];
    newGroups[gIdx] = { ...newGroups[gIdx], [field]: value };
    setEditForm({ ...editForm, linkGroups: newGroups });
  };

  const handleDeleteGroup = (gIdx) => {
    const newGroups = [...(editForm.linkGroups || [])];
    newGroups.splice(gIdx, 1);
    setEditForm({ ...editForm, linkGroups: newGroups });
  };

  const handleAddLinkToGroup = (gIdx) => {
    const newGroups = [...(editForm.linkGroups || [])];
    newGroups[gIdx].links = newGroups[gIdx].links || [];
    newGroups[gIdx].links.push({
      id: Date.now(),
      name: "New Link",
      url: "/",
      isSpecial: false,
      isDivider: false,
    });
    setEditForm({ ...editForm, linkGroups: newGroups });
  };

  const handleUpdateLinkInGroup = (gIdx, lIdx, field, value) => {
    const newGroups = [...(editForm.linkGroups || [])];
    newGroups[gIdx].links[lIdx] = {
      ...newGroups[gIdx].links[lIdx],
      [field]: value,
    };
    setEditForm({ ...editForm, linkGroups: newGroups });
  };

  const handleDeleteLinkInGroup = (gIdx, lIdx) => {
    const newGroups = [...(editForm.linkGroups || [])];
    newGroups[gIdx].links.splice(lIdx, 1);
    setEditForm({ ...editForm, linkGroups: newGroups });
  };

  const migrateLinksToGroup = () => {
    setEditForm({
      ...editForm,
      linkGroups: [{ title: "LINKS", links: editForm.links || [] }],
      links: [],
    });
  };

  // --- Promos Handlers ---
  const handleAddPromo = () => {
    setEditForm((prev) => {
      if (!prev) return prev;
      const nextForm = {
        ...prev,
        promos: [
          ...(prev.promos || []),
          {
            id: Date.now(),
            categoryId: "",
            image: "",
            customImage: "",
            hasCustomImage: false,
            title: "",
            url: "",
            mobileViewType: "",
          },
        ],
      };
      setMenuItems((prevItems) =>
        prevItems.map((m) => (m.id === nextForm.id ? nextForm : m))
      );
      return nextForm;
    });
  };

  const handleSelectPromoCategory = (promoId, categoryId) => {
    const selectedCat = activeCategories.find(
      (c) => String(c.id) === String(categoryId)
    );

    setEditForm((prev) => {
      if (!prev) return prev;
      const nextPromos = (prev.promos || []).map((p) => {
        if (p.id !== promoId) return p;

        if (!selectedCat) {
          return {
            ...p,
            categoryId: "",
            image: p.hasCustomImage ? p.image : "",
          };
        }

        const nextTitle =
          !p.title || p.title.trim() === "" || p.title === "Promo Title"
            ? selectedCat.name
            : p.title;

        const nextUrl =
          !p.url || p.url.trim() === "" || p.url === "/"
            ? `/collections/${selectedCat.slug}`
            : p.url;

        const nextImage = p.hasCustomImage
          ? p.customImage || p.image
          : selectedCat.image || "";

        return {
          ...p,
          categoryId: selectedCat.id,
          title: nextTitle,
          url: nextUrl,
          image: nextImage,
        };
      });

      const nextForm = { ...prev, promos: nextPromos };
      setMenuItems((prevItems) =>
        prevItems.map((m) => (m.id === nextForm.id ? nextForm : m))
      );
      return nextForm;
    });
  };

  const handleRevertToCategoryImage = (promoId) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      const nextPromos = (prev.promos || []).map((p) => {
        if (p.id !== promoId) return p;
        const linkedCat = activeCategories.find(
          (c) => String(c.id) === String(p.categoryId)
        );
        return {
          ...p,
          hasCustomImage: false,
          customImage: "",
          image: linkedCat?.image || "",
        };
      });
      const nextForm = { ...prev, promos: nextPromos };
      setMenuItems((prevItems) =>
        prevItems.map((m) => (m.id === nextForm.id ? nextForm : m))
      );
      return nextForm;
    });
    toast.success("Reverted to category database image");
  };

  const handleUpdatePromo = (id, field, value) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      const nextForm = {
        ...prev,
        promos: (prev.promos || []).map((p) =>
          p.id === id ? { ...p, [field]: value } : p
        ),
      };
      setMenuItems((prevItems) =>
        prevItems.map((m) => (m.id === nextForm.id ? nextForm : m))
      );
      return nextForm;
    });
  };

  const handleDeletePromo = (id) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      const nextForm = {
        ...prev,
        promos: (prev.promos || []).filter((p) => p.id !== id),
      };
      setMenuItems((prevItems) =>
        prevItems.map((m) => (m.id === nextForm.id ? nextForm : m))
      );
      return nextForm;
    });
  };

  const handlePromoImageUpload = async (id, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Url = reader.result;

      setEditForm((prev) => {
        if (!prev) return prev;
        const nextPromos = (prev.promos || []).map((p) =>
          p.id === id
            ? {
                ...p,
                image: base64Url,
                customImage: base64Url,
                hasCustomImage: true,
              }
            : p
        );
        const nextForm = { ...prev, promos: nextPromos };
        setMenuItems((prevItems) =>
          prevItems.map((m) => (m.id === nextForm.id ? nextForm : m))
        );
        return nextForm;
      });

      try {
        toast.info("Uploading image to cloud...");
        const formData = new FormData();
        formData.append("image", file);

        const token = localStorage.getItem("auth_token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"}/upload/image?folder=menu_promos`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (res.ok) {
          const json = await res.json();
          if (json && (json.url || json.secure_url)) {
            const uploadedUrl = json.url || json.secure_url;
            setEditForm((prev) => {
              if (!prev) return prev;
              const nextPromos = (prev.promos || []).map((p) =>
                p.id === id
                  ? {
                      ...p,
                      image: uploadedUrl,
                      customImage: uploadedUrl,
                      hasCustomImage: true,
                    }
                  : p
              );
              const nextForm = { ...prev, promos: nextPromos };
              setMenuItems((prevItems) =>
                prevItems.map((m) => (m.id === nextForm.id ? nextForm : m))
              );
              return nextForm;
            });
            toast.success("Promo image uploaded to cloud");
          }
        }
      } catch (err) {
        console.error("Cloud upload error, keeping base64 persistent preview:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  return {
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
  };
}
