import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function AccountFooter({ d }) {
  const defaultLinks = [
    { id: 1, label: "Refund policy", url: "/policies/refund-policy" },
    { id: 2, label: "Shipping", url: "/policies/shipping-policy" },
    { id: 3, label: "Privacy policy", url: "/policies/privacy-policy" },
    { id: 4, label: "Terms of service", url: "/policies/terms-of-service" },
    { id: 5, label: "Contact information", url: "/pages/contact" },
  ];

  return (
    <footer className="py-4 flex flex-row flex-wrap justify-center sm:justify-start gap-x-2 gap-y-2 text-[10px] text-[#b83c84] tracking-[0.01em] leading-[1] items-center sm:mt-2 border-t border-gray-100 w-full md:w-[80%]">
      <button className="flex items-center gap-0 underline">
        {d?.footerLinks?.country || "United States"} <ChevronDown size={14} />
      </button>
      {(d?.footerLinks?.links || defaultLinks).map((linkItem, idx) => (
        <Link key={linkItem.id || idx} to={linkItem.url || "#"} className="underline">
          {linkItem.label}
        </Link>
      ))}
    </footer>
  );
}
