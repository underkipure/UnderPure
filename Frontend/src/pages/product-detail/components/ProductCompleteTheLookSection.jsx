import React from "react";
import CompleteTheLookItem from "./CompleteTheLookItem";

export default function ProductCompleteTheLookSection({
  product,
  completeTheLookProducts,
  addToCart,
}) {
  const hasItems =
    (product?.completeTheLook && product.completeTheLook.length > 0) ||
    completeTheLookProducts.length > 0;

  if (!hasItems) return null;

  const items =
    product?.completeTheLook && product.completeTheLook.length > 0
      ? product.completeTheLook
      : completeTheLookProducts.slice(0, 3);

  return (
    <div className="pb-6 text-left">
      <h3 className="font-serif text-[20px] text-black mb-4">Complete the Look</h3>
      <div className="space-y-6">
        {items.map((item) => (
          <CompleteTheLookItem
            key={item.id || item.name}
            item={item}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}
