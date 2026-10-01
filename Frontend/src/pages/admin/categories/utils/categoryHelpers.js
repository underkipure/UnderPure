/**
 * Pure helper functions for Category Management
 */

export function generateCategorySlug(name = '') {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function readImageAsDataUrl(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

export function groupCategoriesHierarchy(categories = []) {
  const topLevel = (categories || []).filter((c) => !c.parentId);
  const subMap = {};
  (categories || []).filter((c) => c.parentId).forEach((c) => {
    if (!subMap[c.parentId]) subMap[c.parentId] = [];
    subMap[c.parentId].push(c);
  });

  return { topLevel, subMap };
}
