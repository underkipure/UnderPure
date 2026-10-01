import React from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

export default function AccountOrdersTab({
  d,
  orders,
  ordersLoading,
  handleViewDetails,
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="font-serif text-[18px] md:text-[20px] uppercase tracking-wider text-black mb-1">
          {d?.navigation?.tab2 || "Order History"}
        </h2>
        <p className="text-[12px] font-sans text-gray-500">
          View and track your recent orders.
        </p>
      </div>

      {ordersLoading ? (
        <div className="py-16 text-center">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Loading orders...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center border border-black/10">
          <Package
            size={32}
            strokeWidth={1}
            className="mx-auto mb-4 text-gray-300"
          />
          <h3 className="font-serif text-xl mb-2">
            {d?.emptyStates?.ordersEmptyTitle || "No orders yet"}
          </h3>
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-6">
            {d?.emptyStates?.ordersEmptySubtitle ||
              "Discover our latest arrivals and find something you love."}
          </p>
          <Link
            to="/collections/new-arrivals"
            className="bg-black text-white px-8 py-3 text-[11px] uppercase tracking-widest hover:bg-gray-800 transition-colors inline-block"
          >
            {d?.emptyStates?.ordersShopButton || "Start Shopping"}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-black/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-black/30 transition-colors"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 flex-1">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Order
                  </p>
                  <p className="text-sm font-semibold">#{order.id}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Date
                  </p>
                  <p className="text-sm">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Total
                  </p>
                  <p className="text-sm">
                    Rs. {parseFloat(order.total).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block px-2.5 py-1 text-[9px] uppercase tracking-widest ${
                      order.status === "delivered"
                        ? "bg-green-50 text-green-700"
                        : order.status === "cancelled"
                          ? "bg-red-50 text-red-600"
                          : order.status === "processing"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-100 text-black"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {order.tracking_number && (
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">
                    Track: {order.tracking_number}
                  </span>
                )}
                <button
                  onClick={() => handleViewDetails(order)}
                  className="border border-black px-6 py-2.5 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors whitespace-nowrap"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
