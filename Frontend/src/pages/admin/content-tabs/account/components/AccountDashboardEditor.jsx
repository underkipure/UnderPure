import React from 'react';

const AccountDashboardEditor = ({ dashboard, update }) => {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">Dashboard (My Account) Messages</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Welcome Text</label>
          <input 
            type="text" 
            value={dashboard?.welcomeText || ''} 
            onChange={e => update({ dashboard: { ...dashboard, welcomeText: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif text-lg" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Subtitle Text</label>
          <input 
            type="text" 
            value={dashboard?.subtitleText || ''} 
            onChange={e => update({ dashboard: { ...dashboard, subtitleText: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
          />
        </div>
      </div>
    </div>
  );
};

export default AccountDashboardEditor;
