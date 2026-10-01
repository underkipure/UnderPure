import React, { useState, useEffect } from 'react';
import { ImageIcon, Save } from 'lucide-react';
import { useSiteSettingsStore, DEFAULTS } from '../../../store/siteSettingsStore';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend';

export default function AuthTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore(s => s.updateSettings);

  const [d, setD] = useState(settings.authData || DEFAULTS.authData);

  useEffect(() => {
    if (settings._loaded && settings.authData) {
      setD(settings.authData);
    }
  }, [settings._loaded]);

  const update = (patch) => setD(prev => ({ ...prev, ...patch }));

  const toggleSocialLogin = (provider) => {
    const current = d.socialLogins || [];
    if (current.includes(provider)) {
      update({ socialLogins: current.filter(p => p !== provider) });
    } else {
      update({ socialLogins: [...current, provider] });
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE_URL}/upload/image?folder=auth`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const handleSave = async () => {
    await updateSettings({ authData: d }, token);
    toast.success('Auth Pages saved successfully!');
  };

  return (
    <div className="bg-white border border-black/10 p-6 space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-b border-black/10 pb-3">
        <div>
          <h2 className="font-serif text-xl">Login & Signup Pages</h2>
          <p className="text-xs text-gray-500 tracking-wider mt-1">Manage authentication page content and layout.</p>
        </div>
        <button onClick={handleSave} className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800">
          <Save size={14} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Login Page */}
        <div className="space-y-4 border border-black/10 p-5">
          <h3 className="font-serif text-lg">Login Page</h3>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Page Heading</label>
            <input 
              type="text" 
              value={d.loginHeading} 
              onChange={e => update({ loginHeading: e.target.value })}
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-serif italic" 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Subheading</label>
            <input 
              type="text" 
              value={d.loginSubheading} 
              onChange={e => update({ loginSubheading: e.target.value })}
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans" 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Login Button Text</label>
            <input 
              type="text" 
              value={d.loginButtonText} 
              onChange={e => update({ loginButtonText: e.target.value })}
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black uppercase tracking-widest font-bold" 
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <input 
              type="checkbox" 
              checked={d.showForgotPassword} 
              onChange={e => update({ showForgotPassword: e.target.checked })}
              className="w-4 h-4 accent-black" 
            />
            <span className="text-xs uppercase tracking-widest">Show "Forgot Password" Link</span>
          </label>
        </div>

        {/* Signup Page */}
        <div className="space-y-4 border border-black/10 p-5">
          <h3 className="font-serif text-lg">Signup Page</h3>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Page Heading</label>
            <input 
              type="text" 
              value={d.signupHeading} 
              onChange={e => update({ signupHeading: e.target.value })}
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-serif italic" 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Subheading</label>
            <input 
              type="text" 
              value={d.signupSubheading} 
              onChange={e => update({ signupSubheading: e.target.value })}
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans" 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Signup Button Text</label>
            <input 
              type="text" 
              value={d.signupButtonText} 
              onChange={e => update({ signupButtonText: e.target.value })}
              className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black uppercase tracking-widest font-bold" 
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <input 
              type="checkbox" 
              checked={d.requireNewsletterOptIn} 
              onChange={e => update({ requireNewsletterOptIn: e.target.checked })}
              className="w-4 h-4 accent-black" 
            />
            <span className="text-xs uppercase tracking-widest">Show Newsletter Opt-in</span>
          </label>
        </div>
      </div>

      <div className="border-t border-black/10 pt-6">
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Side Panel Image</label>
        <div className="flex gap-4 items-end">
          <div className="w-32 aspect-[3/4] bg-gray-100 flex items-center justify-center border border-black/10 overflow-hidden">
            {d.sideImage ? <img loading="lazy" src={d.sideImage} className="w-full h-full object-cover" alt="Side panel" /> : <ImageIcon className="text-gray-300" />}
          </div>
          <label className="bg-black text-white px-4 py-2.5 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-800 transition-colors inline-block mb-2">
            Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
              const file = e.target.files[0];
              if(file) {
                try {
                  toast.info('Uploading...');
                  const url = await uploadImage(file);
                  update({ sideImage: url });
                  toast.success('Image uploaded!');
                } catch {
                  toast.error('Upload failed');
                }
              }
            }} />
          </label>
        </div>
        <p className="text-[10px] text-gray-500 mt-2">This image displays on the left side of the auth forms on desktop screens.</p>
      </div>

      <div className="border-t border-black/10 pt-6">
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Social Login Options</label>
        <div className="flex flex-wrap gap-2">
          {['Google', 'Facebook', 'Apple'].map((provider) => (
            <label key={provider} className="flex items-center gap-2 px-3 py-1.5 border border-black/10 cursor-pointer hover:border-black/30">
              <input 
                type="checkbox" 
                checked={(d.socialLogins || []).includes(provider)} 
                onChange={() => toggleSocialLogin(provider)}
                className="w-3.5 h-3.5 accent-black" 
              />
              <span className="text-[10px] uppercase tracking-widest">Sign in with {provider}</span>
            </label>
          ))}
        </div>
        <p className="text-[10px] text-gray-500 mt-2">Selected options will be displayed on both login and signup pages.</p>
      </div>
    </div>
  );
}
