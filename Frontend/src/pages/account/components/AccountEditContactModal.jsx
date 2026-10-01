import React from "react";
import { X } from "lucide-react";

export default function AccountEditContactModal({
  isOpen,
  onClose,
  d,
  profileData,
  setProfileData,
  handleProfileSubmit,
  isUpdating,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-5">
          <h3 className="font-serif text-[18px] uppercase tracking-wider text-black">
            {d?.personalInfo?.title || "EDIT PROFILE"}
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
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 border border-[#b3004d] rounded-lg p-3">
                <label className="block text-[10px] font-sans text-gray-500 mb-1">
                  {d?.personalInfo?.firstNameLabel || "Full name"}
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      name: e.target.value,
                    })
                  }
                  className="w-full text-[13px] font-sans outline-none bg-transparent"
                  placeholder={d?.personalInfo?.firstNameLabel || "Full name"}
                />
              </div>

              <div className="sm:col-span-2 border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                <label className="block text-[10px] font-sans text-gray-500 mb-1">
                  {d?.personalInfo?.emailLabel || "Email"}
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full text-[13px] font-sans outline-none bg-transparent text-gray-600 cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-400 mt-2">
                  This email is used for sign-in and order updates.
                </p>
              </div>

              <div className="sm:col-span-2 border border-gray-200 rounded-lg p-3">
                <label className="block text-[10px] font-sans text-gray-500 mb-1">
                  {d?.personalInfo?.phoneLabel || "Phone"}
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full text-[13px] font-sans outline-none bg-transparent"
                  placeholder={d?.personalInfo?.phoneLabel || "Phone"}
                />
              </div>
            </div>
            <div className="flex justify-end items-center gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="text-[13px] font-sans text-[#d83c84] hover:text-[#b3004d] underline decoration-[#d83c84]/50 hover:decoration-[#b3004d] underline-offset-4 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isUpdating}
                type="submit"
                className="border border-gray-200 bg-gray-50/50 text-gray-600 px-6 py-2.5 text-[13px] rounded-lg hover:border-gray-300 hover:text-black transition-colors disabled:opacity-50 uppercase tracking-widest"
              >
                {isUpdating ? "Saving..." : d?.personalInfo?.buttonText || "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
