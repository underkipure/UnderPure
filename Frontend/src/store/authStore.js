import { create } from 'zustand';
import { getApiBaseUrl } from '../lib/productUtils';

const API_BASE_URL = getApiBaseUrl();

// ─── Token helpers ────────────────────────────────────────
const getStoredToken = () => localStorage.getItem('auth_token');
const getStoredUser  = () => {
  try {
    const u = localStorage.getItem('auth_user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  isAuthenticated: !!getStoredToken(),
  token: getStoredToken(),
  user: getStoredUser(),
  loading: false,
  error: null,

  // ── Actions ───────────────────────────────────────────────

  /** Login with email + password */
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user',  JSON.stringify(data.user));
      set({ isAuthenticated: true, token: data.token, user: data.user, loading: false });
      get().fetchAddresses();
      return data;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  /** Register new account */
  register: async (name, email, password, dob = null) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, dob }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Registration failed');

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user',  JSON.stringify(data.user));
      set({ isAuthenticated: true, token: data.token, user: data.user, loading: false });
      get().fetchAddresses();
      return data;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  /** Google OAuth login */
  googleLogin: async (credential) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Google login failed');

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user',  JSON.stringify(data.user));
      set({ isAuthenticated: true, token: data.token, user: data.user, loading: false });
      get().fetchAddresses();
      return data;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  /** Fetch user addresses and attach to user state */
  fetchAddresses: async () => {
    const token = get().token;
    if (!token) return [];
    try {
      const res = await fetch(`${API_BASE_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const addrs = await res.json();
        if (Array.isArray(addrs)) {
          const currentUser = get().user || {};
          const updatedUser = {
            ...currentUser,
            addresses: addrs,
            defaultAddress: addrs.find(a => a.is_default) || addrs[0] || null
          };
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
          set({ user: updatedUser });
          return addrs;
        }
      }
    } catch {}
    return [];
  },

  /** Refresh user profile from server */
  fetchMe: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // Token expired or invalid – log out silently
        get().logout();
        return;
      }
      const data = await res.json();
      const user = data.user;
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user });
      get().fetchAddresses();
    } catch {
      // Network error – keep existing state
    }
  },

  /** Logout */
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ isAuthenticated: false, token: null, user: null });
  },

  /** Logout from all devices */
  logoutAll: async () => {
    const token = get().token;
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout-all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error('Failed to revoke sessions on all devices:', err);
      }
    }
    get().logout();
  },

  /** Update Profile */
  updateProfile: async (profileData) => {
    const token = get().token;
    if (!token) throw new Error('Not authenticated');
    
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      set({ user: data.user, loading: false });
      return data;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  /** Update Password */
  updatePassword: async (currentPassword, newPassword) => {
    const token = get().token;
    if (!token) throw new Error('Not authenticated');

    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/auth/password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      
      set({ loading: false });
      return data;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  /** Forgot Password (Send OTP) */
  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      
      set({ loading: false });
      return data;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  /** Verify OTP and Login */
  verifyOtpAndLogin: async (email, otp) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to verify OTP');

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user',  JSON.stringify(data.user));
      set({ isAuthenticated: true, token: data.token, user: data.user, loading: false });
      return data;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  /** Clear any auth error */
  clearError: () => set({ error: null }),
}));
