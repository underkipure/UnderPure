import React from "react";
import { Mail } from "lucide-react";

export default function AccountProfileMarketingSection({
  d,
  emailMarketing,
  setEmailMarketing,
}) {
  if (d?.marketing?.enabled === false) return null;

  return (
    <div className="w-full md:w-[80%]">
      <h2 className="font-serif text-[15px] sm:text-[16px] uppercase tracking-[0.0001em] text-black mb-4">
        {d?.marketing?.title || "MARKETING PREFERENCES"}
      </h2>
      <div className="border border-gray-200 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail
            className="w-[14px] h-[14px] text-gray-400"
            strokeWidth={1.5}
          />
          <span className="text-[12px] font-sans text-gray-500">
            {d?.marketing?.emailLabel || "Email"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setEmailMarketing(!emailMarketing)}
          className={`w-[36px] h-[20px] rounded-full relative flex items-center transition-colors ${
            emailMarketing ? "bg-[#d83c84]" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute left-[2px] w-[16px] h-[16px] rounded-full bg-white shadow-sm transition-transform ${
              emailMarketing ? "translate-x-[16px]" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
