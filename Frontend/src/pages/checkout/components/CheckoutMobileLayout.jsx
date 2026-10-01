import React from "react";
import { ChevronDown } from "lucide-react";
import { CheckoutHeader } from "./CheckoutHeader";
import { ShippingProtectionBanner } from "./ShippingProtectionBanner";
import { CheckoutContactForm } from "./CheckoutContactForm";
import { CheckoutDeliveryForm } from "./CheckoutDeliveryForm";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";
import { CheckoutMobileSummary } from "./CheckoutMobileSummary";
import { CheckoutInfoCards } from "./CheckoutInfoCards";
import { CheckoutFooterLinks } from "./CheckoutFooterLinks";

export function CheckoutMobileLayout({
  storeName,
  isMobileSummaryOpen,
  setIsMobileSummaryOpen,
  isInlineSummaryOpen,
  setIsInlineSummaryOpen,
  total,
  summaryProps,
  hasShippingProtection,
  setHasShippingProtection,
  checkoutSettings,
  formData,
  handleInputChange,
  setPopupContent,
  handleCheckout,
  isProcessing,
  footerData,
  contactEmail,
  contactPhone,
}) {
  return (
    <div className="lg:hidden w-full flex flex-col bg-white overflow-x-hidden">
      <CheckoutHeader storeName={storeName} isMobile={true} />

      <CheckoutMobileSummary
        isMobileSummaryOpen={isMobileSummaryOpen}
        setIsMobileSummaryOpen={setIsMobileSummaryOpen}
        total={total}
        summaryProps={summaryProps}
      />

      {/* Mobile Form Body */}
      <div className="px-2.5 py-3 sm:px-3.5 space-y-3.5">
        <ShippingProtectionBanner
          hasShippingProtection={hasShippingProtection}
          setHasShippingProtection={setHasShippingProtection}
          checkoutSettings={checkoutSettings}
          isMobile={true}
        />

        <CheckoutContactForm
          formData={formData}
          handleInputChange={handleInputChange}
          isMobile={true}
        />

        <CheckoutDeliveryForm
          formData={formData}
          handleInputChange={handleInputChange}
          setPopupContent={setPopupContent}
          isMobile={true}
        />

        {/* In-Line ORDER SUMMARY Accordion on Mobile */}
        <div className="pt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setIsInlineSummaryOpen((prev) => !prev)}
            className="w-full flex justify-between items-center py-1 text-left focus:outline-none cursor-pointer"
          >
            <h2
              className="text-[13px] font-dala-roman tracking-widest text-black uppercase font-normal"
            >
              ORDER SUMMARY
            </h2>
            <ChevronDown
              size={16}
              className={`text-black transition-transform duration-300 ease-in-out ${
                isInlineSummaryOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isInlineSummaryOpen
                ? "grid-rows-[1fr] opacity-100 mt-2.5"
                : "grid-rows-[0fr] opacity-0 mt-0"
            }`}
          >
            <div className="overflow-hidden">
              <CheckoutOrderSummary {...summaryProps} isMobile={true} />
            </div>
          </div>
        </div>

        {/* Pay now Button Mobile */}
        <div className="pt-1.5">
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-black text-white py-3 rounded-lg text-[12.5px] font-semibold uppercase tracking-wider hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isProcessing ? "Processing..." : "Pay now"}
          </button>
        </div>

        <CheckoutInfoCards
          checkoutSettings={checkoutSettings}
          footerData={footerData}
          contactEmail={contactEmail}
          contactPhone={contactPhone}
        />

        {/* Footer Policy Links Mobile */}
        <div className="border-t border-gray-100 pt-2.5 pb-6">
          <CheckoutFooterLinks
            checkoutSettings={checkoutSettings}
            setPopupContent={setPopupContent}
            align="center"
          />
        </div>
      </div>
    </div>
  );
}
