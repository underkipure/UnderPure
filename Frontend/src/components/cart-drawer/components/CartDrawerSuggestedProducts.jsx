import React from "react";
import { Link } from "react-router-dom";
import { fixImageUrl, optimizeImage } from "../../../lib/productUtils";

const CartDrawerSuggestedProducts = ({ cartSettings, suggestedProducts }) => {
  if (!cartSettings?.crossSells?.enabled || !suggestedProducts || suggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 border-b border-gray-200 pb-4 pt-6">
      <div className="flex justify-between items-center mb-3">
        <h3
          className="text-[18px] font-dala-roman text-black tracking-wide pl-3"
        >
          {cartSettings.crossSells.title || "Pairs Well With"}
        </h3>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {suggestedProducts.map((product) => {
          const rawImg = Array.isArray(product.images) && product.images.length > 0
            ? product.images[0].image_url || product.images[0]
            : product.image || "";
          const imgSrc = rawImg ? optimizeImage(fixImageUrl(rawImg), { width: 200, height: 350 }) : null;

          return (
            <div
              key={product.id}
              className="w-[135px] shrink-0 flex flex-col items-center"
            >
              <div className="w-[95px] aspect-[3/5.5] bg-gray-100 mb-5 hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center overflow-hidden">
                <Link to={`/product/${product.id}`} className="w-full h-full block">
                  {imgSrc ? (
                    <img
                      loading="lazy"
                      src={imgSrc}
                      alt={product.name || product.title || "Product"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 uppercase font-sans font-bold">
                      {(product.name || "UP").slice(0, 2)}
                    </div>
                  )}
                </Link>
              </div>
              <h4 className="text-[13px] font-bold font-sans text-black text-center leading-tight mb-1 w-full truncate tracking-[0.0001em] px-1">
                {product.name || product.title}
              </h4>
              <p className="text-[14px] font-bold font-sans text-black tracking-[0.0001em] mb-1">
                Rs. {product.price}
              </p>
              <button className="text-[14px] font-bold font-sans text-black uppercase tracking-[0.0001em] underline underline-offset-2 hover:opacity-70 transition-opacity">
                QUICK SHOP
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartDrawerSuggestedProducts;
