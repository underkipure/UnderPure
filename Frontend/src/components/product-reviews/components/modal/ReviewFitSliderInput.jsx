import React from "react";

export function ReviewFitSliderInput({ sizeRating, setSizeRating }) {
  return (
    <div className="mt-4">
      <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-4 text-black">
        Fit
      </label>
      <div className="w-full max-w-[400px]">
        <div
          className="relative w-full h-1 bg-gray-300 mb-4 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const val = (e.clientX - rect.left) / rect.width;
            if (val < 0.33) setSizeRating(1);
            else if (val > 0.66) setSizeRating(3);
            else setSizeRating(2);
          }}
        >
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full border-2 border-white box-content cursor-grab ${
              sizeRating === 1 ? "left-0" : sizeRating === 3 ? "left-full" : "left-1/2"
            }`}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] font-sans font-bold text-black">
          <span
            onClick={() => setSizeRating(1)}
            className="cursor-pointer"
          >
            Runs Small
          </span>
          <span
            onClick={() => setSizeRating(2)}
            className="cursor-pointer"
          >
            True to Size
          </span>
          <span
            onClick={() => setSizeRating(3)}
            className="cursor-pointer"
          >
            Runs Large
          </span>
        </div>
      </div>
    </div>
  );
}
