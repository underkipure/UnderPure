import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export default function GuestModal({
  isOpen,
  onClose,
  guestPopupConfig = {}
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-[450px] p-8 md:p-10 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:opacity-70"
          title="Close"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
        <h3 className="text-[20px] font-bold text-[#4a4f5c] mb-6">
          {guestPopupConfig.title || 'Guest User'}
        </h3>
        <p className="text-[14px] text-[#4a4f5c] mb-8 leading-relaxed">
          {guestPopupConfig.subtitle1 || 'Log in to save and access your Lovelist across all your devices.'}
          <br />
          {guestPopupConfig.subtitle2 || 'Keep track of all your favorite items in one place.'}
        </p>
        <Link
          to="/login"
          className="block w-full bg-[#4a4f5c] text-white text-center py-4 text-[13px] font-bold tracking-widest hover:bg-[#33363f] transition-colors"
        >
          {guestPopupConfig.buttonText || 'LOG IN / CREATE ACCOUNT'}
        </Link>
      </div>
    </div>
  );
}
