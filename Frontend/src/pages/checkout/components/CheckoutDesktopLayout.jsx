import React from "react";
import { CheckoutHeader } from "./CheckoutHeader";
import { ShippingProtectionBanner } from "./ShippingProtectionBanner";
import { CheckoutContactForm } from "./CheckoutContactForm";
import { CheckoutDeliveryForm } from "./CheckoutDeliveryForm";
import { CheckoutShippingMethod } from "./CheckoutShippingMethod";
import { CheckoutPaymentMethod } from "./CheckoutPaymentMethod";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";
import { CheckoutInfoCards } from "./CheckoutInfoCards";
import { CheckoutFooterLinks } from "./CheckoutFooterLinks";

export function CheckoutDesktopLayout({
  storeName,
  hasShippingProtection,
  setHasShippingProtection,
  checkoutSettings,
  formData,
  handleInputChange,
  setPopupContent,
  selectedShipping,
  shipping,
  handleCheckout,
  isProcessing,
  summaryProps,
  footerData,
  contactEmail,
  contactPhone,
}) {
  return (
    <div className="hidden lg:flex flex-row min-h-screen bg-white font-sans w-full">
      {/* Left Column (Scrolls naturally with page, takes 55% width) */}
      <div className="w-[55%] min-h-screen flex justify-end pb-16">
        <div className="w-full max-w-[39rem] px-4 sm:px-6 pt-5 pb-6 lg:py-7 lg:pl-6 lg:pr-8 mx-auto lg:mx-0">
          <CheckoutHeader storeName={storeName} isMobile={false} />

          <ShippingProtectionBanner
            hasShippingProtection={hasShippingProtection}
            setHasShippingProtection={setHasShippingProtection}
            checkoutSettings={checkoutSettings}
            isMobile={false}
          />

          <CheckoutContactForm
            formData={formData}
            handleInputChange={handleInputChange}
            isMobile={false}
          />

          <CheckoutDeliveryForm
            formData={formData}
            handleInputChange={handleInputChange}
            setPopupContent={setPopupContent}
            isMobile={false}
          />

          <CheckoutShippingMethod
            address={formData.address}
            selectedShipping={selectedShipping}
            shipping={shipping}
          />

          <CheckoutPaymentMethod
            checkoutSettings={checkoutSettings}
            handleCheckout={handleCheckout}
            isProcessing={isProcessing}
          />

          <div className="border-t border-gray-100 pt-2.5 mt-4">
            <CheckoutFooterLinks
              checkoutSettings={checkoutSettings}
              setPopupContent={setPopupContent}
              align="start"
            />
          </div>
        </div>
      </div>

      {/* Right Column (45% width, Sticky top-0 with independent scroll) */}
      <div className="w-[45%] bg-[#f8f8f8] border-l border-gray-200">
        <div className="sticky top-0 h-screen max-h-screen overflow-y-auto custom-scrollbar w-full max-w-[490px] px-6 py-7 lg:pl-8 lg:pr-10 space-y-5">
          <CheckoutOrderSummary {...summaryProps} isMobile={false} />

          <div className="pt-1 pb-16">
            <CheckoutInfoCards
              checkoutSettings={checkoutSettings}
              footerData={footerData}
              contactEmail={contactEmail}
              contactPhone={contactPhone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
