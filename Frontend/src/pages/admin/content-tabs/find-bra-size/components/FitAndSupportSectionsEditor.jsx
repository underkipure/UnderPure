import React from 'react';
import { Section, Field, inputCls, textareaCls } from './common/FindBraSizeCommon';

export default function FitAndSupportSectionsEditor({ fitSection, supportSection, updNested }) {
  return (
    <>
      {/* Fit 101 Section */}
      <Section title="Bra Fit 101 Section">
        <Field label="Description">
          <textarea 
            value={fitSection?.description || ''} 
            onChange={e => updNested('fitSection', { description: e.target.value })} 
            rows={2} 
            className={textareaCls} 
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Button Text">
            <input 
              type="text" 
              value={fitSection?.buttonText || ''} 
              onChange={e => updNested('fitSection', { buttonText: e.target.value })} 
              className={inputCls} 
              placeholder="BRA FIT 101" 
            />
          </Field>
          <Field label="Button Link">
            <input 
              type="text" 
              value={fitSection?.buttonUrl || ''} 
              onChange={e => updNested('fitSection', { buttonUrl: e.target.value })} 
              className={inputCls} 
              placeholder="/" 
            />
          </Field>
        </div>
      </Section>

      {/* Support Section */}
      <Section title="Support Section (with Chat Button)">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Heading Prefix">
            <input 
              type="text" 
              value={supportSection?.headingPrefix || ''} 
              onChange={e => updNested('supportSection', { headingPrefix: e.target.value })} 
              className={inputCls} 
              placeholder="we" 
            />
          </Field>
          <Field label="Heading Italic">
            <input 
              type="text" 
              value={supportSection?.headingItalic || ''} 
              onChange={e => updNested('supportSection', { headingItalic: e.target.value })} 
              className={inputCls} 
              placeholder="support you" 
            />
          </Field>
        </div>
        <Field label="Description">
          <textarea 
            value={supportSection?.description || ''} 
            onChange={e => updNested('supportSection', { description: e.target.value })} 
            rows={3} 
            className={textareaCls} 
          />
        </Field>
        <Field label="Button Text (Opens Chat Widget)">
          <input 
            type="text" 
            value={supportSection?.buttonText || ''} 
            onChange={e => updNested('supportSection', { buttonText: e.target.value })} 
            className={inputCls} 
            placeholder="CHAT WITH UNDERPURE" 
          />
        </Field>
      </Section>
    </>
  );
}
