import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../../store/authStore";
import {
  fetchAdminReviews,
  toggleReviewStatus,
  deleteAdminReview,
} from "../../../lib/api";
import { toast } from "sonner";
import { Loader2, MessageSquare } from "lucide-react";

import ReviewsStatsHeader from "./components/ReviewsStatsHeader";
import ReviewsToolbar from "./components/ReviewsToolbar";
import ReviewMobileCard from "./components/ReviewMobileCard";
import ReviewsDesktopTable from "./components/ReviewsDesktopTable";
import DeleteReviewConfirmModal from "./components/DeleteReviewConfirmModal";
import ReviewsPagination from "./components/ReviewsPagination";

export default function AdminReviews() {
  const { token } = useAuthStore();
  const PAGE_SIZE = 20;
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'service', 'product', 'disabled'
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadReviews = useCallback(
    async (pageNumber = 1, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = {
          page: pageNumber,
          limit: PAGE_SIZE,
        };
        if (activeTab && activeTab !== "all") params.tab = activeTab;
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

        const data = await fetchAdminReviews(token, params);
        const list = data?.reviews
          ? data.reviews
          : Array.isArray(data)
          ? data
          : [];
        const total = data?.total ?? list.length;
        const more = data?.hasMore ?? false;

        if (append) {
          setReviews((prev) => [...prev, ...list]);
        } else {
          setReviews(list);
        }
        setTotalCount(total);
        setHasMore(more);
        setPage(pageNumber);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load reviews.");
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [token, activeTab, debouncedSearch]
  );

  useEffect(() => {
    loadReviews(1, false);
  }, [loadReviews]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadReviews(page + 1, true);
    }
  };

  const handleToggleStatus = async (review) => {
    setTogglingId(review.id);
    try {
      const res = await toggleReviewStatus(token, review.id);
      toast.success(res.message || "Review status updated.");
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id ? { ...r, is_disabled: res.is_disabled } : r
        )
      );
    } catch (error) {
      toast.error(error.message || "Failed to update review status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteReview = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteConfirm(true);
  };

  const executeDeleteReview = async () => {
    if (!reviewToDelete) return;
    const reviewId = reviewToDelete;
    setReviewToDelete(null);
    setShowDeleteConfirm(false);
    setDeletingId(reviewId);
    try {
      await deleteAdminReview(token, reviewId);
      toast.success("Review deleted successfully.");
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error(error.message || "Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  // Stats computation
  const disabledCount = reviews.filter(
    (r) => Number(r.is_disabled) === 1
  ).length;
  const activeCount = reviews.length - disabledCount;
  const serviceCount = reviews.filter((r) => !r.product_id).length;
  const productCount = reviews.length - serviceCount;

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto px-1 sm:px-0">
      {/* Page Header & Stats Section */}
      <ReviewsStatsHeader
        totalCount={totalCount}
        activeCount={activeCount}
        disabledCount={disabledCount}
        productCount={productCount}
        serviceCount={serviceCount}
      />

      {/* Controls & Filters Bar */}
      <ReviewsToolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalCount={totalCount}
        serviceCount={serviceCount}
        productCount={productCount}
        disabledCount={disabledCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Reviews View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-1 border border-brand/10 rounded-sm">
          <Loader2 size={32} className="animate-spin text-brand mb-4" />
          <p className="text-xs uppercase tracking-widest text-warm-gray font-bold">
            Loading reviews list...
          </p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-20 text-center bg-surface-1 border border-brand/10 rounded-sm">
          <MessageSquare
            size={48}
            className="mx-auto text-warm-gray/40 mb-4"
          />
          <p className="text-ivory font-medium text-sm font-serif">
            No reviews found
          </p>
          <p className="text-xs text-warm-gray mt-1 font-sans">
            Try clearing search parameters or selected filters.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (md:hidden) */}
          <div className="md:hidden space-y-4">
            {reviews.map((review) => (
              <ReviewMobileCard
                key={review.id}
                review={review}
                handleToggleStatus={handleToggleStatus}
                handleDeleteReview={handleDeleteReview}
                togglingId={togglingId}
                deletingId={deletingId}
              />
            ))}
          </div>

          {/* Desktop Table View (hidden md:block) */}
          <ReviewsDesktopTable
            reviews={reviews}
            handleToggleStatus={handleToggleStatus}
            handleDeleteReview={handleDeleteReview}
            togglingId={togglingId}
            deletingId={deletingId}
          />

          {/* Server-Side Load More Section */}
          <ReviewsPagination
            reviewsCount={reviews.length}
            totalCount={totalCount}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            handleLoadMore={handleLoadMore}
          />
        </>
      )}

      {/* Custom Deletion Confirmation Modal */}
      <DeleteReviewConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setReviewToDelete(null);
        }}
        onConfirm={executeDeleteReview}
      />
    </div>
  );
}
