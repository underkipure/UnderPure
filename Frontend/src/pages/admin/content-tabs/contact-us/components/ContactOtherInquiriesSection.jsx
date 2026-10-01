import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Section, Field, Input, Toggle } from "./ContactFormPrimitives";

export default function ContactOtherInquiriesSection({
  otherInquiries,
  update,
}) {
  const oi = otherInquiries || {};

  // Initialize items array with backwards compatibility
  const items = Array.isArray(oi.items)
    ? oi.items
    : [
        {
          id: "gen",
          label: "General inquiries",
          email: oi.generalEmail || "hello@underpure.com",
        },
        {
          id: "press",
          label: "Press inquiries",
          email: oi.pressEmail || "press@underpure.com",
        },
        {
          id: "whole",
          label: "Wholesale inquiries",
          email: oi.wholesaleEmail || "wholesale@underpure.com",
        },
        {
          id: "market",
          label: "Marketing, Partnerships and Affiliate inquiries",
          email: oi.marketingEmail || "press@underpure.com",
        },
      ];

  const updateOi = (patch) => update({ otherInquiries: { ...oi, ...patch } });

  const isEnabled = oi.enabled !== false;
  const isSocialEnabled = oi.socialEnabled !== false;

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      label: "New Inquiry",
      email: "",
    };
    updateOi({ items: [...items, newItem] });
  };

  const updateItem = (id, field, value) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateOi({ items: updated });
  };

  const removeItem = (id) => {
    const updated = items.filter((item) => item.id !== id);
    updateOi({ items: updated });
  };

  return (
    <Section title="Other Inquiries Section">
      {/* 1. Global Section Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
        <Toggle
          enabled={isEnabled}
          onChange={(v) => updateOi({ enabled: v })}
          label={
            isEnabled
              ? "Other Inquiries: Visible on Page"
              : "Other Inquiries: Hidden on Page"
          }
        />
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">
          {isEnabled ? "Section Active" : "Section Disabled"}
        </span>
      </div>

      <div
        className={`space-y-6 transition-opacity ${
          isEnabled ? "opacity-100" : "opacity-40 pointer-events-none"
        }`}
      >
        {/* Section Heading Title */}
        <Field label="Section Title">
          <Input
            value={oi.title || ""}
            onChange={(v) => updateOi({ title: v })}
            placeholder="e.g. other inquiries"
          />
        </Field>

        {/* 2. Social Lead-in Line */}
        <div className="bg-gray-50/70 border border-black/10 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Toggle
              enabled={isSocialEnabled}
              onChange={(v) => updateOi({ socialEnabled: v })}
              label={
                isSocialEnabled
                  ? "Social Mention Line: Visible"
                  : "Social Mention Line: Hidden"
              }
            />
          </div>
          {isSocialEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <Field label="Social Lead-in Text">
                <Input
                  value={oi.socialText || ""}
                  onChange={(v) => updateOi({ socialText: v })}
                  placeholder="e.g. Share what you love. Love what you share:"
                />
              </Field>
              <Field label="Social Handle">
                <Input
                  value={oi.socialHandle || ""}
                  onChange={(v) => updateOi({ socialHandle: v })}
                  placeholder="e.g. @underpurenyc"
                />
              </Field>
              <Field label="Social Link URL">
                <Input
                  value={oi.socialUrl || ""}
                  onChange={(v) => updateOi({ socialUrl: v })}
                  placeholder="e.g. https://instagram.com/underpurenyc"
                />
              </Field>
            </div>
          )}
        </div>

        {/* 3. Dynamic Inquiry Email Items (Add, Edit, Delete) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-black">
                Inquiries Directory
              </label>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                Add, customize, or delete specific inquiry channels
              </p>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="bg-black text-white px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> Add Inquiry
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3 border border-black/10 bg-white"
              >
                <div className="w-full sm:w-[45%]">
                  <label className="block text-[9px] uppercase tracking-widest text-gray-400 mb-1">
                    Inquiry Label
                  </label>
                  <input
                    type="text"
                    value={item.label || ""}
                    onChange={(e) =>
                      updateItem(item.id, "label", e.target.value)
                    }
                    placeholder="e.g. Press inquiries"
                    className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black bg-white"
                  />
                </div>
                <div className="w-full sm:flex-1">
                  <label className="block text-[9px] uppercase tracking-widest text-gray-400 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={item.email || ""}
                    onChange={(e) =>
                      updateItem(item.id, "email", e.target.value)
                    }
                    placeholder="e.g. press@underpure.com"
                    className="w-full border border-black/20 p-2 text-sm text-gray-700 focus:outline-none focus:border-black bg-white"
                  />
                </div>
                <div className="sm:pt-4 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-red-500 p-2 transition-colors cursor-pointer"
                    title="Delete this inquiry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="p-6 text-center border border-dashed border-gray-300 text-gray-400 text-xs">
                No inquiry email items added yet. Click &ldquo;+ Add Inquiry&rdquo; above to create one.
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
