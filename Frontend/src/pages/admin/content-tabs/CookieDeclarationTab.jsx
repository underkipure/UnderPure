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

const inputCls = "w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black";
const textareaCls = "w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-y";

export default function CookieDeclarationTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore(s => s.updateSettings);
  const defaults = DEFAULTS.cookieDeclarationData;

  const [data, setData] = useState(settings.cookieDeclarationData || defaults);

  useEffect(() => {
    if (settings._loaded) setData(settings.cookieDeclarationData || defaults);
  }, [settings._loaded, settings.cookieDeclarationData]);

  const upd = (patch) => setData(p => ({ ...p, ...patch }));

  const updSection = (idx, patch) => {
    const sections = [...(data.sections || [])];
    sections[idx] = { ...sections[idx], ...patch };
    upd({ sections });
  };

  const addSection = () => upd({
    sections: [...(data.sections || []), { heading: '', description: '', cookies: [] }]
  });

  const removeSection = (idx) => upd({ sections: data.sections.filter((_, i) => i !== idx) });

  const updCookie = (sIdx, cIdx, patch) => {
    const sections = [...(data.sections || [])];
    const cookies = [...(sections[sIdx].cookies || [])];
    cookies[cIdx] = { ...cookies[cIdx], ...patch };
    sections[sIdx] = { ...sections[sIdx], cookies };
    upd({ sections });
  };

  const addCookie = (sIdx) => {
    const sections = [...(data.sections || [])];
    sections[sIdx] = { ...sections[sIdx], cookies: [...(sections[sIdx].cookies || []), { name: '', domain: '', retention: '', type: '', provider: '', purpose: '' }] };
    upd({ sections });
  };

  const removeCookie = (sIdx, cIdx) => {
    const sections = [...(data.sections || [])];
    sections[sIdx] = { ...sections[sIdx], cookies: sections[sIdx].cookies.filter((_, i) => i !== cIdx) };
    upd({ sections });
  };

  const handleSave = async () => {
    await updateSettings({ cookieDeclarationData: data }, token);
    toast.success('Cookie Declaration page updated!');
  };

  return (
    <div className="space-y-6">
      <Section title="Page Header">
        <Field label="Main Title">
          <input type="text" value={data.title || ''} onChange={e => upd({ title: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Meta Text (e.g. Date generated)">
          <input type="text" value={data.metaText || ''} onChange={e => upd({ metaText: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Introductory Text">
          <textarea value={data.introText || ''} onChange={e => upd({ introText: e.target.value })} rows={4} className={textareaCls} />
        </Field>
      </Section>

      <Section title="Cookie Categories">
        {(data.sections || []).map((section, sIdx) => (
          <div key={sIdx} className="border border-black/10 p-5 space-y-4 mb-4 bg-gray-50/30">
            <div className="flex justify-between items-center border-b border-black/5 pb-2">
              <span className="text-[12px] uppercase tracking-widest font-bold text-gray-700">Category {sIdx + 1}</span>
              <button onClick={() => removeSection(sIdx)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
            </div>
            <Field label="Category Heading">
              <input type="text" value={section.heading || ''} onChange={e => updSection(sIdx, { heading: e.target.value })} className={inputCls} placeholder="Strictly necessary cookies" />
            </Field>
            <Field label="Category Description">
              <textarea value={section.description || ''} onChange={e => updSection(sIdx, { description: e.target.value })} rows={2} className={textareaCls} />
            </Field>

            <div className="space-y-3 mt-6">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Cookies List</p>
              {(section.cookies || []).map((cookie, cIdx) => (
                <div key={cIdx} className="bg-white p-4 border border-black/10 flex flex-col gap-3 relative">
                  <button onClick={() => removeCookie(sIdx, cIdx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><MinusCircle size={16} /></button>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pr-8">
                    <Field label="Name"><input type="text" value={cookie.name || ''} onChange={e => updCookie(sIdx, cIdx, { name: e.target.value })} className={inputCls} /></Field>
                    <Field label="Domain"><input type="text" value={cookie.domain || ''} onChange={e => updCookie(sIdx, cIdx, { domain: e.target.value })} className={inputCls} /></Field>
                    <Field label="Retention"><input type="text" value={cookie.retention || ''} onChange={e => updCookie(sIdx, cIdx, { retention: e.target.value })} className={inputCls} /></Field>
                    <Field label="Type"><input type="text" value={cookie.type || ''} onChange={e => updCookie(sIdx, cIdx, { type: e.target.value })} className={inputCls} /></Field>
                    <Field label="Provider"><input type="text" value={cookie.provider || ''} onChange={e => updCookie(sIdx, cIdx, { provider: e.target.value })} className={inputCls} /></Field>
                  </div>
                  <Field label="Purpose"><textarea value={cookie.purpose || ''} onChange={e => updCookie(sIdx, cIdx, { purpose: e.target.value })} rows={2} className={textareaCls} /></Field>
                </div>
              ))}
              <button onClick={() => addCookie(sIdx)} className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors pt-2">
                <PlusCircle size={13} /> Add Cookie to Category
              </button>
            </div>
          </div>
        ))}
        <button onClick={addSection} className="flex items-center gap-2 border border-dashed border-black/30 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black hover:border-black px-4 py-3 w-full justify-center transition-colors mt-4">
          <Plus size={14} /> Add New Category
        </button>
      </Section>

      <div className="flex justify-end pt-4">
        <button onClick={handleSave} className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-md">
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );
}
