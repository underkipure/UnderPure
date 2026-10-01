export const EMPTY_PRODUCT = {
  name: "",
  categoryIds: [],
  price: "",
  compareAtPrice: "",
  description: "",
  isFeatured: false,
  images: [],
  colorImages: {},
  badges: [],
  variants: [],
  metaTitle: "",
  metaDescription: "",
  careInstructions: "",
  fabricComposition: "",
};

export const DEFAULT_GLOBAL_SIZES = [
  "Free Size",
  "Small",
  "Medium",
  "Large",
  "XL",
  "XXL",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
];

export const getProductStatus = (product) => {
  let totalStock = 0;
  if (Array.isArray(product.inventory)) {
    product.inventory.forEach((invGroup) => {
      if (Array.isArray(invGroup.sizes)) {
        invGroup.sizes.forEach((sz) => {
          totalStock += Number(sz.stock || sz.stock_count || 0);
        });
      } else if (invGroup.size) {
        totalStock += Number(invGroup.stock || invGroup.stock_count || 0);
      }
    });
  }

  if (totalStock === 0) return "Out of Stock";
  if (totalStock <= 10) return "Low Stock";
  return "Active";
};

export const buildCategoryHierarchy = (categories) => {
  const activeCategories = (categories || []).filter(
    (c) => c.isVisible !== false
  );
  const topLevelCategories = activeCategories.filter((c) => !c.parentId);
  const subCategoryMap = {};

  activeCategories
    .filter((c) => c.parentId)
    .forEach((c) => {
      const parentExists = activeCategories.some(
        (p) => String(p.id) === String(c.parentId)
      );
      if (parentExists) {
        if (!subCategoryMap[c.parentId]) subCategoryMap[c.parentId] = [];
        subCategoryMap[c.parentId].push(c);
      }
    });

  return { activeCategories, topLevelCategories, subCategoryMap };
};

