import React from "react";
import { Link } from "react-router-dom";
import { Check, HelpCircle } from "lucide-react";

export const CheckoutContactForm = ({
  formData,
  handleInputChange,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <div className="space-y-2.5 pt-0.5">
        <div className="flex justify-between items-center">
          <h2
            className="text-[13px] font-dala-roman tracking-widest text-black uppercase font-normal"
          >
            CONTACT
          </h2>
          <Link
            to="/account"
            className="text-[11.5px] text-[#90134a] hover:underline underline-offset-2 font-medium"
          >
            Sign in
          </Link>
        </div>

        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg py-2.5 px-3 pr-9 text-[12px] text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-gray-400 font-sans"
          />
          <HelpCircle
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer pt-0.5">
          <div className="w-4 h-4 rounded-full bg-[#90134a] flex items-center justify-center text-white shrink-0">
            <Check size={10} strokeWidth={3} />
          </div>
          <span className="text-[11.5px] text-gray-800 font-sans">
            Email me with news and offers
          </span>
        </label>
      </div>
    );
  }

  return (
    <div className="mb-4.5 space-y-2">
      <div className="flex justify-between items-center">
        <h2
          className="text-[12px] font-dala-roman tracking-widest text-black uppercase font-normal"
        >
          CONTACT
        </h2>
        <Link
          to="/account"
          className="text-[11px] text-[#90134a] hover:underline underline-offset-2 font-medium"
        >
          Sign in
        </Link>
      </div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-[11.5px] bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-gray-400 font-sans"
        value={formData.email}
        onChange={handleInputChange}
      />
      <label className="flex items-center gap-2 cursor-pointer pt-0.5">
        <input
          type="checkbox"
          className="w-3.5 h-3.5 accent-[#90134a] rounded"
          defaultChecked
        />
        <span className="text-[11px] text-gray-800 font-sans">
          Email me with news and offers
        </span>
      </label>
    </div>
  );
};
