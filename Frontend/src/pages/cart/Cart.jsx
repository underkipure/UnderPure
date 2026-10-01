import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSiteSettingsStore } from "../../store/siteSettingsStore";
import { useProductStore } from "../../store/productStore";
import EmptyCartState from "./components/EmptyCartState";
import CartItemRow from "./components/CartItemRow";
import CartOrderSummary from "./components/CartOrderSummary";
import CartRecommendations from "./components/CartRecommendations";

export default function Cart({ cartItems, removeFromCart, updateQuantity }) {
  const cartSettings = useSiteSettingsStore((s) => s.cartSettings);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const { products } = useProductStore();

  const recConfig = cartSettings?.recommendations || {};
  let suggestedProducts = [];

  if (recConfig.enabled ?? true) {
    if (
      recConfig.mode === "custom" &&
      Array.isArray(recConfig.customProducts) &&
      recConfig.customProducts.length > 0
    ) {
      suggestedProducts = recConfig.customProducts.map((cp) => {
        const found = (products || []).find(
          (p) => p.id === cp.id || p.slug === cp.slug || p.name === cp.name,
        );
        return found
          ? {
              ...found,
              id: found.id,
              slug: found.slug,
              name: found.name,
              title: found.name || found.title,
              price:
                typeof found.price === "number"
                  ? found.price
                  : parseFloat(String(found.price).replace(/[^0-9.]/g, "")) ||
                    0,
              image:
                found.images?.[0]?.image_url ||
                found.images?.[0] ||
                found.image ||
                "",
            }
          : {
              ...cp,
              title: cp.name || cp.title,
              price:
                typeof cp.price === "number"
                  ? cp.price
                  : parseFloat(String(cp.price).replace(/[^0-9.]/g, "")) || 0,
              image: cp.image || "",
            };
      });
    } else {
      const limit = parseInt(recConfig.limit) || 4;
      suggestedProducts = (products || []).slice(0, limit).map((p) => ({
        ...p,
        id: p.id,
        slug: p.slug,
        name: p.name,
        title: p.name || p.title,
        price:
          typeof p.price === "number"
            ? p.price
            : parseFloat(String(p.price).replace(/[^0-9.]/g, "")) || 0,
        image: p.images?.[0]?.image_url || p.images?.[0] || p.image || "",
      }));
    }
  }

  if (cartItems.length === 0) {
    return (
      <EmptyCartState
        title={cartSettings?.basic?.title}
        emptyMessage={cartSettings?.basic?.emptyMessage}
      />
    );
  }

  return (
    <div className="w-full font-sans">
      {/* Top Cart Section */}
      <div className="max-w-[1150px] mx-auto px-6 sm:px-8 lg:px-8 pt-8 pb-16">
        <h1
          className="text-[32px] font-dala-roman mb-8 lg:mb-4 text-black text-center lg:text-left font-medium"
        >
          {cartSettings?.basic?.title?.toLowerCase() || "shopping bag"}
        </h1>

        {/* Mobile Top Checkout (Visible only on mobile) */}
        <div className="block lg:hidden mb-10 border-b border-gray-200 pb-10">
          <div className="flex justify-between items-center text-[16px] font-bold text-black mb-5 font-sans">
            <span>Estimated total</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="w-full bg-[#111] text-white flex items-center justify-center py-4 text-[13px] font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            PROCEED TO CHECKOUT
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-19">
          {/* Left Side: Cart Items */}
          <div className="lg:col-span-7 w-[90%]">
            <div className="border-t border-gray-200">
              {cartItems.map((item) => (
                <CartItemRow
                  key={item.cartItemId || item.id}
                  item={item}
                  products={products}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              ))}
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <CartOrderSummary
            subtotal={subtotal}
            basic={cartSettings?.basic}
          />
        </div>
      </div>

      {/* Suggested Products Section */}
      <CartRecommendations
        recConfig={recConfig}
        suggestedProducts={suggestedProducts}
      />
    </div>
  );
}
