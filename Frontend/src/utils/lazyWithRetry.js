import React, { lazy } from 'react';

/**
 * Enhanced lazy loading wrapper that automatically catches stale chunk errors,
 * undefined exports, or network deployment mismatches, and recovers cleanly.
 */
export function lazyWithRetry(componentImport) {
  return lazy(async () => {
    const pageHasBeenReloadedKey = 'chunk_reload_retry_' + window.location.pathname;
    const pageHasBeenReloaded = sessionStorage.getItem(pageHasBeenReloadedKey);

    try {
      const component = await componentImport();
      if (!component || (!component.default && typeof component !== 'function')) {
        throw new Error('Component import returned undefined or invalid default export');
      }
      sessionStorage.removeItem(pageHasBeenReloadedKey);
      return component;
    } catch (error) {
      console.warn('Dynamic import failed, attempting page reload for updated assets:', error);
      if (!pageHasBeenReloaded) {
        sessionStorage.setItem(pageHasBeenReloadedKey, 'true');
        window.location.reload();
        return new Promise(() => {}); // keep pending while window reloads
      }
      console.error('Lazy component failed after reload:', error);
      return { default: () => React.createElement('div', { className: 'p-4 text-center text-sm text-gray-400' }, 'Content temporarily unavailable. Please refresh.') };
    }
  });
}
