import React from 'react';
import { Section, Field, inputCls, textareaCls, ImageUploadButton } from './common/FindBraSizeCommon';

export default function HeroSectionEditor({ hero, updNested, handleImageUpload, uploading }) {
  return (
    <Section title="Hero Section">
      <Field label="Hero Image">
        <ImageUploadButton 
          url={hero?.image} 
          onChange={(val) => handleImageUpload(val, (url) => updNested('hero', { image: url }))} 
          disabled={uploading} 
        />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Heading Line 1">
          <input 
            type="text" 
            value={hero?.headingLine1 || ''} 
            onChange={e => updNested('hero', { headingLine1: e.target.value })} 
            className={inputCls} 
            placeholder="find your" 
          />
        </Field>
        <Field label="Heading Italic Word">
          <input 
            type="text" 
            value={hero?.headingItalic || ''} 
            onChange={e => updNested('hero', { headingItalic: e.target.value })} 
            className={inputCls} 
            placeholder="bra" 
          />
        </Field>
        <Field label="Heading Line 2">
          <input 
            type="text" 
            value={hero?.headingLine2 || ''} 
            onChange={e => updNested('hero', { headingLine2: e.target.value })} 
            className={inputCls} 
            placeholder="size" 
          />
        </Field>
      </div>
      <Field label="Description">
        <textarea 
          value={hero?.description || ''} 
          onChange={e => updNested('hero', { description: e.target.value })} 
          rows={3} 
          className={textareaCls} 
        />
      </Field>
      <Field label="Button Text">
        <input 
          type="text" 
          value={hero?.buttonText || ''} 
          onChange={e => updNested('hero', { buttonText: e.target.value })} 
          className={inputCls} 
          placeholder="GET STARTED" 
        />
      </Field>
    </Section>
  );
}
