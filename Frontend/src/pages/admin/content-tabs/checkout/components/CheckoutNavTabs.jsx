import React from 'react';

const CheckoutNavTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'general', label: 'General & Sidebar' },
    { id: 'payment', label: 'Shipping Protection & Payment' },
    { id: 'dialogs', label: 'Footer Links & Dialogs' },
  ];

  return (
    <div className="flex border-b border-black/10 gap-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`pb-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === tab.id
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CheckoutNavTabs;
