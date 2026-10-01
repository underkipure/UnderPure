import React from "react";
import { X } from "lucide-react";
import { AddressFormFields } from "../../../components/shared/address";

export default function AccountAddressModal({
  isOpen,
  onClose,
  d,
  addressForm,
  setAddressForm,
  editingAddressId,
  saveAddress,
}) {
  if (!isOpen) return null;

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-5">
          <h3 className="font-serif text-[18px] uppercase tracking-wider text-black">
            {editingAddressId
              ? d?.addressBook?.editButton || "EDIT ADDRESS"
              : d?.addressBook?.addButton || "ADD ADDRESS"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-6 pb-6">
          <form onSubmit={saveAddress} className="space-y-4">
            <AddressFormFields
              variant="account"
              values={addressForm}
              onChange={handleFieldChange}
            />

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="default-address"
                checked={Boolean(addressForm.is_default)}
                onChange={(e) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    is_default: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-[#d83c84]"
              />
              <label
                htmlFor="default-address"
                className="text-[12px] font-sans text-black cursor-pointer select-none"
              >
                This is my default address
              </label>
            </div>

            <div className="flex justify-end items-center gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="text-[13px] font-sans text-[#d83c84] hover:text-[#b3004d] underline decoration-[#d83c84]/50 hover:decoration-[#b3004d] underline-offset-4 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border border-gray-200 bg-gray-50/50 text-gray-600 px-6 py-2.5 text-[13px] rounded-lg hover:border-gray-300 hover:text-black transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
