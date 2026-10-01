import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
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

export default function CustomerDataTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore(s => s.updateSettings);

  const [data, setData] = useState(settings.customerDataRequests || DEFAULTS.customerDataRequests || { heading: '', sections: [] });

  useEffect(() => {
    if (settings._loaded) {
      setData(settings.customerDataRequests || DEFAULTS.customerDataRequests || { heading: '', sections: [] });
    }
  }, [settings._loaded, settings.customerDataRequests]);

  const update = (patch) => setData(prev => ({ ...prev, ...patch }));

  const updateSection = (index, patch) => {
    const newSections = [...(data.sections || [])];
    newSections[index] = { ...newSections[index], ...patch };
    update({ sections: newSections });
  };

  const handleSave = async () => {
    await updateSettings({ customerDataRequests: data }, token);
    toast.success('Customer Data Requests page updated!');
  };

  return (
    <div className="space-y-6">
      <Section title="Page Content">
        <Field label="Heading">
          <input
            type="text"
            value={data.heading || ''}
            onChange={e => update({ heading: e.target.value })}
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
          />
        </Field>
      </Section>
      
      <Section title="Sections">
        {(data.sections || []).map((section, idx) => (
          <div key={idx} className="border border-black/10 p-4 relative mb-4 space-y-4">
            <Field label={`Section ${idx + 1} Title`}>
              <input
                type="text"
                value={section.title || ''}
                onChange={e => updateSection(idx, { title: e.target.value })}
                className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={section.description || ''}
                onChange={e => updateSection(idx, { description: e.target.value })}
                className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-y"
                rows={2}
              />
            </Field>
            <Field label="Button Text">
              <input
                type="text"
                value={section.buttonText || ''}
                onChange={e => updateSection(idx, { buttonText: e.target.value })}
                className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
              />
            </Field>
          </div>
        ))}
      </Section>

      <Section title="Footer Link Settings">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={data.enabledInFooter !== false}
            onChange={e => update({ enabledInFooter: e.target.checked })}
            className="w-4 h-4 accent-black"
          />
          Show "Customer Data Requests" link in footer
        </label>
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
