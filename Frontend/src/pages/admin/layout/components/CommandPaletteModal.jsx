import React from 'react';
import { Search, CornerDownLeft } from 'lucide-react';

export default function CommandPaletteModal({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  selectedIndex,
  setSelectedIndex,
  combinedItems,
  handleSelectCommandItem,
  handleCommandKeyDown,
  commandInputRef
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-xs flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-3 sm:px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[95vw] sm:max-w-xl bg-white border border-black/10 rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Search Input */}
        <div className="flex items-center px-4 border-b border-gray-200 bg-gray-50">
          <Search size={18} className="text-gray-400 shrink-0 mr-3" />
          <input
            ref={commandInputRef}
            type="text"
            placeholder="Type to search pages or actions (Up/Down to navigate)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleCommandKeyDown}
            className="w-full py-4 bg-transparent text-sm uppercase tracking-wider text-black placeholder-gray-400 focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-black px-2 py-1"
          >
            ESC
          </button>
        </div>

        {/* Modal Items List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
          {combinedItems.length === 0 ? (
            <div className="p-6 text-center text-xs uppercase tracking-wider text-gray-400">
              No matching pages or actions found.
            </div>
          ) : (
            combinedItems.map((item, idx) => (
              <button
                key={`${item.type}-${item.name}`}
                onClick={() => handleSelectCommandItem(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  selectedIndex === idx ? 'bg-black text-white' : 'hover:bg-gray-50 text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={16} className={selectedIndex === idx ? 'text-white' : 'text-gray-400'} />
                  <span className="text-xs uppercase tracking-wider font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-widest ${selectedIndex === idx ? 'text-gray-300' : 'text-gray-400'}`}>
                    {item.type === 'page' ? 'Page' : 'Action'}
                  </span>
                  <CornerDownLeft size={13} className={selectedIndex === idx ? 'text-white' : 'text-gray-400'} />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Palette Footer */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-400">
          <span>Navigate with Up / Down arrows</span>
          <span>Press Enter to Select</span>
        </div>
      </div>
    </div>
  );
}
