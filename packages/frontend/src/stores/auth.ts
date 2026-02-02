import { create } from 'zustand';
import apiClient from '../services/api';
import type { ApiResponse } from '@bmaderp/shared';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const getUserFromStorage = (): { email: string; role: string } | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user from storage:', error);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: getUserFromStorage(),
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post<
        ApiResponse<{ accessToken: string; user: { email: string; role: string } }>
      >('/v1/auth/login', { email, password });

      if (!response.data.success || !response.data.data) {
        throw new Error('Invalid response format');
      }

      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      set({ isAuthenticated: true, user: response.data.data.user });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed');
    }
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null });
  },
}));
