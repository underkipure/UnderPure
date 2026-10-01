import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ALL_TABS } from '../tabConfig';

export default function AdminContentTabsNav({ activeTab, onSelectTab }) {
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = tabsContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollTabs = (dir) => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const amount = dir === 'left' ? -300 : 300;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleTabClick = (key) => {
    onSelectTab(key);
    const btnEl = tabRefs.current[key];
    if (btnEl) {
      btnEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Left Scroll Indicator & Button */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 flex items-center bg-gradient-to-r from-white via-white/95 to-transparent pr-6 z-10 rounded-l-lg">
          <button
            onClick={() => scrollTabs('left')}
            className="p-1.5 ml-2 bg-black text-white rounded-full shadow hover:bg-gray-800 transition-all cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* Tabs Bar */}
      <div
        ref={tabsContainerRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto no-scrollbar scroll-smooth px-2"
      >
        {ALL_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              ref={(el) => (tabRefs.current[tab.key] = el)}
              onClick={() => handleTabClick(tab.key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-xs uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'border-black text-black font-bold bg-gray-50'
                  : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50/50'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Right Scroll Indicator & Button */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end bg-gradient-to-l from-white via-white/95 to-transparent pl-6 z-10 rounded-r-lg">
          <button
            onClick={() => scrollTabs('right')}
            className="p-1.5 mr-2 bg-black text-white rounded-full shadow hover:bg-gray-800 transition-all cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
