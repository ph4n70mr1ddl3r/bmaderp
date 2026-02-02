import axios from 'axios';
import axiosRetry from 'axios-retry';
import type { ApiResponse } from '@bmaderp/shared';
import { TIMEOUTS, SYNC_CONFIG } from '@bmaderp/shared';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: TIMEOUTS.API_REQUEST,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse;
    if (!data.success && data.error) {
      throw new Error(data.error.message);
    }
    return response;
  },
  (error) => {
    const errorData = error.response?.data as ApiResponse;
    if (errorData?.error) {
      throw new Error(errorData.error.message);
    }
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

axiosRetry(apiClient, {
  retries: SYNC_CONFIG.RETRY_MAX_ATTEMPTS,
  retryDelay: (retryCount) => {
    return Math.pow(2, retryCount) * SYNC_CONFIG.RETRY_BASE_DELAY_MS;
  },
  retryCondition: (error) => {
    if (axiosRetry.isNetworkOrIdempotentRequestError(error)) {
      return true;
    }
    if (error.response) {
      return error.response.status === 429 || error.response.status >= 500;
    }
    return false;
  },
});

export const healthCheck = async (): Promise<ApiResponse> => {
  const response = await apiClient.get<ApiResponse>('/v1/health');
  return response.data;
};

export default apiClient;
