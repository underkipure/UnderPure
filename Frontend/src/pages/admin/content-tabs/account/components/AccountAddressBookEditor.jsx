import React from 'react';

const AccountAddressBookEditor = ({ addressBook, update }) => {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">Address Book</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Section Title</label>
          <input 
            type="text" 
            value={addressBook?.title || ''} 
            onChange={e => update({ addressBook: { ...addressBook, title: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Add New Button</label>
          <input 
            type="text" 
            value={addressBook?.addButton || ''} 
            onChange={e => update({ addressBook: { ...addressBook, addButton: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Edit Button Text</label>
          <input 
            type="text" 
            value={addressBook?.editButton || ''} 
            onChange={e => update({ addressBook: { ...addressBook, editButton: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Delete Button Text</label>
          <input 
            type="text" 
            value={addressBook?.deleteButton || ''} 
            onChange={e => update({ addressBook: { ...addressBook, deleteButton: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Default Badge Text</label>
          <input 
            type="text" 
            value={addressBook?.defaultBadge || ''} 
            onChange={e => update({ addressBook: { ...addressBook, defaultBadge: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
      </div>
    </div>
  );
};

export default AccountAddressBookEditor;
