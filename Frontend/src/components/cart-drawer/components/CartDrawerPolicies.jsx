import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import PolicyItem from "./PolicyItem";

const CartDrawerPolicies = ({ cartSettings }) => {
  const [policiesOpen, setPoliciesOpen] = useState(false);

  if (!cartSettings?.policies?.enabled) return null;

  const policyItems = cartSettings.policies.items || [];

  if (policyItems.length === 0) return null;

  return (
    <div className="border-t border-gray-200 pt-2 mt-2">
      <button
        onClick={() => setPoliciesOpen(!policiesOpen)}
        className="w-full flex justify-between items-center text-[18px] sm:text-[20px] font-dala-roman text-black hover:text-gray-600 transition-colors py-2"
      >
        {cartSettings.policies.title || "Our Policies"}
        {policiesOpen ? (
          <ChevronUp className="w-7 h-7 stroke-[1] text-black" />
        ) : (
          <ChevronDown className="w-7 h-7 stroke-[1] text-black" />
        )}
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          policiesOpen
            ? "grid-rows-[1fr] opacity-100 mt-2"
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 max-h-[220px] overflow-y-auto pr-1 tracking-wide [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {policyItems.map((item) => (
              <PolicyItem key={item.id || item.title} title={item.title}>
                {String(item.content || "")
                  .split("\n")
                  .map((para, i) =>
                    para.trim() ? <p key={i}>{para}</p> : null
                  )}
              </PolicyItem>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawerPolicies;
