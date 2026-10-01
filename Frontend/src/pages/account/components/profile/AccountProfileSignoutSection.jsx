import React, { useState } from "react";
import ConfirmModal from "../../../../components/ConfirmModal";

export default function AccountProfileSignoutSection({ d, logout, logoutAll }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  const handleSignout = () => {
    logout();
    window.location.href = "/login";
  };

  const handleSignoutAll = async () => {
    try {
      setIsLoggingOutAll(true);
      if (logoutAll) {
        await logoutAll();
      } else {
        logout();
      }
    } finally {
      setIsLoggingOutAll(false);
      setShowConfirm(false);
      window.location.href = "/login";
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-3 mt-4 pt-8 pb-2 w-full md:w-[80%]">
        <button
          onClick={handleSignout}
          className="w-full sm:w-auto border border-gray-200 px-3 py-3 text-[12px] sm:text-[12px] font-sans hover:border-black transition-colors rounded-xl sm:rounded-lg text-black tracking-[0.0001em] text-center"
        >
          {d?.logout?.button1 || "Sign out"}
        </button>
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={isLoggingOutAll}
          className="w-full sm:w-auto text-[12px] sm:text-[12px] font-sans text-[#b3004d] hover:text-black transition-colors text-center disabled:opacity-50"
        >
          <span className="tracking-[0.0001em]">
            {isLoggingOutAll ? "Signing out of all devices..." : (d?.logout?.button2 || "Sign out of all devices")}
          </span>
        </button>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Sign Out Everywhere"
          message="Are you sure you want to sign out of all devices? This will immediately terminate your active sessions on all phones, tablets, and computers."
          confirmText={isLoggingOutAll ? "Signing out..." : "Sign Out Everywhere"}
          cancelText="Cancel"
          onConfirm={handleSignoutAll}
          onCancel={() => !isLoggingOutAll && setShowConfirm(false)}
        />
      )}
    </>
  );
}
