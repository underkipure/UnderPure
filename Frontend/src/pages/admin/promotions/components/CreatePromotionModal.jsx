import React from "react";
import { X } from "lucide-react";
import { Field, INPUT_CLS } from "../constants";

export default function CreatePromotionModal({
  isOpen,
  onClose,
  form,
  setField,
  categories,
  handleCreate
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 w-full" onClick={onClose}>
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm w-full transition-opacity duration-200" />
      <div
        className="relative w-[95%] sm:w-full md:max-w-xl bg-white border border-gray-200 z-50 rounded-sm max-h-[90vh] overflow-hidden shadow-2xl flex flex-col transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
            <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-b border-gray-100 bg-white shrink-0 w-full">
              <p className="text-[10px] sm:text-xs md:text-[13px] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-sans font-bold text-black truncate">New Discount Code</p>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-black bg-gray-50 sm:bg-white p-1.5 sm:p-2 rounded-sm border border-gray-200 transition-transform hover:rotate-90 shrink-0"
                aria-label="Close modal"
              >
                <X size={16} className="sm:w-[20px] sm:h-[20px]" strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6 overflow-y-auto custom-scrollbar flex-1 w-full pb-24 md:pb-8">
              <Field label="Code *">
                <input 
                  type="text" 
                  value={form.code} 
                  onChange={(e) => setField("code", e.target.value.toUpperCase())} 
                  placeholder="SUMMER25" 
                  className={INPUT_CLS} 
                />
              </Field>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full">
                <Field label="Discount Type">
                  <select value={form.type} onChange={(e) => setField("type", e.target.value)} className={INPUT_CLS}>
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed (Rs.)</option>
                  </select>
                </Field>
                <Field label={form.type === "percent" ? "Discount %" : "Amount (Rs.)"}>
                  <input 
                    type="number" 
                    min={1} 
                    max={form.type === "percent" ? 100 : undefined} 
                    value={form.value} 
                    onChange={(e) => setField("value", Number(e.target.value))} 
                    className={INPUT_CLS} 
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full">
                <Field label="Min. Order (Rs.)">
                  <input 
                    type="number" 
                    min={0} 
                    value={form.minOrder} 
                    onChange={(e) => setField("minOrder", Number(e.target.value))} 
                    className={INPUT_CLS} 
                  />
                </Field>
                <Field label="Max Uses (blank = unlmt)">
                  <input 
                    type="number" 
                    min={1} 
                    value={form.maxUses ?? ""} 
                    onChange={(e) => setField("maxUses", e.target.value ? Number(e.target.value) : null)} 
                    className={INPUT_CLS} 
                  />
                </Field>
              </div>
              <Field label="Expiry Date (blank = never)">
                <input 
                  type="date" 
                  value={form.expires ?? ""} 
                  onChange={(e) => setField("expires", e.target.value || null)} 
                  className={INPUT_CLS} 
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full">
                <Field label="Applies To">
                  <select value={form.applyTo} onChange={(e) => setField("applyTo", e.target.value)} className={INPUT_CLS}>
                    <option value="all">Entire Cart</option>
                    <option value="category">Specific Category</option>
                  </select>
                </Field>
                {form.applyTo === "category" && (
                  <Field label="Category *">
                    <select 
                      value={form.category_id || ""} 
                      onChange={(e) => setField("category_id", e.target.value ? Number(e.target.value) : null)} 
                      className={INPUT_CLS}
                    >
                      <option value="">Select Category...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </Field>
                )}
              </div>

              {/* Desktop Buttons */}
              <div className="hidden md:flex gap-4 pt-4 border-t border-gray-100 w-full">
                <button 
                  onClick={onClose} 
                  className="flex-1 bg-white border border-gray-200 text-black py-4 text-xs tracking-[0.15em] uppercase font-sans font-bold transition-colors rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate} 
                  className="flex-1 bg-black text-white py-4 text-xs tracking-[0.15em] uppercase font-sans font-bold hover:bg-gray-800 transition-colors rounded-sm shadow-md"
                >
                  Create Code
                </button>
              </div>
            </div>

            {/* Mobile Sticky Buttons */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 flex gap-2.5 sm:gap-3 z-20 w-full">
              <button 
                onClick={onClose} 
                className="flex-1 bg-white border border-gray-200 text-black py-3.5 sm:py-4 text-[10px] sm:text-xs tracking-[0.15em] uppercase font-sans font-bold rounded-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate} 
                className="flex-1 bg-black text-white py-3.5 sm:py-4 text-[10px] sm:text-xs tracking-[0.15em] uppercase font-sans font-bold hover:bg-gray-800 rounded-sm shadow-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
  );
}
