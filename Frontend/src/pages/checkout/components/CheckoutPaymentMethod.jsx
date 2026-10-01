import React from "react";

export const CheckoutPaymentMethod = ({
  checkoutSettings = {},
  handleCheckout,
  isProcessing = false,
}) => {
  const cs = checkoutSettings || {};

  return (
    <div className="mb-4.5 space-y-2">
      <div>
        <h2
          className="text-[12px] font-dala-roman tracking-widest text-black uppercase font-normal mt-4"
        >
          {cs.paymentTitle || "PAYMENT"}
        </h2>
        {/* <p className="text-[10.5px] text-gray-500 font-sans mt-0.5">
          {cs.paymentSubtitle || "All transactions are secure and encrypted."}
        </p> */}
      </div>
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <div className="flex items-center gap-2.5 p-2.5 cursor-pointer bg-white border-b border-gray-200">
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              name="paymentMethod"
              className="w-3.5 h-3.5 accent-[#90134a] opacity-0 absolute"
              defaultChecked
            />
            <div className="w-3.5 h-3.5 rounded-full border-[4px] border-[#90134a] bg-white pointer-events-none"></div>
          </div>
          <p className="text-[11.5px] text-black font-sans font-medium">
            {cs.codTitle || "Cash on Delivery (COD)"}
          </p>
        </div>
        {/* <div className="p-2.5 bg-[#fafafa] flex justify-center border-t border-gray-100">
          <div className="text-center py-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-5.5 h-5.5 text-gray-400 mx-auto mb-1"
            >
              <rect x="3" y="6" width="18" height="12" rx="2" />
              <path d="M3 10h18" />
              <path d="M7 14h.01" />
            </svg>
            <p className="text-[10.5px] text-gray-600 font-sans leading-relaxed max-w-[16rem] mx-auto">
              {cs.codDescription ||
                "You will pay for your order in cash when it is delivered to your address."}
            </p>
          </div>
        </div> */}
      </div>

      <div className="pt-1">
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full bg-black text-white py-2.5 rounded-lg text-[12px] font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer shadow-sm active:scale-[0.99]"
        >
          {isProcessing ? "Processing..." : "Order Now"}
        </button>
      </div>
    </div>
  );
};
