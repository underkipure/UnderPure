import React from 'react';

const CustomersFilterPills = ({ vipFilter, setVipFilter, customersCount, vipCount, regularCount }) => {
  const filterItems = [
    { label: 'All Customers', val: 'all', count: customersCount },
    { label: 'VIP Members', val: 'vip', count: vipCount },
    { label: 'Regular Customers', val: 'regular', count: regularCount },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      {filterItems.map((item) => (
        <button
          key={item.val}
          onClick={() => setVipFilter(item.val)}
          className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            vipFilter === item.val
              ? 'bg-black text-white font-semibold shadow-xs'
              : 'bg-white text-gray-600 border border-black/10 hover:border-black'
          }`}
        >
          <span>{item.label}</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${
            vipFilter === item.val ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
          }`}>
            {item.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CustomersFilterPills;
