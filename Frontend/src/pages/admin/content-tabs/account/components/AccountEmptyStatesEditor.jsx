import React from 'react';

const AccountEmptyStatesEditor = ({ emptyStates, update }) => {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">Empty States Text</h3>
      
      <div className="space-y-6">
        <div className="border-l-2 border-black pl-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3">Order History (Empty)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Empty Title</label>
              <input 
                type="text" 
                value={emptyStates?.ordersEmptyTitle || ''} 
                onChange={e => update({ emptyStates: { ...emptyStates, ordersEmptyTitle: e.target.value } })} 
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif" 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Empty Subtitle</label>
              <input 
                type="text" 
                value={emptyStates?.ordersEmptySubtitle || ''} 
                onChange={e => update({ emptyStates: { ...emptyStates, ordersEmptySubtitle: e.target.value } })} 
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Shop Button Text</label>
              <input 
                type="text" 
                value={emptyStates?.ordersShopButton || ''} 
                onChange={e => update({ emptyStates: { ...emptyStates, ordersShopButton: e.target.value } })} 
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
              />
            </div>
          </div>
        </div>

        <div className="border-l-2 border-black pl-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3">Lovelist (Empty)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Empty Title</label>
              <input 
                type="text" 
                value={emptyStates?.lovelistEmptyTitle || ''} 
                onChange={e => update({ emptyStates: { ...emptyStates, lovelistEmptyTitle: e.target.value } })} 
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif" 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Empty Subtitle</label>
              <input 
                type="text" 
                value={emptyStates?.lovelistEmptySubtitle || ''} 
                onChange={e => update({ emptyStates: { ...emptyStates, lovelistEmptySubtitle: e.target.value } })} 
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Shop Button Text</label>
              <input 
                type="text" 
                value={emptyStates?.lovelistShopButton || ''} 
                onChange={e => update({ emptyStates: { ...emptyStates, lovelistShopButton: e.target.value } })} 
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountEmptyStatesEditor;
