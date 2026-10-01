import React from 'react';
import { Save, ChevronDown } from 'lucide-react';
import { TAB_GROUPS, ALL_TABS } from '../tabConfig';

export default function AdminContentHeader({
  activeTab,
  onSelectTab,
  onPublish,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl mb-2 text-black">Content Editor</h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Control every section of your website ({ALL_TABS.length} Sections)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        {/* Quick Category Dropdown Selector */}
        <div className="relative w-full sm:min-w-[240px]">
          <select
            value={activeTab}
            onChange={(e) => onSelectTab(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-xs uppercase tracking-wider text-black font-semibold appearance-none pr-8 focus:outline-none focus:border-black cursor-pointer shadow-sm"
          >
            {TAB_GROUPS.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.tabs.map((tab) => (
                  <option key={tab.key} value={tab.key}>
                    {tab.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
          />
        </div>

        <button
          onClick={onPublish}
          className="bg-black text-white px-6 py-2.5 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shrink-0 w-full sm:w-auto rounded-sm cursor-pointer"
        >
          <Save size={14} /> Publish Changes
        </button>
      </div>
    </div>
  );
}
