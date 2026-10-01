import React from "react";

export const CheckoutInfoCards = ({
  checkoutSettings = {},
  footerData = {},
  contactEmail = "",
  contactPhone = "",
}) => {
  const cs = checkoutSettings || {};
  const fd = footerData || {};
  const rawEmail = contactEmail || fd.contactEmail || "";
  const rawPhone = contactPhone || fd.contactPhone || "";
  const activeEmail = typeof rawEmail === "string" ? rawEmail : String(rawEmail || "");
  const activePhone =
    typeof rawPhone === "string"
      ? rawPhone
      : rawPhone && typeof rawPhone === "object"
      ? String(rawPhone.phone || rawPhone.number || "")
      : String(rawPhone || "");
  const cleanPhone = String(activePhone).replace(/[^0-9+]/g, "");

  return (
    <div className="space-y-2">
      {/* RETURNS Card */}
      <div className="border border-gray-200/90 rounded-xl p-3 bg-white space-y-1 shadow-2xs">
        <h3
          className="text-[11px] uppercase tracking-wider text-black font-dala-roman"
        >
          {cs.returnsTitle || "RETURNS"}
        </h3>
        <p className="text-[10px] text-gray-600 leading-relaxed font-sans">
          {cs.returnsText ||
            "We accept returns within 30 days of shipping for all unused items with tags. Full priced items are returnable for refund or store credit. Sale items are returnable for store credit only. Final sale items are final sale and are not returnable."}
        </p>
      </div>

      {/* CONTACT US Card */}
      <div className="border border-gray-200/90 rounded-xl p-3 bg-white space-y-1 shadow-2xs">
        <h3
          className="text-[11px] uppercase tracking-wider text-black font-dala-roman"
        >
          {cs.contactTitle || "CONTACT US"}
        </h3>
        <p className="text-[10px] text-gray-600 leading-relaxed font-sans">
          Need help? Chat with us
          {activeEmail && (
            <>
              , e-mail us anytime at{" "}
              <a
                href={`mailto:${activeEmail}`}
                className="text-[#90134a] hover:underline underline-offset-2 font-medium"
              >
                {activeEmail}
              </a>
            </>
          )}
          {activePhone && cleanPhone && (
            <>
              {" "}or call us at{" "}
              <a
                href={`tel:${cleanPhone}`}
                className="text-[#90134a] hover:underline underline-offset-2 font-medium"
              >
                {activePhone}
              </a>
            </>
          )}
          {(cs.contactServiceHours || fd.contactServiceHours) && (
            <span> ({cs.contactServiceHours || fd.contactServiceHours})</span>
          )}.
        </p>
      </div>

      {/* GUARANTEED SAFE CHECKOUT */}
      <div className="pt-1.5 text-center">
        <h3
          className="text-[10px] uppercase tracking-[2px] text-black font-dala-roman"
        >
          {cs.guaranteeText || "GUARANTEED SAFE CHECKOUT"}
        </h3>
      </div>
    </div>
  );
};
