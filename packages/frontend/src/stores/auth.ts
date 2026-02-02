import { create } from 'zustand';
import apiClient from '../services/api';
import type { ApiResponse, UserRole } from '@bmaderp/shared';
import { API_VERSION } from '@bmaderp/shared';
import { safeGetItem, safeSetItem, safeRemoveItem, safeGetJSON } from '../utils/storage';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; role: UserRole } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const getUserFromStorage = (): { email: string; role: UserRole } | null => {
  return safeGetJSON<{ email: string; role: UserRole }>('user');
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!safeGetItem('accessToken'),
  user: getUserFromStorage(),
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post<
        ApiResponse<{ accessToken: string; user: { email: string; role: UserRole } }>
      >(`/${API_VERSION}/auth/login`, { email, password });

      if (!response.data.success || !response.data.data) {
        throw new Error('Invalid response format');
      }

      safeSetItem('accessToken', response.data.data.accessToken);
      safeSetItem('user', JSON.stringify(response.data.data.user));
      set({ isAuthenticated: true, user: response.data.data.user });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed');
    }
  },
  logout: () => {
    safeRemoveItem('accessToken');
    safeRemoveItem('user');
    set({ isAuthenticated: false, user: null });
  },
}));
