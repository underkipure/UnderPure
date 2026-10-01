import { useState } from 'react';
import { Save, Camera } from 'lucide-react';
import { useSiteSettingsStore } from '../../../store/siteSettingsStore';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'sonner';

export default function PopupTab() {
  const { popupSettings, updateSettings } = useSiteSettingsStore();
  const { token } = useAuthStore();
  const [uploading, setUploading] = useState(false);

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend'}/upload/image?folder=popup`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Upload failed');
    }
    const data = await res.json();
    return data.url;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      toast.info('Uploading image...');
      const serverUrl = await uploadFileToServer(file);
      updateSettings({
        popupSettings: {
          ...popupSettings,
          image: serverUrl
        }
      }, token);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateSettings({ popupSettings }, token);
      toast.success('Popup settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateSettings({
      popupSettings: {
        ...popupSettings,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-black/10 p-6 shadow-sm">
        <h3 className="font-serif text-xl mb-4 text-black">Welcome Popup Settings</h3>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input 
              type="checkbox" 
              name="enabled"
              checked={popupSettings?.enabled || false}
              onChange={handleChange}
              className="w-4 h-4 text-black border-black/20 focus:ring-black"
            />
            <span className="text-sm font-medium">Enable Welcome Popup on First Visit</span>
          </label>

          {popupSettings?.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-black/10">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Discount Text</label>
                <input 
                  type="text" 
                  name="discountText"
                  value={popupSettings?.discountText || ''}
                  onChange={handleChange}
                  placeholder="e.g. 15% OFF"
                  className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Heading</label>
                <input 
                  type="text" 
                  name="heading"
                  value={popupSettings?.heading || ''}
                  onChange={handleChange}
                  placeholder="e.g. YOUR FIRST ORDER"
                  className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Description Text</label>
                <textarea 
                  name="text"
                  value={popupSettings?.text || ''}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black resize-y"
                  placeholder="e.g. Get VIP access to our newest launches..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Button Text</label>
                <input 
                  type="text" 
                  name="buttonText"
                  value={popupSettings?.buttonText || ''}
                  onChange={handleChange}
                  placeholder="e.g. SIGN UP"
                  className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Popup Image</label>
                <div className="flex items-center gap-4">
                  {popupSettings?.image && (
                    <img src={popupSettings.image} alt="Popup" className="w-16 h-16 object-cover border border-black/20" />
                  )}
                  <label className={`px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>
                    {uploading ? (
                      <><span className="animate-spin inline-block w-3 h-3 border-2 border-black border-t-transparent rounded-full" /> Uploading...</>
                    ) : (
                      <><Camera size={14} /> Upload Image</>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              {/* Color Settings */}
              <div className="md:col-span-2 pt-4 border-t border-black/10">
                <h4 className="font-serif text-lg mb-4 text-black">Color Settings</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Background Color</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        name="bgColor"
                        value={popupSettings?.bgColor || '#ffffff'}
                        onChange={handleChange}
                        className="w-10 h-10 border-0 p-0 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        name="bgColor"
                        value={popupSettings?.bgColor || '#ffffff'}
                        onChange={handleChange}
                        className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black uppercase"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Text Color</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        name="textColor"
                        value={popupSettings?.textColor || '#000000'}
                        onChange={handleChange}
                        className="w-10 h-10 border-0 p-0 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        name="textColor"
                        value={popupSettings?.textColor || '#000000'}
                        onChange={handleChange}
                        className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Button Color</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        name="buttonColor"
                        value={popupSettings?.buttonColor || '#000000'}
                        onChange={handleChange}
                        className="w-10 h-10 border-0 p-0 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        name="buttonColor"
                        value={popupSettings?.buttonColor || '#000000'}
                        onChange={handleChange}
                        className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Button Text</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        name="buttonTextColor"
                        value={popupSettings?.buttonTextColor || '#ffffff'}
                        onChange={handleChange}
                        className="w-10 h-10 border-0 p-0 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        name="buttonTextColor"
                        value={popupSettings?.buttonTextColor || '#ffffff'}
                        onChange={handleChange}
                        className="w-full border border-black/20 p-2 text-xs focus:outline-none focus:border-black uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );
}
