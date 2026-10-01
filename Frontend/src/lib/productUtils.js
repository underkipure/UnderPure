export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, origin } = window.location;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${origin}/backend`;
    }
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend';
};

export const fixImageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  url = url.trim();
  if (url.includes('\\')) {
    url = url.replace(/\\/g, '/');
  }

  // Strip any accidental [object Object] in Cloudinary transforms
  if (url.includes('[object') || url.includes('%20Object') || url.includes('%5Bobject')) {
    url = url.replace(/\/upload\/[^/]*(?:\[object|%20Object|%5Bobject)[^/]*\//gi, '/upload/');
  }

  if (url.startsWith('uploads/')) {
    return `${getApiBaseUrl()}/${url}`;
  }
  if (url.startsWith('/uploads/')) {
    return `${getApiBaseUrl()}${url}`;
  }

  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return url.replace(/^http:\/\/localhost:\d+\//, `${window.location.protocol}//${hostname}/`)
                .replace(/^http:\/\/127\.0\.0\.1:\d+\//, `${window.location.protocol}//${hostname}/`)
                .replace(/^http:\/\/localhost\//, `${window.location.protocol}//${hostname}/`)
                .replace(/^http:\/\/127\.0\.0\.1\//, `${window.location.protocol}//${hostname}/`);
    }
  }
  return url;
};

export const isSizeDisabled = (variants, color, size) => {
  const variant = variants?.find(v => v.color === color && v.size === size);
  return variant ? variant.stock === 0 : true;
};

/**
 * Optimizes image delivery with zero resolution degradation.
 * Uses Cloudinary dynamic DPR matching (dpr_auto) and format negotiation (f_auto).
 */
export const optimizeImage = (url, customWidth, quality = 'best') => {
  if (!url || typeof url !== 'string') return url;
  url = fixImageUrl(url);
  if (!url.includes('cloudinary.com')) return url;
  
  if (url.includes('[object') || url.includes('%20Object') || url.includes('%5Bobject')) {
    url = url.replace(/\/upload\/[^/]*(?:\[object|%20Object|%5Bobject)[^/]*\//gi, '/upload/');
  }

  let width = null;
  let height = null;
  let q = quality;

  if (typeof customWidth === 'object' && customWidth !== null) {
    const rawW = customWidth.width ?? customWidth.w;
    const rawH = customWidth.height ?? customWidth.h;
    if (rawW !== undefined && rawW !== null && !isNaN(Number(rawW))) {
      width = Number(rawW);
    }
    if (rawH !== undefined && rawH !== null && !isNaN(Number(rawH))) {
      height = Number(rawH);
    }
    if (customWidth.quality) q = customWidth.quality;
  } else if (typeof customWidth === 'number' && !isNaN(customWidth)) {
    width = customWidth;
  } else if (typeof customWidth === 'string' && !isNaN(Number(customWidth)) && customWidth.trim() !== '') {
    width = Number(customWidth);
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const targetWidth = (width && width > 0) ? Math.round(width) : (isMobile ? 1000 : 1800);
  const qStr = q === 'eco' ? 'q_auto:eco' : q === 'good' ? 'q_auto:good' : 'q_auto:best';
  
  // High-fidelity transform: f_auto (lossless WebP/AVIF where supported), dpr_auto (Retina clarity), c_limit (prevent pixel stretching)
  let transform = `f_auto,${qStr},dpr_auto,w_${targetWidth}`;
  if (height && !isNaN(Number(height)) && Number(height) > 0) {
    transform += `,h_${Math.round(Number(height))}`;
  }
  transform += ',c_limit';
  
  // If already has transformation, replace it cleanly
  if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto') || url.includes('/upload/w_')) {
    return url.replace(/\/upload\/[^/]+\//, `/upload/${transform}/`);
  }
  
  return url.replace('/upload/', `/upload/${transform}/`);
};

export const getOptimizedImageUrl = (url, customWidth, quality) => optimizeImage(url, customWidth, quality);

/**
 * Generate responsive srcSet for crystal clear display on any screen resolution
 */
export const generateSrcSet = (url, widths = [600, 900, 1200, 1800]) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return '';
  return widths.map(w => `${optimizeImage(url, w)} ${w}w`).join(', ');
};
