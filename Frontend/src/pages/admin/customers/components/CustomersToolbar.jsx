import React from 'react';
import { Search } from 'lucide-react';

const CustomersToolbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border border-black/10 rounded-sm">
      <div className="relative w-full sm:w-96">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="SEARCH CUSTOMERS..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-black/10 text-xs uppercase tracking-widest focus:outline-none focus:border-black transition-colors rounded-sm"
        />
      </div>
    </div>
  );
};

export default CustomersToolbar;
