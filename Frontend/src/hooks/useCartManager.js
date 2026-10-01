import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getCartItemAvailableStock } from "../utils/stockUtils";
import { useProductStore } from "../store/productStore";

export function useCartManager() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("underpure_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("underpure_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const { products } = useProductStore();

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product) => {
    const cartItemId =
      product.cartItemId ||
      `${product.id}-${product.color || "default"}-${product.size || "default"}`;
    const resolvedName =
      product.title ||
      product.name ||
      product.product_name ||
      product.product?.name ||
      product.product?.title ||
      "Unknown Product";
    const productToAdd = {
      ...product,
      name: resolvedName,
      title: resolvedName,
      product_name: resolvedName,
      cartItemId,
    };

    const availableStock = getCartItemAvailableStock(productToAdd, products);

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => (item.cartItemId || item.id) === cartItemId
      );
      if (existing) {
        if (existing.quantity >= availableStock) {
          toast.error(
            `Cannot add more. Available stock limit (${availableStock}) reached!`
          );
          return prev;
        }
        return prev.map((item) =>
          (item.cartItemId || item.id) === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      if (availableStock <= 0) {
        toast.error("This item is currently out of stock!");
        return prev;
      }
      return [...prev, { ...productToAdd, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const clearCart = () => setCartItems([]);

  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => (item.cartItemId || item.id) !== id)
    );
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if ((item.cartItemId || item.id) === id) {
          const maxStock = getCartItemAvailableStock(item, products);
          if (newQuantity > maxStock) {
            toast.error(
              `Cannot increase quantity beyond available stock (${maxStock})`
            );
            return { ...item, quantity: maxStock };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  return {
    isCartOpen,
    cartItems,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
