import { API_BASE_URL, getHeaders, handleResponse } from './client';

let categoriesCache = null;
let categoriesCacheTime = 0;
let inFlightCategories = null;
const CAT_TTL = 60000; // 60 seconds TTL for storefront navigation

export const clearCategoriesCache = () => {
  categoriesCache = null;
  categoriesCacheTime = 0;
};

export const fetchCategories = async (token, options = {}) => {
  // Use in-memory cache for public storefront requests if still fresh
  if (!token && !options.force && categoriesCache && Date.now() - categoriesCacheTime < CAT_TTL) {
    return categoriesCache;
  }

  // Deduplicate concurrent requests
  if (!token && inFlightCategories) {
    return inFlightCategories;
  }

  const fetchPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, { headers: getHeaders(token) });
      const data = await handleResponse(res);
      if (!token && Array.isArray(data)) {
        categoriesCache = data;
        categoriesCacheTime = Date.now();
      }
      return data;
    } finally {
      if (!token) inFlightCategories = null;
    }
  })();

  if (!token) {
    inFlightCategories = fetchPromise;
  }

  return fetchPromise;
};

export const createCategory = async (token, data) => {
  clearCategoriesCache();
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateCategory = async (token, id, data) => {
  clearCategoriesCache();
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteCategory = async (token, id) => {
  clearCategoriesCache();
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};
