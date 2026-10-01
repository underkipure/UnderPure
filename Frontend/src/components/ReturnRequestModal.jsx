import React, { useState } from 'react';
import { X, MessageCircle, Mail } from 'lucide-react';
import { useSiteSettingsStore } from '../store/siteSettingsStore';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend';

const ReturnRequestModal = ({ isOpen, onClose, modalType = 'return' }) => {
  const { contactPhone, contactEmail, footerData } = useSiteSettingsStore();
  
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleWhatsApp = async () => {
    if (!orderNumber || !orderDate || !reason) {
      alert("Please fill out all fields before proceeding.");
      return;
    }
    
    // Save to DB
    try {
      await fetch(`${API}/returns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, orderDate, reason, method: 'WhatsApp', type: modalType })
      });
    } catch (e) {
      console.error(e);
    }

    const actionText = modalType === 'withdrawal' ? 'initiate a withdrawal' : 'initiate a return';
    let text = `Hello, I would like to ${actionText}.\n\n`;
    text += `*Order / Invoice Number:* ${orderNumber}\n`;
    text += `*Order Date:* ${orderDate}\n`;
    text += `*Reason:* ${reason}`;

    const rawPhone = contactPhone || footerData?.contactPhone || "";
    let phone = rawPhone.replace(/\D/g, "");
    if (phone.startsWith("0")) {
      phone = "92" + phone.slice(1);
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    onClose();
  };

  const handleEmail = async () => {
    if (!orderNumber || !orderDate || !reason) {
      alert("Please fill out all fields before proceeding.");
      return;
    }

    // Save to DB
    try {
      await fetch(`${API}/returns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, orderDate, reason, method: 'Email', type: modalType })
      });
    } catch (e) {
      console.error(e);
    }

    const actionText = modalType === 'withdrawal' ? 'initiate a withdrawal' : 'initiate a return';
    const email = contactEmail || footerData?.contactEmail || footerData?.email || "";
    const subject = `${actionText === 'initiate a withdrawal' ? 'Withdrawal' : 'Return'} Request - Order ${orderNumber}`;
    let body = `Hello,\n\nI would like to ${actionText}.\n\n`;
    body += `Order / Invoice Number: ${orderNumber}\n`;
    body += `Order Date: ${orderDate}\n`;
    body += `Reason:\n${reason}\n`;

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="font-serif text-xl font-medium text-black">
            {modalType === 'withdrawal' ? 'Submit Withdrawal' : 'Initiate Return'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">Order / Invoice Number</label>
            <input 
              type="text" 
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. #1024"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">Order Date</label>
            <input 
              type="date" 
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">Reason</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe why you are returning this item..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[100px] resize-y focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
            />
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-3">
          <p className="text-xs text-center text-gray-500 mb-2">How would you like to inform us?</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-colors shadow-sm"
            >
              <MessageCircle size={18} /> Send via WhatsApp
            </button>
            <button 
              onClick={handleEmail}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-colors shadow-sm"
            >
              <Mail size={18} /> Send via Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestModal;
