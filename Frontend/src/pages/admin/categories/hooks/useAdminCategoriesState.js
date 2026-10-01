import { useState } from 'react';
import { useAdmin } from '../../../../context/AdminContext';
import { createCategory, updateCategory, deleteCategory } from '../../../../lib/api';
import { useAuthStore } from '../../../../store/authStore';
import { useSiteSettingsStore } from '../../../../store/siteSettingsStore';
import { toast } from 'sonner';
import { generateCategorySlug, groupCategoriesHierarchy } from '../utils/categoryHelpers';

export function useAdminCategoriesState() {
  const { categories, setCategories } = useAdmin();
  const { token } = useAuthStore();
  const { megaMenuData, updateSettings } = useSiteSettingsStore();

  const [expandedId, setExpandedId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [showNewSubcategoryFor, setShowNewSubcategoryFor] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [newSubName, setNewSubName] = useState('');
  const [newSubSlug, setNewSubSlug] = useState('');
  const [newSubImage, setNewSubImage] = useState('');

  const { topLevel, subMap } = groupCategoriesHierarchy(categories);

  const syncSubcategoryToMenu = async (action, subCat, currentCats = categories) => {
    if (!subCat.parentId) return;
    const parentCat = currentCats.find((c) => String(c.id) === String(subCat.parentId));
    if (!parentCat || parentCat.showInHeader === false) return;

    let currentMenus = megaMenuData?.menus || [];
    const menuIndex = currentMenus.findIndex(
      (m) => m.name.toLowerCase() === parentCat.name.toLowerCase()
    );
    if (menuIndex === -1) return;

    const updatedMenus = [...currentMenus];
    let links = [...(updatedMenus[menuIndex].links || [])];
    let linkGroups = [...(updatedMenus[menuIndex].linkGroups || [])];

    const targetUrl = `/collections/${subCat.slug}`;
    const isMatch = (l) =>
      String(l.id) === String(subCat.id) ||
      l.url?.toLowerCase() === targetUrl.toLowerCase() ||
      l.name?.trim().toLowerCase() === subCat.name?.trim().toLowerCase();

    const newLinkObj = {
      id: subCat.id,
      name: subCat.name,
      url: targetUrl,
      image: subCat.image || '',
      isSpecial: false,
      isDivider: false,
    };

    if (action === 'add') {
      if (subCat.showInHeader !== false) {
        links.push(newLinkObj);
        if (linkGroups.length > 0) {
          const targetGroup =
            linkGroups.find(
              (g) => g.title?.trim().toLowerCase() === parentCat.name?.trim().toLowerCase()
            ) || linkGroups[0];
          if (targetGroup) {
            targetGroup.links = [...(targetGroup.links || []), newLinkObj];
          }
        }
      }
    } else if (action === 'update') {
      if (subCat.showInHeader === false) {
        links = links.filter((l) => !isMatch(l));
        linkGroups = linkGroups.map((g) => ({
          ...g,
          links: (g.links || []).filter((l) => !isMatch(l)),
        }));
      } else {
        const idx = links.findIndex(isMatch);
        if (idx !== -1) {
          links[idx] = { ...links[idx], ...newLinkObj };
        } else {
          links.push(newLinkObj);
        }

        if (linkGroups.length > 0) {
          linkGroups = linkGroups.map((g) => ({
            ...g,
            links: (g.links || []).map((l) => (isMatch(l) ? { ...l, ...newLinkObj } : l)),
          }));
        }
      }
    } else if (action === 'delete') {
      links = links.filter((l) => !isMatch(l));
      linkGroups = linkGroups.map((g) => ({
        ...g,
        links: (g.links || []).filter((l) => !isMatch(l)),
      }));
    }

    const hasAnyLinks = links.length > 0 || linkGroups.some((g) => (g.links || []).length > 0);
    updatedMenus[menuIndex] = {
      ...updatedMenus[menuIndex],
      links,
      linkGroups,
      hasDropdown: hasAnyLinks || (updatedMenus[menuIndex].promos || []).length > 0,
    };
    await updateSettings({ megaMenuData: { menus: updatedMenus } }, token);
  };

  /* ── CRUD HANDLERS ─────────────────────────────── */

  const handleAddCategory = async (payload) => {
    try {
      const res = await createCategory(token, payload);
      const newCatObj = { ...payload, id: res?.id || Date.now() };
      setCategories([...categories, newCatObj]);
      toast.success('Category created');
      setShowNewCategoryForm(false);

      // Auto-sync new category to Mega Menu
      let currentMenus = megaMenuData?.menus || [];
      const newMenuItem = {
        id: Date.now(),
        name: newCatObj.name.toUpperCase(),
        hasDropdown: false,
        isRed: false,
        url: `/collections/${newCatObj.slug}`,
        links: [],
        promos: [],
      };
      await updateSettings({ megaMenuData: { menus: [...currentMenus, newMenuItem] } }, token);
    } catch (err) {
      toast.error(err.message || 'Failed to create category');
    }
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const cat = categories.find((c) => c.id === categoryToDelete);
      await deleteCategory(token, categoryToDelete);
      setCategories(categories.filter((c) => c.id !== categoryToDelete));
      toast.success('Deleted');

      if (cat) {
        if (cat.parentId) {
          await syncSubcategoryToMenu('delete', cat);
        } else {
          // If parent is deleted, remove it from mega menu completely
          let currentMenus = megaMenuData?.menus || [];
          currentMenus = currentMenus.filter(
            (m) => m.name.toLowerCase() !== cat.name.toLowerCase()
          );
          await updateSettings({ megaMenuData: { menus: currentMenus } }, token);
        }
      }
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setCategoryToDelete(null);
    }
  };

  const handleUpdate = async (id, updates) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    try {
      const updatedCat = { ...cat, ...updates };
      await updateCategory(token, id, updatedCat);
      setCategories(categories.map((c) => (c.id === id ? updatedCat : c)));
      toast.success('Updated');
      setEditingCategory(null);

      if (updatedCat.parentId) {
        await syncSubcategoryToMenu('update', updatedCat);
      }
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleToggleVisibility = async (id) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    await handleUpdate(id, { isVisible: !cat.isVisible });
  };

  const handleToggleHeader = async (id) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const next = !(cat.showInHeader !== false);

    try {
      // Update DB
      await updateCategory(token, id, { ...cat, showInHeader: next });
      setCategories(categories.map((c) => (c.id === id ? { ...c, showInHeader: next } : c)));

      // Sync with Mega Menu Tab
      let currentMenus = megaMenuData?.menus || [];
      if (next) {
        const exists = currentMenus.find((m) => m.name.toLowerCase() === cat.name.toLowerCase());
        if (!exists) {
          const subcats = categories.filter((c) => String(c.parentId) === String(cat.id));
          const links = subcats.map((sub, idx) => ({
            id: Date.now() + idx,
            name: sub.name,
            url: `/collections/${sub.slug}`,
            image: sub.image || '',
            isSpecial: false,
            isDivider: false,
          }));
          const newItem = {
            id: Date.now(),
            name: cat.name.toUpperCase(),
            hasDropdown: links.length > 0,
            isRed: false,
            url: `/collections/${cat.slug}`,
            links: links,
            promos: [],
          };
          currentMenus = [...currentMenus, newItem];
        }
      } else {
        currentMenus = currentMenus.filter((m) => m.name.toLowerCase() !== cat.name.toLowerCase());
      }
      await updateSettings({ megaMenuData: { menus: currentMenus } }, token);

      toast.success(next ? 'Added to header nav' : 'Removed from header nav');
    } catch (err) {
      toast.error('Failed to update header setting');
      console.error(err);
    }
  };

  const handleAddSubcategory = async (parentId) => {
    if (!newSubName.trim()) return;
    const payload = {
      name: newSubName,
      slug: newSubSlug || generateCategorySlug(newSubName),
      image: newSubImage || '',
      parentId,
      showInHeader: false,
    };
    try {
      const res = await createCategory(token, payload);
      const newId = res?.id || Date.now();
      const newCatObj = { ...payload, id: newId };
      const updatedCats = [...categories, newCatObj];
      setCategories(updatedCats);
      toast.success('Subcategory added');
      setNewSubName('');
      setNewSubSlug('');
      setNewSubImage('');
      setShowNewSubcategoryFor(null);

      await syncSubcategoryToMenu('add', newCatObj, updatedCats);
    } catch (err) {
      toast.error(err.message || 'Failed to add subcategory');
    }
  };

  const handleMoveCategory = (index, dir) => {
    const arr = [...topLevel];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setCategories([...arr, ...categories.filter((c) => c.parentId)]);
  };

  return {
    categories,
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
  };
}
