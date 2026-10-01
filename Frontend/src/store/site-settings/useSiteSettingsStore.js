import { create } from 'zustand';
import { getApiBaseUrl } from '../../lib/productUtils';
import { DEFAULTS } from './defaults';
import { deepMerge, getStoredSettings, saveSettingsToCache, clearSettingsCache } from './utils';

const storedSettings = getStoredSettings() || {};
let activeSettingsPromise = null;
let lastLoadTime = 0;
const FRESHNESS_TTL = 30000; // 30 seconds

export const useSiteSettingsStore = create((set, get) => ({
  ...deepMerge(DEFAULTS, storedSettings),
  _loaded: !!getStoredSettings(),

  /** Load settings from backend (uses lean /settings/storefront for fast initial render) */
  loadSettings: async (options = {}) => {
    const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    const isFull = !!(options.full || isAdminRoute);

    // If storefront settings are already loaded and fresh, avoid duplicate network roundtrips
    if (!isFull && !options.force && get()._loaded && Date.now() - lastLoadTime < FRESHNESS_TTL) {
      return;
    }

    // Reuse existing in-flight request
    if (activeSettingsPromise) {
      return activeSettingsPromise;
    }

    activeSettingsPromise = (async () => {
      try {
        const url = isFull
          ? `${getApiBaseUrl()}/settings`
          : `${getApiBaseUrl()}/settings/storefront`;

        let res = await fetch(url);
        if (!res.ok && url.endsWith('/storefront')) {
          // Fallback to /settings if storefront endpoint is unavailable
          res = await fetch(`${getApiBaseUrl()}/settings`);
        }
        if (!res.ok) return;
        const data = await res.json();
        
        // Filter out null or missing values so they don't overwrite defaults
        const validData = {};
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
          for (const key in data) {
            if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
              validData[key] = data[key];
            }
          }
        }
        
        // Ensure contactEmail and contactPhone are strictly strings
        if (validData.contactEmail && typeof validData.contactEmail !== 'string') {
          delete validData.contactEmail;
        }
        if (validData.contactPhone && typeof validData.contactPhone !== 'string') {
          delete validData.contactPhone;
        }

        // Fix legacy mapping and shallow merge issues
        if (validData.collectionSettings) {
          validData.collectionSettings = {
            ...DEFAULTS.collectionSettings,
            ...validData.collectionSettings,
          };
          // Migrate saleTabText to customTabTitles if needed
          if (validData.collectionSettings.saleTabText && !validData.collectionSettings.customTabTitles?.sale) {
            validData.collectionSettings.customTabTitles = {
              ...(validData.collectionSettings.customTabTitles || {}),
              sale: validData.collectionSettings.saleTabText
            };
          }
        }

        saveSettingsToCache(validData);
        lastLoadTime = Date.now();

        // Merge server values on top of current state deep-merged with defaults
        set({ ...deepMerge(get(), validData), _loaded: true });
      } catch {
        // Network error – keep defaults
        set({ _loaded: true });
      } finally {
        activeSettingsPromise = null;
      }
    })();

    return activeSettingsPromise;
  },

  /** Explicitly load full settings for Admin sections */
  loadFullSettings: async () => {
    return get().loadSettings({ full: true });
  },

  /** Update settings optimistically + persist to server */
  updateSettings: async (keyOrObj, valOrToken, maybeToken) => {
    let payload = {};
    let token = valOrToken;

    if (typeof keyOrObj === 'string') {
      payload = { [keyOrObj]: valOrToken };
      token = maybeToken;
    } else {
      payload = keyOrObj || {};
    }

    // Optimistic update
    set(payload);

    saveSettingsToCache(get());

    if (!token) {
      throw new Error('Authentication token is missing. Please log in again.');
    }
    try {
      const response = await fetch(`${getApiBaseUrl()}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update settings on server');
      }
    } catch (err) {
      console.error('Failed to save settings to server:', err);
      throw err;
    }
  },

  resetSettings: () => {
    clearSettingsCache();
    set({ ...DEFAULTS, _loaded: true });
  },
}));
