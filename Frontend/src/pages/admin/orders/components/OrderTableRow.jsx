import React from "react";
import { Eye, Truck, Check } from "lucide-react";
import { fmt, getStatusBadgeStyle } from "../utils/orderHelpers";
import OrderExpandedDetails from "./OrderExpandedDetails";

const OrderTableRow = ({
  order,
  isExpanded,
  toggleExpand,
  handleAccept,
  handleCancel,
  actioningId,
}) => {
  return (
    <React.Fragment>
      <tr
        onClick={() => toggleExpand(order.id)}
        className={`border-b border-black/5 hover:bg-gray-50/50 transition-colors group cursor-pointer ${
          isExpanded ? "bg-gray-50/50" : ""
        }`}
      >
        <td className="p-4 font-serif text-base font-semibold">#{order.id}</td>
        <td className="p-4">
          <div>
            <div className="font-medium text-black">
              {order.shipping_name || "Guest"}
            </div>
            <div className="text-xs text-gray-500">
              {order.user_email || order.email || ""}
            </div>
          </div>
        </td>
        <td className="p-4 text-gray-500">
          {order.created_at
            ? new Date(order.created_at).toLocaleDateString()
            : ""}
        </td>
        <td className="p-4 text-right font-medium">Rs. {fmt(order.total)}</td>
        <td className="p-4 text-center">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] uppercase tracking-widest border ${getStatusBadgeStyle(
              order.status
            )}`}
          >
            {order.status === "shipped" && <Truck size={10} />}
            {order.status === "delivered" && <Check size={10} />}
            {order.status}
          </span>
        </td>
        <td className="p-4 text-right">
          {order.items?.length || order.items_count || 0} items
        </td>
        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end gap-2">
            {order.status === "pending" && (
              <>
                <button
                  onClick={() => handleAccept(order.id)}
                  disabled={actioningId === order.id}
                  className="border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 text-[10px] uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
                  title="Accept/Process Order"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleCancel(order.id)}
                  disabled={actioningId === order.id}
                  className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 text-[10px] uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
                  title="Cancel Order"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(order.id);
              }}
              className="text-gray-400 hover:text-black transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
          </div>
        </td>
      </tr>
      {/* Expanded Details Row */}
      {isExpanded && (
        <tr className="border-b border-black/10 bg-gray-50/30">
          <td colSpan="7" className="p-0">
            <OrderExpandedDetails order={order} />
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default OrderTableRow;
