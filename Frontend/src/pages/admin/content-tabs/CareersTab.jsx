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

export default function CareersTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore(s => s.updateSettings);
  const defaults = DEFAULTS.careersData;

  const [data, setData] = useState(settings.careersData || defaults);

  useEffect(() => {
    if (settings._loaded) setData(settings.careersData || defaults);
  }, [settings._loaded, settings.careersData]);

  const upd = (patch) => setData(p => ({ ...p, ...patch }));

  const updDept = (idx, patch) => {
    const depts = [...(data.departments || [])];
    depts[idx] = { ...depts[idx], ...patch };
    upd({ departments: depts });
  };

  const addDept = () => upd({
    departments: [...(data.departments || []), { name: '', jobs: [] }]
  });

  const removeDept = (idx) => upd({ departments: data.departments.filter((_, i) => i !== idx) });

  const updJob = (dIdx, jIdx, patch) => {
    const depts = [...(data.departments || [])];
    const jobs = [...(depts[dIdx].jobs || [])];
    jobs[jIdx] = { ...jobs[jIdx], ...patch };
    depts[dIdx] = { ...depts[dIdx], jobs };
    upd({ departments: depts });
  };

  const addJob = (dIdx) => {
    const depts = [...(data.departments || [])];
    depts[dIdx] = { ...depts[dIdx], jobs: [...(depts[dIdx].jobs || []), { title: '' }] };
    upd({ departments: depts });
  };

  const removeJob = (dIdx, jIdx) => {
    const depts = [...(data.departments || [])];
    depts[dIdx] = { ...depts[dIdx], jobs: depts[dIdx].jobs.filter((_, i) => i !== jIdx) };
    upd({ departments: depts });
  };

  const handleSave = async () => {
    await updateSettings({ careersData: data }, token);
    toast.success('Careers page updated!');
  };

  return (
    <div className="space-y-6">
      <Section title="Visibility">
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={data.enabledInFooter !== false} 
            onChange={(e) => upd({ enabledInFooter: e.target.checked })}
            className="w-4 h-4 accent-black"
          />
          <span className="text-sm font-bold text-black uppercase tracking-widest">Show "Careers" link in Footer (Get Help section)</span>
        </label>
      </Section>

      <Section title="Page Header & Footer">
        <Field label="Main Title">
          <input type="text" value={data.title || ''} onChange={e => upd({ title: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Bottom Text (Contact Info)">
          <textarea value={data.bottomText || ''} onChange={e => upd({ bottomText: e.target.value })} rows={3} className={textareaCls} />
        </Field>
      </Section>

      <Section title="Departments & Roles">
        {(data.departments || []).map((dept, dIdx) => (
          <div key={dIdx} className="border border-black/10 p-5 space-y-4 mb-4 bg-gray-50/30">
            <div className="flex justify-between items-center border-b border-black/5 pb-2">
              <span className="text-[12px] uppercase tracking-widest font-bold text-gray-700">Department {dIdx + 1}</span>
              <button onClick={() => removeDept(dIdx)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
            </div>
            <Field label="Department Name (e.g. MARKETING & E-COMMERCE)">
              <input type="text" value={dept.name || ''} onChange={e => updDept(dIdx, { name: e.target.value })} className={inputCls} />
            </Field>

            <div className="space-y-2 mt-4 pl-4 border-l-2 border-black/10">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Open Roles</p>
              {(dept.jobs || []).map((job, jIdx) => (
                <div key={jIdx} className="flex items-center gap-2">
                  <input type="text" value={job.title || ''} onChange={e => updJob(dIdx, jIdx, { title: e.target.value })} className={inputCls} placeholder="Job Title" />
                  <input type="text" value={job.url || ''} onChange={e => updJob(dIdx, jIdx, { url: e.target.value })} className={inputCls} placeholder="Link URL (e.g. mailto: or https://)" />
                  <button onClick={() => removeJob(dIdx, jIdx)} className="text-red-400 hover:text-red-600 px-2"><MinusCircle size={16} /></button>
                </div>
              ))}
              <button onClick={() => addJob(dIdx)} className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors pt-2">
                <PlusCircle size={13} /> Add Job Role
              </button>
            </div>
          </div>
        ))}
        <button onClick={addDept} className="flex items-center gap-2 border border-dashed border-black/30 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black hover:border-black px-4 py-3 w-full justify-center transition-colors mt-4">
          <Plus size={14} /> Add New Department
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
