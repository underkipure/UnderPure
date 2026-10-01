import React from "react";
import { toast } from "sonner";
import { getCartItemAvailableStock } from "../../../utils/stockUtils";
import { optimizeImage } from "../../../lib/productUtils";

const CartDrawerItemList = ({
  cartItems,
  products,
  cartSettings,
  removeFromCart,
  updateQuantity,
}) => {
  return (
    <div className="border-b border-gray-200 mb-0 mt-2">
      {cartItems.map((item, index) => {
        const maxStock = getCartItemAvailableStock(item, products);
        const isOOS = maxStock <= 0;
        const isMaxReached = item.quantity >= maxStock;

        return (
          <div
            key={item.cartItemId || item.id}
            className={`flex gap-4 ${
              index !== cartItems.length - 1
                ? "border-b border-gray-200 pb-6 mb-6"
                : "pb-6"
            }`}
          >
            <div className="w-[80px] aspect-[3/4] bg-gray-100 shrink-0">
              <img
                loading="lazy"
                src={optimizeImage(item.image, 240)}
                alt={item.title || item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-[12px] sm:text-[13px] font-bold font-sans text-black pr-4 leading-[1.1] tracking-[0.0001em]">
                    {item.title || item.name}
                  </h3>
                  <span className="text-[14px] font-bold font-sans text-black shrink-0 leading-none">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
                <p className="text-[12px] sm:text-[13px] text-gray-400 font-sans tracking-[0.0001em] mt-0 leading-[1.2]">
                  {item.color || "Storm Blue"} / {item.size || "L"}
                </p>
              </div>

              <div className="flex items-end justify-between mt-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => removeFromCart(item.cartItemId || item.id)}
                    className="text-[13px] font-sans text-gray-500 hover:text-black underline underline-offset-2 transition-colors pb-0.5"
                  >
                    {cartSettings?.basic?.removeText || "Remove"}
                  </button>
                  <button
                    onClick={() => {
                      try {
                        const saved = JSON.parse(
                          localStorage.getItem("underpure_saved_items") || "[]"
                        );
                        saved.push({ ...item, id: item.id || Date.now() });
                        localStorage.setItem(
                          "underpure_saved_items",
                          JSON.stringify(saved)
                        );
                        removeFromCart(item.cartItemId || item.id);
                        toast.success("Saved for later!");
                      } catch (e) {}
                    }}
                    className="text-[13px] font-sans text-gray-500 hover:text-black underline underline-offset-2 transition-colors pb-0.5"
                  >
                    Save for later
                  </button>
                </div>

                {isOOS ? (
                  <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">
                    Out of stock
                  </span>
                ) : (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center border border-black h-[28px] w-[70px]">
                      <button
                        className="flex-1 h-full flex items-center justify-center text-black hover:bg-gray-100 transition-colors text-[16px] disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateQuantity(
                            item.cartItemId || item.id,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-[13px] font-sans text-black">
                        {item.quantity}
                      </span>
                      <button
                        className={`flex-1 h-full flex items-center justify-center text-black hover:bg-gray-100 transition-colors text-[16px] ${
                          isMaxReached
                            ? "opacity-30 cursor-not-allowed bg-gray-100"
                            : ""
                        }`}
                        disabled={isMaxReached}
                        onClick={() => {
                          if (isMaxReached) {
                            toast.error(`Only ${maxStock} in stock`);
                            return;
                          }
                          updateQuantity(
                            item.cartItemId || item.id,
                            item.quantity + 1
                          );
                        }}
                        title={
                          isMaxReached
                            ? `Stock limit reached (${maxStock})`
                            : "Increase quantity"
                        }
                      >
                        +
                      </button>
                    </div>
                    {maxStock < 999 && isMaxReached && (
                      <span className="text-[10px] text-red-500 font-sans mt-0.5">
                        Max stock reached ({maxStock})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartDrawerItemList;
