import axios from 'axios';
import { auth } from '../lib/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// ─── AUTH INTERCEPTOR ─────────────────────────────────────────────────────────
// Always uses Firebase's current token (auto-refreshed when expired).
// This is the fix for the "No token" / 401 errors after 1 hour.
api.interceptors.request.use(async (cfg) => {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    const token = await firebaseUser.getIdToken(); // silently refreshes if expired
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      // Token was rejected — clear cache
      localStorage.removeItem('cavsulit_token');
      localStorage.removeItem('cavsulit_user');
    }
    return Promise.reject(err);
  }
);

export default api;
