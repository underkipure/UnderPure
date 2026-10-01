import React from 'react';
import { Save } from 'lucide-react';

export default function BrandDescriptionEditor({
  brandDescription,
  setBrandDescription,
  onSave,
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg">Brand SEO Description Settings</h3>
      <p className="text-xs text-gray-500">
        Edit the heading and paragraphs at the bottom of the Homepage. All fonts,
        margins, and styling remain exactly as designed.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Main Heading
          </label>
          <input
            type="text"
            value={brandDescription.heading || ''}
            onChange={e =>
              setBrandDescription({ ...brandDescription, heading: e.target.value })
            }
            placeholder="UnderPure: Luxury Lingerie & Ready-to-Wear"
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Paragraph 1 (First word highlighted automatically)
          </label>
          <textarea
            rows="3"
            value={brandDescription.p1 || ''}
            onChange={e =>
              setBrandDescription({ ...brandDescription, p1: e.target.value })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Paragraph 2
          </label>
          <textarea
            rows="3"
            value={brandDescription.p2 || ''}
            onChange={e =>
              setBrandDescription({ ...brandDescription, p2: e.target.value })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Paragraph 3 (Shown after 'Show More')
          </label>
          <textarea
            rows="3"
            value={brandDescription.p3 || ''}
            onChange={e =>
              setBrandDescription({ ...brandDescription, p3: e.target.value })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Paragraph 4 (Shown after 'Show More')
          </label>
          <textarea
            rows="3"
            value={brandDescription.p4 || ''}
            onChange={e =>
              setBrandDescription({ ...brandDescription, p4: e.target.value })
            }
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-black/10">
        <button
          type="button"
          onClick={() => onSave('brandDescription', brandDescription)}
          className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
        >
          <Save size={14} /> Save Brand Description
        </button>
      </div>
    </div>
  );
}
