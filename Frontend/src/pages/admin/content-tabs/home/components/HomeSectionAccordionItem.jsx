import React from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import HomeSectionEditorRouter from './HomeSectionEditorRouter';

export default function HomeSectionAccordionItem({
  section,
  isExpanded,
  onToggleExpand,
  isVisible,
  onToggleVisibility,
  editorProps,
}) {
  const IconComponent = section.icon;

  return (
    <div className="bg-white border border-black/10 -mt-px first:mt-0">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={onToggleExpand}
      >
        <button type="button" className="text-gray-400 cursor-pointer">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        <IconComponent size={18} className="text-gray-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-serif text-base">{section.label}</div>
          <div className="text-[10px] text-gray-400 tracking-wider">
            {section.desc}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(section.key);
          }}
          className={`flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-widest border transition-colors cursor-pointer ${
            isVisible
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-600'
          }`}
        >
          {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
          {isVisible ? 'Visible' : 'Hidden'}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-black/10 p-6 space-y-6 bg-gray-50/30">
          <HomeSectionEditorRouter
            sectionKey={section.key}
            {...editorProps}
          />
        </div>
      )}
    </div>
  );
}
