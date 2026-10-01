import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { AdminProvider } from '../../../context/AdminContext';
import { useAuthStore } from '../../../store/authStore';
import { useSiteSettingsStore } from '../../../store/siteSettingsStore';
import { navGroups, allNavItems, getQuickActions } from './navigationConfig';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import CommandPaletteModal from './components/CommandPaletteModal';
import BackToTopButton from './components/BackToTopButton';

export default function AdminLayout() {
  const { logo, storeName, loadFullSettings } = useSiteSettingsStore();
  const [logoError, setLogoError] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('admin_sidebar_collapsed') === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBackToTop, setShowBackToTop] = useState(false);

  const commandInputRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (loadFullSettings) {
      loadFullSettings();
    }
  }, [loadFullSettings]);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('admin_sidebar_collapsed', String(nextState));
  };

  // Live Clock Update every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Route guard: must be logged in as admin
  const isAdmin = isAuthenticated && (user?.isAdmin || user?.role === 'admin' || user?.is_admin);
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const quickActions = getQuickActions(navigate, toggleCollapse, isCollapsed);

  const currentNavItem = allNavItems.find(item => {
    if (item.path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(item.path);
  }) || { name: 'Command Center' };

  const currentGroup = navGroups.find(g => g.items.some(i => i.name === currentNavItem.name));

  useEffect(() => {
    document.title = `${currentNavItem.name} - UnderPure Admin`;
  }, [currentNavItem.name]);

  // Global Ctrl+K / Cmd+K Command Palette Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      } else if (e.key === 'Escape' && isCommandOpen) {
        setIsCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandOpen]);

  // Auto focus input when Command Palette opens
  useEffect(() => {
    if (isCommandOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => commandInputRef.current?.focus(), 50);
    }
  }, [isCommandOpen]);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const filteredPages = searchQuery.trim() === '' 
    ? allNavItems 
    : allNavItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredActions = searchQuery.trim() === ''
    ? quickActions
    : quickActions.filter(action => action.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const combinedItems = [
    ...filteredPages.map(p => ({ ...p, type: 'page' })),
    ...filteredActions.map(a => ({ ...a, type: 'action' }))
  ];

  const handleSelectCommandItem = (item) => {
    setIsCommandOpen(false);
    if (item.type === 'page') {
      navigate(item.path);
    } else if (item.type === 'action') {
      item.action();
    }
  };

  // Keyboard navigation inside Command Palette
  const handleCommandKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, combinedItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + combinedItems.length) % Math.max(1, combinedItems.length));
    } else if (e.key === 'Enter' && combinedItems[selectedIndex]) {
      e.preventDefault();
      handleSelectCommandItem(combinedItems[selectedIndex]);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const userInitial = (user?.name || user?.email || 'A').charAt(0).toUpperCase();

  return (
    <AdminProvider>
      <div className={`min-h-screen bg-[#F9F9F9] flex font-sans overflow-x-hidden w-full m-0 p-0 transition-all duration-200 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        
        {/* Sidebar */}
        <AdminSidebar
          isCollapsed={isCollapsed}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          toggleCollapse={toggleCollapse}
          handleLogout={handleLogout}
          logo={logo}
          storeName={storeName}
          logoError={logoError}
          setLogoError={setLogoError}
          navGroups={navGroups}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <AdminHeader
            setIsSidebarOpen={setIsSidebarOpen}
            setIsCommandOpen={setIsCommandOpen}
            currentGroup={currentGroup}
            currentNavItem={currentNavItem}
            currentTime={currentTime}
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
            user={user}
            userInitial={userInitial}
          />

          {/* Page Content */}
          <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-x-hidden relative">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Full-Screen Spotlight Command Palette Modal */}
        <CommandPaletteModal
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          combinedItems={combinedItems}
          handleSelectCommandItem={handleSelectCommandItem}
          handleCommandKeyDown={handleCommandKeyDown}
          commandInputRef={commandInputRef}
        />

        {/* Floating Back to Top Button */}
        <BackToTopButton
          show={showBackToTop}
          onClick={scrollToTop}
        />
        
      </div>
    </AdminProvider>
  );
}
