import React from 'react';

const CheckoutPaymentTab = ({ formData, setFormData }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Shipping Protection (UnderPure)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Section Title</label>
            <input 
              type="text" 
              value={formData.shippingProtectionTitle || ''} 
              onChange={e => setFormData({...formData, shippingProtectionTitle: e.target.value})} 
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
              placeholder="Shipping Protection"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Provider Name</label>
            <input 
              type="text" 
              value={formData.shippingProtectionProvider || ''} 
              onChange={e => setFormData({...formData, shippingProtectionProvider: e.target.value})} 
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
              placeholder="UnderPure"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Protection Fee (Rs)</label>
            <input 
              type="number" 
              step="0.01"
              value={formData.shippingProtectionFee ?? 1.95} 
              onChange={e => setFormData({...formData, shippingProtectionFee: Number(e.target.value)})} 
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
              placeholder="1.95"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Description Text</label>
            <input 
              type="text" 
              value={formData.shippingProtectionDesc || ''} 
              onChange={e => setFormData({...formData, shippingProtectionDesc: e.target.value})} 
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
              placeholder="If your package is lost, stolen, or damaged, Route will refund or replace it."
            />
          </div>
        </div>
      </div>

      <div className="border-t border-black/10 pt-6">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Payment Methods Block</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Payment Section Title</label>
            <input 
              type="text" 
              value={formData.paymentTitle || ''} 
              onChange={e => setFormData({...formData, paymentTitle: e.target.value})} 
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase" 
              placeholder="PAYMENT"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Payment Subtitle</label>
            <input 
              type="text" 
              value={formData.paymentSubtitle || ''} 
              onChange={e => setFormData({...formData, paymentSubtitle: e.target.value})} 
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
              placeholder="All transactions are secure and encrypted."
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">COD Option Title</label>
            <input 
              type="text" 
              value={formData.codTitle || ''} 
              onChange={e => setFormData({...formData, codTitle: e.target.value})} 
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
              placeholder="Cash on Delivery (COD)"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">COD Description</label>
            <input 
              type="text" 
              value={formData.codDescription || ''} 
              onChange={e => setFormData({...formData, codDescription: e.target.value})} 
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" 
              placeholder="You will pay for your order in cash when it is delivered to your address."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentTab;
