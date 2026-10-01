import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { fetchReturnRequests, updateReturnStatus } from '../../../lib/api';

import ReturnsHeader from './components/ReturnsHeader';
import ReturnsToolbar from './components/ReturnsToolbar';
import ReturnsMobileCards from './components/ReturnsMobileCards';
import ReturnsDesktopTable from './components/ReturnsDesktopTable';
import ReturnsLoadMore from './components/ReturnsLoadMore';

export default function AdminReturns() {
  const { token } = useAuthStore();
  const PAGE_SIZE = 20;
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actioningId, setActioningId] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadRequests = useCallback(
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
        if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

        const data = await fetchReturnRequests(token, params);
        const list = data?.requests ? data.requests : Array.isArray(data) ? data : [];
        const total = data?.total ?? list.length;
        const more = data?.hasMore ?? false;

        if (append) {
          setRequests((prev) => [...prev, ...list]);
        } else {
          setRequests(list);
        }
        setTotalCount(total);
        setHasMore(more);
        setPage(pageNumber);
      } catch (e) {
        toast.error('Failed to load return requests');
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [token, statusFilter, debouncedSearch]
  );

  useEffect(() => {
    loadRequests(1, false);
  }, [loadRequests]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadRequests(page + 1, true);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setActioningId(id);
    try {
      const data = await updateReturnStatus(token, id, status);
      if (data?.success) {
        toast.success(`Request marked as ${status}`);
        loadRequests(1, false);
      } else {
        toast.error(data?.error || 'Failed to update status');
      }
    } catch (e) {
      toast.error('An error occurred');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ReturnsHeader onRefresh={() => loadRequests(1, false)} loading={loading} />

      {/* Toolbar */}
      <ReturnsToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="bg-white border border-black/10 overflow-hidden">
        {loading && requests.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="animate-spin text-black" />
            <span className="text-xs uppercase tracking-widest">
              Loading requests from server...
            </span>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No return requests found.</div>
        ) : (
          <>
            {/* Mobile Card View (md:hidden) */}
            <ReturnsMobileCards
              requests={requests}
              actioningId={actioningId}
              onUpdateStatus={handleUpdateStatus}
            />

            {/* Desktop Table View (hidden md:block) */}
            <ReturnsDesktopTable
              requests={requests}
              actioningId={actioningId}
              onUpdateStatus={handleUpdateStatus}
            />

            {/* Server-Side Load More Section */}
            <ReturnsLoadMore
              currentCount={requests.length}
              totalCount={totalCount}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
            />
          </>
        )}
      </div>
    </div>
  );
}
