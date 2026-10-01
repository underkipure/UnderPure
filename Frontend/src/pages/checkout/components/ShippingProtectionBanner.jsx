import React from "react";
import { Check, ShieldCheck, HelpCircle } from "lucide-react";

export const ShippingProtectionBanner = ({
  hasShippingProtection,
  setHasShippingProtection,
  checkoutSettings,
  isMobile = false,
}) => {
  const cs = checkoutSettings || {};
  const fee = Number(cs.shippingProtectionFee ?? 1.95).toFixed(2);
  const title = cs.shippingProtectionTitle || "Shipping Protection";
  const desc = cs.shippingProtectionDesc
    ? cs.shippingProtectionDesc.replace(/\b(Route|PostEx)\b/gi, "UnderPure")
    : "If your package is lost, stolen, or damaged, UnderPure will refund or replace it.";

  if (isMobile) {
    return (
      <div className="p-0.5 bg-white">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setHasShippingProtection((prev) => !prev)}
        >
          <div className="flex items-center gap-1.5">
            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                hasShippingProtection ? "bg-[#90134a]" : "border border-gray-300 bg-white"
              }`}
            >
              {hasShippingProtection && <Check size={9} strokeWidth={3} className="text-white" />}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[11px] text-gray-900 font-sans font-medium">
                {title}
              </span>
              <ShieldCheck size={12} strokeWidth={2.2} className="text-black shrink-0" />
              {checkoutSettings?.logoUrl ? (
                <img
                  src={checkoutSettings.logoUrl}
                  alt="UnderPure"
                  className="h-4.5 w-auto max-w-[35px] object-contain inline-block"
                />
              ) : (
                <span className="font-serif text-[10.5px]">UnderPure</span>
              )}
              <HelpCircle size={12} className="text-gray-400 cursor-help" />
            </div>
          </div>
          <span className="text-[11px] text-gray-900 font-sans font-medium">
            Rs {fee}
          </span>
        </div>
        <p className="text-[10px] text-gray-500 tracking-[0.0001em] leading-tight font-sans mt-0.5">
          {desc}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4.5 flex flex-col bg-white">
      <div className="flex justify-between items-center">
        <label
          className="flex items-center gap-1.5 cursor-pointer text-[11.5px] text-black tracking-tight"
          onClick={() => setHasShippingProtection((prev) => !prev)}
        >
          <div
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors shrink-0 ${
              hasShippingProtection ? "bg-[#90134a]" : "border border-gray-300 bg-white"
            }`}
          >
            {hasShippingProtection && <Check size={9} strokeWidth={3} className="text-white" />}
          </div>
          <span className="font-medium text-gray-900">{title}</span>
          <span className="font-bold flex items-center gap-1 ml-0.5 tracking-tight">
            <ShieldCheck size={12} strokeWidth={2.2} className="text-black shrink-0" />
            {checkoutSettings?.logoUrl ? (
              <img
                src={checkoutSettings.logoUrl}
                alt="UnderPure"
                className="h-4.5 w-auto max-w-[50px] object-contain inline-block"
              />
            ) : (
              <span className="font-serif text-[10.5px]">UnderPure</span>
            )}{" "}
            <span className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center text-[9px] text-gray-500 font-serif font-normal">
              i
            </span>
          </span>
        </label>
        <span className="text-[11.5px] font-medium text-black font-sans">
          Rs {fee}
        </span>
      </div>
      <p className="text-[10px] text-gray-500 pl-5 tracking-[0.0001em] leading-tight mt-0.5 font-sans">
        {desc}
      </p>
    </div>
  );
};
