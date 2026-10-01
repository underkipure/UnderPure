import React from 'react';

const AccountNavMenuEditor = ({ navigation, update }) => {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">Sidebar Navigation Menu</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Tab 1 Name</label>
          <input 
            type="text" 
            value={navigation?.tab1 || ''} 
            onChange={e => update({ navigation: { ...navigation, tab1: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Tab 2 Name</label>
          <input 
            type="text" 
            value={navigation?.tab2 || ''} 
            onChange={e => update({ navigation: { ...navigation, tab2: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Tab 3 Name</label>
          <input 
            type="text" 
            value={navigation?.tab3 || ''} 
            onChange={e => update({ navigation: { ...navigation, tab3: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
      </div>
    </div>
  );
};

export default AccountNavMenuEditor;
