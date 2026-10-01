import React, { useEffect } from "react";
import { useSiteSettingsStore } from "../../store/siteSettingsStore";
import { useProductStore } from "../../store/productStore";
import { useAuthStore } from "../../store/authStore";

import CartDrawerHeader from "./components/CartDrawerHeader";
import CartDrawerGiftingBanner from "./components/CartDrawerGiftingBanner";
import CartDrawerDiscover from "./components/CartDrawerDiscover";
import CartDrawerItemList from "./components/CartDrawerItemList";
import CartDrawerSuggestedProducts from "./components/CartDrawerSuggestedProducts";
import CartDrawerLoyaltyBanner from "./components/CartDrawerLoyaltyBanner";
import CartDrawerFooter from "./components/CartDrawerFooter";

const CartDrawer = ({
  isOpen,
  toggleCart,
  cartItems,
  removeFromCart,
  updateQuantity,
  addToCart,
}) => {
  const cartSettings = useSiteSettingsStore((s) => s.cartSettings);
  const { isAuthenticated } = useAuthStore();
  const { products } = useProductStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Suggested products for "Pairs Well With"
  const suggestedProducts = (products || []).slice(0, 3);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[200] transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] md:w-[470px] bg-white z-[210] transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <CartDrawerHeader
          cartSettings={cartSettings}
          cartItems={cartItems}
          itemCount={itemCount}
          toggleCart={toggleCart}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar font-sans px-5 sm:px-6 pt-5 sm:pt-3 pb-6">
          {/* Gifting Box (Always visible) */}
          <CartDrawerGiftingBanner
            cartSettings={cartSettings}
            addToCart={addToCart}
          />

          {cartItems.length === 0 ? (
            <CartDrawerDiscover
              cartSettings={cartSettings}
              toggleCart={toggleCart}
            />
          ) : (
            <>
              <CartDrawerItemList
                cartItems={cartItems}
                products={products}
                cartSettings={cartSettings}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />

              {/* Pairs Well With */}
              <CartDrawerSuggestedProducts
                cartSettings={cartSettings}
                suggestedProducts={suggestedProducts}
              />

              {/* Loyalty Banner */}
              <CartDrawerLoyaltyBanner
                cartSettings={cartSettings}
                isAuthenticated={isAuthenticated}
                toggleCart={toggleCart}
              />
            </>
          )}
        </div>

        {/* Sticky Footer */}
        <CartDrawerFooter
          cartItems={cartItems}
          cartSettings={cartSettings}
          itemCount={itemCount}
          subtotal={subtotal}
          toggleCart={toggleCart}
        />
      </div>
    </>
  );
};

export default CartDrawer;
