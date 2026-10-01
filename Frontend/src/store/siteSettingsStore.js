/**
 * Proxy export for backward compatibility
 * All site settings logic and defaults are now cleanly modularized in ./site-settings/
 */
export * from './site-settings';
export { useSiteSettingsStore as default } from './site-settings';
