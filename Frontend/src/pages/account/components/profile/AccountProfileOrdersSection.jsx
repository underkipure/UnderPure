import React from "react";
import { RotateCcw } from "lucide-react";
import { getOrderStatusBadgeClass } from "../../utils/accountProfileHelpers";

export default function AccountProfileOrdersSection({
  d,
  orders,
  ordersLoading,
  setActiveTab,
  navigate,
}) {
  return (
    <div className="w-full md:w-[80%]">
      <h2 className="font-serif text-[15px] sm:text-[16px] uppercase tracking-wider text-black mb-2">
        {d?.navigation?.tab2 || "YOUR RECENT ORDERS"}
      </h2>
      <div className="border border-gray-200 rounded-xl overflow-hidden w-full">
        {ordersLoading ? (
          <div className="p-8 flex justify-center text-gray-400">
            <RotateCcw className="animate-spin w-5 h-5" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-3">
            <span className="text-[12px] font-sans text-gray-400">
              You haven't placed any orders yet.
            </span>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-4 py-3.5"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-sans text-black font-semibold">
                    #{order.id}
                  </span>
                  <span className="text-[11px] font-sans text-gray-400">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${getOrderStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {order.status || "pending"}
                  </span>
                  <span className="text-[13px] font-sans text-black font-medium">
                    Rs. {parseFloat(order.total).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {orders.length > 0 && (
        <button
          onClick={() => {
            setActiveTab("orders");
            navigate("/account?tab=orders");
          }}
          className="mt-2 text-[11px] font-sans text-black underline underline-offset-2 hover:opacity-60 tracking-wide"
        >
          View all orders →
        </button>
      )}
    </div>
  );
}
