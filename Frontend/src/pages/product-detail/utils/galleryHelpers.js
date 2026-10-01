import { optimizeImage } from "../../../lib/productUtils";

/**
 * Resolve optimized gallery images based on selected color
 */
export const resolveProductGallery = (
  product,
  selectedColorName,
  selectedColorObj,
  inventory
) => {
  if (!product) return [];

  let colorSpecificImages = [];
  if (selectedColorName) {
    if (product.colorImages && typeof product.colorImages === "object") {
      const matchingKey = Object.keys(product.colorImages).find(
        (k) => k.toLowerCase() === selectedColorName.toLowerCase()
      );
      if (
        matchingKey &&
        Array.isArray(product.colorImages[matchingKey]) &&
        product.colorImages[matchingKey].length > 0
      ) {
        colorSpecificImages = product.colorImages[matchingKey];
      }
    }
    if (
      colorSpecificImages.length === 0 &&
      selectedColorObj &&
      Array.isArray(selectedColorObj.images) &&
      selectedColorObj.images.length > 0
    ) {
      colorSpecificImages = selectedColorObj.images;
    }
    if (colorSpecificImages.length === 0 && Array.isArray(inventory)) {
      const invGroup = inventory.find(
        (item) =>
          (item.color || "Default").toLowerCase() ===
          selectedColorName.toLowerCase()
      );
      if (
        invGroup &&
        Array.isArray(invGroup.images) &&
        invGroup.images.length > 0
      ) {
        colorSpecificImages = invGroup.images;
      }
    }
    if (colorSpecificImages.length === 0 && Array.isArray(product.images)) {
      const filteredFromImages = product.images
        .filter(
          (img) =>
            typeof img === "object" &&
            img !== null &&
            (img.color || "").toLowerCase() === selectedColorName.toLowerCase()
        )
        .map((img) => img.image_url || img.url || img.image || img);
      if (filteredFromImages.length > 0) {
        colorSpecificImages = filteredFromImages;
      }
    }
  }

  let mainGeneralImages = [];
  if (product.image) {
    mainGeneralImages.push(product.image);
  }
  if (Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach((img) => {
      const url =
        typeof img === "object" && img !== null
          ? img.image_url || img.url || img.image
          : img;
      if (url && !mainGeneralImages.includes(url)) {
        if (typeof img === "object" && img !== null) {
          if (!img.color || img.is_primary) mainGeneralImages.push(url);
        } else {
          mainGeneralImages.push(url);
        }
      }
    });
  }

  const rawGallery =
    selectedColorName && colorSpecificImages.length > 0
      ? colorSpecificImages
      : mainGeneralImages.length > 0
        ? mainGeneralImages
        : product.image
          ? [product.image]
          : [];

  return [...new Set(rawGallery.map((img) => optimizeImage(img)))];
};
