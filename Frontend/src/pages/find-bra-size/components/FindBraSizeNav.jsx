import React, { useState } from "react";

export default function FindBraSizeNav({ tabs }) {
  const [active, setActive] = useState(0);

  return (
    <nav className="bg-black w-full sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab, idx) => (
          <a
            key={idx}
            href={tab.anchor ? `#${tab.anchor}` : "#"}
            onClick={() => setActive(idx)}
            className={`flex-shrink-0 px-6 py-4 text-[12px] uppercase tracking-[0.08em] font-medium transition-colors whitespace-nowrap ${
              active === idx
                ? "text-white border-b-2 border-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
