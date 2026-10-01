import React from "react";
import { Star, Trash2, Eye, EyeOff, Award, ShoppingBag, Loader2 } from "lucide-react";

const ReviewMobileCard = ({
  review,
  handleToggleStatus,
  handleDeleteReview,
  togglingId,
  deletingId,
}) => {
  const isDisabled = Number(review.is_disabled) === 1;

  return (
    <div
      className={`bg-surface-1 border border-brand/15 p-4 space-y-3 rounded-sm shadow-md ${
        isDisabled ? "bg-red-950/10 border-red-500/30" : ""
      }`}
    >
      {/* Header: User + Rating + Status */}
      <div className="flex justify-between items-start gap-2 border-b border-brand/10 pb-2.5">
        <div>
          <span className="font-semibold text-ivory text-sm block">
            {review.user_name || "Guest User"}
          </span>
          <span className="text-[10px] text-warm-gray">{review.user_email}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isDisabled ? (
            <span className="bg-red-500/10 border border-red-500/35 text-red-400 px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase tracking-wider">
              Disabled
            </span>
          ) : (
            <span className="bg-green-500/10 border border-green-500/35 text-green-400 px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase tracking-wider">
              Approved
            </span>
          )}
          <div className="flex gap-0.5 text-brand">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                className={
                  i < review.rating ? "fill-brand text-brand" : "text-warm-gray/30"
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Target */}
      <div>
        {review.product_id ? (
          <span className="inline-flex items-center gap-1 bg-brand/10 border border-brand/25 text-brand px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider">
            <ShoppingBag size={10} /> {review.product_name || "Product"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-surface-2 border border-brand/20 text-ivory px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider">
            <Award size={10} /> Store Review
          </span>
        )}
      </div>

      {/* Comment */}
      <div className="bg-surface-2 p-2.5 rounded-sm border border-brand/10 text-xs">
        {review.title && (
          <h5 className="font-bold text-ivory text-xs uppercase mb-1">
            {review.title}
          </h5>
        )}
        <p className="text-warm-gray italic">
          "{review.comment || "No comment left."}"
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center pt-1 border-t border-brand/10">
        <span className="text-[9px] text-warm-gray/70">
          {new Date(review.created_at).toLocaleDateString("en-GB")}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handleToggleStatus(review)}
            disabled={togglingId === review.id}
            className="px-3 py-1.5 rounded-sm text-[10px] uppercase tracking-widest font-bold border border-brand/30 bg-surface-2 text-ivory hover:bg-brand hover:text-surface-base transition-colors flex items-center gap-1 cursor-pointer"
          >
            {togglingId === review.id ? (
              <Loader2 size={12} className="animate-spin" />
            ) : isDisabled ? (
              <Eye size={12} />
            ) : (
              <EyeOff size={12} />
            )}
            {isDisabled ? "Approve" : "Disable"}
          </button>
          <button
            onClick={() => handleDeleteReview(review.id)}
            disabled={deletingId === review.id}
            className="px-3 py-1.5 rounded-sm text-[10px] uppercase tracking-widest font-bold border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            {deletingId === review.id ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewMobileCard;
