import React, { useState } from "react";

const PolicyItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full flex justify-between items-center py-3 text-[12px] sm:text-[13px] font-sans text-black hover:text-gray-600 transition-colors text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className="text-[16px] leading-none font-light text-gray-400">
          {isOpen ? "–" : "+"}
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mb-3"
            : "grid-rows-[0fr] opacity-0 mb-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="text-[11px] sm:text-[12px] text-gray-500 font-sans leading-relaxed space-y-3 pr-3 pt-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyItem;
