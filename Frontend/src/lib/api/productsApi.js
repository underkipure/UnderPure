import { API_BASE_URL, getHeaders, handleResponse, buildQueryString } from './client';

// High-performance in-memory client cache with Stale-While-Revalidate
const clientCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds fresh TTL
const STALE_TTL_MS = 5 * 60 * 1000; // 5 minutes max stale lifetime

export const invalidateProductsClientCache = () => {
  clientCache.clear();
};

export const fetchProducts = async (token = null, params = {}) => {
  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}/products${queryString}`;

  // Only cache unauthenticated storefront public requests
  const isPublic = !token;
  const cacheKey = isPublic ? `products_${queryString}` : null;

  if (cacheKey && clientCache.has(cacheKey)) {
    const entry = clientCache.get(cacheKey);
    const now = Date.now();
    const age = now - entry.timestamp;

    // If completely fresh (under 60s), return immediately (0ms latency, zero spinner)
    if (age < CACHE_TTL_MS) {
      return entry.data;
    }

    // If stale but within 5 mins, return stale immediately & revalidate in background
    if (age < STALE_TTL_MS) {
      fetch(url, { headers: getHeaders(null) })
        .then(handleResponse)
        .then((freshData) => {
          if (freshData) {
            clientCache.set(cacheKey, { data: freshData, timestamp: Date.now() });
          }
        })
        .catch(() => {});
      return entry.data;
    }
  }

  const res = await fetch(url, { headers: getHeaders(token) });
  const data = await handleResponse(res);

  if (cacheKey && data) {
    clientCache.set(cacheKey, { data, timestamp: Date.now() });
  }

  return data;
};

export const fetchProduct = async (idOrSlug) => {
  const cacheKey = idOrSlug ? `product_${idOrSlug}` : null;

  if (cacheKey && clientCache.has(cacheKey)) {
    const entry = clientCache.get(cacheKey);
    const now = Date.now();
    const age = now - entry.timestamp;

    if (age < CACHE_TTL_MS) {
      return entry.data;
    }

    if (age < STALE_TTL_MS) {
      fetch(`${API_BASE_URL}/products/${idOrSlug}`)
        .then(handleResponse)
        .then((freshData) => {
          if (freshData) {
            clientCache.set(cacheKey, { data: freshData, timestamp: Date.now() });
          }
        })
        .catch(() => {});
      return entry.data;
    }
  }

  const res = await fetch(`${API_BASE_URL}/products/${idOrSlug}`);
  const data = await handleResponse(res);

  if (cacheKey && data) {
    clientCache.set(cacheKey, { data, timestamp: Date.now() });
  }

  return data;
};

export const createProduct = async (token, productData) => {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });
  const data = await handleResponse(res);
  invalidateProductsClientCache();
  return data;
};

export const updateProduct = async (token, id, productData) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });
  const data = await handleResponse(res);
  invalidateProductsClientCache();
  return data;
};

export const deleteProduct = async (token, id) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  const data = await handleResponse(res);
  invalidateProductsClientCache();
  return data;
};

export const fetchInventory = async (token) => {
  const res = await fetch(`${API_BASE_URL}/inventory`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const updateInventoryStock = async (token, productId, color, size, newStock) => {
  const res = await fetch(`${API_BASE_URL}/inventory/${productId}/stock`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify({ color, size, stock: newStock }),
  });
  const data = await handleResponse(res);
  invalidateProductsClientCache();
  return data;
};

export const fetchSizeClasses = async (token) => {
  const res = await fetch(`${API_BASE_URL}/size-classes`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const createSizeClass = async (token, data) => {
  const res = await fetch(`${API_BASE_URL}/size-classes`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateSizeClass = async (token, id, data) => {
  const res = await fetch(`${API_BASE_URL}/size-classes/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteSizeClass = async (token, id) => {
  const res = await fetch(`${API_BASE_URL}/size-classes/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};
