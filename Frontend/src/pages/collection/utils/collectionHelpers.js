/**
 * Helper to extract all product sizes regardless of structure
 */
export const getProductSizes = (p) => {
  const sizes = new Set();
  if (p.sizes) {
    if (Array.isArray(p.sizes)) {
      p.sizes.forEach((s) => {
        if (typeof s === 'object' && s !== null) {
          const val = s.name || s.size || s.label;
          if (val) sizes.add(String(val).trim());
        } else if (s) {
          sizes.add(String(s).trim());
        }
      });
    } else if (typeof p.sizes === 'string') {
      try {
        const parsed = JSON.parse(p.sizes);
        if (Array.isArray(parsed)) {
          parsed.forEach((s) => {
            if (typeof s === 'object' && s !== null) {
              const val = s.name || s.size || s.label;
              if (val) sizes.add(String(val).trim());
            } else if (s) {
              sizes.add(String(s).trim());
            }
          });
        } else {
          p.sizes.split(',').forEach((s) => {
            if (s.trim()) sizes.add(s.trim());
          });
        }
      } catch (e) {
        p.sizes.split(',').forEach((s) => {
          if (s.trim()) sizes.add(s.trim());
        });
      }
    }
  }
  if (p.inventory && Array.isArray(p.inventory)) {
    p.inventory.forEach((inv) => {
      if (inv.sizes && Array.isArray(inv.sizes)) {
        inv.sizes.forEach((sz) => {
          if (typeof sz === 'object' && sz !== null) {
            const val = sz.size || sz.name;
            if (val) sizes.add(String(val).trim());
          } else if (sz) {
            sizes.add(String(sz).trim());
          }
        });
      }
    });
  }
  return sizes;
};

/**
 * Helper to extract all product colors regardless of structure
 */
export const getProductColors = (p) => {
  const colors = new Set();
  if (p.colors && Array.isArray(p.colors)) {
    p.colors.forEach((c) => {
      if (typeof c === 'string') {
        try {
          const parsed = JSON.parse(c);
          if (Array.isArray(parsed)) {
            parsed.forEach((pc) => colors.add(String(pc.name || pc || '').trim()));
          } else {
            colors.add(c.trim());
          }
        } catch (e) {
          colors.add(c.trim());
        }
      } else if (c && typeof c === 'object') {
        const val = c.name || c.color;
        if (val) colors.add(String(val).trim());
      }
    });
  }
  if (p.inventory && Array.isArray(p.inventory)) {
    p.inventory.forEach((inv) => {
      if (inv.color) colors.add(String(inv.color).trim());
    });
  }
  return colors;
};

/**
 * Helper to get default page title for collections
 */
export const getCollectionTitle = (categoryId, searchQuery, currentCategory, badgeQuery) => {
  if (badgeQuery) return badgeQuery.toUpperCase();
  if (currentCategory) return currentCategory.name;
  if (categoryId === 'search') {
    return searchQuery ? `Search results for "${searchQuery}"` : 'Search';
  }
  switch (categoryId) {
    case 'best-sellers':
      return 'best selling lingerie & clothing';
    case 'lingerie':
      return 'lingerie collection';
    case 'pleasure':
      return 'pleasure';
    case 'swim':
      return 'swimwear';
    default:
      return categoryId ? categoryId.replace(/-/g, ' ') : 'collection';
  }
};
