import React from "react";

export const Section = ({ title, children }) => (
  <div className="bg-white border border-black/10 p-6 space-y-5">
    <h3 className="font-serif text-lg border-b border-black/10 pb-3">{title}</h3>
    {children}
  </div>
);

export const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
      {label}
    </label>
    {children}
  </div>
);

export const Input = ({ value, onChange, placeholder, className = "" }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black ${className}`}
  />
);

export const TextArea = ({ value, onChange, placeholder, className = "" }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black min-h-[80px] ${className}`}
  />
);

export const Toggle = ({ enabled, onChange, label }) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className="flex items-center gap-2 text-[11px] font-sans font-bold uppercase tracking-widest cursor-pointer"
  >
    <span
      className={`inline-block w-8 h-4 rounded-full transition-colors relative ${
        enabled ? "bg-black" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
          enabled ? "left-4.5" : "left-0.5"
        }`}
      />
    </span>
    {label}
  </button>
);
