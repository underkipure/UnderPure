import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTopButton({ show, onClick }) {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 text-xs uppercase tracking-widest animate-in fade-in"
      title="Back to Top"
      aria-label="Back to Top"
    >
      <ArrowUp size={14} /> Top
    </button>
  );
}
