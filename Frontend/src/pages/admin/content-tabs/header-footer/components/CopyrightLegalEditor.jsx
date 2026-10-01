import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Section, Field, Input } from "./FormControls";

const CopyrightLegalEditor = ({
  fd,
  update,
  addLegalLink,
  updateLegalLink,
  removeLegalLink,
}) => {
  return (
    <Section title="Copyright & Legal Links">
      <Field label="Copyright Text">
        <Input
          value={fd.copyrightText}
          onChange={(v) => update({ copyrightText: v })}
        />
      </Field>
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[10px] uppercase tracking-widest text-gray-500">
            Legal Links (bottom bar)
          </label>
          <button
            onClick={addLegalLink}
            className="flex items-center gap-1 text-[10px] uppercase tracking-widest hover:underline"
          >
            <Plus size={12} /> Add Link
          </button>
        </div>
        <div className="space-y-2">
          {(fd.legalLinks || []).map((l) => (
            <div
              key={l.id}
              className="flex flex-col sm:flex-row gap-2 items-start sm:items-center group relative p-2 sm:p-0 border sm:border-0 border-black/5 bg-gray-50/50 sm:bg-transparent"
            >
              <input
                type="text"
                value={l.name}
                onChange={(e) =>
                  updateLegalLink(l.id, "name", e.target.value)
                }
                placeholder="Link Name"
                className="w-full sm:flex-1 border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
              />
              <input
                type="text"
                value={l.url}
                onChange={(e) =>
                  updateLegalLink(l.id, "url", e.target.value)
                }
                placeholder="/url"
                className="w-full sm:flex-1 border border-black/20 p-2 text-sm text-gray-500 focus:outline-none focus:border-black"
              />
              <button
                onClick={() => removeLegalLink(l.id)}
                className="absolute sm:relative top-2 right-2 sm:top-auto sm:right-auto text-gray-300 hover:text-red-500 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1"
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

export default CopyrightLegalEditor;
