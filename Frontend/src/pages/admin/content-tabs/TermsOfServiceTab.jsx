import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import { useSiteSettingsStore, DEFAULTS } from '../../../store/siteSettingsStore';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'sonner';

const Section = ({ title, children }) => (
  <div className="bg-white border border-black/10 p-6 space-y-5">
    <h3 className="font-serif text-lg border-b border-black/10 pb-3">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">{label}</label>
    {children}
  </div>
);

export default function TermsOfServiceTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore(s => s.updateSettings);

  const [data, setData] = useState(
    settings.termsOfServiceData || DEFAULTS.termsOfServiceData || { heading: '', sections: [] }
  );

  useEffect(() => {
    if (settings._loaded) {
      setData(settings.termsOfServiceData || DEFAULTS.termsOfServiceData || { heading: '', sections: [] });
    }
  }, [settings._loaded, settings.termsOfServiceData]);

  const update = (patch) => setData(prev => ({ ...prev, ...patch }));

  const updateSection = (idx, patch) => {
    const sections = [...(data.sections || [])];
    sections[idx] = { ...sections[idx], ...patch };
    update({ sections });
  };

  const updateParagraph = (sIdx, pIdx, value) => {
    const sections = [...(data.sections || [])];
    const paras = [...(sections[sIdx].paragraphs || [])];
    paras[pIdx] = value;
    sections[sIdx] = { ...sections[sIdx], paragraphs: paras };
    update({ sections });
  };

  const addParagraph = (sIdx) => {
    const sections = [...(data.sections || [])];
    sections[sIdx] = { ...sections[sIdx], paragraphs: [...(sections[sIdx].paragraphs || []), ''] };
    update({ sections });
  };

  const removeParagraph = (sIdx, pIdx) => {
    const sections = [...(data.sections || [])];
    sections[sIdx] = { ...sections[sIdx], paragraphs: sections[sIdx].paragraphs.filter((_, i) => i !== pIdx) };
    update({ sections });
  };

  const addSection = () => {
    update({ sections: [...(data.sections || []), { title: '', paragraphs: [''] }] });
  };

  const removeSection = (idx) => {
    update({ sections: data.sections.filter((_, i) => i !== idx) });
  };

  const moveSectionUp = (idx) => {
    if (idx === 0) return;
    const sections = [...data.sections];
    [sections[idx - 1], sections[idx]] = [sections[idx], sections[idx - 1]];
    update({ sections });
  };

  const moveSectionDown = (idx) => {
    if (idx === data.sections.length - 1) return;
    const sections = [...data.sections];
    [sections[idx], sections[idx + 1]] = [sections[idx + 1], sections[idx]];
    update({ sections });
  };

  const handleSave = async () => {
    await updateSettings({ termsOfServiceData: data }, token);
    toast.success('Terms of Service page updated!');
  };

  return (
    <div className="space-y-6">
      <Section title="Page Settings">
        <Field label="Page Heading">
          <input
            type="text"
            value={data.heading || ''}
            onChange={e => update({ heading: e.target.value })}
            placeholder="e.g. Terms of Service"
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
          />
        </Field>
      </Section>

      <Section title="Sections">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest">
          Each section will be separated by a horizontal divider on the page.
        </p>
        {(data.sections || []).map((section, sIdx) => (
          <div key={sIdx} className="border border-black/10 p-5 space-y-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] uppercase tracking-widest font-bold text-gray-500">Section {sIdx + 1}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveSectionUp(sIdx)}
                  disabled={sIdx === 0}
                  className="text-[10px] px-2 py-1 border border-black/20 hover:bg-black hover:text-white transition-colors disabled:opacity-30"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveSectionDown(sIdx)}
                  disabled={sIdx === (data.sections || []).length - 1}
                  className="text-[10px] px-2 py-1 border border-black/20 hover:bg-black hover:text-white transition-colors disabled:opacity-30"
                  title="Move down"
                >
                  ↓
                </button>
                <button onClick={() => removeSection(sIdx)} className="text-red-500 hover:text-red-700 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <Field label="Section Title (italic heading)">
              <input
                type="text"
                value={section.title || ''}
                onChange={e => updateSection(sIdx, { title: e.target.value })}
                placeholder="e.g. Use of site"
                className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
              />
            </Field>

            <Field label="Paragraphs">
              {(section.paragraphs || []).map((para, pIdx) => (
                <div key={pIdx} className="flex gap-2 mb-2">
                  <textarea
                    value={para}
                    onChange={e => updateParagraph(sIdx, pIdx, e.target.value)}
                    rows={3}
                    placeholder="Enter paragraph text..."
                    className="flex-1 border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-y"
                  />
                  <button onClick={() => removeParagraph(sIdx, pIdx)} className="text-red-400 hover:text-red-600 self-start mt-1">
                    <MinusCircle size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addParagraph(sIdx)}
                className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black mt-1 transition-colors"
              >
                <PlusCircle size={13} /> Add Paragraph
              </button>
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

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );
}
