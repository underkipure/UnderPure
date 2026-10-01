import React from "react";
import { AddressFormFields } from "../../../components/shared/address";

export const CheckoutDeliveryForm = ({
  formData,
  handleInputChange,
  setPopupContent,
  isMobile = false,
}) => {
  return (
    <div className={isMobile ? "space-y-3.5" : "mb-4.5 space-y-2"}>
      <div className="space-y-2">
        <h2
          className={`${
            isMobile ? "text-[13px]" : "text-[12px]"
          } font-dala-roman tracking-widest text-black uppercase font-normal`}
        >
          DELIVERY
        </h2>

        <AddressFormFields
          variant="checkout"
          values={formData}
          onChange={handleInputChange}
          isMobile={isMobile}
        />
      </div>

      {/* Save Information Notice on Mobile */}
      {isMobile && (
        <div className="space-y-1.5 pt-0.5">
          <h3 className="text-[12px] text-gray-900 font-medium font-sans">
            Save my information for a faster checkout
          </h3>
          <p className="text-[10.5px] text-gray-500 leading-relaxed font-sans pt-0.5">
            By providing your phone number, you agree to create a Shop account subject to Shop&apos;s{" "}
            <button
              type="button"
              onClick={() => setPopupContent && setPopupContent("terms")}
              className="underline hover:text-black cursor-pointer"
            >
              Terms
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => setPopupContent && setPopupContent("privacy")}
              className="underline hover:text-black cursor-pointer"
            >
              Privacy Policy
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
};
