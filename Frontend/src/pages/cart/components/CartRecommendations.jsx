import React from "react";
import { ProductRecommendationCarousel } from "../../../components/shared/products";

export default function CartRecommendations({ recConfig, suggestedProducts }) {
  if (!(recConfig?.enabled ?? true) || !suggestedProducts || suggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-16 pt-4 w-full">
      <ProductRecommendationCarousel
        title={recConfig?.title || "Selected For You"}
        products={suggestedProducts}
        variant="simple"
        fontFamily='"Dala Floda Roman", serif'
        showQuickShop={true}
        quickShopText="QUICK SHOP"
      />
    </div>
  );
}
