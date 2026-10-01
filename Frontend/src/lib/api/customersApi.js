import { API_BASE_URL, getHeaders, handleResponse, buildQueryString } from './client';

export const fetchCustomers = async (token, params = {}) => {
  const queryString = buildQueryString(params);
  const res = await fetch(`${API_BASE_URL}/admin/customers${queryString}`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const promoteToVip = async (token, id) => {
  const res = await fetch(`${API_BASE_URL}/admin/customers/promote`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ user_id: id }),
  });
  return handleResponse(res);
};

export const updateCustomerVip = async (token, id, data) => {
  const res = await fetch(`${API_BASE_URL}/admin/customers/update-vip`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ user_id: id, ...data }),
  });
  return handleResponse(res);
};
