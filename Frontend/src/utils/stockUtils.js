/**
 * Helper to get available stock for a product size / color variant
 * @param {Object} product 
 * @param {string|null} colorName 
 * @param {string|null} sizeName 
 * @returns {number} Available stock
 */
export const getProductSizeStock = (product, colorName = null, sizeName = null) => {
  if (!product) return 0;

  const inventory = Array.isArray(product.inventory)
    ? product.inventory
    : typeof product.inventory === "object" && product.inventory !== null
      ? Object.values(product.inventory)
      : [];

  const targetColor = colorName && String(colorName).trim().toLowerCase() !== "default"
    ? String(colorName).trim().toLowerCase()
    : null;
  const targetSize = sizeName && String(sizeName).trim().toLowerCase() !== "default"
    ? String(sizeName).trim().toLowerCase()
    : null;

  if (inventory.length > 0) {
    if (targetColor) {
      // Find matching color group in inventory
      const colorGroup = inventory.find(
        (inv) => inv.color && String(inv.color).trim().toLowerCase() === targetColor
      );

      if (!colorGroup) {
        // Requested color does not exist in inventory
        return 0;
      }

      if (targetSize) {
        if (Array.isArray(colorGroup.sizes)) {
          const sObj = colorGroup.sizes.find(
            (sz) => String(sz.size || sz.name || sz).trim().toLowerCase() === targetSize
          );
          if (sObj) {
            return Number(sObj.stock !== undefined ? sObj.stock : sObj.stock_count || 0);
          }
          // Size does not exist under this color
          return 0;
        } else if (colorGroup.size) {
          if (String(colorGroup.size).trim().toLowerCase() === targetSize) {
            return Number(colorGroup.stock !== undefined ? colorGroup.stock : colorGroup.stock_count || 0);
          }
          return 0;
        }
        return 0;
      } else {
        // Sum stock for all sizes in this color group
        if (Array.isArray(colorGroup.sizes)) {
          return colorGroup.sizes.reduce(
            (sum, sz) => sum + Number(sz.stock !== undefined ? sz.stock : sz.stock_count || 0),
            0
          );
        } else {
          return Number(colorGroup.stock !== undefined ? colorGroup.stock : colorGroup.stock_count || 0);
        }
      }
    } else {
      // No target color specified
      if (targetSize) {
        let sizeFound = false;
        let totalSizeStock = 0;
        inventory.forEach((colorGroup) => {
          if (Array.isArray(colorGroup.sizes)) {
            const sObj = colorGroup.sizes.find(
              (sz) => String(sz.size || sz.name || sz).trim().toLowerCase() === targetSize
            );
            if (sObj) {
              sizeFound = true;
              totalSizeStock += Number(sObj.stock !== undefined ? sObj.stock : sObj.stock_count || 0);
            }
          } else if (colorGroup.size && String(colorGroup.size).trim().toLowerCase() === targetSize) {
            sizeFound = true;
            totalSizeStock += Number(colorGroup.stock !== undefined ? colorGroup.stock : colorGroup.stock_count || 0);
          }
        });
        if (sizeFound) return totalSizeStock;
        return 0;
      } else {
        // Total product stock across all colors & sizes
        let total = 0;
        inventory.forEach((colorGroup) => {
          if (Array.isArray(colorGroup.sizes)) {
            colorGroup.sizes.forEach((sz) => {
              total += Number(sz.stock !== undefined ? sz.stock : sz.stock_count || 0);
            });
          } else {
            total += Number(colorGroup.stock !== undefined ? colorGroup.stock : colorGroup.stock_count || 0);
          }
        });
        return total;
      }
    }
  }

  // Check product.sizes array if it contains objects with stock
  if (targetSize && product.sizes) {
    try {
      const parsed = typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes;
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sObj = parsed.find(
          (sz) => typeof sz === "object" && sz && (sz.size || sz.name) && String(sz.size || sz.name).trim().toLowerCase() === targetSize
        );
        if (sObj) {
          return Number(sObj.stock !== undefined ? sObj.stock : sObj.stock_count || 0);
        }
      }
    } catch (e) {}
  }

  // Fallback to top-level stock properties
  if (product.stock !== undefined && product.stock !== null) return Number(product.stock);
  if (product.stock_count !== undefined && product.stock_count !== null) return Number(product.stock_count);
  if (product.inStock === false) return 0;

  return 999;
};

/**
 * Gets available stock for an item in cart using cached products store or item properties
 * @param {Object} cartItem 
 * @param {Array} allProducts 
 * @returns {number}
 */
export const getCartItemAvailableStock = (cartItem, allProducts = []) => {
  if (!cartItem) return 0;

  const matchedProduct = Array.isArray(allProducts) && allProducts.length > 0
    ? allProducts.find((p) => String(p.id) === String(cartItem.id) || String(p.id) === String(cartItem.product_id) || (cartItem.slug && p.slug === cartItem.slug))
    : null;

  const productToUse = matchedProduct || cartItem;
  
  const colorName = cartItem.color || cartItem.colorName || productToUse.color || null;
  const sizeName = cartItem.size || cartItem.sizeName || productToUse.size || null;

  return getProductSizeStock(productToUse, colorName, sizeName);
};
