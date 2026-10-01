import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

export default function AccountHeader({ storeName }) {
  const renderFormattedStoreName = (name) => {
    const defaultName = "UNDERPURE";
    const str = (name || defaultName).toUpperCase();

    // If it's exactly UNDERPURE, split manually
    if (str === "UNDERPURE" || str === "UNDER PURE") {
      return (
        <span className="flex flex-col leading-[0.9]">
          <span>UNDER</span>
          <span>PURE</span>
        </span>
      );
    }

    // If it has spaces, split by spaces
    if (str.includes(" ")) {
      return (
        <span className="flex flex-col leading-[0.9]">
          {str.split(" ").map((part, index) => (
            <span key={index}>{part}</span>
          ))}
        </span>
      );
    }

    return str;
  };

  return (
    <header className="w-full flex justify-between items-center mb-2 lg:mb-10">
      <Link to="/" className="flex items-center">
        <h1 className="font-serif text-4xl lg:text-5xl tracking-[0.0001em] font-medium">
          {renderFormattedStoreName(storeName)}
        </h1>
      </Link>
      <button className="rounded-full border border-gray-800 p-0 text-gray-500 hover:text-black hover:border-black transition-colors">
        <User size={22} strokeWidth={2} />
      </button>
    </header>
  );
}
