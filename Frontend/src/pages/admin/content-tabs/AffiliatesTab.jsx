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

export default function AffiliatesTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore(s => s.updateSettings);

  const [data, setData] = useState(
    settings.affiliatesData || DEFAULTS.affiliatesData || { heading: '', enabledInFooter: true, enabledInGetHelp: true, columns: [] }
  );

  useEffect(() => {
    if (settings._loaded) {
      setData(settings.affiliatesData || DEFAULTS.affiliatesData || { heading: '', enabledInFooter: true, enabledInGetHelp: true, columns: [] });
    }
  }, [settings._loaded, settings.affiliatesData]);

  const update = (patch) => setData(prev => ({ ...prev, ...patch }));

  const updateColumn = (colIdx, patch) => {
    const cols = [...(data.columns || [])];
    cols[colIdx] = { ...cols[colIdx], ...patch };
    update({ columns: cols });
  };

  const updateParagraph = (colIdx, pIdx, value) => {
    const cols = [...(data.columns || [])];
    const paras = [...(cols[colIdx].paragraphs || [])];
    paras[pIdx] = value;
    cols[colIdx] = { ...cols[colIdx], paragraphs: paras };
    update({ columns: cols });
  };

  const addParagraph = (colIdx) => {
    const cols = [...(data.columns || [])];
    cols[colIdx] = { ...cols[colIdx], paragraphs: [...(cols[colIdx].paragraphs || []), ''] };
    update({ columns: cols });
  };

  const removeParagraph = (colIdx, pIdx) => {
    const cols = [...(data.columns || [])];
    const paras = cols[colIdx].paragraphs.filter((_, i) => i !== pIdx);
    cols[colIdx] = { ...cols[colIdx], paragraphs: paras };
    update({ columns: cols });
  };

  const updateButton = (colIdx, bIdx, patch) => {
    const cols = [...(data.columns || [])];
    const btns = [...(cols[colIdx].buttons || [])];
    btns[bIdx] = { ...btns[bIdx], ...patch };
    cols[colIdx] = { ...cols[colIdx], buttons: btns };
    update({ columns: cols });
  };

  const addButton = (colIdx) => {
    const cols = [...(data.columns || [])];
    cols[colIdx] = { ...cols[colIdx], buttons: [...(cols[colIdx].buttons || []), { text: '', url: '' }] };
    update({ columns: cols });
  };

  const removeButton = (colIdx, bIdx) => {
    const cols = [...(data.columns || [])];
    cols[colIdx] = { ...cols[colIdx], buttons: cols[colIdx].buttons.filter((_, i) => i !== bIdx) };
    update({ columns: cols });
  };

  const addColumn = () => {
    update({ columns: [...(data.columns || []), { title: '', paragraphs: [''], buttons: [{ text: '', url: '' }] }] });
  };

  const removeColumn = (colIdx) => {
    update({ columns: data.columns.filter((_, i) => i !== colIdx) });
  };

  const handleSave = async () => {
    await updateSettings({ affiliatesData: data }, token);
    toast.success('Affiliates page updated!');
  };

  return (
    <div className="space-y-6">
      <Section title="Page Settings">
        <Field label="Main Heading">
          <input
            type="text"
            value={data.heading || ''}
            onChange={e => update({ heading: e.target.value })}
            placeholder="e.g. become an affiliate"
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
          />
        </Field>
      </Section>

      <Section title="Visibility Settings">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={data.enabledInFooter !== false}
              onChange={e => update({ enabledInFooter: e.target.checked })}
              className="w-4 h-4 accent-black"
            />
            Show "Affiliates" link in footer bottom bar
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={data.enabledInGetHelp !== false}
              onChange={e => update({ enabledInGetHelp: e.target.checked })}
              className="w-4 h-4 accent-black"
            />
            Show "Affiliates" link in Get Help section (footer)
          </label>
        </div>
      </Section>

      <Section title="Columns">
        {(data.columns || []).map((col, colIdx) => (
          <div key={colIdx} className="border border-black/10 p-5 space-y-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] uppercase tracking-widest font-bold text-gray-500">Column {colIdx + 1}</span>
              <button onClick={() => removeColumn(colIdx)} className="text-red-500 hover:text-red-700 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>

            <Field label="Column Title">
              <input
                type="text"
                value={col.title || ''}
                onChange={e => updateColumn(colIdx, { title: e.target.value })}
                placeholder="e.g. CREATOR AFFILIATES"
                className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
              />
            </Field>

            <Field label="Paragraphs">
              {(col.paragraphs || []).map((para, pIdx) => (
                <div key={pIdx} className="flex gap-2 mb-2">
                  <textarea
                    value={para}
                    onChange={e => updateParagraph(colIdx, pIdx, e.target.value)}
                    rows={2}
                    className="flex-1 border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-y"
                  />
                  <button onClick={() => removeParagraph(colIdx, pIdx)} className="text-red-400 hover:text-red-600 self-start mt-1">
                    <MinusCircle size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addParagraph(colIdx)}
                className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black mt-1 transition-colors"
              >
                <PlusCircle size={13} /> Add Paragraph
              </button>
            </Field>

            <Field label="Buttons">
              {(col.buttons || []).map((btn, bIdx) => (
                <div key={bIdx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={btn.text || ''}
                    onChange={e => updateButton(colIdx, bIdx, { text: e.target.value })}
                    placeholder="Button Text"
                    className="flex-1 border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    value={btn.url || ''}
                    onChange={e => updateButton(colIdx, bIdx, { url: e.target.value })}
                    placeholder="URL (https://...)"
                    className="flex-1 border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
                  />
                  <button onClick={() => removeButton(colIdx, bIdx)} className="text-red-400 hover:text-red-600">
                    <MinusCircle size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addButton(colIdx)}
                className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black mt-1 transition-colors"
              >
                <PlusCircle size={13} /> Add Button
              </button>
            </Field>
          </div>
        ))}

        <button
          onClick={addColumn}
          className="flex items-center gap-2 border border-dashed border-black/30 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black hover:border-black px-4 py-3 w-full justify-center transition-colors"
        >
          <Plus size={14} /> Add Column
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
