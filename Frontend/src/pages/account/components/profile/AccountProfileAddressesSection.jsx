import React from "react";
import { MapPin } from "lucide-react";
import AccountAddressModal from "../AccountAddressModal";

export default function AccountProfileAddressesSection({
  d,
  addresses,
  addressesLoading,
  showAddressForm,
  setShowAddressForm,
  addressForm,
  setAddressForm,
  editingAddressId,
  setEditingAddressId,
  saveAddress,
  deleteAddress,
}) {
  const handleOpenNewAddressModal = () => {
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
  };

  const handleOpenEditAddressModal = (addr) => {
    setAddressForm({
      full_name: addr.full_name,
      phone: addr.phone || "",
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 || "",
      city: addr.city,
      state: addr.state || "",
      zip: addr.zip || "",
      country: addr.country || "Pakistan",
      is_default: addr.is_default == 1,
    });
    setEditingAddressId(addr.id);
    setShowAddressForm(true);
  };

  return (
    <div className="w-full md:w-[80%]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-serif text-[15px] sm:text-[16px] uppercase tracking-[0.0001em] text-black">
          {d?.addressBook?.title || "ADDRESSES"}
        </h2>
        <button
          onClick={handleOpenNewAddressModal}
          className="text-[11px] font-sans border border-gray-200 px-2 py-2 hover:border-black transition-colors rounded-lg text-gray-700 bg-white shadow-sm"
        >
          Add
        </button>
      </div>

      <AccountAddressModal
        isOpen={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        d={d}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        editingAddressId={editingAddressId}
        saveAddress={saveAddress}
      />

      <div className="border border-gray-200 rounded-lg">
        {addressesLoading ? (
          <div className="py-8 text-center">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex items-center gap-3 p-3">
            <MapPin
              className="w-[14px] h-[14px] text-gray-400"
              strokeWidth={1.5}
            />
            <span className="text-[12px] font-sans text-gray-400">
              No addresses added
            </span>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="px-4 py-3.5 flex justify-between items-start"
              >
                <div className="text-[13px] font-sans text-gray-600 space-y-0.5">
                  <p className="text-black font-medium">{addr.full_name}</p>
                  <p>
                    {addr.address_line1}
                    {addr.address_line2 ? `, ${addr.address_line2}` : ""}
                  </p>
                  <p>
                    {addr.city}
                    {addr.state ? `, ${addr.state}` : ""} {addr.zip}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => handleOpenEditAddressModal(addr)}
                    className="text-[11px] text-gray-500 hover:text-black underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-[11px] text-gray-500 hover:text-red-500 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
