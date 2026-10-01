import React from 'react';
import { Save } from 'lucide-react';

export default function PressQuotesEditor({
  pressQuotes,
  setPressQuotes,
  onSave,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-lg">
          Press Quotes (Vogue, Who What Wear, The Zoe Report)
        </h3>
        <p className="text-xs text-gray-500">
          Edit headings and magazine quotes displayed above the brand description section.
        </p>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
            Section Heading (Optional, above all quotes)
          </label>
          <input
            type="text"
            value={pressQuotes.sectionHeading || ''}
            onChange={e =>
              setPressQuotes({ ...pressQuotes, sectionHeading: e.target.value })
            }
            placeholder="e.g. PRESS & REVIEWS (leave empty to hide)"
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
          />
        </div>

        {/* Quote 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 border border-black/10">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Quote 1 Heading
            </label>
            <input
              type="text"
              value={pressQuotes.heading1 || 'VOGUE'}
              onChange={e =>
                setPressQuotes({ ...pressQuotes, heading1: e.target.value })
              }
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            />
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mt-3 mb-1">
              Heading Style
            </label>
            <select
              value={pressQuotes.style1 || 'serif-bold'}
              onChange={e =>
                setPressQuotes({ ...pressQuotes, style1: e.target.value })
              }
              className="w-full border border-black/20 p-2.5 text-xs bg-white focus:outline-none focus:border-black"
            >
              <option value="serif-bold">Serif Bold (e.g. VOGUE)</option>
              <option value="sans-heavy">Sans Heavy Bold (e.g. WHO WHAT WEAR)</option>
              <option value="center-bold">Center Word Bold (e.g. THE [BOLD] REPORT)</option>
              <option value="sans-bold">All Bold Black</option>
              <option value="sans-light">All Light Grey</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Quote 1 Text
            </label>
            <textarea
              rows="4"
              value={pressQuotes.quote1 || ''}
              onChange={e =>
                setPressQuotes({ ...pressQuotes, quote1: e.target.value })
              }
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-sans"
            />
          </div>
        </div>

        {/* Quote 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 border border-black/10">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Quote 2 Heading
            </label>
            <input
              type="text"
              value={pressQuotes.heading2 || 'WHO WHAT WEAR'}
              onChange={e =>
                setPressQuotes({ ...pressQuotes, heading2: e.target.value })
              }
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            />
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mt-3 mb-1">
              Heading Style
            </label>
            <select
              value={pressQuotes.style2 || 'sans-heavy'}
              onChange={e =>
                setPressQuotes({ ...pressQuotes, style2: e.target.value })
              }
              className="w-full border border-black/20 p-2.5 text-xs bg-white focus:outline-none focus:border-black"
            >
              <option value="sans-heavy">Sans Heavy Bold (e.g. WHO WHAT WEAR)</option>
              <option value="center-bold">Center Word Bold (e.g. THE [BOLD] REPORT)</option>
              <option value="serif-bold">Serif Bold (e.g. VOGUE)</option>
              <option value="sans-bold">All Bold Black</option>
              <option value="sans-light">All Light Grey</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Quote 2 Text
            </label>
            <textarea
              rows="4"
              value={pressQuotes.quote2 || ''}
              onChange={e =>
                setPressQuotes({ ...pressQuotes, quote2: e.target.value })
              }
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-sans"
            />
          </div>
        </div>

        {/* Quote 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 border border-black/10">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Quote 3 Heading
            </label>
            <input
              type="text"
              value={pressQuotes.heading3 || 'THE ZOE REPORT'}
              onChange={e =>
                setPressQuotes({ ...pressQuotes, heading3: e.target.value })
              }
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            />
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mt-3 mb-1">
              Heading Style
            </label>
            <select
              value={pressQuotes.style3 || 'center-bold'}
              onChange={e =>
                setPressQuotes({ ...pressQuotes, style3: e.target.value })
              }
              className="w-full border border-black/20 p-2.5 text-xs bg-white focus:outline-none focus:border-black"
            >
              <option value="center-bold">Center Word Bold (e.g. THE [BOLD] REPORT)</option>
              <option value="serif-bold">Serif Bold (e.g. VOGUE)</option>
              <option value="sans-heavy">Sans Heavy Bold (e.g. WHO WHAT WEAR)</option>
              <option value="sans-bold">All Bold Black</option>
              <option value="sans-light">All Light Grey</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Quote 3 Text
            </label>
            <textarea
              rows="4"
              value={pressQuotes.quote3 || ''}
              onChange={e =>
                setPressQuotes({ ...pressQuotes, quote3: e.target.value })
              }
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-sans"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-black/10">
        <button
          type="button"
          onClick={() => onSave('pressQuotes', pressQuotes)}
          className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
        >
          <Save size={14} /> Save Press Quotes
        </button>
      </div>
    </div>
  );
}
