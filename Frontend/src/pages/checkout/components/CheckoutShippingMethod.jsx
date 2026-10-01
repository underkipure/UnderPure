import React from "react";

export const CheckoutShippingMethod = ({
  address,
  selectedShipping = { name: "Standard Courier" },
  shipping = 0,
}) => {
  return (
    <div className="mb-4.5 space-y-2">
      {!address ? (
        <div className="bg-[#f8f8f8] border border-gray-200 rounded-lg py-2.5 px-3 text-center">
          <p className="text-[11px] text-gray-600 font-sans">
            Enter your shipping address to view available shipping methods.
          </p>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-2.5 bg-white flex justify-between items-center">
          <p className="text-[11.5px] text-black font-medium font-sans">
            {selectedShipping.name || "Standard Courier"}
          </p>
          <span className="text-[11.5px] font-semibold text-black font-sans">
            Rs{" "}
            {shipping.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      )}
    </div>
  );
};
