import React from "react";
import { Star } from "lucide-react";

export function ReviewStarRatingInput({ rating, setRating }) {
  return (
    <div>
      <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">
        Score
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-8 h-8 cursor-pointer transition-colors ${
              star <= rating
                ? "fill-black text-black"
                : "fill-gray-200 text-gray-200 hover:fill-gray-300"
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    </div>
  );
}
