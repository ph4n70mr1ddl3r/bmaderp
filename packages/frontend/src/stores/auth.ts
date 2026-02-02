import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  login: async (email: string, password: string) => {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Login failed');
    }
    const data = await response.json();
    if (!data.success || !data.data) {
      throw new Error('Invalid response format');
    }
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    set({ isAuthenticated: true, user: data.data.user });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null });
  },
}));
