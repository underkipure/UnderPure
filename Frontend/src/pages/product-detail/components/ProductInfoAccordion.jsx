import React from "react";
import { ChevronDown, Minus } from "lucide-react";
import { sanitizeHtml } from "../../../utils/sanitizeHtml";

export default function ProductInfoAccordion({
  accordions,
  expandedAccordion,
  setExpandedAccordion,
}) {
  if (!accordions || accordions.length === 0) return null;

  return (
    <div className="w-full border-t border-gray-200 mb-6">
      {accordions.map((acc) => (
        <div key={acc.id} className="border-b border-gray-200">
          <button
            className="w-full py-3.5 flex justify-between items-center text-[13px] font-sans text-black font-medium hover:opacity-70 transition-opacity text-left"
            onClick={() =>
              setExpandedAccordion(
                expandedAccordion === acc.id ? null : acc.id,
              )
            }
          >
            {acc.title}
            {expandedAccordion === acc.id ? (
              <Minus className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedAccordion === acc.id && (
            <div
              className="pb-4 text-[12px] text-gray-600 font-sans leading-relaxed text-left"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(acc.content) }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
