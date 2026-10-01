import React from "react";
import { ProductRecommendationCarousel } from "../../../components/shared/products";

export default function LovelistRecommendations({
  recommendationsConfig = {},
  products = [],
  quickShopButtonText = "QUICK SHOP",
}) {
  if (recommendationsConfig.enabled === false) return null;

  let recommendedProducts = [];
  if (
    recommendationsConfig.mode === "custom" &&
    Array.isArray(recommendationsConfig.customProducts) &&
    recommendationsConfig.customProducts.length > 0
  ) {
    recommendedProducts = recommendationsConfig.customProducts.map((cp) => {
      const found = products.find(
        (p) => p.id === cp.id || p.slug === cp.slug || p.name === cp.name
      );
      return found
        ? {
            id: found.id,
            slug: found.slug,
            name: found.name,
            price:
              typeof found.price === "number"
                ? `Rs. ${found.price.toLocaleString()}`
                : found.price || "Rs. 0",
            image: found.images?.[0]?.image_url || found.image || "",
          }
        : cp;
    });
  } else {
    const limit = parseInt(recommendationsConfig.limit) || 4;
    recommendedProducts = products.slice(0, limit).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price:
        typeof p.price === "number"
          ? `Rs. ${p.price.toLocaleString()}`
          : p.price || "Rs. 0",
      image: p.images?.[0]?.image_url || p.image || "",
    }));
  }

  if (recommendedProducts.length === 0) return null;

  return (
    <div className="px-4 sm:px-16 md:px-16 lg:px-20 xl:px-14 mb-36 mt-0 md:mt-0">
      <ProductRecommendationCarousel
        title={recommendationsConfig.title || "Selected For You"}
        products={recommendedProducts}
        variant="simple"
        fontFamily='"Dala Floda", serif'
        showQuickShop={true}
        quickShopText={quickShopButtonText}
      />
    </div>
  );
}
