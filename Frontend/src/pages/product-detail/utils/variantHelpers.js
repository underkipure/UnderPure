/**
 * Extract unique color variants from product.colors or fallback to product.inventory
 */
export const extractUniqueColors = (product) => {
  if (!product) return [];
  const uniqueColors = [];

  if (Array.isArray(product.colors)) {
    product.colors.forEach((c, i) => {
      if (typeof c === "object" && c !== null) {
        uniqueColors.push({
          hex: c.hex || "#000",
          name: c.name || "Default",
          images: Array.isArray(c.images) ? c.images : [],
        });
      } else {
        uniqueColors.push({
          hex: c,
          name: product.colorNames?.[i] || c,
          images: [],
        });
      }
    });
  }

  const inventory = Array.isArray(product.inventory)
    ? product.inventory
    : typeof product.inventory === "object" && product.inventory !== null
      ? Object.values(product.inventory)
      : [];

  // Fallback populate uniqueColors from inventory if colors array was empty
  if (uniqueColors.length === 0 && inventory.length > 0) {
    inventory.forEach((item) => {
      if (item.color) {
        uniqueColors.push({
          hex: item.colorHex || item.hex || "#000000",
          name: item.color,
          images: Array.isArray(item.images) ? item.images : [],
        });
      }
    });
  }

  return uniqueColors;
};

/**
 * Normalize inventory array from array or object dictionary
 */
export const normalizeInventory = (product) => {
  if (!product) return [];
  if (Array.isArray(product.inventory)) return product.inventory;
  if (typeof product.inventory === "object" && product.inventory !== null) {
    return Object.values(product.inventory);
  }
  return [];
};

/**
 * Parse all size variants from product.sizes or inventory
 */
