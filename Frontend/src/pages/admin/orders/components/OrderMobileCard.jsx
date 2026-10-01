import React from "react";
import { Eye, Truck, Check } from "lucide-react";
import { fmt, getStatusBadgeStyle } from "../utils/orderHelpers";
import OrderExpandedDetails from "./OrderExpandedDetails";

const OrderMobileCard = ({
  order,
  isExpanded,
  toggleExpand,
  handleAccept,
  handleCancel,
  actioningId,
}) => {
  return (
    <div className="bg-white border border-black/10 p-4 space-y-3 rounded-sm shadow-2xs">
      {/* Top Bar */}
      <div className="flex justify-between items-center border-b border-black/10 pb-2.5">
        <span className="font-serif text-lg font-bold text-black">
          #{order.id}
        </span>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase tracking-widest border font-bold ${getStatusBadgeStyle(
            order.status
          )}`}
        >
          {order.status === "shipped" && <Truck size={10} />}
          {order.status === "delivered" && <Check size={10} />}
          {order.status}
        </span>
      </div>

      {/* Customer Info */}
      <div>
        <div className="font-semibold text-black text-sm">
          {order.shipping_name || "Guest"}
        </div>
        <div className="text-xs text-gray-500">
          {order.user_email || order.email || ""}
        </div>
      </div>

      {/* 2-Column Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-sm border border-black/5">
        <div>
          <span className="text-gray-400 block text-[9px] uppercase tracking-widest">
            Date
          </span>
          <span className="text-gray-700 font-medium">
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div>
          <span className="text-gray-400 block text-[9px] uppercase tracking-widest">
            Items
          </span>
          <span className="text-gray-700 font-medium">
            {order.items?.length || order.items_count || 0} items
          </span>
        </div>
        <div className="col-span-2 pt-1 border-t border-gray-200/60 flex justify-between items-center">
          <span className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold">
            Total Amount
          </span>
          <span className="font-serif text-base font-bold text-black">
            Rs. {fmt(order.total)}
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex gap-2 flex-1">
          {order.status === "pending" && (
            <>
              <button
                onClick={() => handleAccept(order.id)}
                disabled={actioningId === order.id}
                className="flex-1 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 py-1.5 text-[10px] uppercase tracking-widest font-bold text-center transition-colors disabled:opacity-50"
              >
                Accept
              </button>
              <button
                onClick={() => handleCancel(order.id)}
                disabled={actioningId === order.id}
                className="flex-1 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 py-1.5 text-[10px] uppercase tracking-widest font-bold text-center transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}
        </div>
        <button
          onClick={() => toggleExpand(order.id)}
          className="border border-black/20 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 hover:bg-black hover:text-white transition-colors"
        >
          <Eye size={13} /> {isExpanded ? "Hide" : "Details"}
        </button>
      </div>

      {/* Expanded Mobile Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-black/10">
          <OrderExpandedDetails order={order} />
        </div>
      )}
    </div>
  );
};

export default OrderMobileCard;
