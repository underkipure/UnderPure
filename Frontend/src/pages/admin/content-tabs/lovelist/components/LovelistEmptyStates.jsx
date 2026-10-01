import React from "react";

export default function LovelistEmptyStates({ d, update }) {
  return (
    <div className="space-y-4 border border-black/10 p-5">
      <h3 className="text-sm font-bold uppercase tracking-widest border-b border-black/10 pb-2 mb-4">
        Empty States
      </h3>
      <div className="space-y-6">
        <div className="border-l-2 border-black pl-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3">
            Lovelist (Empty)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Title
              </label>
              <input
                type="text"
                value={d.emptyLovelist?.title || ""}
                onChange={(e) =>
                  update({
                    emptyLovelist: { ...d.emptyLovelist, title: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={d.emptyLovelist?.buttonText || ""}
                onChange={(e) =>
                  update({
                    emptyLovelist: {
                      ...d.emptyLovelist,
                      buttonText: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Link
              </label>
              <input
                type="text"
                value={d.emptyLovelist?.link || ""}
                onChange={(e) =>
                  update({
                    emptyLovelist: { ...d.emptyLovelist, link: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        <div className="border-l-2 border-black pl-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3">
            Saved (Empty)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Title
              </label>
              <input
                type="text"
                value={d.emptySaved?.title || ""}
                onChange={(e) =>
                  update({
                    emptySaved: { ...d.emptySaved, title: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={d.emptySaved?.subtitle || ""}
                onChange={(e) =>
                  update({
                    emptySaved: { ...d.emptySaved, subtitle: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={d.emptySaved?.buttonText || ""}
                onChange={(e) =>
                  update({
                    emptySaved: {
                      ...d.emptySaved,
                      buttonText: e.target.value,
                    },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Link
              </label>
              <input
                type="text"
                value={d.emptySaved?.link || ""}
                onChange={(e) =>
                  update({
                    emptySaved: { ...d.emptySaved, link: e.target.value },
                  })
                }
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
