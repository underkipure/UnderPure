import React from 'react';
import { Menu, Search, Clock, Minimize2, Maximize2 } from 'lucide-react';

export default function AdminHeader({
  setIsSidebarOpen,
  setIsCommandOpen,
  currentGroup,
  currentNavItem,
  currentTime,
  isFullscreen,
  toggleFullscreen,
  user,
  userInitial
}) {
  return (
    <header className="h-16 bg-white border-b border-black/10 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-black" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
          <Menu size={24} strokeWidth={1.5} />
        </button>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-gray-400 hidden sm:block">
            Admin {currentGroup ? `/ ${currentGroup.title}` : ''}
          </div>
          <h2 className="font-serif text-xl tracking-wide text-black leading-tight">{currentNavItem.name}</h2>
        </div>
      </div>

      {/* Quick Jump / Spotlight Trigger Button */}
      <button
        onClick={() => setIsCommandOpen(true)}
        className="hidden md:flex items-center justify-between w-64 lg:w-80 bg-gray-50 border border-gray-200 hover:border-gray-400 rounded-full pl-4 pr-3 py-1.5 transition-all text-left"
      >
        <div className="flex items-center gap-2.5 text-gray-500">
          <Search size={14} />
          <span className="text-xs uppercase tracking-wider">Quick Jump & Actions...</span>
        </div>
        <kbd className="inline-flex items-center px-1.5 py-0.5 border border-gray-200 rounded text-[9px] font-mono text-gray-500 bg-white">
          Ctrl K
        </kbd>
      </button>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Command Palette Trigger */}
        <button
          onClick={() => setIsCommandOpen(true)}
          className="md:hidden p-2 text-gray-600 hover:text-black rounded-full transition-colors"
          title="Search Pages & Actions"
          aria-label="Search Pages and Actions"
        >
          <Search size={18} />
        </button>

        {/* Live Time Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-gray-500 border-r border-gray-200 pr-4">
          <Clock size={13} className="text-gray-400" />
          <span>
            {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </button>

        <div className="flex items-center gap-3 text-sm tracking-widest uppercase text-black">
          <span className="hidden sm:block text-xs text-gray-500">{user?.name || user?.email || 'Admin'}</span>
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full font-serif text-lg">
            {userInitial}
          </div>
        </div>
      </div>
    </header>
  );
}
