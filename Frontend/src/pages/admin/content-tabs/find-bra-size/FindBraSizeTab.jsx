import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useSiteSettingsStore, DEFAULTS } from '../../../../store/siteSettingsStore';
import { useAuthStore } from '../../../../store/authStore';
import { toast } from 'sonner';

import HeroSectionEditor from './components/HeroSectionEditor';
import NavTabsEditor from './components/NavTabsEditor';
import IntroSectionEditor from './components/IntroSectionEditor';
import MeasurementSectionsEditor from './components/MeasurementSectionsEditor';
import SizeCalculatorEditor from './components/SizeCalculatorEditor';
import StyleGuideSectionsEditor from './components/StyleGuideSectionsEditor';
import FitAndSupportSectionsEditor from './components/FitAndSupportSectionsEditor';

export default function FindBraSizeTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore(s => s.updateSettings);
  const defaults = DEFAULTS.braSizeData;

  const [data, setData] = useState(settings.braSizeData || defaults);
  const [uploading, setUploading] = useState(false);

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend'}/upload/image?folder=bra-size`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const handleImageUpload = async (e, callback) => {
    if (e?.target?.files) {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      try {
        const url = await uploadFileToServer(file);
        callback(url);
      } catch (err) {
        toast.error('Failed to upload image');
      } finally {
        setUploading(false);
      }
    } else {
      callback(e); // String URL case
    }
  };

  useEffect(() => {
    if (settings._loaded) setData(settings.braSizeData || defaults);
  }, [settings._loaded, settings.braSizeData]);

  const upd = (patch) => setData(p => ({ ...p, ...patch }));
  const updNested = (key, patch) => setData(p => ({ ...p, [key]: { ...p[key], ...patch } }));

  /* ─── Nav Tabs ─── */
  const updNavTab = (idx, patch) => {
    const navTabs = [...(data.navTabs || [])];
    navTabs[idx] = { ...navTabs[idx], ...patch };
    upd({ navTabs });
  };
  const addNavTab = () => upd({ navTabs: [...(data.navTabs || []), { label: '', anchor: '' }] });
  const removeNavTab = (idx) => upd({ navTabs: data.navTabs.filter((_, i) => i !== idx) });

  /* ─── Sections (Band/Bust) ─── */
  const updSection = (idx, patch) => {
    const sections = [...(data.sections || [])];
    sections[idx] = { ...sections[idx], ...patch };
    upd({ sections });
  };
  const updStep = (sIdx, stIdx, val) => {
    const sections = [...(data.sections || [])];
    const steps = [...(sections[sIdx].steps || [])];
    steps[stIdx] = val;
    sections[sIdx] = { ...sections[sIdx], steps };
    upd({ sections });
  };
  const addStep = (sIdx) => {
    const sections = [...(data.sections || [])];
    sections[sIdx] = { ...sections[sIdx], steps: [...(sections[sIdx].steps || []), ''] };
    upd({ sections });
  };
  const removeStep = (sIdx, stIdx) => {
    const sections = [...(data.sections || [])];
    sections[sIdx] = { ...sections[sIdx], steps: sections[sIdx].steps.filter((_, i) => i !== stIdx) };
    upd({ sections });
  };
  const addSection = () => upd({
    sections: [...(data.sections || []), { headingPrefix: 'the', headingItalic: '', image: '', imageAlt: '', steps: [''], hotTip: '', anchor: '' }]
  });
  const removeSection = (idx) => upd({ sections: data.sections.filter((_, i) => i !== idx) });

  /* ─── Calculator Shop Buttons ─── */
  const updShopBtn = (idx, patch) => {
    const btns = [...(data.calculator?.shopButtons || [])];
    btns[idx] = { ...btns[idx], ...patch };
    updNested('calculator', { shopButtons: btns });
  };
  const addShopBtn = () => updNested('calculator', { shopButtons: [...(data.calculator?.shopButtons || []), { label: '', url: '' }] });
  const removeShopBtn = (idx) => updNested('calculator', { shopButtons: data.calculator.shopButtons.filter((_, i) => i !== idx) });

  /* ─── Extra Sections (Style Guide) ─── */
  const updExtraSection = (idx, patch) => {
    const ext = [...(data.extraSections || [])];
    ext[idx] = { ...ext[idx], ...patch };
    upd({ extraSections: ext });
  };
  const updExtraItem = (sIdx, iIdx, patch) => {
    const ext = [...(data.extraSections || [])];
    const items = [...(ext[sIdx].items || [])];
    items[iIdx] = { ...items[iIdx], ...patch };
    ext[sIdx] = { ...ext[sIdx], items };
    upd({ extraSections: ext });
  };
  const addExtraItem = (sIdx) => {
    const ext = [...(data.extraSections || [])];
    ext[sIdx] = { ...ext[sIdx], items: [...(ext[sIdx].items || []), { image: '', title: '', description: '' }] };
    upd({ extraSections: ext });
  };
  const removeExtraItem = (sIdx, iIdx) => {
    const ext = [...(data.extraSections || [])];
    ext[sIdx] = { ...ext[sIdx], items: ext[sIdx].items.filter((_, i) => i !== iIdx) };
    upd({ extraSections: ext });
  };
  const addExtraSection = () => upd({
    extraSections: [...(data.extraSections || []), { anchor: '', headingPrefix: '', headingItalic: '', description: '', items: [] }]
  });
  const removeExtraSection = (idx) => upd({ extraSections: data.extraSections.filter((_, i) => i !== idx) });

  const handleSave = async () => {
    await updateSettings({ braSizeData: data }, token);
    toast.success('Find Your Bra Size page updated!');
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <HeroSectionEditor 
        hero={data.hero} 
        updNested={updNested} 
        handleImageUpload={handleImageUpload} 
        uploading={uploading} 
      />

      {/* Nav Tabs */}
      <NavTabsEditor 
        navTabs={data.navTabs} 
        updNavTab={updNavTab} 
        addNavTab={addNavTab} 
        removeNavTab={removeNavTab} 
      />

      {/* Intro Section */}
      <IntroSectionEditor 
        intro={data.intro} 
        updNested={updNested} 
      />

      {/* Band / Bust Sections */}
      <MeasurementSectionsEditor 
        sections={data.sections}
        updSection={updSection}
        addSection={addSection}
        removeSection={removeSection}
        updStep={updStep}
        addStep={addStep}
        removeStep={removeStep}
        handleImageUpload={handleImageUpload}
        uploading={uploading}
      />

      {/* Size Calculator */}
      <SizeCalculatorEditor 
        calculator={data.calculator}
        updNested={updNested}
        updShopBtn={updShopBtn}
        addShopBtn={addShopBtn}
        removeShopBtn={removeShopBtn}
      />

      {/* Extra Sections (Style Guide) */}
      <StyleGuideSectionsEditor 
        extraSections={data.extraSections}
        updExtraSection={updExtraSection}
        addExtraSection={addExtraSection}
        removeExtraSection={removeExtraSection}
        updExtraItem={updExtraItem}
        addExtraItem={addExtraItem}
        removeExtraItem={removeExtraItem}
        handleImageUpload={handleImageUpload}
        uploading={uploading}
      />

      {/* Fit 101 & Support Sections */}
      <FitAndSupportSectionsEditor 
        fitSection={data.fitSection}
        supportSection={data.supportSection}
        updNested={updNested}
      />

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
