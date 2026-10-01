import React from "react";
import ProductPerksList from "./ProductPerksList";
import { sanitizeHtml } from "../../../utils/sanitizeHtml";

export default function ProductDescriptionSection({
  description,
  longDescription,
  activePerks,
  setIsReturnModalOpen,
}) {
  return (
    <div className="mb-6 text-left">
      {description && (
        <div className="text-[12.5px] font-sans text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
          {description}
        </div>
      )}

      {longDescription && (
        <div
          className="text-[12.5px] font-sans text-gray-800 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(longDescription) }}
        />
      )}

      {/* Perks List */}
      <ProductPerksList
        activePerks={activePerks}
        setIsReturnModalOpen={setIsReturnModalOpen}
      />
    </div>
  );
}
