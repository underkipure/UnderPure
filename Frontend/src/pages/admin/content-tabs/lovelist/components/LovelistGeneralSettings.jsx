import React from "react";

export default function LovelistGeneralSettings({ d, update }) {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">
        General Settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Page Title
          </label>
          <input
            type="text"
            value={d.pageTitle || ""}
            onChange={(e) => update({ pageTitle: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Guest User Text
          </label>
          <input
            type="text"
            value={d.guestUserText || ""}
            onChange={(e) => update({ guestUserText: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Logged In Default Text
          </label>
          <input
            type="text"
            value={d.loggedInDefaultText || ""}
            onChange={(e) => update({ loggedInDefaultText: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>
    </div>
  );
}
