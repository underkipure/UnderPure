import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { fetchSurveys } from "../../../lib/api";
import { toast } from "sonner";
import { ClipboardList, Loader2 } from "lucide-react";

import SurveysHeader from "./components/SurveysHeader";
import SurveysStatsGrid from "./components/SurveysStatsGrid";
import SurveysToolbar from "./components/SurveysToolbar";
import SurveysMobileCards from "./components/SurveysMobileCards";
import SurveysDesktopTable from "./components/SurveysDesktopTable";
import SurveysLoadMore from "./components/SurveysLoadMore";

const PAGE_SIZE = 20;

export default function AdminSurveys() {
  const { token } = useAuthStore();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load when token or debounced search changes
  useEffect(() => {
    if (!token) return;
    setPage(1);
    loadSurveys(1, false);
  }, [token, debouncedSearch]);

  const loadSurveys = async (pageNumber = 1, append = false) => {
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
      if (debouncedSearch) params.search = debouncedSearch;

      const data = await fetchSurveys(token, params);

      if (data && data.surveys !== undefined) {
        if (append) {
          setSurveys((prev) => [...prev, ...data.surveys]);
        } else {
          setSurveys(data.surveys || []);
        }
        setTotalCount(data.total || 0);
        setTotalSubmissions(data.totalSubmissions || data.total || 0);
        setAvgScore(data.avgScore || 0);
        setHasMore(Boolean(data.hasMore));
        setPage(pageNumber);
      } else if (Array.isArray(data)) {
        // Fallback for legacy format
        if (append) {
          setSurveys((prev) => [...prev, ...data]);
        } else {
          setSurveys(data);
        }
        setTotalCount(data.length);
        setTotalSubmissions(data.length);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load surveys:", error);
      toast.error("Failed to load surveys.");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadSurveys(page + 1, true);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <SurveysHeader />

      <SurveysStatsGrid
        totalSubmissions={totalSubmissions}
        avgScore={avgScore}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SurveysToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalMatching={totalCount}
          displayedCount={surveys.length}
        />

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : surveys.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No surveys found.</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View (md:hidden) */}
              <SurveysMobileCards surveys={surveys} />

              {/* Desktop Table View (hidden md:block) */}
              <SurveysDesktopTable surveys={surveys} />

              {/* Load More Button */}
              <SurveysLoadMore
                displayedCount={surveys.length}
                totalCount={totalCount}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
