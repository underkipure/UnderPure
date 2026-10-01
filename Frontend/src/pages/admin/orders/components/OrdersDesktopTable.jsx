import React from "react";
import OrderTableRow from "./OrderTableRow";

const OrdersDesktopTable = ({
  orders,
  expandedOrderId,
  toggleExpand,
  handleAccept,
  handleCancel,
  actioningId,
}) => {
  return (
    <div className="hidden md:block bg-white border border-black/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[900px]">
          <thead>
            <tr className="border-b border-black/10 text-[11px] uppercase tracking-[0.15em] text-gray-500 bg-gray-50/50">
              <th className="p-4 font-normal">Order ID</th>
              <th className="p-4 font-normal">Customer</th>
              <th className="p-4 font-normal">Date</th>
              <th className="p-4 font-normal text-right">Total</th>
              <th className="p-4 font-normal text-center">Status</th>
              <th className="p-4 font-normal text-right">Items</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                isExpanded={expandedOrderId === order.id}
                toggleExpand={toggleExpand}
                handleAccept={handleAccept}
                handleCancel={handleCancel}
                actioningId={actioningId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersDesktopTable;
