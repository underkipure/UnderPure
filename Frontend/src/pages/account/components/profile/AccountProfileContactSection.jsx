import React from "react";
import AccountEditContactModal from "../AccountEditContactModal";
import { formatAddressSummary } from "../../utils/accountProfileHelpers";

export default function AccountProfileContactSection({
  d,
  user,
  profileData,
  setProfileData,
  isEditingContact,
  setIsEditingContact,
  handleProfileSubmit,
  isUpdating,
  addresses,
  setAddressForm,
  setEditingAddressId,
  setShowAddressForm,
}) {
  const defaultAddress = addresses?.length > 0
    ? (addresses.find((a) => a.is_default) || addresses[0])
    : null;

  return (
    <div className="w-full md:w-[80%]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-[15px] sm:text-[16px] uppercase tracking-wider text-black">
          {d?.personalInfo?.title || "CONTACT"}
        </h2>
        <button
          onClick={() => setIsEditingContact(true)}
          className="text-[11px] font-sans border border-gray-300 px-2 py-2 hover:border-black transition-colors rounded-lg text-gray-700 bg-white shadow-sm"
        >
          Edit
        </button>
      </div>

      <AccountEditContactModal
        isOpen={isEditingContact}
        onClose={() => setIsEditingContact(false)}
        d={d}
        profileData={profileData}
        setProfileData={setProfileData}
        handleProfileSubmit={handleProfileSubmit}
        isUpdating={isUpdating}
      />

      <div className="border border-gray-200 rounded-xl p-3 flex justify-between items-center">
        <span className="text-[12px] font-sans text-gray-500">Email</span>
        <span className="text-[12px] font-sans text-black">
          {user?.email || ""}
        </span>
      </div>

      <div className="border border-gray-200 rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3">
        <span className="text-[12px] font-sans text-gray-500">
          Saved Address
        </span>
        <span className="text-[12px] font-sans text-black mt-1 sm:mt-0 text-right">
          {defaultAddress ? (
            formatAddressSummary(defaultAddress)
          ) : (
            <button
              type="button"
              onClick={() => {
                setAddressForm({
                  full_name: "",
                  phone: "",
                  address_line1: "",
                  address_line2: "",
                  city: "",
                  state: "",
                  zip: "",
                  country: "Pakistan",
                  is_default: false,
                });
                setEditingAddressId(null);
                setShowAddressForm(true);
              }}
              className="text-[#d83c84] underline hover:opacity-80"
            >
              Add address
            </button>
          )}
        </span>
      </div>
    </div>
  );
}
