import React from 'react';
import { Mail, Shield } from 'lucide-react';
import { fmt } from '../utils/customerHelpers';

const CustomerTableRow = ({
  customer,
  actioningId,
  onOpenPrivileges,
  onToggleVip,
}) => {
  const c = customer;
  const isVip = c.is_vip || c.status === 'VIP';

  return (
    <tr className="border-b border-black/5 hover:bg-gray-50/50 transition-colors">
      <td className="p-4">
        <div>
          <div className="font-serif text-base text-black">{c.name || 'Anonymous'}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Mail size={12} /> {c.email}
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-widest border ${
          isVip ? 'border-purple-200 bg-purple-50 text-purple-700 font-bold' :
          'border-gray-200 bg-gray-50 text-gray-700'
        }`}>
          {isVip ? 'VIP' : 'Customer'}
        </span>
      </td>
      <td className="p-4 text-right font-medium">{c.orders ?? 0}</td>
      <td className="p-4 text-right font-medium">Rs. {fmt(c.totalSpent ?? 0)}</td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
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
      </td>
    </tr>
  );
};

export default CustomerTableRow;
