import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export const PRESET_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Slate", hex: "#64748B" },
  { name: "Red", hex: "#DC2626" },
  { name: "Rose", hex: "#E11D48" },
  { name: "Pink", hex: "#DB2777" },
  { name: "Purple", hex: "#9333EA" },
  { name: "Indigo", hex: "#4F46E5" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Teal", hex: "#0D9488" },
  { name: "Emerald", hex: "#059669" },
  { name: "Green", hex: "#16A34A" },
  { name: "Lime", hex: "#65A30D" },
  { name: "Yellow", hex: "#CA8A04" },
  { name: "Amber", hex: "#D97706" },
  { name: "Orange", hex: "#EA580C" },
  { name: "Brown", hex: "#78350F" },
  { name: "Nude", hex: "#E5C4A1" },
  { name: "Beige", hex: "#F5F5DC" },
];

export default function CustomColorPicker({ value, onChange, onNameChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <div
        className="flex items-center gap-2 border border-black/20 p-2 cursor-pointer hover:border-black transition-colors bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
          style={{ backgroundColor: value || "#000000" }}
        />
        <span className="text-xs uppercase tracking-widest text-gray-700 flex-1 truncate">
          {value || "#000000"}
        </span>
        <ChevronDown size={14} className="text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute top-full right-[-10px] sm:right-auto sm:left-0 mt-1 w-[260px] max-w-[85vw] bg-white border border-black/10 shadow-2xl z-50 p-3">
          <div className="grid grid-cols-5 gap-2 mb-3">
            {PRESET_COLORS.map((c) => (
              <div
                key={c.hex}
                onClick={() => {
                  onChange(c.hex);
                  if (onNameChange && (!value || value === "#000000"))
                    onNameChange(c.name);
                  setIsOpen(false);
                }}
                className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform border border-gray-200 shadow-sm"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
          <div className="flex gap-2 items-center border-t border-gray-100 pt-3">
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">
              Hex:
            </span>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 border border-black/20 p-1.5 text-xs focus:outline-none focus:border-black uppercase"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="text-[9px] bg-black text-white px-3 py-1.5 uppercase tracking-widest font-bold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
