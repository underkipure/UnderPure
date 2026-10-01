import { API_BASE_URL, getHeaders, handleResponse, buildQueryString } from './client';

export const fetchOrders = async (token, params = {}) => {
  const queryString = buildQueryString(params);
  const res = await fetch(`${API_BASE_URL}/orders${queryString}`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const acceptOrder = async (token, id) => {
  const res = await fetch(`${API_BASE_URL}/orders/${id}/accept`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

export const cancelOrder = async (token, id) => {
  const res = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

export const syncPostExOrders = async (token) => {
  const res = await fetch(`${API_BASE_URL}/orders/sync-postex`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

export const fetchReturnRequests = async (token, params = {}) => {
  const queryString = buildQueryString(params);
  const res = await fetch(`${API_BASE_URL}/returns${queryString}`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const updateReturnStatus = async (token, id, status) => {
  const res = await fetch(`${API_BASE_URL}/returns/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
};
