import axios from 'axios';
import axiosRetry from 'axios-retry';
import type { ApiResponse } from '@bmaderp/shared';
import { TIMEOUTS, SYNC_CONFIG, API_VERSION } from '@bmaderp/shared';
import { safeGetItem, safeRemoveItem } from '../utils/storage';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: TIMEOUTS.API_REQUEST,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = safeGetItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface ApiError extends Error {
  code?: string;
  statusCode?: number;
  retryable?: boolean;
}

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse;
    if (!data.success && data.error) {
      const error = new Error(data.error.message) as ApiError;
      error.code = data.error.code;
      error.statusCode = data.error.statusCode;
      error.retryable = data.error.retryable;
      throw error;
    }
    return response;
  },
  (error) => {
    const errorData = error.response?.data as ApiResponse;
    if (errorData?.error) {
      const apiError = new Error(errorData.error.message) as ApiError;
      apiError.code = errorData.error.code;
      apiError.statusCode = errorData.error.statusCode;
      apiError.retryable = errorData.error.retryable;
      return Promise.reject(apiError);
    }
    if (error.response?.status === 401) {
      safeRemoveItem('accessToken');
      safeRemoveItem('user');
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
  const response = await apiClient.get<ApiResponse>(`/${API_VERSION}/health`);
  return response.data;
};

export default apiClient;
