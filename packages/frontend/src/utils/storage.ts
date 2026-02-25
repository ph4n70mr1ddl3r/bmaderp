// Cookie utility functions
const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      try {
        return decodeURIComponent(cookieValue);
      } catch {
        return cookieValue;
      }
    }
  }
  return null;
};

const setCookie = (
  name: string,
  value: string,
  options: { expires?: Date; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' } = {}
): void => {
  const { expires, secure = true, sameSite = 'strict' } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  cookieString += `; path=/; secure=${secure}; samesite=${sameSite}`;

  document.cookie = cookieString;
};

const removeCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict`;
};

// Token storage with fallback to localStorage for development
export const tokenStorage = {
  // Access Token - should be stored in httpOnly cookie in production
  getAccessToken: (): string | null => {
    // In production, this should come from httpOnly cookie
    if (import.meta.env.PROD) {
      // For production, tokens should be handled by httpOnly cookies
      // This would typically be handled by the backend setting cookies
      return null; // Tokens are managed by backend via cookies
    }

    // Fallback to localStorage for development
    return safeGetItem('accessToken');
  },

  setAccessToken: (token: string, rememberMe: boolean = false): void => {
    if (import.meta.env.PROD) {
      // In production, this should be handled by backend
      // The backend should set httpOnly cookies during login
      return;
    }

    // For development, use localStorage with expiration
    if (rememberMe) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 30); // 30 days for remember me
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.setItem('accessToken', token);
    }
  },

  removeAccessToken: (): void => {
    if (import.meta.env.PROD) {
      // In production, backend should clear cookies
      return;
    }
    localStorage.removeItem('accessToken');
  },

  // Refresh Token - should always be stored in httpOnly cookie
  getRefreshToken: (): string | null => {
    if (import.meta.env.PROD) {
      return null; // Handled by httpOnly cookies
    }
    return safeGetItem('refreshToken');
  },

  setRefreshToken: (token: string): void => {
    if (import.meta.env.PROD) {
      return; // Handled by backend
    }
    localStorage.setItem('refreshToken', token);
  },

  removeRefreshToken: (): void => {
    if (import.meta.env.PROD) {
      return; // Handled by backend
    }
    localStorage.removeItem('refreshToken');
  },

  // User data - can be stored in localStorage (not sensitive)
  getUser: <T = any>(): T | null => {
    return safeGetJSON('user');
  },

  setUser: <T = any>(userData: T): void => {
    safeSetItem('user', JSON.stringify(userData));
  },

  removeUser: (): void => {
    localStorage.removeItem('user');
  },

  // Complete logout
  clearAll: (): void => {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUser();
  },
};

// Legacy localStorage functions for backward compatibility
export const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
};

export const safeRemoveItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    return;
  }
};

export const safeGetJSON = <T>(key: string): T | null => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};
