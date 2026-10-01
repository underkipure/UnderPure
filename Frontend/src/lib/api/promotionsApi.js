import { API_BASE_URL, getHeaders, handleResponse } from './client';

export const fetchPromotions = async (token) => {
  const res = await fetch(`${API_BASE_URL}/admin/promotions`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const createPromotion = async (token, data) => {
  const res = await fetch(`${API_BASE_URL}/admin/promotions`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updatePromotion = async (token, id, data) => {
  const res = await fetch(`${API_BASE_URL}/admin/promotions/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deletePromotion = async (token, id) => {
  const res = await fetch(`${API_BASE_URL}/admin/promotions/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

export const validatePromo = async (code, subtotal, cartItems) => {
  const res = await fetch(`${API_BASE_URL}/checkout/validate-promo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, subtotal, cart_items: cartItems })
  });
  return handleResponse(res);
};

export const fetchBadges = async (token) => {
  const res = await fetch(`${API_BASE_URL}/badges`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const createBadge = async (token, data) => {
  const res = await fetch(`${API_BASE_URL}/admin/badges`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateBadge = async (token, id, data) => {
  const res = await fetch(`${API_BASE_URL}/admin/badges/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteBadge = async (token, id) => {
  const res = await fetch(`${API_BASE_URL}/admin/badges/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};
