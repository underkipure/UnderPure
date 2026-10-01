import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-6xl mb-4 text-black">404</h1>
      <h2 className="text-xl font-bold font-sans uppercase tracking-widest text-black mb-6">Page Not Found</h2>
      <p className="text-sm font-sans text-gray-500 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
        Return to Homepage
      </Link>
    </div>
  );
}
