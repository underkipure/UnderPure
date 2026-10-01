import React from "react";
import { Search, RefreshCw } from "lucide-react";

const OrdersToolbar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  statusCounts,
  handleSync,
  isSyncing,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 border border-black/10 rounded-sm">
      <div className="relative w-full sm:w-80">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="SEARCH ORDERS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-black/10 text-xs uppercase tracking-widest focus:outline-none focus:border-black transition-colors rounded-sm"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-full sm:w-auto justify-center border border-black/10 px-4 py-2.5 text-xs uppercase tracking-widest focus:outline-none hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap disabled:opacity-50 rounded-sm font-semibold"
          title="Sync live status from PostEx"
        >
          <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
          Sync Status
        </button>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto border border-black/10 px-4 py-2.5 text-xs uppercase tracking-widest focus:outline-none focus:border-black bg-white cursor-pointer rounded-sm font-semibold"
        >
          <option value="all">ALL STATUSES ({statusCounts.all})</option>
          <option value="pending">PENDING ({statusCounts.pending})</option>
          <option value="processing">
            PROCESSING ({statusCounts.processing})
          </option>
          <option value="shipped">SHIPPED ({statusCounts.shipped})</option>
          <option value="delivered">
            DELIVERED ({statusCounts.delivered})
          </option>
          <option value="cancelled">
            CANCELLED ({statusCounts.cancelled})
          </option>
        </select>
      </div>
    </div>
  );
};

export default OrdersToolbar;
