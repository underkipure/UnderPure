import React from "react";
import { Plus } from "lucide-react";

export default function MegaMenuHeader({
  onPublish,
  isSaving,
  onAdd,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-b border-black/10 pb-3">
      <div>
        <h2 className="font-serif text-xl">Navigation Menu Editor</h2>
        <p className="text-xs text-gray-500 tracking-wider mt-1">
          Control which categories appear in the top navigation and their
          dropdowns.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPublish}
          disabled={isSaving}
          className="bg-green-600 text-white px-4 py-2 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 cursor-pointer"
        >
          <Plus size={14} /> Add Menu Item
        </button>
      </div>
    </div>
  );
}
