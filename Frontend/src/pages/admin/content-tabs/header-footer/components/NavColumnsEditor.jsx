import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Section } from "./FormControls";

const NavColumnsEditor = ({
  fd,
  addColumn,
  updateColumn,
  removeColumn,
  addLink,
  updateLink,
  removeLink,
}) => {
  return (
    <Section title="Additional Footer Columns (Optional / Custom)">
      <div className="space-y-4">
        {fd.columns.map((col) => (
          <div key={col.id} className="border border-black/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={col.title}
                onChange={(e) => updateColumn(col.id, "title", e.target.value)}
                className="text-xs font-bold uppercase tracking-widest border-b border-black/20 focus:outline-none focus:border-black pb-0.5 bg-transparent"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => addLink(col.id)}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-widest hover:underline"
                >
                  <Plus size={12} /> Add Link
                </button>
                <button
                  onClick={() => removeColumn(col.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {col.links.map((link) => (
                <div
                  key={link.id}
                  className="flex flex-col sm:flex-row gap-2 items-start sm:items-center group relative p-2 sm:p-0 border sm:border-0 border-black/5 bg-gray-50/50 sm:bg-transparent"
                >
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) =>
                      updateLink(col.id, link.id, "name", e.target.value)
                    }
                    placeholder="Link Name"
                    className="w-full sm:flex-1 border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) =>
                      updateLink(col.id, link.id, "url", e.target.value)
                    }
                    placeholder="/url"
                    className="w-full sm:flex-1 border border-black/20 p-2 text-sm text-gray-500 focus:outline-none focus:border-black"
                  />
                  <button
                    onClick={() => removeLink(col.id, link.id)}
                    className="absolute sm:relative top-2 right-2 sm:top-auto sm:right-auto text-gray-300 hover:text-red-500 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {col.links.length === 0 && (
                <p className="text-[11px] text-gray-400 italic">No links yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addColumn}
        className="flex items-center gap-2 text-[11px] uppercase tracking-widest border border-black/20 px-4 py-2 hover:border-black transition-colors"
      >
        <Plus size={12} /> Add Column
      </button>
    </Section>
  );
};

export default NavColumnsEditor;
