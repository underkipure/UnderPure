import React from "react";

const OrdersStatusPillFilter = ({
  statusFilter,
  setStatusFilter,
  statusCounts,
}) => {
  const statuses = [
    "all",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      {statuses.map((st) => (
        <button
          key={st}
          onClick={() => setStatusFilter(st)}
          className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            statusFilter === st
              ? "bg-black text-white font-semibold shadow-xs"
              : "bg-white text-gray-600 border border-black/10 hover:border-black"
          }`}
        >
          <span>{st}</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${
              statusFilter === st
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {statusCounts[st] || 0}
          </span>
        </button>
      ))}
    </div>
  );
};

export default OrdersStatusPillFilter;
