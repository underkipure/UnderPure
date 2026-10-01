import React from 'react';

const AccountOrdersTableEditor = ({ orders, update }) => {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">Order History Table</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Order ID Column</label>
          <input 
            type="text" 
            value={orders?.tableHeaders?.id || ''} 
            onChange={e => update({ orders: { ...orders, tableHeaders: { ...orders?.tableHeaders, id: e.target.value } } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Date Column</label>
          <input 
            type="text" 
            value={orders?.tableHeaders?.date || ''} 
            onChange={e => update({ orders: { ...orders, tableHeaders: { ...orders?.tableHeaders, date: e.target.value } } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Total Column</label>
          <input 
            type="text" 
            value={orders?.tableHeaders?.total || ''} 
            onChange={e => update({ orders: { ...orders, tableHeaders: { ...orders?.tableHeaders, total: e.target.value } } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Status Column</label>
          <input 
            type="text" 
            value={orders?.tableHeaders?.status || ''} 
            onChange={e => update({ orders: { ...orders, tableHeaders: { ...orders?.tableHeaders, status: e.target.value } } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Action Column</label>
          <input 
            type="text" 
            value={orders?.tableHeaders?.action || ''} 
            onChange={e => update({ orders: { ...orders, tableHeaders: { ...orders?.tableHeaders, action: e.target.value } } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">View Details Link</label>
          <input 
            type="text" 
            value={orders?.viewDetails || ''} 
            onChange={e => update({ orders: { ...orders, viewDetails: e.target.value } })} 
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
          />
        </div>
      </div>
    </div>
  );
};

export default AccountOrdersTableEditor;
