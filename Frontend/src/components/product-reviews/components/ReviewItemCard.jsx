import React from "react";
import { Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { StarRatingDisplay } from "../../ui/StarRating";

const ReviewItemCard = ({
  review,
  votedReviews,
  handleVote,
}) => {
  const isVoted = votedReviews.has(review.id);

  return (
    <div className="flex flex-col md:flex-row w-full py-10 border-t border-gray-200">
      {/* Left Column: Reviewer Info */}
      <div className="w-full md:w-1/4 shrink-0 mb-6 md:mb-0 md:pr-8">
        <div className="text-[13px] font-bold font-sans text-gray-900 mb-1">
          {review.user_name || review.user}
        </div>
        <div className="flex items-center gap-1.5 text-[12px] font-sans text-gray-600 mb-4">
          Verified Buyer{" "}
          <Check className="w-3.5 h-3.5 bg-black text-white rounded-full p-[2px]" />
        </div>
        <button
          onClick={() => handleVote(review.id, "up")}
          disabled={isVoted}
          className={`flex items-center gap-2 text-[12px] font-sans text-gray-700 font-medium transition-colors hover:text-black ${
            isVoted ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              isVoted ? "bg-gray-400" : "bg-black"
            }`}
          >
            <ThumbsUp className="w-3 h-3 text-white fill-white stroke-white" />
          </div>
          I recommend this product
        </button>
      </div>

      {/* Right Column: Review Content */}
      <div className="w-full md:w-3/4 flex flex-col pl-0 md:pl-12">
        <div className="flex justify-between items-start mb-4">
          <StarRatingDisplay
            rating={review.rating || 5}
            size={16}
            activeColor="text-black"
          />
          <div className="text-[12px] font-sans text-gray-600">
            {review.created_at
              ? new Date(review.created_at).toLocaleDateString()
              : review.date || "10 months ago"}
          </div>
        </div>

        <h4 className="text-[13px] font-bold font-sans text-black mb-2 uppercase tracking-wide">
          {review.title}
        </h4>
        <p className="text-[13px] font-sans text-gray-700 leading-relaxed mb-6">
          {review.comment || review.text}
        </p>

        {review.media_url && (
          <div className="mb-6 h-32 w-24 shrink-0 rounded overflow-hidden border border-gray-200">
            {review.media_type === "video" ? (
              <video
                src={review.media_url}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={review.media_url}
                alt="Review Media"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {/* Individual Size Slider */}
        <div className="w-full max-w-[320px] mb-6 mt-2">
          <div className="relative w-full h-1 bg-gray-300 mb-3">
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full box-content ${
                review.size_rating === 1
                  ? "left-0"
                  : review.size_rating === 3
                  ? "left-full"
                  : "left-1/2"
              }`}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] font-sans font-bold text-gray-600">
            <span>Runs Small</span>
            <span>True to Size</span>
            <span>Runs Large</span>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 text-[12px] font-sans font-medium text-gray-500 mt-auto">
          <button
            onClick={() => handleVote(review.id, "up")}
            disabled={isVoted}
            className={`flex items-center gap-1.5 transition-colors ${
              isVoted
                ? "text-black opacity-50 cursor-not-allowed"
                : "hover:text-black"
            }`}
          >
            <div
              className={`w-[22px] h-[22px] rounded-full flex items-center justify-center ${
                isVoted ? "bg-gray-400" : "bg-black"
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5 text-white fill-white stroke-white" />
            </div>
            {review.helpful_votes || 1}
          </button>
          <button
            onClick={() => handleVote(review.id, "down")}
            disabled={isVoted}
            className={`flex items-center gap-1.5 transition-colors ${
              isVoted
                ? "text-black opacity-50 cursor-not-allowed"
                : "hover:text-black"
            }`}
          >
            <div
              className={`w-[22px] h-[22px] rounded-full flex items-center justify-center ${
                isVoted ? "bg-gray-400" : "bg-black"
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5 text-white fill-white stroke-white" />
            </div>
            {review.unhelpful_votes || 0}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewItemCard;
