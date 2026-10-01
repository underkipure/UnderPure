import React from "react";
import { ChevronDown } from "lucide-react";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";

export const CheckoutMobileSummary = ({
  isMobileSummaryOpen,
  setIsMobileSummaryOpen,
  total,
  summaryProps,
}) => {
  return (
    <div className="bg-[#fafafa] border-b border-gray-200">
      <button
        type="button"
        onClick={() => setIsMobileSummaryOpen((prev) => !prev)}
        className="w-full py-3 px-2.5 sm:px-3 flex justify-between items-center text-left bg-[#fafafa] hover:bg-[#f5f5f5] transition-colors"
      >
        <div className="flex items-center gap-1.5 text-[#90134a] text-[12.5px] font-normal">
          <span>Order summary</span>
          <ChevronDown
            size={13}
            className={`text-[#90134a] transition-transform duration-300 ease-in-out ${
              isMobileSummaryOpen ? "rotate-180" : ""
            }`}
            strokeWidth={2.2}
          />
        </div>

        <div className="text-right">
          <span className="text-[13.5px] font-semibold text-black tracking-tight font-sans">
            Rs{" "}
            {total > 0
              ? total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </span>
        </div>
      </button>

      {/* Smooth animated accordion */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isMobileSummaryOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden border-t border-gray-200/80 bg-[#f9f9f9]">
          <div className="px-2.5 py-3 sm:px-3.5">
            <CheckoutOrderSummary {...summaryProps} isMobile={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
