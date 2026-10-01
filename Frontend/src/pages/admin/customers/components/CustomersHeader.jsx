import React from 'react';
import { Shield } from 'lucide-react';

const CustomersHeader = ({ onOpenGlobalPrivileges }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl mb-2 text-black">Customers</h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">Client directory & loyalty</p>
      </div>
      <button 
        onClick={onOpenGlobalPrivileges}
        className="bg-black text-white px-6 py-2.5 uppercase tracking-[0.1em] text-[13px] hover:bg-gray-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center rounded-sm shadow-2xs cursor-pointer"
      >
        <Shield size={16} /> Manage VIP Privileges
      </button>
    </div>
  );
};

export default CustomersHeader;
