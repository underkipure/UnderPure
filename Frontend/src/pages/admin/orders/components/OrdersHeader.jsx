import React from "react";

const OrdersHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl mb-2 text-black">Orders</h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Manage and fulfill orders
        </p>
      </div>
    </div>
  );
};

export default OrdersHeader;
