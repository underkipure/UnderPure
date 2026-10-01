import React from "react";
import {
  Trash2,
  Eye,
  EyeOff,
  Award,
  ShoppingBag,
  Image as ImageIcon,
  Film,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { VideoPlayer } from "../../../../components/ui/VideoPlayer";
import { StarRatingDisplay } from "../../../../components/ui/StarRating";

const ReviewTableRow = ({
  review,
  handleToggleStatus,
  handleDeleteReview,
  togglingId,
  deletingId,
}) => {
  const isDisabled = Number(review.is_disabled) === 1;

  return (
    <tr
      className={`hover:bg-brand/2 transition-colors ${
        isDisabled ? "bg-red-950/5 opacity-80" : ""
      }`}
    >
      {/* Customer */}
      <td className="py-4.5 px-6">
        <div className="flex flex-col">
          <span className="font-semibold text-ivory">
            {review.user_name || "Guest User"}
          </span>
          <span className="text-[10px] text-warm-gray mt-0.5">
            {review.user_email}
          </span>
          <span className="text-[9px] text-warm-gray/70 mt-1">
            {new Date(review.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </td>

      {/* Target (Overall / Product) */}
      <td className="py-4.5 px-6">
        {review.product_id ? (
          <div className="flex flex-col items-start gap-1">
            <span className="inline-flex items-center gap-1 bg-brand/10 border border-brand/25 text-brand px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider shrink-0">
              <ShoppingBag size={10} /> Product
            </span>
            <a
              href={`/product/${review.product_slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-warm-gray hover:underline hover:text-brand truncate max-w-[140px] inline-flex items-center gap-0.5 mt-1 font-medium"
            >
              {review.product_name} <ExternalLink size={8} />
            </a>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 bg-surface-2 border border-brand/20 text-ivory px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider shrink-0">
            <Award size={10} /> Store
          </span>
        )}
      </td>

      {/* Rating */}
      <td className="py-4.5 px-6">
        <StarRatingDisplay
          rating={review.rating || 5}
          size={12}
          activeColor="text-brand fill-brand"
          inactiveColor="text-warm-gray/30"
        />
      </td>

      {/* Comment & Media */}
      <td className="py-4.5 px-6">
        <div className="space-y-3">
          {review.title && (
            <h4 className="font-bold text-ivory text-sm uppercase tracking-wide">
              {review.title}
            </h4>
          )}
          <p className="text-warm-gray italic leading-relaxed break-words whitespace-pre-line pr-4">
            "{review.comment || "No comment left."}"
          </p>

          {/* Media attachment representation */}
          {review.media_url && (
            <div className="relative rounded-sm overflow-hidden border border-brand/15 max-w-[200px] bg-black shadow-inner">
              {review.media_type === "video" ? (
                <VideoPlayer
                  src={review.media_url}
                  className="w-full max-h-[110px]"
                />
              ) : (
                <img
                  src={review.media_url}
                  alt="Attachment"
                  loading="lazy"
                  className="w-full max-h-[110px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(review.media_url, "_blank")}
                />
              )}
              <div className="absolute top-1 right-1 bg-black/75 px-1.5 py-0.5 rounded-sm text-[8px] uppercase tracking-wider font-bold text-ivory flex items-center gap-1 backdrop-blur-sm">
                {review.media_type === "video" ? (
                  <Film size={10} />
                ) : (
                  <ImageIcon size={10} />
                )}
                {review.media_type}
              </div>
            </div>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="py-4.5 px-6">
        {isDisabled ? (
          <span className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/35 text-red-400 px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider shrink-0">
            <EyeOff size={10} /> Disabled
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/35 text-green-400 px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider shrink-0">
            <Eye size={10} /> Approved
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="py-4.5 px-6 text-right">
        <div className="flex gap-2 justify-end">
          {/* Toggle Status Button */}
          <button
            onClick={() => handleToggleStatus(review)}
            disabled={togglingId === review.id}
            title={isDisabled ? "Approve Review" : "Disable Review"}
            className={`p-2 rounded-sm border hover:scale-105 active:scale-95 transition-all cursor-pointer ${
              isDisabled
                ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black"
                : "bg-surface-2 border-brand/30 text-brand hover:bg-brand hover:text-surface-base"
            }`}
          >
            {togglingId === review.id ? (
              <Loader2 size={13} className="animate-spin" />
            ) : isDisabled ? (
              <Eye size={13} />
            ) : (
              <EyeOff size={13} />
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteReview(review.id)}
            disabled={deletingId === review.id}
            title="Delete Review"
            className="p-2 rounded-sm border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer bg-red-500/10"
          >
            {deletingId === review.id ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReviewTableRow;
