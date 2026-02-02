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
