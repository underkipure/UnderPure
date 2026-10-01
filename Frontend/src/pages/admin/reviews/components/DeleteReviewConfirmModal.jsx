import React from "react";

const DeleteReviewConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface-2 border border-brand/15 max-w-[380px] w-full p-8 rounded-sm shadow-2xl text-center font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-2xl font-medium text-ivory mb-2">
          Delete Review?
        </h3>
        <p className="text-warm-gray text-xs leading-relaxed mb-6 font-medium">
          This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-[10px] tracking-widest font-bold uppercase text-ivory bg-transparent border border-brand/20 hover:border-brand/50 rounded-sm transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-[10px] tracking-widest font-bold uppercase text-white bg-red-500 hover:bg-red-600 rounded-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReviewConfirmModal;
