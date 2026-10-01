import DOMPurify from 'dompurify';

/**
 * Sanitize untrusted HTML to prevent XSS attacks while allowing rich text formatting.
 *
 * @param {string|null|undefined} dirty Untrusted HTML markup
 * @returns {string} Clean, safe HTML string
 */
export const sanitizeHtml = (dirty) => {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel']
  });
};

export default sanitizeHtml;
