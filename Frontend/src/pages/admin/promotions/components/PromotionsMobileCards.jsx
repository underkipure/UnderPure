import React from "react";
import { Copy, Trash2 } from "lucide-react";

export default function PromotionsMobileCards({
  codes,
  categories,
  handleCopy,
  handleToggle,
  setDeleteId
}) {
  return (
    <div className="md:hidden space-y-3 sm:space-y-4 w-full">
      {codes.map((code) => {
        const isExpired = code.expires && new Date(code.expires) < new Date();
        const isMaxed = code.maxUses !== null && code.uses >= code.maxUses;

        return (
          <div key={code.id} className="bg-white border border-black/10 p-4 sm:p-5 rounded-sm shadow-sm relative w-full space-y-3">
            <div className="flex justify-between items-center border-b border-black/10 pb-2.5">
              <div className="flex items-center gap-2">
                <code className="text-xs sm:text-sm font-mono font-bold text-black bg-black/5 px-2.5 py-1 rounded-sm border border-black/10">
                  {code.code}
                </code>
                <button 
                  onClick={() => handleCopy(code.code)} 
                  className="text-gray-500 hover:text-black bg-gray-50 p-1.5 rounded-sm border border-black/10 transition-colors"
                  title="Copy Code"
                >
                  <Copy size={14} />
                </button>
              </div>
              <button
                onClick={() => handleToggle(code.id, code.active)}
                className={`text-[9px] tracking-widest uppercase font-bold px-2.5 py-1 rounded-sm ${
                  code.active && !isExpired && !isMaxed
                    ? "text-green-700 bg-green-50 border border-green-200"
                    : "text-gray-500 bg-gray-50 border border-gray-200"
                }`}
              >
                {code.active && !isExpired && !isMaxed ? "Active" : "Inactive"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-sm border border-black/5">
              <div>
                <span className="text-gray-400 block text-[9px] uppercase tracking-widest">Discount</span>
                <span className="font-bold text-black">{code.type === "percent" ? `${code.value}%` : `Rs. ${code.value}`} OFF</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase tracking-widest">Uses</span>
                <span className="text-gray-700 font-medium">
                  {code.uses}{code.maxUses !== null ? ` / ${code.maxUses}` : ""}
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-gray-200">
                <span className="text-gray-400 block text-[9px] uppercase tracking-widest">Applies To</span>
                <span className="text-gray-700 font-medium">
                  {code.category_id 
                    ? (categories.find((c) => Number(c.id) === Number(code.category_id))?.name || `Category #${code.category_id}`)
                    : "Entire Cart"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-black/10">
              <span className="text-[10px] text-gray-500">
                {code.expires ? `Expires: ${new Date(code.expires).toLocaleDateString("en-GB")}` : "No Expiry"}
              </span>
              <button 
                onClick={() => setDeleteId(code.id)} 
                className="text-red-500 hover:bg-red-50 p-1.5 rounded border border-red-200 text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        );
      })}
      {codes.length === 0 && (
        <div className="p-8 text-center bg-gray-50 border border-black/5 rounded-sm w-full">
          <p className="text-xs text-gray-500 font-sans italic">No promotion codes available.</p>
        </div>
      )}
    </div>
  );
}
