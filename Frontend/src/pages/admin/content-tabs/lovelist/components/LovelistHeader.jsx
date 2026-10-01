import React from "react";
import { Save } from "lucide-react";

export default function LovelistHeader({ handleSave }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-black/10 pb-4 sm:pb-3">
      <h2 className="font-serif text-xl text-center sm:text-left">
        Lovelist Page
      </h2>
      <button
        onClick={handleSave}
        className="bg-black text-white px-6 py-3 sm:py-2 text-xs uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-gray-800 w-full sm:w-auto"
      >
        <Save size={14} /> Save Changes
      </button>
    </div>
  );
}
