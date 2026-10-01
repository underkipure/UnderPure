import React, { useState } from "react";
import { Star } from "lucide-react";

/**
 * Universal Star Rating Display component.
 * Renders 1–5 stars with configurable size, fill, stroke, and optional numeric rating label.
 */
export function StarRatingDisplay({
  rating = 5,
  maxStars = 5,
  size = 14,
  fillColor = "currentColor",
  strokeColor = "currentColor",
  inactiveColor = "text-gray-300",
  activeColor = "text-black",
  showNumber = false,
  className = "",
}) {
  const normalizedRating = Math.max(0, Math.min(maxStars, Number(rating) || 0));

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className={`flex items-center gap-0.5 ${activeColor}`}>
        {Array.from({ length: maxStars }).map((_, index) => {
          const isFilled = index < Math.round(normalizedRating);
          return (
            <Star
              key={index}
              size={size}
              strokeWidth={1.5}
              className={
                isFilled
                  ? `${activeColor} fill-current`
                  : `${inactiveColor} fill-none`
              }
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-sans font-medium text-gray-700 ml-1">
          {normalizedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

/**
 * Universal Interactive Star Rating Input component.
 * Supports hover preview, touch selection, and change callbacks.
 */
export function StarRatingInput({
  value = 5,
  onChange,
  maxStars = 5,
  size = 22,
  activeColor = "text-black",
  inactiveColor = "text-gray-300",
  className = "",
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || value;

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      onMouseLeave={() => setHoverRating(0)}
    >
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange && onChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus:ring-1 focus:ring-black rounded-xs"
            aria-label={`Rate ${starValue} of ${maxStars} stars`}
          >
            <Star
              size={size}
              strokeWidth={1.5}
              className={isFilled ? `${activeColor} fill-current` : `${inactiveColor} fill-none`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default StarRatingDisplay;
