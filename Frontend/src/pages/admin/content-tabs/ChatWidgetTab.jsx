import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, MessageCircle, HelpCircle, Phone, Type, Search } from 'lucide-react';
import { useSiteSettingsStore, DEFAULTS } from '../../../store/siteSettingsStore';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'sonner';

export default function ChatWidgetTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const { chatWidgetData, updateSettings } = settings;
  const d = chatWidgetData || DEFAULTS.chatWidgetData || {};

  const [formData, setFormData] = useState({
    title: d.title || 'Hi there, how can we help?',
    searchPlaceholder: d.searchPlaceholder || 'Search for answers',
    leaveMessageText: d.leaveMessageText || 'Leave us a message',
    whatsappNumber: d.whatsappNumber || '',
    questions: d.questions || []
  });

  useEffect(() => {
    if (settings._loaded && settings.chatWidgetData) {
      const data = settings.chatWidgetData;
      setFormData({
        title: data.title || 'Hi there, how can we help?',
        searchPlaceholder: data.searchPlaceholder || 'Search for answers',
        leaveMessageText: data.leaveMessageText || 'Leave us a message',
        whatsappNumber: data.whatsappNumber || '',
        questions: data.questions || []
      });
    }
  }, [settings._loaded, settings.chatWidgetData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddQuestion = () => {
    const newId = Date.now().toString();
    setFormData(prev => ({
      ...prev,
      questions: [{ id: newId, question: '', answer: '' }, ...prev.questions]
    }));
  };

  const handleUpdateQuestion = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, [field]: value } : q)
    }));
  };

  const handleRemoveQuestion = (id) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const handleSave = async () => {
    try {
      await updateSettings({ chatWidgetData: formData }, token);
      toast.success('Chat widget settings saved successfully!');
    } catch (err) {
      console.error('Failed to save chat widget settings:', err);
      toast.error(err?.message || 'Failed to save chat widget settings');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1200px] mx-auto pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <MessageCircle size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Chat Widget Configuration</h2>
            <p className="text-sm text-gray-500 mt-1">Customize your floating FAQ and WhatsApp support widget.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* General Settings (Left Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <LayoutTemplateIcon /> Appearance & Text
              </h3>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Type size={14} className="text-gray-400" /> Header Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="E.g., Hi there, how can we help?"
                />
              </div>

              {/* Search Placeholder */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Search size={14} className="text-gray-400" /> Search Placeholder
                </label>
                <input
                  type="text"
                  value={formData.searchPlaceholder}
                  onChange={(e) => handleChange('searchPlaceholder', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="E.g., Search for answers"
                />
              </div>

              {/* Footer Button Text */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MessageCircle size={14} className="text-gray-400" /> WhatsApp Button Text
                </label>
                <input
                  type="text"
                  value={formData.leaveMessageText}
                  onChange={(e) => handleChange('leaveMessageText', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="E.g., Leave us a message"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" /> WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="+923000000000"
                />
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Enter with country code (e.g., +92). If left empty, the widget will use the primary store contact number.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs (Right Column) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full max-h-[800px]">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <HelpCircle size={18} className="text-blue-500" /> Widget FAQs
              </h3>
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={16} /> Add New FAQ
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-gray-50/30 flex-1 space-y-4">
              {formData.questions.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <HelpCircle size={20} />
                  </div>
                  <h4 className="text-gray-900 font-medium mb-1">No FAQs configured</h4>
                  <p className="text-sm text-gray-500 max-w-[250px] mx-auto mb-4">
                    Add frequently asked questions to help your customers quickly find answers.
                  </p>
                  <button
                    onClick={handleAddQuestion}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white bg-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Plus size={16} /> Add First FAQ
                  </button>
                </div>
              ) : (
                formData.questions.map((q, index) => (
                  <div key={q.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative group hover:border-blue-200 transition-colors">
                    <button
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                      title="Remove FAQ"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="space-y-4 pr-10">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Question {formData.questions.length - index}
                        </label>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => handleUpdateQuestion(q.id, 'question', e.target.value)}
                          className="w-full border-b border-gray-200 py-2 text-sm focus:border-blue-500 outline-none transition-all font-medium text-gray-900 placeholder:font-normal placeholder:text-gray-400"
                          placeholder="What is your return policy?"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Answer
                        </label>
                        <textarea
                          value={q.answer}
                          onChange={(e) => handleUpdateQuestion(q.id, 'answer', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all min-h-[100px] resize-y text-gray-600"
                          placeholder="Provide a clear and helpful answer..."
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple helper icon
function LayoutTemplateIcon(props) {
  return (
    <svg
      {...props}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-500"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}
