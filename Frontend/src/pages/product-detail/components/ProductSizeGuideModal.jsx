import React from "react";
import { SizeGuideTable } from "../../../components/shared/products";
import { useSiteSettingsStore } from "../../../store/siteSettingsStore";
import { sanitizeHtml } from "../../../utils/sanitizeHtml";

export default function ProductSizeGuideModal({
  isOpen,
  onClose,
  productDetailSettings,
}) {
  const contactPhone = useSiteSettingsStore((s) => s.contactPhone);
  const contactEmail = useSiteSettingsStore((s) => s.contactEmail);

  if (!isOpen) return null;

  const columns =
    productDetailSettings?.sizeGuide?.columns || [
      "Size",
      "Bust (in)",
      "Waist (in)",
      "Hip (in)",
    ];

  const defaultNote = contactPhone
    ? `For further questions, please reach out to our client care team via LiveChat, Email or Phone ${contactPhone}.`
    : (contactEmail ? `For further questions, please reach out to our client care team at ${contactEmail}.` : "For further questions, please reach out to our client care team.");

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[970px] max-h-[62vh] border border-black overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative px-8 py-6 md:px-12 md:py-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3 right-4 p-1 hover:opacity-70 z-10 cursor-pointer text-black/60"
          aria-label="Close size guide"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Heading */}
        <div className="text-center mb-4 mt-1">
          <h2 className="text-[28px] md:text-[40px] font-serif font-medium text-black leading-[0.95] tracking-tight">
            ready to wear
          </h2>
          <h3 className="text-[16px] md:text-[24px] font-serif text-black tracking-wide">
            size chart
          </h3>
        </div>

        {/* Shared SizeGuideTable */}
        <SizeGuideTable
          table={productDetailSettings?.sizeGuide?.table}
          columns={columns}
          variant="modal"
        />

        {/* Footer text */}
        <div className="mt-8 text-center">
          <p
            className="text-[12px] md:text-[16.5px] text-black font-medium leading-relaxed tracking-[0.0001em]"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(
                productDetailSettings?.sizeGuide?.note || defaultNote
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}
