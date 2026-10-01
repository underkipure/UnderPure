import React from "react";
import { Save } from "lucide-react";

const LoyaltyHeader = ({ handleSaveToBackend }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 bg-white p-4 border border-black/10 sticky top-0 z-10 shadow-sm">
      <div>
        <h2 className="font-serif text-xl">Loyalty Program Settings</h2>
        <p className="text-xs text-gray-500">
          Manage the UnderPure Insider page.
        </p>
      </div>
      <button
        onClick={handleSaveToBackend}
        className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 cursor-pointer"
      >
        <Save size={14} /> Save Page
      </button>
    </div>
  );
};

export default LoyaltyHeader;
