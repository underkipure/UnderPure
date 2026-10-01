import React from 'react';
import { Section, Field, inputCls, textareaCls } from './common/FindBraSizeCommon';

export default function IntroSectionEditor({ intro, updNested }) {
  return (
    <Section title="'Before We Get Started' Section">
      <Field label="Heading Text">
        <input 
          type="text" 
          value={intro?.heading || ''} 
          onChange={e => updNested('intro', { heading: e.target.value })} 
          className={inputCls} 
          placeholder="before we get" 
        />
      </Field>
      <Field label="Heading Italic Part">
        <input 
          type="text" 
          value={intro?.headingItalic || ''} 
          onChange={e => updNested('intro', { headingItalic: e.target.value })} 
          className={inputCls} 
          placeholder="started..." 
        />
      </Field>
      <Field label="Description">
        <textarea 
          value={intro?.description || ''} 
          onChange={e => updNested('intro', { description: e.target.value })} 
          rows={3} 
          className={textareaCls} 
        />
      </Field>
    </Section>
  );
}
