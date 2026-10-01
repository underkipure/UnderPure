import React from "react";
import { BackToTopIcon } from "./FloatingIcons";

export default function BackToTopButton({ showBackToTop, scrollToTop }) {
  return (
    <button
      onClick={scrollToTop}
      className={`flex flex-col items-center justify-center text-black hover:opacity-70 transition-all duration-300 cursor-pointer ${
        showBackToTop
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
      title="Back to top"
    >
      <BackToTopIcon />
      <span className="text-[10px] font-bold tracking-[0.01em] mt-1">
        BACK TO TOP
      </span>
    </button>
  );
}
