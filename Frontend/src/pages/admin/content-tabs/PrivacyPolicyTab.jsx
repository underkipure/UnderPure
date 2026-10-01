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

export default function PrivacyPolicyTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore(s => s.updateSettings);

  const empty = { heading: 'privacy policy', lastUpdated: '', introParagraphs: [], sections: [] };

  const [data, setData] = useState(settings.privacyPolicyData || DEFAULTS.privacyPolicyData || empty);

  useEffect(() => {
    if (settings._loaded) {
      setData(settings.privacyPolicyData || DEFAULTS.privacyPolicyData || empty);
    }
  }, [settings._loaded, settings.privacyPolicyData]);

  const update = (patch) => setData(prev => ({ ...prev, ...patch }));

  /* ── Intro paragraphs ── */
  const updateIntroPara = (idx, val) => {
    const arr = [...(data.introParagraphs || [])];
    arr[idx] = val;
    update({ introParagraphs: arr });
  };
  const addIntroPara = () => update({ introParagraphs: [...(data.introParagraphs || []), ''] });
  const removeIntroPara = (idx) => update({ introParagraphs: data.introParagraphs.filter((_, i) => i !== idx) });

  /* ── Sections ── */
  const updateSection = (idx, patch) => {
    const sections = [...(data.sections || [])];
    sections[idx] = { ...sections[idx], ...patch };
    update({ sections });
  };

  /* paragraphs */
  const updatePara = (sIdx, pIdx, val) => {
    const sections = [...(data.sections || [])];
    const paras = [...(sections[sIdx].paragraphs || [])];
    paras[pIdx] = val;
    sections[sIdx] = { ...sections[sIdx], paragraphs: paras };
    update({ sections });
  };
  const addPara = (sIdx) => {
    const sections = [...(data.sections || [])];
    sections[sIdx] = { ...sections[sIdx], paragraphs: [...(sections[sIdx].paragraphs || []), ''] };
    update({ sections });
  };
  const removePara = (sIdx, pIdx) => {
    const sections = [...(data.sections || [])];
    sections[sIdx] = { ...sections[sIdx], paragraphs: sections[sIdx].paragraphs.filter((_, i) => i !== pIdx) };
    update({ sections });
  };

  /* bullets */
  const updateBullet = (sIdx, bIdx, val) => {
    const sections = [...(data.sections || [])];
    const bullets = [...(sections[sIdx].bullets || [])];
    bullets[bIdx] = val;
    sections[sIdx] = { ...sections[sIdx], bullets };
    update({ sections });
  };
  const addBullet = (sIdx) => {
    const sections = [...(data.sections || [])];
    sections[sIdx] = { ...sections[sIdx], bullets: [...(sections[sIdx].bullets || []), ''] };
    update({ sections });
  };
  const removeBullet = (sIdx, bIdx) => {
    const sections = [...(data.sections || [])];
    sections[sIdx] = { ...sections[sIdx], bullets: sections[sIdx].bullets.filter((_, i) => i !== bIdx) };
    update({ sections });
  };

  /* afterBulletParagraphs */
  const updateAfterBullet = (sIdx, pIdx, val) => {
    const sections = [...(data.sections || [])];
    const arr = [...(sections[sIdx].afterBulletParagraphs || [])];
    arr[pIdx] = val;
    sections[sIdx] = { ...sections[sIdx], afterBulletParagraphs: arr };
    update({ sections });
  };
  const addAfterBullet = (sIdx) => {
    const sections = [...(data.sections || [])];
    sections[sIdx] = { ...sections[sIdx], afterBulletParagraphs: [...(sections[sIdx].afterBulletParagraphs || []), ''] };
    update({ sections });
  };
  const removeAfterBullet = (sIdx, pIdx) => {
    const sections = [...(data.sections || [])];
    sections[sIdx] = { ...sections[sIdx], afterBulletParagraphs: sections[sIdx].afterBulletParagraphs.filter((_, i) => i !== pIdx) };
    update({ sections });
  };

  const addSection = () => update({ sections: [...(data.sections || []), { title: '', paragraphs: [], bullets: [], afterBulletParagraphs: [] }] });
  const removeSection = (idx) => update({ sections: data.sections.filter((_, i) => i !== idx) });

  const moveSectionUp = (idx) => {
    if (idx === 0) return;
    const s = [...data.sections];
    [s[idx - 1], s[idx]] = [s[idx], s[idx - 1]];
    update({ sections: s });
  };
  const moveSectionDown = (idx) => {
    if (idx === data.sections.length - 1) return;
    const s = [...data.sections];
    [s[idx], s[idx + 1]] = [s[idx + 1], s[idx]];
    update({ sections: s });
  };

  const handleSave = async () => {
    await updateSettings({ privacyPolicyData: data }, token);
    toast.success('Privacy Policy updated!');
  };

  return (
    <div className="space-y-6">

      {/* Page Settings */}
      <Section title="Page Settings">
        <Field label="Heading (italic lowercase)">
          <input
            type="text"
            value={data.heading || ''}
            onChange={e => update({ heading: e.target.value })}
            placeholder="e.g. privacy policy"
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
          />
        </Field>
        <Field label="Last Updated Text">
          <input
            type="text"
            value={data.lastUpdated || ''}
            onChange={e => update({ lastUpdated: e.target.value })}
            placeholder="e.g. LAST UPDATED: SEPTEMBER 26, 2023"
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
          />
        </Field>
      </Section>

      {/* Intro Paragraphs */}
      <Section title="Intro Paragraphs (no title, shown at top)">
        {(data.introParagraphs || []).map((para, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <textarea
              value={para}
              onChange={e => updateIntroPara(idx, e.target.value)}
              rows={3}
              placeholder="Intro paragraph text..."
              className="flex-1 border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-y"
            />
            <button onClick={() => removeIntroPara(idx)} className="text-red-400 hover:text-red-600 self-start mt-1">
              <MinusCircle size={16} />
            </button>
          </div>
        ))}
        <button onClick={addIntroPara} className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
          <PlusCircle size={13} /> Add Intro Paragraph
        </button>
      </Section>

      {/* Sections */}
      <Section title="Sections">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest">
          Sections have an UPPERCASE title, paragraphs, bullet points, and optional after-bullet paragraphs.
        </p>

        {(data.sections || []).map((section, sIdx) => (
          <div key={sIdx} className="border border-black/10 p-5 space-y-5 mb-4">
            {/* Section header controls */}
            <div className="flex justify-between items-center">
              <span className="text-[11px] uppercase tracking-widest font-bold text-gray-500">Section {sIdx + 1}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => moveSectionUp(sIdx)} disabled={sIdx === 0}
                  className="text-[10px] px-2 py-1 border border-black/20 hover:bg-black hover:text-white transition-colors disabled:opacity-30">↑</button>
                <button onClick={() => moveSectionDown(sIdx)} disabled={sIdx === (data.sections || []).length - 1}
                  className="text-[10px] px-2 py-1 border border-black/20 hover:bg-black hover:text-white transition-colors disabled:opacity-30">↓</button>
                <button onClick={() => removeSection(sIdx)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Title */}
            <Field label="Title (UPPERCASE on page)">
              <input
                type="text"
                value={section.title || ''}
                onChange={e => updateSection(sIdx, { title: e.target.value })}
                placeholder="e.g. UPDATES TO THIS POLICY"
                className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
              />
            </Field>

            {/* Paragraphs */}
            <Field label="Paragraphs (shown before bullets)">
              {(section.paragraphs || []).map((para, pIdx) => (
                <div key={pIdx} className="flex gap-2 mb-2">
                  <textarea value={para} onChange={e => updatePara(sIdx, pIdx, e.target.value)} rows={2}
                    className="flex-1 border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-y" />
                  <button onClick={() => removePara(sIdx, pIdx)} className="text-red-400 hover:text-red-600 self-start mt-1">
                    <MinusCircle size={16} />
                  </button>
                </div>
              ))}
              <button onClick={() => addPara(sIdx)} className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                <PlusCircle size={13} /> Add Paragraph
              </button>
            </Field>

            {/* Bullets */}
            <Field label="Bullet Points">
              {(section.bullets || []).map((bullet, bIdx) => (
                <div key={bIdx} className="flex gap-2 mb-2">
                  <input type="text" value={bullet} onChange={e => updateBullet(sIdx, bIdx, e.target.value)}
                    placeholder="Bullet item text..."
                    className="flex-1 border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black" />
                  <button onClick={() => removeBullet(sIdx, bIdx)} className="text-red-400 hover:text-red-600">
                    <MinusCircle size={16} />
                  </button>
                </div>
              ))}
              <button onClick={() => addBullet(sIdx)} className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                <PlusCircle size={13} /> Add Bullet
              </button>
            </Field>

            {/* After-bullet paragraphs */}
            <Field label="Paragraphs After Bullets (optional)">
              {(section.afterBulletParagraphs || []).map((para, pIdx) => (
                <div key={pIdx} className="flex gap-2 mb-2">
                  <textarea value={para} onChange={e => updateAfterBullet(sIdx, pIdx, e.target.value)} rows={2}
                    className="flex-1 border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-y" />
                  <button onClick={() => removeAfterBullet(sIdx, pIdx)} className="text-red-400 hover:text-red-600 self-start mt-1">
                    <MinusCircle size={16} />
                  </button>
                </div>
              ))}
              <button onClick={() => addAfterBullet(sIdx)} className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                <PlusCircle size={13} /> Add After-Bullet Paragraph
              </button>
            </Field>
          </div>
        ))}

        <button onClick={addSection}
          className="flex items-center gap-2 border border-dashed border-black/30 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black hover:border-black px-4 py-3 w-full justify-center transition-colors">
          <Plus size={14} /> Add Section
        </button>
      </Section>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );
}
