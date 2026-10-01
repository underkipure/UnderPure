import React from "react";
import { CustomChatIcon } from "./FloatingIcons";

export default function ChatTriggerButton({ isChatOpen, handleChatClick }) {
  return (
    <button
      onClick={handleChatClick}
      className={`w-[50px] h-[50px] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer ${
        isChatOpen
          ? "bg-[#f8d7da] text-black scale-90"
          : "bg-[#f8d7da] text-black hover:scale-105"
      }`}
      aria-label="Chat with us"
      title="Chat with us"
    >
      {isChatOpen ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ) : (
        <CustomChatIcon />
      )}
    </button>
  );
}
