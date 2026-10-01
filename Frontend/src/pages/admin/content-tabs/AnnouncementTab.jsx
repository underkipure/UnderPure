import React, { useState, useEffect } from 'react';
import { useSiteSettingsStore } from '../../../store/siteSettingsStore';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'sonner';
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default function AnnouncementTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();

  const parseMessages = (raw) => {
    if (!raw) return [''];
    const parts = raw.split('|').map(s => s.trim()).filter(Boolean);
    return parts.length > 0 ? parts : [''];
  };

  const [isEnabled, setIsEnabled] = useState(settings.announcementBarEnabled ?? true);
  const [messages, setMessages] = useState(() => parseMessages(settings.announcementBar));
  const [link, setLink] = useState(settings.announcementBarLink || '');
  const [bgColor, setBgColor] = useState(settings.announcementBarBgColor || '#000000');
  const [textColor, setTextColor] = useState(settings.announcementBarTextColor || '#FFFFFF');
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    if (settings._loaded) {
      setIsEnabled(settings.announcementBarEnabled ?? true);
      setMessages(parseMessages(settings.announcementBar));
      setLink(settings.announcementBarLink || '');
      setBgColor(settings.announcementBarBgColor || '#000000');
      setTextColor(settings.announcementBarTextColor || '#FFFFFF');
    }
  }, [settings._loaded, settings.announcementBarEnabled, settings.announcementBar, settings.announcementBarLink, settings.announcementBarBgColor, settings.announcementBarTextColor]);

  // Rotate preview slide every 3s if more than 1 message
  useEffect(() => {
    const validMessages = messages.filter(m => m.trim());
    if (validMessages.length <= 1) {
      setPreviewIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setPreviewIndex((prev) => (prev + 1) % validMessages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [messages]);

  const handleMessageChange = (index, value) => {
    const updated = [...messages];
    updated[index] = value;
    setMessages(updated);
  };

  const addMessage = () => {
    setMessages([...messages, '']);
  };

  const removeMessage = (index) => {
    if (messages.length === 1) {
      setMessages(['']);
      return;
    }
    const updated = messages.filter((_, i) => i !== index);
    setMessages(updated);
  };

  const moveMessage = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= messages.length) return;
    const updated = [...messages];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setMessages(updated);
  };

  const handleSave = async () => {
    const validMessages = messages.map(m => m.trim()).filter(Boolean);
    const joinedText = validMessages.join(' | ');
    try {
      await settings.updateSettings({
        announcementBarEnabled: isEnabled,
        announcementBar: joinedText,
        announcementBarLink: link,
        announcementBarBgColor: bgColor,
        announcementBarTextColor: textColor
      }, token);
      toast.success('Announcement Bar saved successfully!');
    } catch (e) {
      toast.error('Failed to save announcement bar');
    }
  };

  return (
    <div className="bg-white border border-black/10 p-6 space-y-6 max-w-2xl relative">
      <div className="flex justify-between items-center border-b border-black/10 pb-3">
        <div>
          <h2 className="font-serif text-xl">Announcement Bar</h2>
          <p className="text-xs text-gray-400 mt-0.5 font-sans">Manage store announcement banner and multi-slide carousel</p>
        </div>
        <button onClick={handleSave} className="bg-black text-white px-4 py-2 text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors">
          <Save size={14} /> Save Changes
        </button>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isEnabled} 
            onChange={(e) => setIsEnabled(e.target.checked)}
            className="w-4 h-4 accent-black" 
          />
          <span className="text-sm font-semibold uppercase tracking-widest font-sans">Enable Announcement Bar</span>
        </label>
      </div>

      <div className={!isEnabled ? 'opacity-50 pointer-events-none' : ''}>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-sans">
                Display Messages (Slider / Carousel)
              </label>
              <span className="text-[10px] text-gray-400 italic font-sans">
                {messages.filter(m => m.trim()).length > 1 
                  ? 'Multiple messages slide automatically every 3 seconds' 
                  : 'Single message displays statically'}
              </span>
            </div>
            
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button 
                      type="button"
                      onClick={() => moveMessage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 border border-black/10 hover:bg-black hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black transition-colors"
                      title="Move up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => moveMessage(idx, 'down')}
                      disabled={idx === messages.length - 1}
                      className="p-1 border border-black/10 hover:bg-black hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black transition-colors"
                      title="Move down"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>
                  <div className="flex-grow relative">
                    <input 
                      type="text" 
                      value={msg}
                      onChange={(e) => handleMessageChange(idx, e.target.value)}
                      placeholder={`Slide ${idx + 1} text (e.g. FREE SHIPPING ABOVE RS 2500)`}
                      className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-sans" 
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeMessage(idx)}
                    className="p-3 border border-black/10 text-gray-500 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
                    title="Remove message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={addMessage}
              className="mt-3 w-full border border-dashed border-black/30 py-3 text-[11px] uppercase tracking-widest font-bold hover:border-black hover:bg-black/5 transition-all flex items-center justify-center gap-2 text-black font-sans"
            >
              <Plus size={16} /> Add Another Announcement Message
            </button>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-sans">Link (Optional)</label>
            <input 
              type="text" 
              placeholder="/collections/sale" 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-sans" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-sans">Background Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 border border-black/20 cursor-pointer p-0" 
                />
                <input 
                  type="text" 
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-sans">Text Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 border border-black/20 cursor-pointer p-0" 
                />
                <input 
                  type="text" 
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans" 
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="pt-2 border-t border-black/10">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-sans">Live Store Preview</label>
            <div 
              style={{ backgroundColor: bgColor, color: textColor }}
              className="text-center py-3 px-4 text-[11px] uppercase tracking-widest relative overflow-hidden transition-all flex flex-col items-center justify-center min-h-[45px] shadow-sm font-sans"
            >
              <span>
                {messages.filter(m => m.trim()).length > 0 
                  ? (messages.filter(m => m.trim())[previewIndex] || messages.filter(m => m.trim())[0]) 
                  : 'Enter your announcement text'}
              </span>
            </div>
            {messages.filter(m => m.trim()).length > 1 && (
              <p className="text-[10px] text-center text-gray-400 mt-1.5 italic font-sans">
                Previewing slide {previewIndex + 1} of {messages.filter(m => m.trim()).length} (cycles automatically every 3 seconds on website)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
