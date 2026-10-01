import React from "react";

const CustomArrow = ({ isOpen }) => (
  <svg
    viewBox="0 0 200 100"
    className={`w-[3vw] h-[3vw] md:w-[0.8vw] md:h-[0.8vw] transition-transform duration-300 ${
      isOpen ? "rotate-0" : "rotate-180"
    }`}
    fill="currentColor"
  >
    <path d="M 0,100 C 60,100 85,50 100,0 C 115,50 140,100 200,100 Z" />
  </svg>
);

export default CustomArrow;
