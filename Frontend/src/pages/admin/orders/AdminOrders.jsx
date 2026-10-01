import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import {
  fetchOrders,
  acceptOrder,
  cancelOrder,
  syncPostExOrders,
} from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "sonner";

import OrdersHeader from "./components/OrdersHeader";
import OrdersToolbar from "./components/OrdersToolbar";
import OrdersStatusPillFilter from "./components/OrdersStatusPillFilter";
import OrderMobileCard from "./components/OrderMobileCard";
import OrdersDesktopTable from "./components/OrdersDesktopTable";
import OrdersPagination from "./components/OrdersPagination";

export default function AdminOrders() {
  const { token } = useAuthStore();
  const PAGE_SIZE = 20;
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actioningId, setActioningId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadOrders = useCallback(
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
        if (statusFilter && statusFilter !== "all")
          params.status = statusFilter;
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

        const data = await fetchOrders(token, params);
        const orderList = Array.isArray(data) ? data : data?.orders ?? [];
        const total = data?.total ?? orderList.length;
        const more = data?.hasMore ?? false;

        if (append) {
          setOrders((prev) => [...prev, ...orderList]);
        } else {
          setOrders(orderList);
        }
        setTotalCount(total);
        setHasMore(more);
        setPage(pageNumber);

        if (data?.statusCounts) {
          setStatusCounts((prev) => ({
            ...prev,
            ...data.statusCounts,
          }));
        }
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [token, statusFilter, debouncedSearch]
  );

  useEffect(() => {
    loadOrders(1, false);
  }, [loadOrders]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadOrders(page + 1, true);
    }
  };

  const handleAccept = async (id) => {
    setActioningId(id);
    try {
      await acceptOrder(token, id);
      toast.success("Order accepted/processing");
      loadOrders(1, false);
    } catch (error) {
      toast.error(error.message || "Failed to accept order");
    } finally {
      setActioningId(null);
    }
  };

  const handleCancel = async (id) => {
    setActioningId(id);
    try {
      await cancelOrder(token, id);
      toast.success("Order cancelled");
      loadOrders(1, false);
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setActioningId(null);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await syncPostExOrders(token);
      toast.success(res.message || "Synced successfully");
      loadOrders(1, false);
    } catch (error) {
      toast.error(error.message || "Failed to sync with PostEx");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <OrdersHeader />

      {/* Toolbar */}
      <OrdersToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusCounts={statusCounts}
        handleSync={handleSync}
        isSyncing={isSyncing}
      />

      {/* Quick Status Pill Filter Bar */}
      <OrdersStatusPillFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusCounts={statusCounts}
      />

      {/* Orders View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-black/10">
          <Loader2 size={32} className="animate-spin text-black mb-4" />
          <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
            Loading orders...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-8 text-center bg-white border border-black/10 text-gray-400 italic">
          No orders found.
        </div>
      ) : (
        <>
          {/* Mobile Cards View (md:hidden) */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <OrderMobileCard
                key={order.id}
                order={order}
                isExpanded={expandedOrderId === order.id}
                toggleExpand={toggleExpand}
                handleAccept={handleAccept}
                handleCancel={handleCancel}
                actioningId={actioningId}
              />
            ))}
          </div>

          {/* Desktop Table View (hidden md:block) */}
          <OrdersDesktopTable
            orders={orders}
            expandedOrderId={expandedOrderId}
            toggleExpand={toggleExpand}
            handleAccept={handleAccept}
            handleCancel={handleCancel}
            actioningId={actioningId}
          />

          {/* Server-Side Load More Section */}
          <OrdersPagination
            ordersCount={orders.length}
            totalCount={totalCount}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            handleLoadMore={handleLoadMore}
          />
        </>
      )}
    </div>
  );
}
