import React from 'react';
import { Trash2, Plus, PlusCircle, MinusCircle } from 'lucide-react';
import { Section, Field, inputCls, textareaCls, ImageUploadButton } from './common/FindBraSizeCommon';

export default function MeasurementSectionsEditor({
  sections,
  updSection,
  addSection,
  removeSection,
  updStep,
  addStep,
  removeStep,
  handleImageUpload,
  uploading
}) {
  return (
    <Section title="Measurement Sections (The Band, The Bust, etc.)">
      <p className="text-[11px] text-gray-400 uppercase tracking-widest">Sections alternate left/right image layout automatically.</p>
      {(sections || []).map((section, sIdx) => (
        <div key={sIdx} className="border border-black/10 p-5 space-y-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest font-bold text-gray-500">Section {sIdx + 1}</span>
            <button 
              onClick={() => removeSection(sIdx)} 
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Delete Section"
              aria-label={`Delete Section ${sIdx + 1}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Heading Prefix (e.g. 'the')">
              <input 
                type="text" 
                value={section.headingPrefix || ''} 
                onChange={e => updSection(sIdx, { headingPrefix: e.target.value })} 
                className={inputCls} 
              />
            </Field>
            <Field label="Heading Italic (e.g. 'band')">
              <input 
                type="text" 
                value={section.headingItalic || ''} 
                onChange={e => updSection(sIdx, { headingItalic: e.target.value })} 
                className={inputCls} 
              />
            </Field>
          </div>
          <Field label="Section Anchor (for nav links, without #)">
            <input 
              type="text" 
              value={section.anchor || ''} 
              onChange={e => updSection(sIdx, { anchor: e.target.value })} 
              className={inputCls} 
              placeholder="the-band" 
            />
          </Field>
          <Field label="Section Image">
            <ImageUploadButton 
              url={section.image} 
              onChange={(val) => handleImageUpload(val, (url) => updSection(sIdx, { image: url }))} 
              disabled={uploading} 
            />
          </Field>
          <Field label="Intro Paragraph (optional, before steps)">
            <textarea 
              value={(section.paragraphs || []).join('\n')} 
              onChange={e => updSection(sIdx, { paragraphs: e.target.value ? [e.target.value] : [] })} 
              rows={2} 
              className={textareaCls} 
            />
          </Field>
          <Field label="Steps">
            {(section.steps || []).map((step, stIdx) => (
              <div key={stIdx} className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={step} 
                  onChange={e => updStep(sIdx, stIdx, e.target.value)} 
                  className={inputCls} 
                  placeholder={`Step ${stIdx + 1}...`} 
                />
                <button 
                  onClick={() => removeStep(sIdx, stIdx)} 
                  className="text-red-400 hover:text-red-600 transition-colors"
                  title="Remove Step"
                >
                  <MinusCircle size={16} />
                </button>
              </div>
            ))}
            <button 
              onClick={() => addStep(sIdx)} 
              className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            >
              <PlusCircle size={13} /> Add Step
            </button>
          </Field>
          <Field label="Hot Tip">
            <input 
              type="text" 
              value={section.hotTip || ''} 
              onChange={e => updSection(sIdx, { hotTip: e.target.value })} 
              className={inputCls} 
              placeholder="In between numbers? Round up." 
            />
          </Field>
        </div>
      ))}
      <button 
        onClick={addSection} 
        className="flex items-center gap-2 border border-dashed border-black/30 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black hover:border-black px-4 py-3 w-full justify-center transition-colors"
      >
        <Plus size={14} /> Add Section
      </button>
    </Section>
  );
}
