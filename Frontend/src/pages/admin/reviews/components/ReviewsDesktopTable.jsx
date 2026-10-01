import React from "react";
import ReviewTableRow from "./ReviewTableRow";

const ReviewsDesktopTable = ({
  reviews,
  handleToggleStatus,
  handleDeleteReview,
  togglingId,
  deletingId,
}) => {
  return (
    <div className="hidden md:block bg-surface-1 border border-brand/10 rounded-sm overflow-hidden shadow-md">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="w-full">
            <tr className="border-b border-brand/15 bg-surface-1 text-warm-gray text-[10px] sm:text-xs tracking-wider uppercase font-bold">
              <th className="py-4.5 px-6 w-1/4">Customer</th>
              <th className="py-4.5 px-6 w-[12%]">Target</th>
              <th className="py-4.5 px-6 w-[12%]">Rating</th>
              <th className="py-4.5 px-6 w-1/3">Comment & Media</th>
              <th className="py-4.5 px-6 w-[12%]">Status</th>
              <th className="py-4.5 px-6 w-[10%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand/10 text-xs sm:text-sm font-sans">
            {reviews.map((review) => (
              <ReviewTableRow
                key={review.id}
                review={review}
                handleToggleStatus={handleToggleStatus}
                handleDeleteReview={handleDeleteReview}
                togglingId={togglingId}
                deletingId={deletingId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsDesktopTable;
