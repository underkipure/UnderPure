import React from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { Section, Field, inputCls, textareaCls } from './common/FindBraSizeCommon';

export default function SizeCalculatorEditor({
  calculator,
  updNested,
  updShopBtn,
  addShopBtn,
  removeShopBtn
}) {
  return (
    <Section title="Size Calculator">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Heading Prefix">
          <input 
            type="text" 
            value={calculator?.headingPrefix || ''} 
            onChange={e => updNested('calculator', { headingPrefix: e.target.value })} 
            className={inputCls} 
            placeholder="your" 
          />
        </Field>
        <Field label="Heading Italic">
          <input 
            type="text" 
            value={calculator?.headingItalic || ''} 
            onChange={e => updNested('calculator', { headingItalic: e.target.value })} 
            className={inputCls} 
            placeholder="Underpure" 
          />
        </Field>
        <Field label="Heading Suffix">
          <input 
            type="text" 
            value={calculator?.headingSuffix || ''} 
            onChange={e => updNested('calculator', { headingSuffix: e.target.value })} 
            className={inputCls} 
            placeholder="size" 
          />
        </Field>
        <Field label="Button Text">
          <input 
            type="text" 
            value={calculator?.buttonText || ''} 
            onChange={e => updNested('calculator', { buttonText: e.target.value })} 
            className={inputCls} 
            placeholder="GET MY SIZE" 
          />
        </Field>
      </div>
      <Field label="Description">
        <textarea 
          value={calculator?.description || ''} 
          onChange={e => updNested('calculator', { description: e.target.value })} 
          rows={2} 
          className={textareaCls} 
        />
      </Field>
      <Field label="Band Input Placeholder">
        <input 
          type="text" 
          value={calculator?.bandPlaceholder || ''} 
          onChange={e => updNested('calculator', { bandPlaceholder: e.target.value })} 
          className={inputCls} 
          placeholder="Band measurement (inches)" 
        />
      </Field>
      <Field label="Bust Input Placeholder">
        <input 
          type="text" 
          value={calculator?.bustPlaceholder || ''} 
          onChange={e => updNested('calculator', { bustPlaceholder: e.target.value })} 
          className={inputCls} 
          placeholder="Bust measurement (inches)" 
        />
      </Field>
      <Field label="Result Message (shown below size)">
        <input 
          type="text" 
          value={calculator?.resultMessage || ''} 
          onChange={e => updNested('calculator', { resultMessage: e.target.value })} 
          className={inputCls} 
          placeholder="Shop our collection to find your perfect fit." 
        />
      </Field>
      <Field label="Note (bottom of calculator)">
        <input 
          type="text" 
          value={calculator?.note || ''} 
          onChange={e => updNested('calculator', { note: e.target.value })} 
          className={inputCls} 
          placeholder="All sizes in inches" 
        />
      </Field>
      <Field label="Shop Buttons (shown after result)">
        {(calculator?.shopButtons || []).map((btn, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
            <input 
              type="text" 
              value={btn.label || ''} 
              onChange={e => updShopBtn(idx, { label: e.target.value })} 
              className={inputCls} 
              placeholder="SHOP BRAS" 
            />
            <div className="flex gap-2">
              <input 
                type="text" 
                value={btn.url || ''} 
                onChange={e => updShopBtn(idx, { url: e.target.value })} 
                className={inputCls} 
                placeholder="/bras" 
              />
              <button 
                onClick={() => removeShopBtn(idx)} 
                className="text-red-400 hover:text-red-600 transition-colors"
                title="Remove Button"
              >
                <MinusCircle size={16} />
              </button>
            </div>
          </div>
        ))}
        <button 
          onClick={addShopBtn} 
          className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
        >
          <PlusCircle size={13} /> Add Shop Button
        </button>
      </Field>
    </Section>
  );
}
