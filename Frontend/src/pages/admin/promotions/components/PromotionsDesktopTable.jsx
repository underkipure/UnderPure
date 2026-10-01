import React from "react";
import { Copy, Trash2 } from "lucide-react";

export default function PromotionsDesktopTable({
  codes,
  categories,
  handleCopy,
  handleToggle,
  setDeleteId
}) {
  return (
    <div className="hidden md:block border border-black/10 overflow-hidden bg-white rounded-sm shadow-md w-full">
      <div className="w-full">
        <table className="w-full text-left text-xs lg:text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-white">
              {["Code", "Discount", "Applies To", "Min. Order", "Uses", "Expires", "Status", ""].map((h) => (
                <th key={h} className="px-3 lg:px-4 py-3.5 text-left text-[10px] lg:text-[11px] tracking-[0.1em] uppercase font-sans font-bold text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 w-full">
            {codes.map((code) => {
              const isExpired = code.expires && new Date(code.expires) < new Date();
              const isMaxed = code.maxUses !== null && code.uses >= code.maxUses;
              return (
                <tr key={code.id} className="hover:bg-gray-50 transition-colors group w-full">
                  <td className="px-3 lg:px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-black bg-black/5 px-2 py-1 rounded-sm border border-black/10 font-bold truncate max-w-[110px]">
                        {code.code}
                      </code>
                      <button 
                        onClick={() => handleCopy(code.code)} 
                        className="text-gray-500 hover:text-black transition-colors p-1 bg-gray-50 rounded-sm shrink-0" 
                        title="Copy code"
                      >
                        <Copy size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 lg:px-4 py-3.5 text-xs font-sans font-semibold text-black whitespace-nowrap">
                    {code.type === "percent" ? `${code.value}%` : `Rs. ${code.value}`} off
                  </td>
                  <td className="px-3 lg:px-4 py-3.5 text-xs font-sans text-gray-500 max-w-[150px]">
                    {code.category_id ? (
                      <span className="text-black bg-black/5 px-2 py-0.5 rounded-sm border border-black/10 font-bold text-[9px] tracking-wide uppercase truncate block" title={categories.find((c) => Number(c.id) === Number(code.category_id))?.name}>
                        {categories.find((c) => Number(c.id) === Number(code.category_id))?.name || `Category #${code.category_id}`}
                      </span>
                    ) : (
                      <span className="whitespace-nowrap">Entire Cart</span>
                    )}
                  </td>
                  <td className="px-3 lg:px-4 py-3.5 text-xs font-sans text-gray-500 whitespace-nowrap">
                    {code.minOrder > 0 ? `Rs. ${code.minOrder}` : "—"}
                  </td>
                  <td className="px-3 lg:px-4 py-3.5 text-xs font-sans text-black whitespace-nowrap">
                    {code.uses}{code.maxUses !== null ? ` / ${code.maxUses}` : ""}
                    {isMaxed && <span className="ml-1 text-[8px] text-red-400 font-sans font-bold tracking-widest bg-red-400/10 px-1 py-0.5 rounded-sm border border-red-400/20">MAXED</span>}
                  </td>
                  <td className="px-3 lg:px-4 py-3.5 text-xs font-sans text-gray-500 whitespace-nowrap">
                    {code.expires
                      ? <span className={isExpired ? "text-red-400 font-medium" : ""}>{new Date(code.expires).toLocaleDateString("en-GB")}{isExpired && " (exp)"}</span>
                      : "Never"
                    }
                  </td>
                  <td className="px-3 lg:px-4 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(code.id, code.active)}
                      className={`text-[9px] tracking-widest uppercase font-sans font-bold px-2.5 py-1 transition-colors rounded-sm ${code.active && !isExpired && !isMaxed
                        ? "text-green-700 bg-green-50 border border-green-200"
                        : "text-gray-500 bg-gray-50 border border-gray-200"
                        }`}
                    >
                      {code.active && !isExpired && !isMaxed ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-3 lg:px-4 py-3.5 text-right whitespace-nowrap">
                    <button 
                      onClick={() => setDeleteId(code.id)} 
                      className="text-gray-400 hover:text-red-600 transition-colors p-1" 
                      title="Delete promotion"
                    >
                      <Trash2 size={15} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {codes.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm font-sans italic">
                  No promotion codes available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
