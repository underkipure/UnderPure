import React from "react";

export default function LovelistTabsSettings({ d, update }) {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">
        Tabs
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Lovelist Tab
          </label>
          <input
            type="text"
            value={d.tabs?.lovelist || ""}
            onChange={(e) =>
              update({ tabs: { ...d.tabs, lovelist: e.target.value } })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Saved for Later Tab
          </label>
          <input
            type="text"
            value={d.tabs?.saved || ""}
            onChange={(e) =>
              update({ tabs: { ...d.tabs, saved: e.target.value } })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
          />
        </div>
      </div>
    </div>
  );
}
