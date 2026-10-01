import React from "react";

export default function DeletePromotionModal({ deleteId, onClose, handleDelete }) {
  if (!deleteId) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 w-full" onClick={onClose}>
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm w-full transition-opacity duration-200" />
      <div
        className="relative w-[90%] sm:w-full md:max-w-sm bg-gray-50 border border-black/10 z-[60] p-6 sm:p-8 md:p-10 text-center rounded-sm shadow-2xl transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-2 sm:mb-3 md:mb-4">Delete Code?</p>
        <p className="text-xs sm:text-sm text-gray-500 font-sans mb-6 sm:mb-8 font-medium">This cannot be undone.</p>
        <div className="flex gap-2 sm:gap-3 md:gap-4 w-full">
          <button 
            onClick={onClose} 
            className="flex-1 bg-white border border-gray-200 text-black py-3 sm:py-3.5 md:py-4 text-[10px] sm:text-xs md:text-sm tracking-[0.15em] uppercase font-sans font-bold hover:bg-gray-50 transition-colors rounded-sm"
          >
            Cancel
          </button>
          <button 
            onClick={() => handleDelete(deleteId)} 
            className="flex-1 bg-red-500/90 text-white py-3 sm:py-3.5 md:py-4 text-[10px] sm:text-xs md:text-sm tracking-[0.15em] uppercase font-sans font-bold hover:bg-red-500 transition-colors rounded-sm shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
