import React from 'react';
import { ArrowDownLeft, RefreshCw } from 'lucide-react';

export default function ReturnsHeader({ onRefresh, loading }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl mb-2 text-black flex items-center gap-2">
          <ArrowDownLeft className="text-gray-400" /> Return Requests
        </h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Manage customer return inquiries
        </p>
      </div>
      <button
        onClick={onRefresh}
        className="bg-black text-white px-5 py-2.5 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer"
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
      </button>
    </div>
  );
}
