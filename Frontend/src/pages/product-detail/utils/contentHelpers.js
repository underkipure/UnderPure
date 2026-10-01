/**
 * Build dynamic accordions list for materials, shipping, returns, and custom tabs
 */
export const buildProductAccordions = (product, productDetailSettings) => {
  if (!product) return [];

  const customAccordions = Array.isArray(
    productDetailSettings?.customAccordions
  )
    ? productDetailSettings.customAccordions
    : [];

  return [
    {
      id: "materials",
      title:
        productDetailSettings?.titles?.accordionMaterials || "Materials & Care",
      content:
        productDetailSettings?.accordions?.fabricCare ||
        product.materials ||
        product.careInstructions ||
        "<p>No materials information available.</p>",
    },
    {
      id: "shipping",
      title:
        productDetailSettings?.titles?.accordionShipping || "Shipping Info",
      content:
        productDetailSettings?.accordions?.shippingInfo ||
        "<p>Free shipping on orders over Rs. 195. Returns accepted within 30 days.</p>",
    },
    {
      id: "returns",
      title: productDetailSettings?.titles?.accordionReturns || "Returns Info",
      content:
        productDetailSettings?.accordions?.returnsInfo ||
        "<p>We accept returns of unworn, unwashed items with tags attached within 30 days of delivery.</p>",
    },
    ...customAccordions.map((acc, index) => ({
      id: `custom_${index}`,
      title: acc.title || `Specification ${index + 1}`,
      content: acc.content || "",
    })),
  ];
};

/**
 * Build active perks list
 */
export const buildActivePerks = (productDetailSettings) => {
  const defaultPerks = [
    {
      id: 1,
      enabled: true,
      icon: "Package",
      text: "Free shipping on orders over Rs. 195+",
      link: "/faqs",
      openModal: "",
    },
    {
      id: 2,
      enabled: true,
      icon: "RotateCcw",
      text: "Easy Returns",
      link: "",
      openModal: "returns",
    },
    {
      id: 3,
      enabled: true,
      icon: "Gift",
      text: "Make it a gift with an UnderPure signature gift box",
      link: "/contact",
      openModal: "",
    },
  ];

  const perksList =
    Array.isArray(productDetailSettings?.perks) &&
    productDetailSettings.perks.length > 0
      ? productDetailSettings.perks
      : defaultPerks;

  return perksList.filter((p) => p.enabled !== false);
};
