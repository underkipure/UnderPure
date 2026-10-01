import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { toast } from "sonner";
import { getCartItemAvailableStock } from "../../../utils/stockUtils";
import { optimizeImage } from "../../../lib/productUtils";

export default function CartItemRow({
  item,
  products,
  removeFromCart,
  updateQuantity,
}) {
  const maxStock = getCartItemAvailableStock(item, products);
  const isOOS = maxStock <= 0;

  return (
    <div key={item.cartItemId || item.id} className="py-5 flex relative">
      {/* Remove Icon */}
      <button
        onClick={() => removeFromCart(item.cartItemId || item.id)}
        className="absolute right-0 top-5 text-black hover:opacity-50 transition-opacity"
      >
        <X className="w-5 h-5" strokeWidth={1.5} />
      </button>

      {/* Image */}
      <div className="w-[110px] md:w-[150px] shrink-0 mr-6 md:mr-8 bg-white">
        <Link to={`/product/${item.slug || item.id}`}>
          <img
            loading="lazy"
            src={optimizeImage(item.image, 300)}
            alt={item.title || item.name}
            className="w-full h-auto object-cover"
          />
        </Link>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 pt-0 space-y-2">
        <Link
          to={`/product/${item.slug || item.id}`}
          className="text-[14px] font-bold text-black hover:opacity-70 pr-8 leading-tight tracking-[0.01em] font-sans"
        >
          {item.title || item.name}
        </Link>

        <div className="text-[12px] tracking-[0.01em] text-black font-sans">
          Color/Size: {item.color || "cloud"} / {item.size || "s"}
        </div>

        <div className="text-[12px] font-bold text-black tracking-[0.01em] font-sans">
          Rs. {Number(item.price * item.quantity).toFixed(2)}
        </div>

        {isOOS ? (
          <div className="text-[12px] font-bold text-red-500 uppercase tracking-wider pt-1">
            Out of stock
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[12px] text-black font-bold font-sans">
              Qty:
            </span>
            <input
              type="number"
              min="1"
              max={maxStock}
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (isNaN(val) || val < 1) {
                  updateQuantity(item.cartItemId || item.id, 1);
                  return;
                }
                if (val > maxStock) {
                  toast.error(`Only ${maxStock} item(s) in stock`);
                  updateQuantity(item.cartItemId || item.id, maxStock);
                } else {
                  updateQuantity(item.cartItemId || item.id, val);
                }
              }}
              className="border border-black w-[50px] h-[30px] text-center text-[13px] text-black outline-none font-sans"
            />
            {maxStock < 999 && (
              <span className="text-[11px] text-gray-500 font-sans">
                (Max: {maxStock})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
