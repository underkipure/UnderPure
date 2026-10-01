import React, { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import SEO from "../SEO";
import FloatingButtons from "../FloatingButtons";
import AppRoutes from "../../routes/AppRoutes";
import { useDocumentMetadata } from "../../hooks/useDocumentMetadata";

const CartDrawer = lazy(() => import("../CartDrawer"));
const WelcomePopup = lazy(() => import("../WelcomePopup"));

export default function AppContent({
  isCartOpen,
  cartItems,
  toggleCart,
  removeFromCart,
  updateQuantity,
  addToCart,
  clearCart,
}) {
  const location = useLocation();
  const { pageName } = useDocumentMetadata();

  const isCheckout = location.pathname === "/checkout";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isAdminPage = location.pathname.startsWith("/admin");
  const hideHeaderFooter =
    isCheckout || isAuthPage || isAdminPage || location.pathname === "/account";

  const totalCartCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-clip m-0 p-0 relative">
      <SEO title={pageName} />
      {!hideHeaderFooter && (
        <Header toggleCart={toggleCart} cartCount={totalCartCount} />
      )}
      <Suspense fallback={null}>
        <CartDrawer
          isOpen={isCartOpen}
          toggleCart={toggleCart}
          cartItems={cartItems}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          addToCart={addToCart}
        />
      </Suspense>

      <main className="flex-grow relative">
        {!isAdminPage && (
          <Suspense fallback={null}>
            <WelcomePopup />
          </Suspense>
        )}
        <AppRoutes
          cartItems={cartItems}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          addToCart={addToCart}
          clearCart={clearCart}
        />
      </main>

      {!hideHeaderFooter && <FloatingButtons />}
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}
