import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  RotateCcw,
  Gift,
  Truck,
  ShieldCheck,
  Sparkles,
  Tag,
  Heart,
  CreditCard,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

const PERK_ICONS = {
  Package,
  RotateCcw,
  Gift,
  Truck,
  ShieldCheck,
  Sparkles,
  Tag,
  Heart,
  CreditCard,
  CheckCircle2,
  RefreshCw,
};

export default function ProductPerksList({
  activePerks,
  setIsReturnModalOpen,
}) {
  if (!activePerks || activePerks.length === 0) return null;

  return (
    <div className="space-y-3 mb-6 pt-4 border-t border-gray-100">
      {activePerks.map((perk, index) => {
        const IconComp = PERK_ICONS[perk.icon] || Package;
        return (
          <div
            key={perk.id || index}
            className="flex items-center gap-3 text-[12px] font-sans text-gray-800"
          >
            <IconComp
              className="w-4 h-4 text-gray-500 shrink-0"
              strokeWidth={1.5}
            />
            {perk.openModal === "returns" ? (
              <button
                onClick={() => setIsReturnModalOpen(true)}
                className="hover:opacity-70 transition-opacity text-left underline"
              >
                {perk.text}
              </button>
            ) : perk.link ? (
              <Link
                to={perk.link}
                className="hover:opacity-70 transition-opacity underline"
              >
                {perk.text}
              </Link>
            ) : (
              <span>{perk.text}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
