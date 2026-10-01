import React from "react";

export default function LovelistButtonsSettings({ d, update }) {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">
        Action Buttons
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Clear List
          </label>
          <input
            type="text"
            value={d.buttons?.clearList || ""}
            onChange={(e) =>
              update({
                buttons: { ...d.buttons, clearList: e.target.value },
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Move all to cart
          </label>
          <input
            type="text"
            value={d.buttons?.moveToCart || ""}
            onChange={(e) =>
              update({
                buttons: { ...d.buttons, moveToCart: e.target.value },
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Add to Cart Button
          </label>
          <input
            type="text"
            value={d.buttons?.addToCart || ""}
            onChange={(e) =>
              update({
                buttons: { ...d.buttons, addToCart: e.target.value },
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Quick Shop Button
          </label>
          <input
            type="text"
            value={d.buttons?.quickShop || ""}
            onChange={(e) =>
              update({
                buttons: { ...d.buttons, quickShop: e.target.value },
              })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
          />
        </div>
      </div>
    </div>
  );
}
