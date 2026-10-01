import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Section, Field, Input } from "./FormControls";

export const defaultGetHelpLinks = [
  { id: 1, label: "My Account", url: "/account" },
  { id: 2, label: "Chat with a Stylist", url: "chat:open" },
  { id: 3, label: "Find Your Bra Size", url: "/bra-size" },
  { id: 4, label: "FAQs", url: "/faqs" },
  { id: 5, label: "Affiliates", url: "/affiliates" },
  { id: 6, label: "Careers", url: "/careers" },
];

const GetHelpColumnEditor = ({
  fd,
  update,
  getHelpLinksList = [],
  addGetHelpLink,
  updateGetHelpLink,
  removeGetHelpLink,
}) => {
  return (
    <Section title="Footer Column 4: Get Help Links">
      <Field label="Section Title">
        <Input
          value={
            fd.getHelpTitle !== undefined
              ? fd.getHelpTitle
              : "GET HELP"
          }
          onChange={(v) => update({ getHelpTitle: v })}
          placeholder="GET HELP"
        />
      </Field>
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[10px] uppercase tracking-widest text-gray-500">
            Get Help Links
          </label>
          <button
            type="button"
            onClick={addGetHelpLink}
            className="flex items-center gap-1 text-[10px] uppercase tracking-widest hover:underline cursor-pointer"
          >
            <Plus size={12} /> Add Link
          </button>
        </div>
        <div className="space-y-2">
          {getHelpLinksList.map((l) => (
            <div
              key={l.id}
              className="flex flex-col sm:flex-row gap-2 items-start sm:items-center group relative p-2 sm:p-0 border sm:border-0 border-black/5 bg-gray-50/50 sm:bg-transparent"
            >
              <input
                type="text"
                value={l.label || l.name || ""}
                onChange={(e) =>
                  updateGetHelpLink(l.id, "label", e.target.value)
                }
                placeholder="Link Label (e.g. FAQs)"
                className="w-full sm:flex-1 border border-black/20 p-2 text-sm focus:outline-none focus:border-black bg-white"
              />
              <input
                type="text"
                value={l.url || ""}
                onChange={(e) =>
                  updateGetHelpLink(l.id, "url", e.target.value)
                }
                placeholder="URL (e.g. /faqs or chat:open)"
                className="w-full sm:flex-1 border border-black/20 p-2 text-sm text-gray-600 focus:outline-none focus:border-black bg-white"
              />
              <button
                type="button"
                onClick={() => removeGetHelpLink(l.id)}
                className="absolute sm:relative top-2 right-2 sm:top-auto sm:right-auto text-gray-300 hover:text-red-500 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                title="Remove Link"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default GetHelpColumnEditor;
