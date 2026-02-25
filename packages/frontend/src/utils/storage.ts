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
  const { expires, secure = !import.meta.env.PROD, sameSite = 'strict' } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  cookieString += `; path=/; secure; samesite=${sameSite}`;

  // Add httponly flag for sensitive tokens
  if (name === 'accessToken' || name === 'refreshToken') {
    cookieString += '; httponly';
  }

  document.cookie = cookieString;
};

const removeCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict`;
};

// Token storage with secure fallback to localStorage for development
export const tokenStorage = {
  // Access Token - should be stored in httpOnly cookie in production
  getAccessToken: (): string | null => {
    // Always check httpOnly cookie first (works in both dev and prod)
    const cookieToken = getCookie('accessToken');
    if (cookieToken) {
      return cookieToken;
    }

    // Fallback to localStorage only for development (when no cookies available)
    if (!import.meta.env.PROD) {
      return safeGetItem('accessToken');
    }

    return null; // No token available
  },

  setAccessToken: (token: string, rememberMe: boolean = false): void => {
    // Set httpOnly cookie first (works in both dev and prod)
    const expires = rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day default

    setCookie('accessToken', token, {
      expires,
      secure: !import.meta.env.PROD,
      sameSite: 'strict',
    });

    // Fallback to localStorage for development only
    if (!import.meta.env.PROD) {
      localStorage.setItem('accessToken', token);
    }
  },

  removeAccessToken: (): void => {
    // Clear httpOnly cookie (works in both dev and prod)
    removeCookie('accessToken');

    // Also clear localStorage for development
    if (!import.meta.env.PROD) {
      localStorage.removeItem('accessToken');
    }
  },

  // Refresh Token - should always be stored in httpOnly cookie
  getRefreshToken: (): string | null => {
    // Refresh token should only come from httpOnly cookie for security
    return getCookie('refreshToken');
  },

  setRefreshToken: (token: string): void => {
    // Set refresh token in httpOnly cookie only (never in localStorage)
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    setCookie('refreshToken', token, {
      expires,
      secure: !import.meta.env.PROD,
      sameSite: 'strict',
    });
  },

  removeRefreshToken: (): void => {
    // Clear refresh token cookie
    removeCookie('refreshToken');
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

    // Clear all other auth-related cookies
    const authCookies = ['csrfToken', 'sessionId'];
    authCookies.forEach((cookie) => removeCookie(cookie));
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
