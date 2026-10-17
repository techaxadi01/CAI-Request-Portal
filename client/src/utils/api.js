const BASE_URL = '/api';

export async function requestApi(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`API Error on ${url}:`, err);
    return { success: false, message: err.message || 'Network communication error' };
  }
}

export const api = {
  // Auth
  login: (email, password) =>
    requestApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    requestApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getDemoUsers: () => requestApi('/auth/demo-users'),

  // Requests
  getRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return requestApi(`/requests${query ? `?${query}` : ''}`);
  },

  getRequestById: (id, role = '') =>
    requestApi(`/requests/${id}${role ? `?role=${role}` : ''}`),

  createRequest: (data) =>
    requestApi('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  coordinatorAction: (id, data) =>
    requestApi(`/requests/${id}/coordinator-action`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  specialistReview: (id, data) =>
    requestApi(`/requests/${id}/specialist-review`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  requesterCorrection: (id, data) =>
    requestApi(`/requests/${id}/requester-correction`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  confirmClosure: (id, data) =>
    requestApi(`/requests/${id}/confirm-closure`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  resetData: () =>
    requestApi('/requests/seed-reset', {
      method: 'POST',
    }),
};
