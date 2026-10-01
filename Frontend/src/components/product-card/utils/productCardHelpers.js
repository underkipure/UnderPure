import { optimizeImage } from "../../../lib/productUtils";

export function extractProductImages(product) {
  const displayImage = optimizeImage(
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0].image_url || product.images[0]
      : product.image || "",
    600
  );

  const hoverImage = optimizeImage(
    Array.isArray(product.images) && product.images.length > 1
      ? product.images[1].image_url || product.images[1]
      : product.imageHover || displayImage,
    600
  );

  let allImages = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    allImages = product.images.map((img) =>
      optimizeImage(img.image_url || img, 600)
    );
  } else {
    allImages = [displayImage];
    if (product.imageHover) allImages.push(optimizeImage(product.imageHover, 600));
  }
  allImages = [...new Set(allImages)];

  return { displayImage, hoverImage, allImages };
}

export function extractBadgeList(product, contextBadge, hideBadges) {
  if (hideBadges) return [];

  let badgeList = [];
  if (Array.isArray(product.badges) && product.badges.length > 0) {
    badgeList = product.badges.map((b) => (typeof b === "object" ? b.name : b));
  } else if (product.badge) {
    badgeList = product.badge
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
  } else if (product.isFeatured || product.featured) {
    badgeList = ["Featured"];
  }

  // Filter based on contextBadge, limit to 1 badge
  if (contextBadge) {
    const match = badgeList.find(
      (b) => b.toLowerCase() === contextBadge.toLowerCase()
    );
    if (match) {
      return [match];
    }
    if (badgeList.length > 0) {
      return [badgeList[0]];
    }
  } else if (badgeList.length > 0) {
    return [badgeList[0]];
  }

  return badgeList;
}

export function findColorImages(product, colorName, directImage) {
  const images = [];
  if (directImage) images.push(directImage);

  // 1. Check inventory array
  if (Array.isArray(product.inventory)) {
    product.inventory.forEach((inv) => {
      if ((inv.color || "").toLowerCase() === (colorName || "").toLowerCase()) {
        if (Array.isArray(inv.images) && inv.images.length > 0) {
          inv.images.forEach((img) => {
            const url = typeof img === "object" ? img.image_url || img.url || img.image : img;
            if (url) images.push(url);
          });
        }
        if (inv.image || inv.image_url) images.push(inv.image || inv.image_url);
      }
    });
  }

  // 2. Check product.colors array
  if (Array.isArray(product.colors)) {
    product.colors.forEach((col) => {
      if ((col.name || col.color || "").toLowerCase() === (colorName || "").toLowerCase()) {
        if (Array.isArray(col.images) && col.images.length > 0) {
          col.images.forEach((img) => {
            const url = typeof img === "object" ? img.image_url || img.url || img.image : img;
            if (url) images.push(url);
          });
        }
        if (col.image || col.image_url) images.push(col.image || col.image_url);
      }
    });
  }

  // 3. Check product.colorImages map
  if (product.colorImages && typeof product.colorImages === "object") {
    const matchingKey = Object.keys(product.colorImages).find(
      (k) => k.toLowerCase() === (colorName || "").toLowerCase()
    );
    if (matchingKey && Array.isArray(product.colorImages[matchingKey])) {
      product.colorImages[matchingKey].forEach((img) => {
        const url = typeof img === "object" ? img.image_url || img.url || img.image : img;
        if (url) images.push(url);
      });
    }
  }

  // 4. Check product.images filtered by color property
  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (
        typeof img === "object" &&
        img !== null &&
        (img.color || "").toLowerCase() === (colorName || "").toLowerCase()
      ) {
        const url = img.image_url || img.url || img.image || img;
        if (url) images.push(url);
      }
    });
  }

  // Deduplicate and optimize URLs
  const uniqueUrls = Array.from(new Set(images.filter(Boolean)));
  return uniqueUrls.map((url) => optimizeImage(url, 600));
}

export function extractUniqueColors(product) {
  const uniqueColors = [];
  if (Array.isArray(product.inventory)) {
    product.inventory.forEach((v) => {
      const hex = v.colorHex || v.color_hex;
      const name = v.color;
      const directImg = v.image || v.image_url || (Array.isArray(v.images) && v.images[0]);
      if (hex && !uniqueColors.find((c) => c.hex === hex)) {
        uniqueColors.push({ hex, name, image: directImg });
      }
    });
  }

  if (Array.isArray(product.colors)) {
    product.colors.forEach((c) => {
      if (c.hex && !uniqueColors.find((existing) => existing.hex === c.hex)) {
        const directImg = c.image || c.image_url || (Array.isArray(c.images) && c.images[0]);
        uniqueColors.push({ hex: c.hex, name: c.name || c.color, image: directImg });
      }
    });
  }

  return uniqueColors;
}
