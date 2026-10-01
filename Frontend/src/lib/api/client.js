import { getApiBaseUrl } from '../productUtils';

export const API_BASE_URL = getApiBaseUrl();

export const getUrl = (path) => `${getApiBaseUrl()}${path}`;

export const getHeaders = (token, isFormData = false) => {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';
  return headers;
};

export const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP Error ${res.status}`);
  }
  return res.json();
};

export const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  return query.toString() ? `?${query.toString()}` : '';
};
