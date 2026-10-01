import React from "react";
import { Link } from "react-router-dom";

export default function EmptyCartState({ title, emptyMessage }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 font-sans">
      <h1
        className="text-[32px] font-dala-roman mb-6 text-black"
      >
        {title?.toLowerCase() || "shopping bag"}
      </h1>
      <p className="text-[13px] mb-8 text-black">
        {emptyMessage || "Your bag is empty."}
      </p>
      <Link
        to="/"
        className="bg-black text-white px-8 py-3 text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
