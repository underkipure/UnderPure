import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { useSiteSettingsStore } from './store/siteSettingsStore';
import { useAuthStore } from './store/authStore';
import { useProductStore } from './store/productStore';
import { useCategoryStore } from './store/categoryStore';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '255394142103-qfksq59129g65oebnt686h3ngofqbl68.apps.googleusercontent.com';

// Handle Vite dynamic import failure (e.g. after new deployment)
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const lastReload = sessionStorage.getItem('vite_preload_error_reload');
  const now = Date.now();
  if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
    sessionStorage.setItem('vite_preload_error_reload', now.toString());
    window.location.reload();
  }
});

function Bootstrap() {
  const loadSettings = useSiteSettingsStore((s) => s.loadSettings);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const loadCategories = useCategoryStore((s) => s.loadCategories);
  const loadProducts = useProductStore((s) => s.loadProducts);

  useEffect(() => {
    // Load site settings, categories, and products from backend on startup
    loadSettings();
    loadCategories();
    loadProducts();
    // Refresh current user session if token exists
    fetchMe();
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Bootstrap />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </HelmetProvider>,
);
