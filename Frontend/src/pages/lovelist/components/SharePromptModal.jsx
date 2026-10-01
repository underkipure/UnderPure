import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export default function SharePromptModal({
  isOpen,
  onClose,
  sharePopupConfig = {}
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
        <h3 className="text-[18px] font-bold text-[#4a4f5c] mb-6">
          {sharePopupConfig.title || 'Share Your Lovelist'}
        </h3>
        <p className="text-[14px] text-[#4a4f5c] mb-4">
          {sharePopupConfig.subtitle1 || 'Please log in to your account to share your Lovelist with friends and family.'}
        </p>
        <p className="text-[14px] text-black font-medium mb-8">
          {sharePopupConfig.subtitle2 || 'Create an account to start sharing now.'}
        </p>
        <Link
          to="/login"
          className="block w-full bg-[#4a4f5c] text-white text-center py-4 text-[13px] font-bold tracking-widest hover:bg-[#33363f] transition-colors uppercase"
        >
          {sharePopupConfig.buttonText || 'LOG IN TO SHARE'}
        </Link>
      </div>
    </div>
  );
}
