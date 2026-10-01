import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import {
  fetchProductReviews,
  submitProductReview,
  voteReview,
} from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";

import ReviewsSummaryHeader from "./components/ReviewsSummaryHeader";
import ReviewsFilterBar from "./components/ReviewsFilterBar";
import ReviewItemCard from "./components/ReviewItemCard";
import WriteReviewModal from "./components/WriteReviewModal";

const ProductReviews = ({ product }) => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, user } = useAuthStore();
  const [votedReviews, setVotedReviews] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(5);

  // Filters State
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState(null);
  const [filterAge, setFilterAge] = useState(null);
  const [filterSizePurchased, setFilterSizePurchased] = useState(null);
  const [filterTrueSize, setFilterTrueSize] = useState(null);

  useEffect(() => {
    if (product && product.id) {
      loadReviews();
    } else {
      setIsLoading(false);
    }
  }, [product]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProductReviews(product.id);
      if (data && data.reviews) {
        setReviewsList(data.reviews);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (payload) => {
    if (!token) {
      toast.error("Please log in to submit a review.");
      return false;
    }

    setIsSubmitting(true);
    try {
      await submitProductReview(token, {
        product_id: product.id,
        ...payload,
      });
      toast.success("Review submitted successfully!");
      setIsFormOpen(false);
      loadReviews();
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (reviewId, type) => {
    if (votedReviews.has(reviewId)) {
      toast.error("You have already voted on this review.");
      return;
    }

    // Optimistic UI update
    setVotedReviews((prev) => new Set(prev).add(reviewId));
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            helpful_votes:
              type === "up"
                ? (Number(r.helpful_votes) || 0) + 1
                : r.helpful_votes,
            unhelpful_votes:
              type === "down"
                ? (Number(r.unhelpful_votes) || 0) + 1
                : r.unhelpful_votes,
          };
        }
        return r;
      })
    );

    try {
      await voteReview(reviewId, type);
    } catch (error) {
      toast.error("Failed to submit vote");
    }
  };

  const reviewsCount = reviewsList.length;
  const avgRating =
    reviewsCount > 0
      ? (
          reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsCount
        ).toFixed(1)
      : "0.0";

  const filteredReviews = reviewsList.filter((r) => {
    const reviewTitle = r.title || "";
    const reviewText = r.comment || "";
    if (
      searchQuery &&
      !reviewTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !reviewText.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (filterRating && r.rating !== filterRating) return false;
    if (filterAge && r.age_range !== filterAge) return false;
    if (filterSizePurchased && r.size_purchased !== filterSizePurchased)
      return false;
    if (filterTrueSize && r.true_size !== filterTrueSize) return false;
    return true;
  });

  const avgSizeRating =
    reviewsCount > 0
      ? reviewsList.reduce((acc, r) => acc + (r.size_rating || 2), 0) /
        reviewsCount
      : 2;
  const sizeSliderPosition = ((avgSizeRating - 1) / 2) * 100;

  return (
    <div className="w-full mt-20 border-t border-gray-200 pt-10 pb-12 bg-[#F3F3F3]">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Top Summary Section */}
        <ReviewsSummaryHeader
          avgRating={avgRating}
          reviewsCount={reviewsCount}
          sizeSliderPosition={sizeSliderPosition}
          token={token}
          setIsFormOpen={setIsFormOpen}
        />

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-6">
          <button
            className={`pb-3 text-[13px] font-bold font-sans transition-colors ${
              activeTab === "reviews"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({reviewsCount})
          </button>
        </div>

        {/* Expandable Filters Section */}
        <ReviewsFilterBar
          isFiltersOpen={isFiltersOpen}
          setIsFiltersOpen={setIsFiltersOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterRating={filterRating}
          setFilterRating={setFilterRating}
          filterAge={filterAge}
          setFilterAge={setFilterAge}
          filterSizePurchased={filterSizePurchased}
          setFilterSizePurchased={setFilterSizePurchased}
          filterTrueSize={filterTrueSize}
          setFilterTrueSize={setFilterTrueSize}
        />

        {/* Review List */}
        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader className="w-8 h-8 animate-spin text-black" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-20 text-center text-[14px] font-sans text-gray-500">
            {reviewsList.length === 0
              ? "No reviews yet. Be the first to write a review!"
              : "No reviews match your filters."}
          </div>
        ) : (
          <div className="flex flex-col w-full pb-12 pt-4">
            {filteredReviews.slice(0, visibleCount).map((review, idx) => (
              <ReviewItemCard
                key={review.id || idx}
                review={review}
                votedReviews={votedReviews}
                handleVote={handleVote}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredReviews.length && (
          <div className="text-center mt-12 mb-20 border-t border-gray-200 pt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="border border-black text-black px-12 py-3.5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-black hover:text-white transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      <WriteReviewModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        user={user}
      />
    </div>
  );
};

export default ProductReviews;
