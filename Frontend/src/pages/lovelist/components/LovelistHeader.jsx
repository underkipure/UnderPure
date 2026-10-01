import React, { useState, useRef, useEffect } from 'react';
import { User, Share2, MoreVertical, Trash2 } from 'lucide-react';

export default function LovelistHeader({
  pageConfig,
  user,
  isAuthenticated,
  activeTab,
  setActiveTab,
  onGuestClick,
  onShareClick,
  onClearLovelist,
  onMoveAllSavedToCart,
  savedItemsCount = 0
}) {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  // Close options dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Title */}
      <h1
        className="text-[32px] md:text-[54px] font-dala-roman mb-8 md:mb-14 text-black"
      >
        {pageConfig.pageTitle || 'Lovelist'}
      </h1>

      <div className="w-full md:w-[85%] mx-auto">
        {/* User Identity */}
        <div className="flex justify-end mb-4 relative">
          <button
            onClick={() => !isAuthenticated && onGuestClick()}
            className="flex items-center gap-2 text-[14px] font-medium text-[#4a4f5c] hover:opacity-70 transition-opacity"
          >
            <User size={20} strokeWidth={1.5} />
            <span className="tracking-[0.0001em] hidden md:inline">
              {isAuthenticated
                ? user?.email || pageConfig.loggedInDefaultText || 'My Account'
                : pageConfig.guestUserText || 'Guest'}
            </span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-y border-gray-600">
          <button
            onClick={() => setActiveTab('lovelist')}
            className={`flex-1 py-4 text-center text-[15px] md:text-[17px] tracking-[0.0001em] transition-colors ${
              activeTab === 'lovelist'
                ? 'bg-[#4a4f5c] text-white'
                : 'bg-white text-[#4a4f5c] hover:bg-gray-50'
            }`}
          >
            {pageConfig.tabs?.lovelist || 'LOVELIST'}
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-4 text-center text-[15px] md:text-[17px] tracking-[0.0001em] transition-colors ${
              activeTab === 'saved'
                ? 'bg-[#4a4f5c] text-white'
                : 'bg-white text-[#4a4f5c] hover:bg-gray-50'
            }`}
          >
            {pageConfig.tabs?.saved || 'SAVED ITEMS'}
          </button>
        </div>

        {/* Action Bar */}
        {activeTab === 'lovelist' ? (
          <div className="border-b border-gray-200 p-4 flex flex-col md:flex-row justify-end items-end md:items-center gap-3 bg-white relative">
            <div
              className="relative mb-2 md:mb-0 w-full flex justify-end border-b border-gray-200 md:border-none pb-2 md:pb-0"
              ref={optionsRef}
            >
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="text-black hover:text-black transition-colors p-1"
                title="Options"
              >
                <MoreVertical size={20} />
              </button>

              {/* Options Dropdown */}
              {showOptions && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-lg py-2 min-w-[150px] z-20">
                  <button
                    onClick={() => {
                      onClearLovelist();
                      setShowOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 text-[12px] hover:bg-gray-50 text-[#e63946] transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>{pageConfig.buttons?.clearList || 'Clear list'}</span>
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onShareClick}
              className="p-2 md:p-3 border border-gray-400 text-gray-500 hover:text-black hover:border-black transition-colors"
              title="Share list"
            >
              <Share2 size={18} />
            </button>
          </div>
        ) : (
          <div className="p-4 md:p-6 flex justify-between items-center gap-3 bg-white relative">
            <button
              onClick={onMoveAllSavedToCart}
              disabled={savedItemsCount === 0}
              className="px-4 py-2.5 md:px-6 md:py-3 border border-gray-300 text-gray-400 text-[13px] md:text-[14px] hover:text-black hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pageConfig.buttons?.moveToCart || 'MOVE ALL TO CART'}
            </button>
            <button
              onClick={onShareClick}
              className="p-2 md:p-3 border border-gray-400 text-gray-500 hover:text-black hover:border-black transition-colors"
              title="Share list"
            >
              <Share2 size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
