import { useAuth } from '../state/AuthContext.jsx';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export function useApi() {
  const { token } = useAuth();
  return {
    signup: (body) => request('/auth/signup', { method: 'POST', body }),
    login: (body) => request('/auth/login', { method: 'POST', body }),

    getMyEvents: () => request('/events', { token }),
    createEvent: (body) => request('/events', { method: 'POST', body, token }),
    updateEvent: (id, body) => request(`/events/${id}`, { method: 'PUT', body, token }),
    deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE', token }),

    getSwappableSlots: () => request('/swappable-slots', { token }),
    createSwapRequest: (body) => request('/swap-request', { method: 'POST', body, token }),
    getSwapRequests: () => request('/swap-requests', { token }),
    respondSwap: (id, accept) => request(`/swap-response/${id}`, { method: 'POST', body: { accept }, token }),
  };
}
