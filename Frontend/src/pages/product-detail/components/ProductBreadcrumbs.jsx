import React from "react";
import { Link } from "react-router-dom";

export default function ProductBreadcrumbs({ category, title }) {
  return (
    <nav className="text-[11px] font-sans text-gray-500 mb-4 tracking-wider flex items-center flex-wrap gap-1 font-medium">
      <Link to="/" className="hover:underline">
        Home
      </Link>
      <span>/</span>
      <Link to="/collections" className="hover:underline">
        {category || "Lingerie"}
      </Link>
      <span>/</span>
      <span className="text-black">{title}</span>
    </nav>
  );
}
