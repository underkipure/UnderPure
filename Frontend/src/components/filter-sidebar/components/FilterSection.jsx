import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FilterSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#e5e5e5]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full py-4 text-left"
      >
        <span className="text-[14px] font-sans font-bold capitalize text-black">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-black transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[1500px] opacity-100 pb-5' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
