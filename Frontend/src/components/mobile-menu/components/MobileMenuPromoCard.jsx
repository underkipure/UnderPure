import React from "react";
import { Link } from "react-router-dom";

const MobileMenuPromoCard = ({ promo, imageSrc, toggleMenu }) => {
  return (
    <Link
      to={promo.url}
      onClick={toggleMenu}
      className="block group no-underline text-black"
    >
      <div className="aspect-[4/5] bg-gray-100 mb-[3vw] md:mb-[1.5vw] overflow-hidden">
        <img
          loading="lazy"
          src={imageSrc}
          alt={promo.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <h4
        className="text-[4.5vw] md:text-[2.2vw] font-dala-roman m-0 group-hover:opacity-70 transition-opacity flex items-center"
      >
        {promo.title}
        <svg
          viewBox="0 0 200 100"
          className="ml-[1.5vw] md:ml-[0.8vw] w-[4vw] h-[4vw] md:w-[2vw] md:h-[2vw] rotate-90 text-black"
          fill="currentColor"
        >
          <path d="M 0,100 C 60,100 85,50 100,0 C 115,50 140,100 200,100 Z" />
        </svg>
      </h4>
    </Link>
  );
};

export default MobileMenuPromoCard;
