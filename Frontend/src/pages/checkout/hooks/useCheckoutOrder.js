import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { validatePromo } from "../../../lib/api";

export function useCheckoutOrder({
  cartItems = [],
  formData = {},
  subtotal = 0,
  hasShippingProtection = true,
  checkoutSettings = {},
  user = null,
  fetchMe,
  clearCart,
}) {
  const navigate = useNavigate();
  const [pointsUsed, setPointsUsed] = useState(0);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isVerifyingPromo, setIsVerifyingPromo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setIsVerifyingPromo(true);
    try {
      const response = await validatePromo(
        promoInput,
        subtotal,
        cartItems.map((i) => ({ product_id: i.id, quantity: i.quantity }))
      );
      if (response && response.discount_amount !== undefined) {
        setAppliedPromo({
          code: response.code,
          amount: response.discount_amount,
        });
        setPromoInput("");
        toast.success(response.message || "Promo code applied!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to apply promo code");
    } finally {
      setIsVerifyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.info("Promo code removed");
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (
      !formData.firstName ||
      !formData.address ||
      !formData.city ||
      !formData.phone
    ) {
      toast.error("Please fill in all required shipping fields.");
      return;
    }

    setIsProcessing(true);

    const cs = checkoutSettings || {};
    const payload = {
      cart_items: cartItems.map((item) => ({
        product_id: item.id,
        product_name:
          item.title ||
          item.name ||
          item.product_name ||
          item.product?.name ||
          item.product?.title ||
          "Unknown Product",
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping_name: `${formData.firstName} ${formData.lastName}`.trim(),
      shipping_email: formData.email,
      shipping_phone: formData.phone,
      shipping_address: `${formData.address} ${formData.apartment}`.trim(),
      shipping_city: formData.city,
      shipping_zip: formData.postalCode,
      promo_code: appliedPromo ? appliedPromo.code : null,
      points_used: pointsUsed,
      gift_note: localStorage.getItem("underpure_gift_note") || null,
      shipping_protection_fee: hasShippingProtection
        ? Number(cs.shippingProtectionFee ?? 1.95)
        : 0,
    };

    try {
      const token = localStorage.getItem("auth_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // Abort controller to prevent indefinite "Processing..." state
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"}/checkout`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      // Points are awarded upon delivery — show simple success message
      toast.success("Order Placed Successfully! 🎉");

      if (fetchMe) fetchMe();
      if (clearCart) clearCart();
      localStorage.removeItem("underpure_gift_note");

      setTimeout(() => navigate("/"), 800);
    } catch (error) {
      if (error.name === "AbortError") {
        toast.error("Checkout request timed out. Please try again.");
      } else {
        toast.error(error.message || "Error processing checkout");
      }
      setIsProcessing(false);
    }
  };

  return {
    pointsUsed,
    setPointsUsed,
    promoInput,
    setPromoInput,
    appliedPromo,
    setAppliedPromo,
    isVerifyingPromo,
    isProcessing,
    handleApplyPromo,
    handleRemovePromo,
    handleCheckout,
  };
}
