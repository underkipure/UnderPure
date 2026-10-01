import React, { useState } from 'react';
import FilterSection from './FilterSection';

export default function TypeFilterSection({
  availableTypes = [],
  selectedTypes = [],
  onToggleType,
  isMobile = false,
  defaultOpen = true
}) {
  const [showAll, setShowAll] = useState(false);

  if (!availableTypes || availableTypes.length === 0) return null;

  return (
    <FilterSection title="Type" defaultOpen={defaultOpen}>
      {isMobile ? (
        /* Mobile View: Pill Buttons */
        <div>
          <div className="grid grid-cols-3 gap-8">
            {availableTypes.slice(0, showAll ? undefined : 6).map((type) => {
              const isChecked = selectedTypes.includes(type.name);
              return (
                <button
                  type="button"
                  key={type.name}
                  onClick={() => onToggleType('types', type.name)}
                  className={`w-full py-2 px-4 border ${
                    isChecked
                      ? 'border-black font-bold text-black border-[1.5px]'
                      : 'border-gray-250 text-[#000]'
                  } text-[13px] font-sans text-center font-medium rounded-sm truncate`}
                  title={type.name}
                >
                  {type.name}
                </button>
              );
            })}
          </div>
          {availableTypes.length > 6 && (
            <div className="w-full border-b border-gray-300 mt-6 pb-2">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="text-[13px] font-sans text-black underline underline-offset-4"
              >
                {showAll ? 'Show less' : 'Show more'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Desktop View: Checkboxes */
        <div className="flex flex-col gap-2.5">
          {availableTypes.slice(0, showAll ? undefined : 8).map((type) => {
            const isChecked = selectedTypes.includes(type.name);
            return (
              <label
                key={type.name}
                className="flex items-center gap-3 cursor-pointer group tracking-[0.1em]"
              >
                <span
                  className={`w-[16px] h-[16px] border-[2px] rounded-[4px] flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'border-black border-[1.5px]'
                      : 'border-gray-400 group-hover:border-black'
                  }`}
                  onClick={() => onToggleType('types', type.name)}
                >
                  {isChecked && <span className="w-[8px] h-[8px] bg-black" />}
                </span>
                <span
                  className="text-[13px] font-sans text-[#000] flex-1 cursor-pointer"
                  onClick={() => onToggleType('types', type.name)}
                >
                  {type.name}
                </span>
                {type.count != null && (
                  <span className="text-[12px] text-gray-400 font-sans">
                    ({type.count})
                  </span>
                )}
              </label>
            );
          })}
          {availableTypes.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="text-[14px] font-sans font-medium text-black underline underline-offset-2 text-left mt-2 tracking-[0.001em]"
            >
              {showAll ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
    </FilterSection>
  );
}
