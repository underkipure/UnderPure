import React from 'react';

const CheckoutHeader = ({ handleSave, isSaving }) => {
  return (
    <div className="flex justify-between items-end border-b border-black/10 pb-4">
      <div>
        <h2 className="font-serif text-2xl mb-1">Checkout Page Customization</h2>
        <p className="text-xs text-gray-500">Dynamically control all checkout texts, fees, policies, and popup dialogs.</p>
      </div>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="bg-black text-white px-6 py-2.5 text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-sm font-medium cursor-pointer"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default CheckoutHeader;
