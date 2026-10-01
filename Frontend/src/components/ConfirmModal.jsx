import React from 'react';

export default function ConfirmModal({ title = 'Confirm Action', message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200" onClick={onCancel}>
      <div className="bg-white border-2 border-black max-w-sm w-full p-6 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-xl mb-3 text-black">{title}</h3>
        <p className="text-sm font-sans text-gray-600 mb-8 leading-relaxed">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onCancel} 
            className="px-5 py-2.5 text-xs uppercase tracking-widest border border-black/20 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className="px-5 py-2.5 text-xs uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
