import { API_BASE_URL, getHeaders, handleResponse, buildQueryString } from './client';

export const fetchProductReviews = async (productId) => {
  const res = await fetch(`${API_BASE_URL}/reviews/${productId}`);
  return handleResponse(res);
};

export const submitProductReview = async (token, reviewData) => {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(reviewData),
  });
  return handleResponse(res);
};

export const voteReview = async (reviewId, type) => {
  const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type })
  });
  return handleResponse(res);
};

export const fetchAdminReviews = async (token, params = {}) => {
  const queryString = buildQueryString(params);
  const res = await fetch(`${API_BASE_URL}/admin/reviews${queryString}`, { headers: getHeaders(token) });
  return handleResponse(res);
};

export const toggleReviewStatus = async (token, id) => {
  const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}/toggle`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};

export const deleteAdminReview = async (token, id) => {
  const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse(res);
};
