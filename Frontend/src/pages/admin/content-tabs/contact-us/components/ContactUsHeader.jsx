import React from "react";
import { Save } from "lucide-react";

export default function ContactUsHeader({ handleSave }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-b border-black/10 pb-3">
      <div>
        <h2 className="text-xl font-serif">Contact Us Page</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
          Manage Store Locations
        </p>
      </div>
      <button
        onClick={handleSave}
        className="bg-black text-white px-6 py-2.5 uppercase tracking-[0.1em] text-[13px] hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        <Save size={16} /> Save Changes
      </button>
    </div>
  );
}
