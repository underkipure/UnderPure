import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { fixImageUrl, optimizeImage } from "../../../lib/productUtils";

const CartDrawerDiscover = ({ cartSettings, toggleCart }) => {
  if (!cartSettings?.discover?.enabled) return null;

  const collections = cartSettings.discover.collections || [];
  if (collections.length === 0) return null;

  return (
    <div className="flex flex-col">
      <p className="text-[12px] sm:text-[13px] font-sans font-medium text-black mb-4 sm:mb-4 leading-[1em] tracking-[0.03em]">
        {cartSettings.discover.title ||
          "Discover new in lingerie, clothing and other exclusive styles."}
      </p>
      <div className="flex flex-col gap-5 sm:gap-4">
        {collections.map((collection, index) => {
          const imgSrc = collection.image ? optimizeImage(fixImageUrl(collection.image), { width: 170, height: 170 }) : null;

          return (
            <Link
              to={collection.url || "#"}
              key={collection.id || index}
              onClick={toggleCart}
            >
              <div className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-5 sm:gap-5">
                  {imgSrc ? (
                    <img
                      loading="lazy"
                      src={imgSrc}
                      alt={collection.name || "Collection"}
                      className="w-[81px] h-[81px] sm:w-[85px] sm:h-[80px] object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="w-[81px] h-[81px] sm:w-[85px] sm:h-[80px] bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold font-sans uppercase">
                      {(collection.name || "UP").slice(0, 2)}
                    </div>
                  )}
                  <span className="text-[13px] sm:text-[12px] font-bold font-sans text-black tracking-[0.012em] uppercase">
                    {collection.name}
                  </span>
                </div>
                <ChevronRight
                  className="w-[24px] h-[24px] sm:w-[24px] sm:h-[24px] text-black-400 group-hover:text-black group-hover:translate-x-1 transition-all"
                  strokeWidth={1}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CartDrawerDiscover;
