import React from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

const ReviewsSummaryHeader = ({
  avgRating,
  reviewsCount,
  sizeSliderPosition,
  token,
  setIsFormOpen,
}) => {
  return (
    <div className="mb-10">
      <h2 className="text-[13px] font-bold font-sans tracking-widest uppercase mb-8 text-black">
        Reviews
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        {/* Left: Overall Rating */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[18px] font-sans font-bold text-black leading-none">
              {avgRating}
            </span>
            <div className="flex gap-1 text-black">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-[18px] h-[18px] ${
                    i < Math.round(avgRating)
                      ? "fill-black text-black"
                      : "fill-gray-300 text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-[12px] font-sans text-gray-600">
            Based on {reviewsCount} reviews
          </div>
        </div>

        {/* Middle: Size Slider Summary */}
        <div className="flex-1 w-full max-w-[400px]">
          <div className="relative w-full h-1 bg-gray-300 mb-3">
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full border-2 border-white box-content"
              style={{ left: `${sizeSliderPosition}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] font-sans font-bold text-black">
            <span>Runs Small</span>
            <span>True to Size</span>
            <span>Runs Large</span>
          </div>
        </div>

        {/* Right: Write Review Button */}
        <div>
          <button
            onClick={() => {
              if (!token) {
                toast.error("Please log in to write a review.");
                return;
              }
              setIsFormOpen(true);
            }}
            className="bg-black text-white text-[12px] font-bold uppercase tracking-widest px-8 py-3.5 hover:bg-gray-800 transition-colors"
          >
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSummaryHeader;
