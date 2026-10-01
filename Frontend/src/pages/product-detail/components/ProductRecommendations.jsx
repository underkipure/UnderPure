import React from "react";
import { ProductRecommendationCarousel } from "../../../components/shared/products";

export default function ProductRecommendations({
  relatedProducts,
  productDetailSettings,
}) {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <ProductRecommendationCarousel
      title={
        productDetailSettings?.titles?.relatedProducts ||
        "Selected For You, Lover"
      }
      products={relatedProducts}
      variant="cards"
    />
  );
}
