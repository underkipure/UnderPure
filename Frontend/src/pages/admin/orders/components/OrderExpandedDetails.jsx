import React from "react";
import { fmt } from "../utils/orderHelpers";
import { optimizeImage } from "../../../../lib/productUtils";

const OrderExpandedDetails = ({ order }) => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-l-4 border-black">
      {/* Customer Details */}
      <div>
        <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3 border-b border-gray-200 pb-2">
          Customer & Shipping Details
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Name:</span>
            <span className="font-medium text-black">
              {order.shipping_name || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email:</span>
            <span className="font-medium text-black">
              {order.shipping_email ||
                order.user_email ||
                order.email ||
                "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phone:</span>
            <span className="font-medium text-black">
              {order.shipping_phone || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Address:</span>
            <span
              className="font-medium text-black text-right max-w-[200px] truncate"
              title={order.shipping_address}
            >
              {order.shipping_address || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">City:</span>
            <span className="font-medium text-black">
              {order.shipping_city || "N/A"} {order.shipping_zip || ""}
            </span>
          </div>
          {order.tracking_number && (
            <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
              <span className="text-gray-500">Tracking #:</span>
              <span className="font-medium text-black">
                {order.tracking_number}
              </span>
            </div>
          )}
          {order.courier_status && (
            <div className="flex justify-between">
              <span className="text-gray-500">Courier Status:</span>
              <span
                className="font-medium text-blue-600 truncate max-w-[200px]"
                title={order.courier_status}
              >
                {order.courier_status}
              </span>
            </div>
          )}
          {order.gift_note && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-sm">
              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-900 mb-1 flex items-center gap-1.5">
                <span>🎁 Gift Note</span>
              </div>
              <p className="text-[13px] text-amber-950 font-serif italic leading-relaxed whitespace-pre-wrap">
                "{order.gift_note}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3 border-b border-gray-200 pb-2">
          Order Items
        </h4>
        <div className="space-y-3">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center gap-3">
                  {item.image_url ? (
                    <img
                      loading="lazy"
                      src={optimizeImage(item.image_url, 150)}
                      alt={item.product_name}
                      className="w-10 h-10 object-cover bg-gray-100 rounded-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-sm text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-black">
                      {item.product_name || "Unknown Item"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {item.color && <span>{item.color}</span>}
                      {item.color && item.size && <span> | </span>}
                      {item.size && <span>{item.size}</span>}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-black">
                    {item.quantity} x Rs. {fmt(item.price)}
                  </p>
                  <p className="text-[11px] text-gray-500 font-semibold">
                    Rs. {fmt((item.quantity || 1) * (item.price || 0))}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">
              No items found for this order.
            </p>
          )}

          <div className="pt-3 mt-3 border-t border-gray-100">
            {order.points_used > 0 && (
              <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                <span>Points Redeemed</span>
                <span>{order.points_used} UP Points</span>
              </div>
            )}
            {order.promo_code && (
              <div className="flex justify-between text-[11px] text-green-600 mb-1">
                <span>Offers Applied</span>
                <span className="font-semibold uppercase">
                  {order.promo_code
                    .split("+")
                    .map((p) => p.trim())
                    .join(", ")}
                </span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-[11px] text-[#90134a] mb-1">
                <span>Total Discount</span>
                <span>- Rs. {fmt(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-black mt-2">
              <span>Total</span>
              <span>Rs. {fmt(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderExpandedDetails;
