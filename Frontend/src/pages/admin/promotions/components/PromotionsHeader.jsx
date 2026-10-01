import React from "react";
import { Plus } from "lucide-react";

export default function PromotionsHeader({ totalCodes, activeCodes, onOpenModal }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 sm:mb-6 md:mb-10 gap-4 md:gap-0 w-full">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-black">Promotions</h1>
        <p className="text-gray-500 text-xs sm:text-sm font-sans mt-1 sm:mt-2">
          {totalCodes} discount codes · {activeCodes} active
        </p>
      </div>
      <button
        onClick={onOpenModal}
        className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3.5 sm:px-6 sm:py-4 md:px-8 md:py-4 text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-sans font-bold hover:bg-gray-800 transition-colors rounded-sm shadow-md w-full md:w-auto shrink-0"
      >
        <Plus size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2} />
        New Code
      </button>
    </div>
  );
}
