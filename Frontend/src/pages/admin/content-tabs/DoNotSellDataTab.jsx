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

export default function DoNotSellDataTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore(s => s.updateSettings);

  const [data, setData] = useState(settings.doNotSellData || DEFAULTS.doNotSellData || {});

  useEffect(() => {
    if (settings._loaded) {
      setData(settings.doNotSellData || DEFAULTS.doNotSellData || {});
    }
  }, [settings._loaded, settings.doNotSellData]);

  const update = (patch) => setData(prev => ({ ...prev, ...patch }));

  const handleSave = async () => {
    await updateSettings({ doNotSellData: data }, token);
    toast.success('Do Not Sell My Data page updated!');
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

        <Field label="Content (Markdown supported)">
          <textarea
            value={data.content || ''}
            onChange={e => update({ content: e.target.value })}
            rows={10}
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-y font-mono"
            placeholder="Use **text** for bold, and empty lines for paragraphs."
          />
          <p className="text-xs text-gray-400 mt-2">Use **bold** to make text bold.</p>
        </Field>
      </Section>
      
      <Section title="Footer Link Settings">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={data.enabledInFooter !== false}
            onChange={e => update({ enabledInFooter: e.target.checked })}
            className="w-4 h-4 accent-black"
          />
          Show "Do Not Sell My Data" link in footer
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
