import React from "react";
import { OrderItemRow, OrderPricingBreakdown } from "../../../components/shared/orders";

export default function AccountOrderDetailModal({
  selectedOrder,
  setSelectedOrder,
  trackingInfo,
  trackingLoading,
}) {
  if (!selectedOrder) return null;

  const orderItems = selectedOrder.items || [];
  const subtotal = orderItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"
      onClick={() => setSelectedOrder(null)}
    >
      <div
        className="bg-white max-w-2xl w-full max-h-[90vh] relative flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onPointerDown={() => setSelectedOrder(null)}
          onClick={() => setSelectedOrder(null)}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-black transition-colors z-50 bg-white/80 rounded-full p-1 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          <div className="mb-6 sm:mb-8">
            <h3 className="font-serif text-[22px] sm:text-2xl uppercase tracking-widest mb-1 text-black">
              Order <span className="text-gray-300">#</span>{selectedOrder.id}
            </h3>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Placed on{" "}
              {new Date(selectedOrder.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 sm:mb-3">
                Shipping Details
              </h4>
              <div className="text-[13px] sm:text-sm space-y-1">
                <p className="font-bold text-black tracking-wide">
                  {selectedOrder.shipping_name}
                </p>
                <p className="text-gray-500 tracking-wide">
                  {selectedOrder.shipping_address}
                </p>
                <p className="text-gray-500 tracking-wide">
                  {selectedOrder.shipping_city}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 sm:mb-3">
                Order Status
              </h4>
              <div className="text-[13px] sm:text-sm space-y-2.5">
                <p className="capitalize flex items-center">
                  <span className="font-bold text-black tracking-wide mr-3 w-[70px]">
                    Status:
                  </span>
                  <span
                    className={`inline-block px-2.5 py-1 text-[9px] uppercase tracking-widest ${
                      selectedOrder.status === "delivered"
                        ? "bg-green-50 text-green-700"
                        : selectedOrder.status === "cancelled"
                          ? "bg-red-50 text-red-600"
                          : selectedOrder.status === "processing"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-100 text-black"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </p>
                <p className="flex items-center">
                  <span className="font-bold text-black tracking-wide mr-3 w-[70px]">
                    Payment:
                  </span>{" "}
                  <span className="text-gray-600">Cash on Delivery</span>
                </p>
                {selectedOrder.tracking_number && (
                  <p>
                    <span className="font-bold mr-2">Tracking:</span>{" "}
                    {selectedOrder.tracking_number}
                  </p>
                )}
                {selectedOrder.courier_status && (
                  <p>
                    <span className="font-bold mr-2">Courier Status:</span>{" "}
                    {selectedOrder.courier_status}
                  </p>
                )}
              </div>
              {trackingLoading && (
                <p className="text-gray-400 mt-2 text-xs italic">
                  Loading live tracking...
                </p>
              )}
            </div>
          </div>

          {trackingInfo &&
            trackingInfo.history &&
            trackingInfo.history.length > 0 && (
              <div className="mb-8">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 border-b border-black/10 pb-2">
                  Tracking History
                </h4>
                <div className="space-y-4">
                  {trackingInfo.history.map((event, idx) => (
                    <div key={idx} className="flex gap-4 items-start text-sm">
                      <div className="w-24 shrink-0 text-gray-500 text-xs mt-0.5">
                        {event.date
                          ? new Date(event.date).toLocaleDateString() +
                            " " +
                            new Date(event.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </div>
                      <div>
                        <p className="font-bold">{event.status}</p>
                        <p className="text-gray-600 text-xs">{event.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Ordered Items using shared OrderItemRow */}
          <div className="mb-8">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 border-b border-black/10 pb-2">
              Items Ordered
            </h4>
            <div className="space-y-4">
              {orderItems.map((item, idx) => (
                <OrderItemRow
                  key={idx}
                  item={item}
                  variant="modal"
                />
              ))}
            </div>
          </div>

          {selectedOrder.gift_note && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm my-4">
              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-900 mb-1">
                Gift Note
              </div>
              <p className="text-xs text-amber-950 font-serif italic whitespace-pre-wrap">
                "{selectedOrder.gift_note}"
              </p>
            </div>
          )}

          {/* Pricing Breakdown using shared OrderPricingBreakdown */}
          <OrderPricingBreakdown
            subtotal={subtotal}
            shipping={parseFloat(selectedOrder.shipping_fee) || 0}
            customDiscount={parseFloat(selectedOrder.discount) || 0}
            customDiscountLabel={selectedOrder.applied_coupon}
            total={parseFloat(selectedOrder.total) || 0}
            variant="modal"
          />
        </div>
      </div>
    </div>
  );
}
