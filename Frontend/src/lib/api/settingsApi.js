import { API_BASE_URL, getHeaders, handleResponse, buildQueryString } from './client';

export const fetchAdminStats = async (token) => {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const fetchAnalytics = async (token) => {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const fetchHomepageContent = async (token) => {
  const res = await fetch(`${API_BASE_URL}/settings/homepage`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const updateHomepageContent = async (token, data) => {
  const res = await fetch(`${API_BASE_URL}/settings/homepage`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const fetchSupportPages = async (token) => {
  const res = await fetch(`${API_BASE_URL}/settings/support-pages`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const fetchSettings = async (token) => {
  const res = await fetch(`${API_BASE_URL}/settings`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const updateSettings = async (token, data) => {
  const res = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const fetchSurveys = async (token, params = {}) => {
  const queryString = buildQueryString(params);
  const res = await fetch(`${API_BASE_URL}/admin/surveys${queryString}`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const submitSurvey = async (data) => {
  const res = await fetch(`${API_BASE_URL}/survey`, {
    method: 'POST',
    headers: getHeaders(null),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};
