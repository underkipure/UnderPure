import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import ScrollToTop from "./components/ScrollToTop";
import AppContent from "./components/app/AppContent";
import { useCartManager } from "./hooks/useCartManager";

function App() {
  const {
    isCartOpen,
    cartItems,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCartManager();

  return (
    <Router>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "white",
            color: "black",
            border: "1px solid black",
            borderRadius: "0px",
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
          className: "uppercase tracking-wide",
        }}
      />
      <ScrollToTop />
      <AppContent
        isCartOpen={isCartOpen}
        cartItems={cartItems}
        toggleCart={toggleCart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        addToCart={addToCart}
        clearCart={clearCart}
      />
    </Router>
  );
}

export default App;
