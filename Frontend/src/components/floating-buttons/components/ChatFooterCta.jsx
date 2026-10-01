import React from "react";
import { MessageCircle } from "lucide-react";

export default function ChatFooterCta({ leaveMessageText, handleWhatsApp }) {
  return (
    <button
      onClick={handleWhatsApp}
      className="w-full py-5 bg-[#F9DFDF] flex justify-center items-center gap-2 hover:bg-[#f5caca] transition-colors"
    >
      <MessageCircle
        className="w-[18px] h-[18px] text-black"
        strokeWidth={1.5}
      />
      <span className="text-[14px] font-sans font-bold text-black tracking-wide">
        {leaveMessageText || "Leave us a message"}
      </span>
    </button>
  );
}
