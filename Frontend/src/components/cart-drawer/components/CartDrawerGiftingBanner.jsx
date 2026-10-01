import React, { useState } from "react";
import { ChevronDown, Gift } from "lucide-react";
import { fixImageUrl, optimizeImage } from "../../../lib/productUtils";

const CartDrawerGiftingBanner = ({ cartSettings, addToCart }) => {
  const [selectedGiftIndex, setSelectedGiftIndex] = useState(0);

  if (!cartSettings?.gifting?.enabled) return null;

  const giftImage = cartSettings.gifting.image ? fixImageUrl(cartSettings.gifting.image) : "";

  return (
    <div className="border border-black rounded-[8px] px-4 py-3 sm:px-4 sm:py-4 mb-8 sm:mb-8 relative">
      <div className="pr-20 sm:pr-20">
        <h3
          className="text-[19px] font-dala-roman text-black mb-1 leading-snug"
        >
          {cartSettings.gifting.title || "Gifting a lover?"}
        </h3>
        <p className="text-[11px] sm:text-[13px] font-medium font-sans text-black mb-4 leading-snug tracking-[0.0001em]">
          {cartSettings.gifting.subtitle ||
            "Make it extra special with an UnderPure gift box."}
        </p>

        <div className="flex gap-3 h-[45px]">
          <div className="relative w-[175px] sm:w-[150px] border border-black hover:border-gray-500 transition-colors">
            <select
              aria-label="Select Gift Box Option"
              value={selectedGiftIndex}
              onChange={(e) => setSelectedGiftIndex(Number(e.target.value))}
              className="w-full h-full appearance-none bg-transparent pl-2 pr-1 text-[12px] font-sans font-medium text-black outline-none cursor-pointer uppercase tracking-[0.0001em]"
            >
              {(cartSettings.gifting.products || []).map((prod, i) => (
                <option key={i} value={i}>
                  {prod.name}—Rs. {prod.price}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-black/60 pointer-events-none stroke-[1.5px]" />
          </div>
          <button
            onClick={() => {
              const products = cartSettings.gifting.products || [];
              const selectedProduct = products[selectedGiftIndex];
              if (selectedProduct) {
                addToCart({
                  id: `gift_${selectedProduct.id || Date.now()}`,
                  title: selectedProduct.name,
                  price: Number(selectedProduct.price),
                  image: giftImage || "",
                });
              }
            }}
            className="bg-black text-white px-7 sm:px-5 text-[12px] sm-text-[10] font-bold uppercase tracking-[0.0001em] hover:bg-gray-800 transition-colors h-[45px] leading-[1.5em]"
          >
            ADD TO CART
          </button>
        </div>
      </div>
      {/* Gift Box Image */}
      <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] flex items-center justify-center">
        {giftImage ? (
          <img
            loading="lazy"
            src={optimizeImage(giftImage, { width: 170, height: 170 })}
            alt="Gift Box"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Gift size={24} strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawerGiftingBanner;
