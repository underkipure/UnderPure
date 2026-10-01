import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import { useSiteSettingsStore, DEFAULTS } from '../../../store/siteSettingsStore';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend';

export default function FaqsTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore(s => s.updateSettings);

  const [faqs, setFaqs] = useState(settings.faqs || DEFAULTS.faqs);
  const [faqHeroImage, setFaqHeroImage] = useState(
    settings.faqHeroImage || DEFAULTS.faqHeroImage || ''
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings._loaded) {
      if (settings.faqs) setFaqs(settings.faqs);
      if (settings.faqHeroImage) setFaqHeroImage(settings.faqHeroImage);
    }
  }, [settings._loaded, settings.faqs, settings.faqHeroImage]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ category: '', question: '', answer: '' });

  const handleAdd = () => {
    const newFaq = { id: Date.now(), category: 'General', question: 'New Question', answer: 'New Answer' };
    setFaqs([newFaq, ...faqs]);
    setEditingId(newFaq.id);
    setEditForm(newFaq);
  };

  const handleEdit = (faq) => {
    setEditingId(faq.id);
    setEditForm(faq);
  };

  const handleLocalSave = () => {
    setFaqs(faqs.map(f => f.id === editingId ? { ...f, ...editForm } : f));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const tempUrl = URL.createObjectURL(file);
    setFaqHeroImage(tempUrl);

    try {
      toast.info('Uploading image to Cloudinary...');
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE_URL}/upload/image?folder=faqs`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to upload image');
      }

      const data = await res.json();
      if (data.success && data.url) {
        setFaqHeroImage(data.url);
        toast.success('Hero image uploaded to Cloudinary successfully!');
      } else {
        throw new Error(data.error || 'Invalid response from server');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveToBackend = async () => {
    setSaving(true);
    try {
      await updateSettings({ faqs, faqHeroImage }, token);
      toast.success('FAQs and Hero Image saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save changes: ' + (err.message || 'Server error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-black/10 p-6 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-b border-black/10 pb-4">
        <div>
          <h2 className="font-serif text-xl">FAQs Editor</h2>
          <p className="text-xs text-gray-500 tracking-wider mt-1">
            Manage FAQ hero banner image and category-wise questions.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className="border border-black/20 text-black px-4 py-2 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Plus size={14} /> Add FAQ
          </button>
          <button
            onClick={handleSaveToBackend}
            disabled={saving || uploadingImage}
            className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>
      </div>

      {/* FAQ Hero Image Banner Section */}
      <div className="bg-gray-50 border border-black/10 p-5 rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon size={18} className="text-gray-700" />
            <h3 className="font-serif text-base text-black">FAQ Hero Banner Image</h3>
          </div>
          <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 bg-black text-white font-medium">
            Cloudinary Configured
          </span>
        </div>

        {/* Image Preview */}
        <div className="relative w-full h-48 sm:h-56 bg-gray-200 border border-black/10 overflow-hidden group">
          <img
            src={faqHeroImage}
            alt="FAQ Hero Banner Preview"
            className="w-full h-full object-cover object-center"
          />
          {uploadingImage && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white gap-2">
              <Loader2 size={28} className="animate-spin" />
              <span className="text-xs uppercase tracking-widest font-semibold">Uploading to Cloudinary...</span>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Image URL / Cloudinary URL
            </label>
            <input
              type="text"
              value={faqHeroImage}
              onChange={(e) => setFaqHeroImage(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="w-full border border-black/20 p-2.5 text-xs font-mono focus:outline-none focus:border-black bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Upload New Image
            </label>
            <label className="flex items-center justify-center gap-2 border border-black/30 bg-white text-black px-4 py-2.5 text-xs font-semibold uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white transition-colors">
              <UploadCloud size={16} />
              <span>Choose Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* FAQ Questions List Editor */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg border-b border-black/10 pb-2">Questions & Answers</h3>

        {faqs.map((faq) => (
          <div key={faq.id} className="border border-black/10 p-4 relative group hover:border-black/30 transition-colors">
            {editingId === faq.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Category</label>
                    <input 
                      type="text" 
                      value={editForm.category} 
                      onChange={e => setEditForm({...editForm, category: e.target.value})}
                      className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Question</label>
                    <input 
                      type="text" 
                      value={editForm.question} 
                      onChange={e => setEditForm({...editForm, question: e.target.value})}
                      className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black font-serif" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Answer</label>
                  <textarea 
                    rows={3} 
                    value={editForm.answer} 
                    onChange={e => setEditForm({...editForm, answer: e.target.value})}
                    className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black resize-none" 
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleLocalSave} className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest">Update</button>
                  <button onClick={() => setEditingId(null)} className="border border-black/20 px-4 py-2 text-xs uppercase tracking-widest">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">{faq.category}</span>
                    <h3 className="font-serif text-lg">{faq.question}</h3>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(faq)} className="text-gray-400 hover:text-black"><Edit3 size={16} /></button>
                    <button onClick={() => handleDelete(faq.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
        {faqs.length === 0 && <p className="text-sm text-gray-500 py-4 text-center">No FAQs added yet.</p>}
      </div>
    </div>
  );
}
