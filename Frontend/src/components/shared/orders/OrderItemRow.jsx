import React from "react";
import { Package } from "lucide-react";
import { optimizeImage } from "../../../lib/productUtils";

/**
 * Reusable OrderItemRow component for rendering order line items.
 *
 * @param {Object} props
 * @param {Object} props.item - Product item data
 * @param {'checkout'|'modal'} [props.variant='checkout']
 * @param {boolean} [props.isMobile=false]
 * @param {string} [props.currencyPrefix="Rs"]
 */
export function OrderItemRow({
  item,
  variant = "checkout",
  isMobile = false,
  currencyPrefix = "Rs",
}) {
  const imageUrl = item.image || item.image_url || item.thumbnail;
  const title = item.title || item.name || item.product_name || "Item";
  const quantity = item.quantity || 1;
  const price = Number(item.price) || 0;
  const lineTotal = price * quantity;

  if (variant === "modal") {
    return (
      <div className="flex gap-4 items-center">
        <div className="w-16 h-20 bg-gray-100 shrink-0 rounded overflow-hidden">
          {imageUrl ? (
            <img
              loading="lazy"
              src={optimizeImage(imageUrl, 200)}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Package size={20} strokeWidth={1} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-xs font-bold uppercase tracking-widest text-black truncate">
            {title}
          </h5>
          {(item.size || item.color) && (
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-0.5">
              {item.size && `Size: ${item.size}`}{" "}
              {item.color && `Color: ${item.color}`}
            </p>
          )}
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
            Qty: {quantity}
          </p>
        </div>
        <div className="text-sm font-serif text-black shrink-0">
          {currencyPrefix}. {price.toLocaleString()}
        </div>
      </div>
    );
  }

  // Checkout variant
  const thumbSize = isMobile ? "w-12 h-12 rounded-lg" : "w-[4.25rem] h-[4.25rem] rounded-xl";
  const textSize = isMobile ? "text-[12px]" : "text-[11.5px]";
  const subTextSize = isMobile ? "text-[11px]" : "text-[10px]";

  return (
    <div className="flex gap-3 items-center">
      <div
        className={`relative ${thumbSize} bg-white border border-gray-200/90 flex items-center justify-center shrink-0 p-1 shadow-2xs`}
      >
        {imageUrl ? (
          <img
            loading="lazy"
            src={optimizeImage(imageUrl, 180)}
            alt={title}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Package size={18} strokeWidth={1} />
          </div>
        )}
        <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 min-w-[20px] min-h-[20px] rounded-full flex items-center justify-center text-[10px] font-semibold leading-none z-20 shadow-xs ring-2 ring-white">
          {quantity}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className={`${textSize} text-gray-900 font-normal font-sans leading-snug truncate`}
        >
          {title}
        </h3>
        <p className={`${subTextSize} text-gray-500 mt-0.5 font-sans lowercase`}>
          {item.color || "Black"} / {item.size || "M"}
        </p>
      </div>

      <span
        className={`${textSize} text-gray-900 font-normal font-sans shrink-0`}
      >
        {currencyPrefix} {lineTotal.toFixed(2)}
      </span>
    </div>
  );
}
