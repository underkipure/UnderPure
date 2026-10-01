import React from 'react';

const AccountPasswordEditor = ({ password, update }) => {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">Change Password</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Section Title</label>
          <input 
            type="text" 
            value={password?.title || ''} 
            onChange={e => update({ password: { ...password, title: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Current Password Label</label>
          <input 
            type="text" 
            value={password?.currentLabel || ''} 
            onChange={e => update({ password: { ...password, currentLabel: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">New Password Label</label>
          <input 
            type="text" 
            value={password?.newLabel || ''} 
            onChange={e => update({ password: { ...password, newLabel: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Update Button Text</label>
          <input 
            type="text" 
            value={password?.buttonText || ''} 
            onChange={e => update({ password: { ...password, buttonText: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
      </div>
    </div>
  );
};

export default AccountPasswordEditor;
