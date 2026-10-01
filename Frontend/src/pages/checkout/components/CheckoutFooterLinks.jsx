import React from "react";

export const CheckoutFooterLinks = ({
  checkoutSettings = {},
  setPopupContent,
  align = "start",
}) => {
  const cs = checkoutSettings || {};

  return (
    <div className={`flex flex-wrap gap-x-3.5 gap-y-1 text-[10.5px] font-sans justify-${align}`}>
      <button
        type="button"
        onClick={() => setPopupContent("refund")}
        className="text-[#90134a] hover:underline underline-offset-2 cursor-pointer"
      >
        {cs.linkRefundText || "Refund policy"}
      </button>
      <button
        type="button"
        onClick={() => setPopupContent("shipping")}
        className="text-[#90134a] hover:underline underline-offset-2 cursor-pointer"
      >
        {cs.linkShippingText || "Shipping"}
      </button>
      <button
        type="button"
        onClick={() => setPopupContent("privacy")}
        className="text-[#90134a] hover:underline underline-offset-2 cursor-pointer"
      >
        {cs.linkPrivacyText || "Privacy policy"}
      </button>
      <button
        type="button"
        onClick={() => setPopupContent("terms")}
        className="text-[#90134a] hover:underline underline-offset-2 cursor-pointer"
      >
        {cs.linkTermsText || "Terms of service"}
      </button>
      <button
        type="button"
        onClick={() => setPopupContent("contact")}
        className="text-[#90134a] hover:underline underline-offset-2 cursor-pointer"
      >
        {cs.linkContactText || "Contact information"}
      </button>
    </div>
  );
};
