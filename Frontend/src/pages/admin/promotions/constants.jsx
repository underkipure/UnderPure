import React from "react";

export const EMPTY_FORM = {
  code: "",
  type: "percent",
  value: 10,
  minOrder: 0,
  maxUses: null,
  active: true,
  expires: null,
  applyTo: "all",
  category_id: null,
};

export const INPUT_CLS =
  "w-full bg-white border border-black/10 focus:border-black/30 text-black text-[12px] sm:text-[13px] font-sans px-3.5 py-3.5 md:px-4 md:py-4 outline-none transition-colors placeholder-gray-400 rounded-sm";

export const LABEL_CLS =
  "block text-[10px] sm:text-[11px] md:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-sans font-bold text-gray-500 mb-1.5 sm:mb-2 md:mb-2";

export function Field({ label, children }) {
  return (
    <div className="mb-4 sm:mb-4 md:mb-0 w-full">
      <label className={LABEL_CLS}>{label}</label>
      {children}
    </div>
  );
}
