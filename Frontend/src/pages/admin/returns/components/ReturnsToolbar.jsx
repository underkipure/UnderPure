import React from 'react';
import { Search } from 'lucide-react';

export default function ReturnsToolbar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 border border-black/10 rounded-sm">
      <div className="relative w-full lg:w-96">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="SEARCH RETURNS BY ORDER #..."
          className="w-full pl-10 pr-4 py-2 border border-black/10 text-xs uppercase tracking-widest focus:outline-none focus:border-black transition-colors rounded-sm"
        />
      </div>
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-black/10 px-4 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-black w-full sm:w-auto rounded-sm bg-white cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processed">Processed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
}
