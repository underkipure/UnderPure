/**
 * Utility functions for checking and managing badge links within the mega menu header configuration.
 */

export const isBadgeInHeader = (badgeName, megaMenuData) => {
  if (!badgeName) return false;
  const menus = megaMenuData?.menus || [];
  const lowerName = badgeName.toLowerCase();

  if (menus.some(m => m.name?.toLowerCase() === lowerName)) return true;

  for (const m of menus) {
    if (m.links?.some(l => l.name?.toLowerCase() === lowerName)) return true;
    if (m.linkGroups?.some(g => g.links?.some(l => l.name?.toLowerCase() === lowerName))) return true;
  }

  return false;
};

export const buildUpdatedMenusForBadge = (currentMenusList, badge, headerTargetType, targetMenuId) => {
  let currentMenus = [...(currentMenusList || [])];
  const badgeUrl = `/collections/all?badge=${encodeURIComponent(badge.name)}`;
  const badgeName = badge.name.toUpperCase();

  if (headerTargetType === 'main') {
    const exists = currentMenus.some(m => m.name?.toLowerCase() === badge.name.toLowerCase());
    if (exists) {
      return { menus: currentMenus, alreadyExists: true, message: `"${badge.name}" is already in the main header menu` };
    }

    currentMenus.push({
      id: Date.now(),
      name: badgeName,
      hasDropdown: false,
      isRed: true,
      url: badgeUrl,
      links: [],
      linkGroups: [],
      promos: []
    });

    return { menus: currentMenus, alreadyExists: false, message: `Added "${badge.name}" as Top-Level Header Menu!` };
  }

  // Target Sub-Link
  if (!targetMenuId) {
    throw new Error('Please select a target parent menu');
  }

  const menuIdx = currentMenus.findIndex(m => String(m.id) === String(targetMenuId));
  if (menuIdx === -1) {
    throw new Error('Target parent menu not found');
  }

  const targetMenu = { ...currentMenus[menuIdx] };
  targetMenu.hasDropdown = true;
  const newSubLink = {
    id: Date.now(),
    name: badgeName,
    url: badgeUrl,
    isSpecial: false,
    isDivider: false
  };

  if (targetMenu.linkGroups && targetMenu.linkGroups.length > 0) {
    const updatedGroups = [...targetMenu.linkGroups];
    updatedGroups[0] = {
      ...updatedGroups[0],
      links: [...(updatedGroups[0].links || []), newSubLink]
    };
    targetMenu.linkGroups = updatedGroups;
  } else {
    const currentLinks = [...(targetMenu.links || [])];
    currentLinks.push(newSubLink);
    targetMenu.links = currentLinks;
  }

  currentMenus[menuIdx] = targetMenu;
  return { menus: currentMenus, alreadyExists: false, message: `Added "${badge.name}" as sub-link under ${targetMenu.name}!` };
};

export const buildMenusWithoutBadge = (currentMenusList, badgeName) => {
  const currentMenus = currentMenusList || [];
  const lowerName = badgeName.toLowerCase();

  let updated = currentMenus.filter(m => m.name?.toLowerCase() !== lowerName);
  updated = updated.map(m => {
    let links = (m.links || []).filter(l => l.name?.toLowerCase() !== lowerName);
    let linkGroups = (m.linkGroups || []).map(g => ({
      ...g,
      links: (g.links || []).filter(l => l.name?.toLowerCase() !== lowerName)
    }));
    return { ...m, links, linkGroups };
  });

  return updated;
};
