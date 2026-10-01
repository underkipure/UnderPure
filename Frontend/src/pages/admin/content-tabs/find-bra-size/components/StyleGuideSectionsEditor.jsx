import React from 'react';
import { Trash2, Plus, PlusCircle, MinusCircle } from 'lucide-react';
import { Section, Field, inputCls, textareaCls, ImageUploadButton } from './common/FindBraSizeCommon';

export default function StyleGuideSectionsEditor({
  extraSections,
  updExtraSection,
  addExtraSection,
  removeExtraSection,
  updExtraItem,
  addExtraItem,
  removeExtraItem,
  handleImageUpload,
  uploading
}) {
  return (
    <Section title="Extra Sections (Bra Style Guide Carousel)">
      {(extraSections || []).map((section, sIdx) => (
        <div key={sIdx} className="border border-black/10 p-5 space-y-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest font-bold text-gray-500">Style Guide Section {sIdx + 1}</span>
            <button 
              onClick={() => removeExtraSection(sIdx)} 
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Delete Section"
              aria-label={`Delete Style Guide Section ${sIdx + 1}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
          <Field label="Anchor (for nav link)">
            <input 
              type="text" 
              value={section.anchor || ''} 
              onChange={e => updExtraSection(sIdx, { anchor: e.target.value })} 
              className={inputCls} 
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Heading Prefix">
              <input 
                type="text" 
                value={section.headingPrefix || ''} 
                onChange={e => updExtraSection(sIdx, { headingPrefix: e.target.value })} 
                className={inputCls} 
              />
            </Field>
            <Field label="Heading Italic">
              <input 
                type="text" 
                value={section.headingItalic || ''} 
                onChange={e => updExtraSection(sIdx, { headingItalic: e.target.value })} 
                className={inputCls} 
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea 
              value={section.description || ''} 
              onChange={e => updExtraSection(sIdx, { description: e.target.value })} 
              rows={2} 
              className={textareaCls} 
            />
          </Field>
          
          <div className="space-y-3 mt-4">
            <p className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2 border-b pb-2">Carousel Items</p>
            {(section.items || []).map((item, iIdx) => (
              <div key={iIdx} className="bg-gray-50 p-4 border border-black/10 flex flex-col gap-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Item {iIdx + 1}</span>
                  <button 
                    onClick={() => removeExtraItem(sIdx, iIdx)} 
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Remove Item"
                  >
                    <MinusCircle size={14} />
                  </button>
                </div>
                <Field label="Image">
                  <ImageUploadButton 
                    url={item.image} 
                    onChange={(val) => handleImageUpload(val, (url) => updExtraItem(sIdx, iIdx, { image: url }))} 
                    disabled={uploading} 
                  />
                </Field>
                <Field label="Title">
                  <input 
                    type="text" 
                    value={item.title || ''} 
                    onChange={e => updExtraItem(sIdx, iIdx, { title: e.target.value })} 
                    className={inputCls} 
                  />
                </Field>
                <Field label="Description">
                  <textarea 
                    value={item.description || ''} 
                    onChange={e => updExtraItem(sIdx, iIdx, { description: e.target.value })} 
                    rows={2} 
                    className={textareaCls} 
                  />
                </Field>
              </div>
            ))}
            <button 
              onClick={() => addExtraItem(sIdx)} 
              className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            >
              <PlusCircle size={13} /> Add Carousel Item
            </button>
          </div>
        </div>
      ))}
      <button 
        onClick={addExtraSection} 
        className="flex items-center gap-2 border border-dashed border-black/30 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black hover:border-black px-4 py-3 w-full justify-center transition-colors"
      >
        <Plus size={14} /> Add Carousel Section
      </button>
    </Section>
  );
}
