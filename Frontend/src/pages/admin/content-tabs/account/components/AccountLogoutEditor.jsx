import React from 'react';

const AccountLogoutEditor = ({ logout, update }) => {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">Logout Section</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Sign Out Button Text</label>
          <input 
            type="text" 
            value={logout?.button1 || ''} 
            onChange={e => update({ logout: { ...logout, button1: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Sign Out All Devices Button Text</label>
          <input 
            type="text" 
            value={logout?.button2 || ''} 
            onChange={e => update({ logout: { ...logout, button2: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
      </div>
    </div>
  );
};

export default AccountLogoutEditor;