export const extractAllSizes = (product, inventory = []) => {
  if (!product) return [];
  let allSizesArr = [];

  if (Array.isArray(product.sizes)) {
    product.sizes.forEach((s) => {
      if (typeof s === "object" && s !== null) {
        allSizesArr.push(s.name || s.size || String(s));
      } else {
        allSizesArr.push(s);
      }
    });
  } else if (typeof product.sizes === "string") {
    try {
      const parsed = JSON.parse(product.sizes);
      if (Array.isArray(parsed)) {
        parsed.forEach((s) => {
          allSizesArr.push(
            typeof s === "object" && s !== null
              ? s.name || s.size || String(s)
              : s
          );
        });
      } else {
        allSizesArr = product.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    } catch {
      allSizesArr = product.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  if (allSizesArr.length === 0 && inventory.length > 0) {
    const sizeSet = new Set();
    inventory.forEach((item) => {
      if (Array.isArray(item.sizes)) {
        item.sizes.forEach((s) => {
          if (s.size) sizeSet.add(s.size);
        });
      } else if (item.size) {
        sizeSet.add(item.size);
      }
    });
    allSizesArr = Array.from(sizeSet);
  }

  return allSizesArr;
};

/**
 * Calculate total available stock across product & variants
 */
export const calculateTotalProductStock = (inventory, product) => {
  if (!Array.isArray(inventory) || inventory.length === 0) {
    if (product?.stock !== undefined) return Number(product.stock);
    if (product?.stock_count !== undefined) return Number(product.stock_count);
    if (product?.inStock === false) return 0;
    return 999;
  }
  let total = 0;
  inventory.forEach((item) => {
    if (Array.isArray(item.sizes)) {
      item.sizes.forEach((s) => {
        total +=
          s.stock !== undefined ? Number(s.stock) : Number(s.stock_count || 0);
      });
    } else {
      total +=
        item.stock !== undefined
          ? Number(item.stock)
          : Number(item.stock_count || 0);
    }
  });
  return total;
};

/**
 * Calculate stock count for specific color & size combination
 */
export const getVariantStockCount = (inventory, product, colorName, sizeName) => {
  if (!Array.isArray(inventory) || inventory.length === 0) {
    if (product?.stock !== undefined) return Number(product.stock);
    if (product?.stock_count !== undefined) return Number(product.stock_count);
    if (product?.inStock === false) return 0;
    return 999;
  }

  if (colorName && sizeName) {
    const colorGroup = inventory.find(
      (item) =>
        (item.color || "Default").toLowerCase() === colorName.toLowerCase()
    );
    if (!colorGroup) return 0;
    if (Array.isArray(colorGroup.sizes)) {
      const sizeItem = colorGroup.sizes.find(
        (s) =>
          (s.size || s.name || String(s)).toLowerCase() ===
          sizeName.toLowerCase()
      );
      if (!sizeItem) return 0;
      return sizeItem.stock !== undefined
        ? Number(sizeItem.stock)
        : Number(sizeItem.stock_count || 0);
    } else if (
      colorGroup.size &&
      colorGroup.size.toLowerCase() === sizeName.toLowerCase()
    ) {
      return colorGroup.stock !== undefined
        ? Number(colorGroup.stock)
        : Number(colorGroup.stock_count || 0);
    }
    return 0;
  }

  if (colorName && !sizeName) {
    const colorGroup = inventory.find(
      (item) =>
        (item.color || "Default").toLowerCase() === colorName.toLowerCase()
    );
    if (!colorGroup) return 0;
    if (Array.isArray(colorGroup.sizes)) {
      return colorGroup.sizes.reduce(
        (acc, s) =>
          acc +
          (s.stock !== undefined
            ? Number(s.stock)
            : Number(s.stock_count || 0)),
        0
      );
    } else {
      return colorGroup.stock !== undefined
        ? Number(colorGroup.stock)
        : Number(colorGroup.stock_count || 0);
    }
  }

  if (!colorName && sizeName) {
    let totalSizeStock = 0;
    let found = false;
    inventory.forEach((colorGroup) => {
      if (Array.isArray(colorGroup.sizes)) {
        const sizeItem = colorGroup.sizes.find(
          (s) =>
            (s.size || s.name || String(s)).toLowerCase() ===
            sizeName.toLowerCase()
        );
        if (sizeItem) {
          found = true;
          totalSizeStock +=
            sizeItem.stock !== undefined
              ? Number(sizeItem.stock)
              : Number(sizeItem.stock_count || 0);
        }
      } else if (
        colorGroup.size &&
        colorGroup.size.toLowerCase() === sizeName.toLowerCase()
      ) {
        found = true;
        totalSizeStock +=
          colorGroup.stock !== undefined
            ? Number(colorGroup.stock)
            : Number(colorGroup.stock_count || 0);
      }
    });
    return found ? totalSizeStock : 0;
  }

  return calculateTotalProductStock(inventory, product);
};

/**
 * Compute Add to Bag button status and button text
 */
export const calculateAddToCartState = ({
  isProductOutOfStock,
  selectedColorIndex,
  selectedSize,
  selectedColorName,
  uniqueColors,
  isColorRequired,
  getStockCount,
  productDetailSettings,
}) => {
  const defaultAddText =
    productDetailSettings?.buttonTexts?.addToCart || "ADD TO BAG";

  if (isProductOutOfStock) {
    return { canAddToCart: false, buttonText: "OUT OF STOCK" };
  }

  if (selectedColorIndex !== null && selectedSize) {
    const variantStock = getStockCount(selectedColorName, selectedSize);
    if (variantStock <= 0) {
      return { canAddToCart: false, buttonText: "OUT OF STOCK" };
    }
    return { canAddToCart: true, buttonText: defaultAddText };
  }

  if (selectedColorIndex !== null && !selectedSize) {
    const colorStock = getStockCount(selectedColorName, null);
    if (colorStock <= 0) {
      return { canAddToCart: false, buttonText: "OUT OF STOCK" };
    }
    return { canAddToCart: false, buttonText: "SELECT A SIZE" };
  }

  if (selectedColorIndex === null && selectedSize) {
    const sizeStock = getStockCount(null, selectedSize);
    if (sizeStock <= 0) {
      return { canAddToCart: false, buttonText: "OUT OF STOCK" };
    }
    if (isColorRequired && uniqueColors.length > 1) {
      return { canAddToCart: false, buttonText: "SELECT A COLOR" };
    }
    return { canAddToCart: true, buttonText: defaultAddText };
  }

  if (isColorRequired && uniqueColors.length > 1) {
    return { canAddToCart: false, buttonText: "SELECT A COLOR" };
  }

  return { canAddToCart: false, buttonText: "SELECT A SIZE" };
};
