import React from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function PublishSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-black max-w-md w-full p-8 shadow-2xl relative animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors p-1 cursor-pointer"
          title="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-md">
            <CheckCircle size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-black tracking-wide">Changes Published</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
              UnderPure Live Sync
            </p>
          </div>
        </div>

        <p className="text-sm font-sans text-gray-600 mb-6 leading-relaxed">
          All content changes have been published successfully across your store. Your updates are
          now live and synchronized for all customers.
        </p>

        <div className="bg-gray-50 border border-black/10 p-3.5 mb-7 text-xs text-gray-600 flex items-center justify-between">
          <span className="font-mono text-[11px] text-gray-500">PAYLOAD STATUS</span>
          <span className="text-green-600 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Synced to Console
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-black text-white py-3.5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-gray-800 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          Continue Editing
        </button>
      </div>
    </div>
  );
}
