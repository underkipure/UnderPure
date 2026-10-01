import React from 'react';
import { Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../../../quill-theme.css';
import { minimalModules } from '../constants';

export default function ProductAccordionsEditor({ data, onChange }) {
  const titles = data.titles || {};
  const accordions = data.accordions || {};
  const customAccordions = data.customAccordions || [];

  const updateTitle = (field, value) => {
    onChange({
      ...data,
      titles: { ...titles, [field]: value }
    });
  };

  const updateAccordionContent = (field, value) => {
    onChange({
      ...data,
      accordions: { ...accordions, [field]: value }
    });
  };

  const addCustomAccordion = () => {
    const newAcc = {
      id: Date.now(),
      title: 'Additional Specs',
      content: '<p>Add details here...</p>'
    };
    onChange({
      ...data,
      customAccordions: [...customAccordions, newAcc]
    });
  };

  const removeCustomAccordion = (id) => {
    onChange({
      ...data,
      customAccordions: customAccordions.filter(a => a.id !== id)
    });
  };

  const updateCustomAccordion = (id, field, value) => {
    onChange({
      ...data,
      customAccordions: customAccordions.map(a =>
        a.id === id ? { ...a, [field]: value } : a
      )
    });
  };

  return (
    <div className="border-t border-black/10 pt-6 space-y-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest">
          Accordion Tabs Configuration
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Customize accordion tab titles and default content shown on product pages.
        </p>
      </div>

      {/* Accordion Titles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 border border-black/10">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Tab 1 Title
          </label>
          <input
            type="text"
            value={titles.accordionMaterials || 'Materials & Care'}
            onChange={e => updateTitle('accordionMaterials', e.target.value)}
            className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black bg-white font-bold"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Tab 2 Title
          </label>
          <input
            type="text"
            value={titles.accordionShipping || 'Shipping Info'}
            onChange={e => updateTitle('accordionShipping', e.target.value)}
            className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black bg-white font-bold"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Tab 3 Title
          </label>
          <input
            type="text"
            value={titles.accordionReturns || 'Returns Info'}
            onChange={e => updateTitle('accordionReturns', e.target.value)}
            className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black bg-white font-bold"
          />
        </div>
      </div>

      {/* Tab 1 Content */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">
          {titles.accordionMaterials || 'Materials & Care'} Content
        </label>
        <ReactQuill
          theme="snow"
          modules={minimalModules}
          value={accordions.fabricCare || ''}
          onChange={content => {
            if (content !== accordions.fabricCare) {
              updateAccordionContent('fabricCare', content);
            }
          }}
          className="bg-white border-black/20 font-sans"
        />
      </div>

      {/* Tab 2 Content */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">
          {titles.accordionShipping || 'Shipping Info'} Content
        </label>
        <ReactQuill
          theme="snow"
          modules={minimalModules}
          value={accordions.shippingInfo || ''}
          onChange={content => {
            if (content !== accordions.shippingInfo) {
              updateAccordionContent('shippingInfo', content);
            }
          }}
          className="bg-white border-black/20 font-sans"
        />
      </div>

      {/* Tab 3 Content */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">
          {titles.accordionReturns || 'Returns Info'} Content
        </label>
        <ReactQuill
          theme="snow"
          modules={minimalModules}
          value={accordions.returnsInfo || ''}
          onChange={content => {
            if (content !== accordions.returnsInfo) {
              updateAccordionContent('returnsInfo', content);
            }
          }}
          className="bg-white border-black/20 font-sans"
        />
      </div>

      {/* Custom Accordions */}
      <div className="pt-4 border-t border-black/10">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-700">
            Custom Accordion Sections
          </h4>
          <button
            onClick={addCustomAccordion}
            className="text-xs font-bold uppercase tracking-widest text-black underline flex items-center gap-1"
          >
            + Add Custom Accordion
          </button>
        </div>

        <div className="space-y-4">
          {customAccordions.map((acc, idx) => (
            <div key={acc.id || idx} className="p-4 border border-black/15 bg-gray-50 space-y-3">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={acc.title || ''}
                  onChange={e => updateCustomAccordion(acc.id, 'title', e.target.value)}
                  className="border border-black/20 p-2 text-xs font-bold focus:outline-none focus:border-black bg-white w-full max-w-sm"
                  placeholder="Accordion Title"
                />
                <button
                  onClick={() => removeCustomAccordion(acc.id)}
                  className="text-red-500 hover:text-red-700 text-xs p-1"
                  title="Delete Accordion"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <ReactQuill
                theme="snow"
                modules={minimalModules}
                value={acc.content || ''}
                onChange={content => updateCustomAccordion(acc.id, 'content', content)}
                className="bg-white border-black/20 font-sans"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
