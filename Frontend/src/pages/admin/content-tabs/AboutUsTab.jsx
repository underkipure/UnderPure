import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { useSiteSettingsStore, DEFAULTS } from '../../../store/siteSettingsStore';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend';

// ── UI helpers ──
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

export default function AboutUsTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore(s => s.updateSettings);

  const [d, setD] = useState(settings.aboutUsData || DEFAULTS.aboutUsData);

  // Sync when store loads
  useEffect(() => {
    if (settings._loaded && settings.aboutUsData) {
      setD(settings.aboutUsData);
    }
  }, [settings._loaded]);

  const update = (patch) => setD(prev => ({ ...prev, ...patch }));

  // ── Upload helper ──
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE_URL}/upload/image?folder=about_us`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const handleSave = async () => {
    await updateSettings({ aboutUsData: d }, token);
    toast.success('About Us page saved!');
  };

  // ── Paragraph helpers ──
  const updateParagraph = (arr, setArr, idx, val) =>
    setArr(arr.map((p, i) => i === idx ? val : p));
  const addParagraph = (arr, key) => update({ [key]: [...arr, ''] });
  const removeParagraph = (arr, key, idx) => update({ [key]: arr.filter((_, i) => i !== idx) });

  // ── Image list helpers ──
  const removeImg = (key, id) =>
    update({ [key]: d[key].filter(img => img.id !== id) });

  const uploadAndAddImg = async (key, file, extra = {}) => {
    try {
      toast.info('Uploading image...');
      const url = await uploadImage(file);
      update({ [key]: [...d[key], { id: Date.now(), src: url, ...extra }] });
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Section 1: Hero ── */}
      <Section title="Section 1 — About Us Hero">
        <Field label="Main Quote / Heading">
          <input
            type="text"
            value={d.heroQuote}
            onChange={e => update({ heroQuote: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm font-serif focus:outline-none focus:border-black"
          />
        </Field>

        <Field label="Body Paragraphs">
          <div className="space-y-3">
            {d.heroParagraphs.map((para, idx) => (
              <div key={idx} className="flex gap-2 items-start group">
                <textarea
                  rows={3}
                  value={para}
                  onChange={e => update({ heroParagraphs: d.heroParagraphs.map((p, i) => i === idx ? e.target.value : p) })}
                  className="flex-1 border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-none"
                />
                <button onClick={() => update({ heroParagraphs: d.heroParagraphs.filter((_, i) => i !== idx) })} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button onClick={() => update({ heroParagraphs: [...d.heroParagraphs, ''] })} className="flex items-center gap-1 text-[10px] uppercase tracking-widest hover:underline">
              <Plus size={11} /> Add Paragraph
            </button>
          </div>
        </Field>

        <Field label="Hero Image (right side)">
          <div className="flex items-start gap-4">
            {d.heroImage && (
              <img loading="lazy" src={d.heroImage} alt="Hero" className="h-32 w-24 object-cover border border-black/10" />
            )}
            <label className="border border-black/20 px-4 py-2 text-[10px] uppercase tracking-widest cursor-pointer hover:border-black transition-colors flex items-center gap-2">
              <ImageIcon size={12} /> Upload Image
              <input type="file" accept="image/*" className="hidden" onChange={async e => {
                const file = e.target.files[0];
                if (file) {
                  try {
                    toast.info('Uploading...');
                    const url = await uploadImage(file);
                    update({ heroImage: url });
                    toast.success('Image updated!');
                  } catch { toast.error('Upload failed'); }
                }
              }} />
            </label>
          </div>
        </Field>
      </Section>

      {/* ── Section 2: Fatale Slider ── */}
      <Section title="Section 2 — Gallery Slider">
        <Field label="Hashtag">
          <input
            type="text"
            value={d.fataleHashtag}
            onChange={e => update({ fataleHashtag: e.target.value })}
            placeholder="#yourtag"
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black max-w-xs"
          />
        </Field>

        <Field label="Slider Images">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {d.fataleImages.map(img => (
              <div key={img.id} className="aspect-square bg-gray-100 border border-black/10 relative group overflow-hidden">
                <img loading="lazy" src={img.src} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => update({ fataleImages: d.fataleImages.filter(i => i.id !== img.id) })} className="bg-white text-red-600 p-2 rounded-full">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
              <ImageIcon size={22} className="text-gray-300 mb-1" />
              <span className="text-[9px] uppercase tracking-widest text-gray-400">Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={async e => {
                const file = e.target.files[0];
                if (file) {
                  try {
                    toast.info('Uploading...');
                    const url = await uploadImage(file);
                    update({ fataleImages: [...d.fataleImages, { id: Date.now(), src: url, hasPlay: false }] });
                    toast.success('Image added!');
                  } catch { toast.error('Upload failed'); }
                }
              }} />
            </label>
          </div>
        </Field>
      </Section>

      {/* ── Section 3: Design Philosophy ── */}
      <Section title="Section 3 — Design Philosophy">
        <Field label="Section Label">
          <input
            type="text"
            value={d.designPhilosophyLabel}
            onChange={e => update({ designPhilosophyLabel: e.target.value })}
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black max-w-xs uppercase tracking-widest"
          />
        </Field>

        <Field label="Body Paragraphs">
          <div className="space-y-3">
            {d.designPhilosophyParagraphs.map((para, idx) => (
              <div key={idx} className="flex gap-2 items-start group">
                <textarea
                  rows={3}
                  value={para}
                  onChange={e => update({ designPhilosophyParagraphs: d.designPhilosophyParagraphs.map((p, i) => i === idx ? e.target.value : p) })}
                  className="flex-1 border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-none"
                />
                <button onClick={() => update({ designPhilosophyParagraphs: d.designPhilosophyParagraphs.filter((_, i) => i !== idx) })} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button onClick={() => update({ designPhilosophyParagraphs: [...d.designPhilosophyParagraphs, ''] })} className="flex items-center gap-1 text-[10px] uppercase tracking-widest hover:underline">
              <Plus size={11} /> Add Paragraph
            </button>
          </div>
        </Field>

        <Field label="Philosophy Images (2-column grid, max 4)">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {d.philosophyImages.map(img => (
              <div key={img.id} className="aspect-[3/4] bg-gray-100 border border-black/10 relative group overflow-hidden">
                <img loading="lazy" src={img.src} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => update({ philosophyImages: d.philosophyImages.filter(i => i.id !== img.id) })} className="bg-white text-red-600 p-2 rounded-full">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            {d.philosophyImages.length < 4 && (
              <label className="aspect-[3/4] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                <ImageIcon size={22} className="text-gray-300 mb-1" />
                <span className="text-[9px] uppercase tracking-widest text-gray-400">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={async e => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      toast.info('Uploading...');
                      const url = await uploadImage(file);
                      update({ philosophyImages: [...d.philosophyImages, { id: Date.now(), src: url }] });
                      toast.success('Image added!');
                    } catch { toast.error('Upload failed'); }
                  }
                }} />
              </label>
            )}
          </div>
        </Field>
      </Section>

      {/* ── Save ── */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 transition-colors"
        >
          <Save size={14} /> Save About Us Page
        </button>
      </div>

    </div>
  );
}
