import { DEFAULTS } from './defaults';

export const CACHE_KEY = 'underpure_site_settings_cache';

/**
 * Deep merge two objects recursively
 */
export const deepMerge = (target, source) => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return target;
  const output = { ...target };
  for (const key in source) {
    if (source[key] !== undefined && source[key] !== null) {
      if (
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }
  return output;
};

/**
 * Retrieve cached settings from localStorage with validation
 */
export const getStoredSettings = () => {
  try {
    const s = localStorage.getItem(CACHE_KEY);
    if (!s) return null;
    const data = JSON.parse(s);
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return null;

    const validData = {};
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        validData[key] = data[key];
      }
    }
    // Ensure contactEmail and contactPhone are strings, never objects or arrays
    if (validData.contactEmail && typeof validData.contactEmail !== 'string') {
      delete validData.contactEmail;
    }
    if (validData.contactPhone && typeof validData.contactPhone !== 'string') {
      delete validData.contactPhone;
    }

    if (validData.collectionSettings) {
      validData.collectionSettings = {
        ...DEFAULTS.collectionSettings,
        ...validData.collectionSettings,
      };
      if (validData.collectionSettings.saleTabText && !validData.collectionSettings.customTabTitles?.sale) {
        validData.collectionSettings.customTabTitles = {
          ...(validData.collectionSettings.customTabTitles || {}),
          sale: validData.collectionSettings.saleTabText
        };
      }
    }
    return validData;
  } catch {
    return null;
  }
};

/**
 * Persist valid settings object to localStorage
 */
export const saveSettingsToCache = (state) => {
  try {
    const validData = {};
    for (const key in state) {
      if (key !== '_loaded' && typeof state[key] !== 'function') {
        validData[key] = state[key];
      }
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(validData));
  } catch (e) {
    console.error('Failed to cache site settings in localStorage:', e);
  }
};

/**
 * Remove settings cache from localStorage
 */
export const clearSettingsCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {}
};
