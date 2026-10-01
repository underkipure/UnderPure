import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, ChevronRight, ChevronLeft, ExternalLink, LogOut } from 'lucide-react';

export default function AdminSidebar({
  isCollapsed,
  isSidebarOpen,
  setIsSidebarOpen,
  toggleCollapse,
  handleLogout,
  logo,
  storeName,
  logoError,
  setLogoError,
  navGroups
}) {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-[100dvh] bg-black text-white z-[100]
        transition-all duration-300 ease-in-out flex flex-col border-r border-gray-800 pb-safe
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800 shrink-0">
          <NavLink
            to="/admin"
            className={`flex items-center no-underline text-white overflow-hidden group ${
              isCollapsed && !isSidebarOpen ? 'justify-center w-full' : 'gap-3 w-full'
            }`}
          >
            {logo && !logoError ? (
              <img
                src={logo}
                alt={storeName || "UNDERPURE"}
                onError={() => setLogoError(true)}
                className={`h-8 w-auto object-contain brightness-0 invert transition-all duration-200 group-hover:opacity-90 ${
                  isCollapsed && !isSidebarOpen ? 'max-w-[42px] mx-auto' : 'max-w-[145px]'
                }`}
              />
            ) : (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-serif font-bold text-sm shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105">
                  {(storeName || "UP").slice(0, 2).toUpperCase()}
                </div>
                {(!isCollapsed || isSidebarOpen) && (
                  <div className="flex flex-col min-w-0">
                    <span className="font-serif text-sm tracking-widest font-bold uppercase truncate text-white leading-none">
                      {storeName || "UNDERPURE"}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.18em] text-gray-400 font-sans mt-1">
                      Control Center
                    </span>
                  </div>
                )}
              </div>
            )}
          </NavLink>

          {isSidebarOpen && (
            <button
              className="md:hidden text-gray-400 hover:text-white p-1 shrink-0 ml-2"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-5 px-3 space-y-5 overflow-y-auto no-scrollbar">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {(!isCollapsed || isSidebarOpen) && (
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 px-2 truncate">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setIsSidebarOpen(false)}
                  title={isCollapsed && !isSidebarOpen ? item.name : undefined}
                  className={({ isActive }) => `
                    flex items-center gap-3.5 px-3 py-2.5 rounded text-xs uppercase tracking-widest transition-all duration-150 group relative
                    ${isActive 
                      ? 'bg-white text-black font-semibold shadow-sm' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }
                    ${isCollapsed && !isSidebarOpen ? 'justify-center' : ''}
                  `}
                >
                  <item.icon size={18} strokeWidth={1.7} className="shrink-0" />
                  {(!isCollapsed || isSidebarOpen) && (
                    <span className="truncate">{item.name}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer & Toggle Area */}
        <div className="p-3 border-t border-gray-800 space-y-1 shrink-0">
          <button
            onClick={toggleCollapse}
            className="hidden md:flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 w-full transition-colors rounded justify-center"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!isCollapsed && <span>Collapse Sidebar</span>}
          </button>

          <button 
            onClick={() => window.open('/', '_blank')}
            className={`flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 w-full transition-colors rounded ${isCollapsed ? 'justify-center' : ''}`}
            title="Open Storefront"
          >
            <ExternalLink size={18} strokeWidth={1.5} className="shrink-0" />
            {!isCollapsed && <span>Live Store</span>}
          </button>

          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-widest text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-colors rounded ${isCollapsed ? 'justify-center' : ''}`}
            title="Sign Out"
          >
            <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
