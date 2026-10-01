import React from 'react';

const AccountPersonalInfoEditor = ({ personalInfo, update }) => {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Section Title</label>
          <input 
            type="text" 
            value={personalInfo?.title || ''} 
            onChange={e => update({ personalInfo: { ...personalInfo, title: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">First Name Label</label>
          <input 
            type="text" 
            value={personalInfo?.firstNameLabel || ''} 
            onChange={e => update({ personalInfo: { ...personalInfo, firstNameLabel: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Last Name Label</label>
          <input 
            type="text" 
            value={personalInfo?.lastNameLabel || ''} 
            onChange={e => update({ personalInfo: { ...personalInfo, lastNameLabel: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Email Label</label>
          <input 
            type="text" 
            value={personalInfo?.emailLabel || ''} 
            onChange={e => update({ personalInfo: { ...personalInfo, emailLabel: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Phone Label</label>
          <input 
            type="text" 
            value={personalInfo?.phoneLabel || ''} 
            onChange={e => update({ personalInfo: { ...personalInfo, phoneLabel: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">DOB Label</label>
          <input 
            type="text" 
            value={personalInfo?.dobLabel || ''} 
            onChange={e => update({ personalInfo: { ...personalInfo, dobLabel: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Update Button Text</label>
          <input 
            type="text" 
            value={personalInfo?.buttonText || ''} 
            onChange={e => update({ personalInfo: { ...personalInfo, buttonText: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
      </div>
    </div>
  );
};

export default AccountPersonalInfoEditor;
