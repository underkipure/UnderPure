import React from "react";
import { Link } from "react-router-dom";

export function CheckoutEmptyBag() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans text-center px-4">
      <h1
        className="text-2xl sm:text-4xl font-dala-roman tracking-widest text-black mb-8"
      >
        Your bag is empty.
      </h1>
      <Link
        to="/"
        className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
      >
        CONTINUE SHOPPING
      </Link>
    </div>
  );
}
