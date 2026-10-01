import React from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import { Section, Field, inputCls } from './common/FindBraSizeCommon';

export default function NavTabsEditor({ navTabs, updNavTab, addNavTab, removeNavTab }) {
  return (
    <Section title="Navigation Tabs (sticky black bar)">
      {(navTabs || []).map((tab, idx) => (
        <div key={idx} className="grid grid-cols-2 gap-3 border border-black/10 p-3 mb-2">
          <Field label={`Tab ${idx + 1} Label`}>
            <input 
              type="text" 
              value={tab.label || ''} 
              onChange={e => updNavTab(idx, { label: e.target.value })} 
              className={inputCls} 
            />
          </Field>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Field label="Anchor (without #)">
                <input 
                  type="text" 
                  value={tab.anchor || ''} 
                  onChange={e => updNavTab(idx, { anchor: e.target.value })} 
                  className={inputCls} 
                  placeholder="e.g. the-band" 
                />
              </Field>
            </div>
            <button 
              onClick={() => removeNavTab(idx)} 
              className="text-red-500 mb-2.5 hover:text-red-700 transition-colors"
              title="Delete Tab"
              aria-label={`Delete Tab ${idx + 1}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <button 
        onClick={addNavTab} 
        className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
      >
        <PlusCircle size={13} /> Add Tab
      </button>
    </Section>
  );
}