export const transformProductToFormData = (product) => {
  let initialVariants = product.variants || [];
  if (initialVariants.length === 0 && Array.isArray(product.inventory)) {
    const reconstructed = [];
    product.inventory.forEach((invGroup) => {
      const color = invGroup.color || "Default";
      const hex = invGroup.colorHex || "#000000";
      if (Array.isArray(invGroup.sizes)) {
        invGroup.sizes.forEach((sz) => {
          reconstructed.push({
            color,
            hex,
            size: sz.size || "",
            stock: sz.stock || 0,
            sku: sz.sku || "",
          });
        });
      }
    });
    initialVariants = reconstructed;
  }

  const colorImagesMap = {};

  if (product.colorImages && typeof product.colorImages === "object") {
    Object.keys(product.colorImages).forEach((color) => {
      if (
        Array.isArray(product.colorImages[color]) &&
        product.colorImages[color].length > 0
      ) {
        colorImagesMap[color] = product.colorImages[color].map((img) =>
          typeof img === "object" ? img.image_url || img.url || img : img
        );
      }
    });
  }

  if (Array.isArray(product.colors)) {
    product.colors.forEach((col) => {
      const cName = col.name || col.color;
      if (cName && Array.isArray(col.images) && col.images.length > 0) {
        const urls = col.images.map((img) =>
          typeof img === "object" ? img.image_url || img.url || img : img
        );
        colorImagesMap[cName] = [...(colorImagesMap[cName] || []), ...urls];
      }
    });
  }

  if (Array.isArray(product.inventory)) {
    product.inventory.forEach((inv) => {
      const cName = inv.color;
      if (cName && Array.isArray(inv.images) && inv.images.length > 0) {
        const urls = inv.images.map((img) =>
          typeof img === "object" ? img.image_url || img.url || img : img
        );
        if (!colorImagesMap[cName]) {
          colorImagesMap[cName] = urls;
        }
      }
    });
  }

  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (typeof img === "object" && img !== null && img.color) {
        const url = img.image_url || img.url || img.image;
        if (url) {
          if (!colorImagesMap[img.color]) colorImagesMap[img.color] = [];
          if (!colorImagesMap[img.color].includes(url)) {
            colorImagesMap[img.color].push(url);
          }
        }
      }
    });
  }

  Object.keys(colorImagesMap).forEach((color) => {
    colorImagesMap[color] = [...new Set(colorImagesMap[color])];
  });

  let parsedColorGroups = [];
  if (Array.isArray(product.inventory) && product.inventory.length > 0) {
    parsedColorGroups = product.inventory.map((inv) => {
      const color = inv.color || "Default";
      const hex = inv.colorHex || inv.hex || "#000000";
      const images = inv.images
        ? inv.images.map((img) =>
            typeof img === "object" ? img.image_url || img.url || img : img
          )
        : colorImagesMap[color] || [];
      const sizes = Array.isArray(inv.sizes)
        ? inv.sizes.map((s) => ({
            size: s.size,
            stock: Number(s.stock || 0),
            sku: s.sku || "",
          }))
        : [];
      return { color, hex, images, sizes };
    });
  } else if (initialVariants.length > 0) {
    const groupMap = {};
    initialVariants.forEach((v) => {
      const c = v.color || "Default";
      if (!groupMap[c]) {
        groupMap[c] = {
          color: c,
          hex: v.hex || "#000000",
          images: colorImagesMap[c] || [],
          sizes: [],
        };
      }
      groupMap[c].sizes.push({
        size: v.size,
        stock: Number(v.stock || 0),
        sku: v.sku || "",
      });
    });
    parsedColorGroups = Object.values(groupMap);
  }

  if (parsedColorGroups.length === 0) {
    parsedColorGroups = [
      {
        color: "Default",
        hex: "#000000",
        images: [],
        sizes: [],
      },
    ];
  }

  const colorImageUrlsSet = new Set();
  Object.values(colorImagesMap).forEach((arr) => {
    if (Array.isArray(arr)) {
      arr.forEach((url) => {
        if (url) colorImageUrlsSet.add(url);
      });
    }
  });

  const allGeneralImages = Array.isArray(product.images)
    ? product.images
        .filter((img) => {
          const url =
            typeof img === "object" && img !== null
              ? img.image_url || img.url || img.image
              : img;
          if (
            typeof img === "object" &&
            img !== null &&
            img.color &&
            !img.is_primary
          ) {
            return false;
          }
          if (colorImageUrlsSet.has(url) && url !== product.image) {
            return false;
          }
          return true;
        })
        .map((img) =>
          typeof img === "object" ? img.image_url || img.url || img : img
        )
    : product.image
      ? [product.image]
      : [];

  return {
    ...product,
    images: allGeneralImages,
    colorImages: colorImagesMap,
    colorGroups: parsedColorGroups,
    compareAtPrice: product.originalPrice || "",
    categoryIds:
      product.category_ids ||
      (product.category_id ? [product.category_id] : []),
    variants: initialVariants,
    badges:
      product.badges ||
      (product.badge
        ? product.badge
            .split(",")
            .map((b) => b.trim())
            .filter(Boolean)
        : []),
  };
};

export const transformFormDataToPayload = (formData, categories = []) => {
  const colorGroups = formData.colorGroups || [];

  const inventory = colorGroups.map((cg) => ({
    color: cg.color,
    colorHex: cg.hex || "#000000",
    images: cg.images || [],
    sizes: (cg.sizes || []).map((s) => ({
      size: s.size,
      stock: Number(s.stock || 0),
      sku: s.sku || "",
    })),
  }));

  const colorsPayload = colorGroups.map((cg) => ({
    name: cg.color,
    hex: cg.hex || "#000000",
    images: cg.images || [],
  }));

  const allSizes = [
    ...new Set(
      colorGroups.flatMap((cg) => (cg.sizes || []).map((s) => s.size))
    ),
  ];

  return {
    name: formData.name,
    slug:
      formData.slug ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    price: Number(formData.price),
    originalPrice: formData.compareAtPrice
      ? Number(formData.compareAtPrice)
      : null,
    description: formData.description,
    longDescription: formData.longDescription || "",
    featured: formData.isFeatured ? 1 : 0,
    category:
      formData.categoryIds?.length > 0
        ? categories.find((c) => c.id === formData.categoryIds[0])?.slug || ""
        : "",
    category_ids: formData.categoryIds || [],
    badge:
      formData.badges && formData.badges.length > 0
        ? formData.badges.join(",")
        : null,
    inventory,
    sizes: allSizes,
    colors: colorsPayload,
    fabricComposition: formData.fabricComposition || "",
    careInstructions: formData.careInstructions || "",
    image: formData.images?.[0] || null,
    additionalImages: formData.images?.slice(1) || [],
  };
};
