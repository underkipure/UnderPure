import React from 'react';
import { Camera, Loader2 } from 'lucide-react';

export const Section = ({ title, children }) => (
  <div className="bg-white border border-black/10 p-6 space-y-5">
    <h3 className="font-serif text-lg border-b border-black/10 pb-3">{title}</h3>
    {children}
  </div>
);

export const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">{label}</label>
    {children}
  </div>
);

export const inputCls = "w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black";
export const textareaCls = "w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-y";

export const ImageUploadButton = ({ url, onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <label className={`cursor-pointer bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {disabled ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
          {disabled ? 'Uploading...' : 'Upload Image'}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={onChange}
            disabled={disabled}
          />
        </label>
        <input 
          type="text" 
          value={url || ''} 
          onChange={(e) => onChange(e.target.value, true)} 
          className={inputCls} 
          placeholder="Or paste image URL..." 
        />
      </div>
      {url && <img src={url} className="h-32 object-contain border border-black/10 bg-gray-50" alt="preview" />}
    </div>
  );
};
