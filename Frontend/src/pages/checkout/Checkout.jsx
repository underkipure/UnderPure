import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useSiteSettingsStore, DEFAULTS } from "../../store/siteSettingsStore";

import {
  CheckoutPolicyModal,
  CheckoutEmptyBag,
  CheckoutMobileLayout,
  CheckoutDesktopLayout,
} from "./components";
import { calculateCheckoutTotals } from "./utils/checkoutCalculations";
import { useCheckoutForm } from "./hooks/useCheckoutForm";
import { useCheckoutOrder } from "./hooks/useCheckoutOrder";

const Checkout = ({ cartItems = [], clearCart }) => {
  const { user, fetchMe } = useAuthStore();
  const storeName = useSiteSettingsStore((s) => s.storeName);
  const loyaltySettings = useSiteSettingsStore((s) => s.loyaltySettings);
  const shippingRates = useSiteSettingsStore((s) => s.shippingRates);
  const taxRate = useSiteSettingsStore((s) => s.taxRate);
  const checkoutSettings = useSiteSettingsStore((s) => s.checkoutSettings);
  const freeShippingThreshold = useSiteSettingsStore((s) => s.freeShippingThreshold);
  const storedFooterData = useSiteSettingsStore((s) => s.footerData);
  const contactEmail = useSiteSettingsStore((s) => s.contactEmail);
  const contactPhone = useSiteSettingsStore((s) => s.contactPhone);

  const fd = storedFooterData || DEFAULTS.footerData || {};
  const cs = checkoutSettings || DEFAULTS.checkoutSettings || {};

  const [popupContent, setPopupContent] = useState(null);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const [isInlineSummaryOpen, setIsInlineSummaryOpen] = useState(true);
  const [hasShippingProtection, setHasShippingProtection] = useState(true);

  // Scoped fluid scaling
  useEffect(() => {
    document.documentElement.classList.add("checkout-fluid");
    return () => {
      document.documentElement.classList.remove("checkout-fluid");
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form Management Hook
  const { formData, handleInputChange } = useCheckoutForm(user);

  // Order & Promo Processing Hook
  const {
    pointsUsed,
    setPointsUsed,
    promoInput,
    setPromoInput,
    appliedPromo,
    isVerifyingPromo,
    isProcessing,
    handleApplyPromo,
    handleRemovePromo,
    handleCheckout,
  } = useCheckoutOrder({
    cartItems,
    formData,
    hasShippingProtection,
    checkoutSettings: cs,
    user,
    fetchMe,
    clearCart,
  });

  // Calculate Subtotals, Discounts, Rates, and Totals
  const {
    subtotal,
    isVip,
    isFirstOrder,
    selectedShipping,
    isFreeShipping,
    shipping,
    taxes,
    duties,
    maxPoints,
    maxRedeemableValue,
    maxPointsToUse,
    pointsDiscount,
    promoDiscount,
    vipDiscount,
    firstOrderDiscount,
    total,
  } = calculateCheckoutTotals({
    cartItems,
    user,
    shippingRates,
    taxRate,
    freeShippingThreshold,
    pointsUsed,
    appliedPromo,
    hasShippingProtection,
    checkoutSettings: cs,
    loyaltySettings,
  });

  const summaryProps = {
    cartItems,
    hasShippingProtection,
    checkoutSettings: cs,
    appliedPromo,
    promoInput,
    setPromoInput,
    isVerifyingPromo,
    handleApplyPromo,
    handleRemovePromo,
    user,
    maxPoints,
    maxRedeemableValue,
    maxPointsToUse,
    pointsUsed,
    setPointsUsed,
    pointsDiscount,
    subtotal,
    shipping,
    promoDiscount,
    firstOrderDiscount,
    vipDiscount,
    total,
  };

  if (cartItems.length === 0) {
    return <CheckoutEmptyBag />;
  }

  return (
    <div className="min-h-screen bg-white font-sans w-full overflow-x-clip lg:overflow-visible">
      {/* Mobile View */}
      <CheckoutMobileLayout
        storeName={storeName}
        isMobileSummaryOpen={isMobileSummaryOpen}
        setIsMobileSummaryOpen={setIsMobileSummaryOpen}
        isInlineSummaryOpen={isInlineSummaryOpen}
        setIsInlineSummaryOpen={setIsInlineSummaryOpen}
        total={total}
        summaryProps={summaryProps}
        hasShippingProtection={hasShippingProtection}
        setHasShippingProtection={setHasShippingProtection}
        checkoutSettings={cs}
        formData={formData}
        handleInputChange={handleInputChange}
        setPopupContent={setPopupContent}
        handleCheckout={handleCheckout}
        isProcessing={isProcessing}
        footerData={fd}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
      />

      {/* Desktop View */}
      <CheckoutDesktopLayout
        storeName={storeName}
        hasShippingProtection={hasShippingProtection}
        setHasShippingProtection={setHasShippingProtection}
        checkoutSettings={cs}
        formData={formData}
        handleInputChange={handleInputChange}
        setPopupContent={setPopupContent}
        selectedShipping={selectedShipping}
        shipping={shipping}
        handleCheckout={handleCheckout}
        isProcessing={isProcessing}
        summaryProps={summaryProps}
        footerData={fd}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
      />

      {/* Policy Modals */}
      <CheckoutPolicyModal
        popupContent={popupContent}
        setPopupContent={setPopupContent}
        checkoutSettings={cs}
        footerData={fd}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
      />
    </div>
  );
};

export default Checkout;
