import React from 'react';
import { Mail, Shield } from 'lucide-react';
import { fmt } from '../utils/customerHelpers';

const CustomerMobileCard = ({
  customer,
  actioningId,
  onOpenPrivileges,
  onToggleVip,
}) => {
  const c = customer;
  const isVip = c.is_vip || c.status === 'VIP';

  return (
    <div className="bg-white border border-black/10 p-4 space-y-3 rounded-sm shadow-2xs">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-serif text-base font-bold text-black">{c.name || 'Anonymous'}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <Mail size={11} /> {c.email}
          </div>
        </div>
        <span className={`inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-widest border font-bold ${
          isVip ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-gray-200 bg-gray-50 text-gray-700'
        }`}>
          {isVip ? 'VIP' : 'Customer'}
        </span>
      </div>

      {/* 2-Column Stats Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-sm border border-black/5">
        <div>
          <span className="text-gray-400 block text-[9px] uppercase tracking-widest">Total Orders</span>
          <span className="font-medium text-black">{c.orders ?? 0}</span>
        </div>
        <div>
          <span className="text-gray-400 block text-[9px] uppercase tracking-widest">Total Spent</span>
          <span className="font-medium text-black">Rs. {fmt(c.totalSpent ?? 0)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1 border-t border-black/10">
        {isVip && (
          <button 
            onClick={() => onOpenPrivileges(c)}
            className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-black/20 bg-white text-black hover:bg-gray-50 transition-all font-bold flex items-center gap-1 cursor-pointer"
          >
            <Shield size={12} /> Privileges
          </button>
        )}
        <button 
          onClick={() => onToggleVip(c)}
          disabled={actioningId === c.id}
          className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border font-bold transition-all cursor-pointer ${
            isVip 
              ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' 
              : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
          }`}
        >
          {isVip ? 'Remove VIP' : 'Make VIP'}
        </button>
      </div>
    </div>
  );
};

export default CustomerMobileCard;
