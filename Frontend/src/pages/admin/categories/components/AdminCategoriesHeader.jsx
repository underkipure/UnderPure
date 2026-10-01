import React from 'react';
import { Plus } from 'lucide-react';

export default function AdminCategoriesHeader({ onOpenNewCategoryForm }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl mb-2 text-black">Categories</h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Manage categories &amp; header navigation
        </p>
      </div>
      <button
        type="button"
        onClick={onOpenNewCategoryForm}
        className="bg-black text-white px-6 py-2.5 uppercase tracking-[0.1em] text-[13px] hover:bg-gray-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
      >
        <Plus size={16} /> New Category
      </button>
    </div>
  );
}
