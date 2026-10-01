import React from 'react';
import { Link } from 'react-router-dom';

export default function HeaderLogo({ storeName, isSolid }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center">
      <Link to="/" className="no-underline">
        <h1
          className={`text-[8vw] md:text-[2.4vw] font-serif uppercase tracking-wide m-0 leading-none cursor-pointer ${!isSolid ? "lg:text-white text-black" : "text-black"}`}
        >
          {storeName ? storeName : "UnderPure"}
        </h1>
      </Link>
    </div>
  );
}
