/**
 * Xử lý Data Storage để gom cụm các thao tác LocalStorage.
 * Hạn chế lỗi out of quota hoặc JSON.parse error, lỗi SSR.
 */

export const storageService = {
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : defaultValue;
    } catch (error) {
      console.warn(`[StorageService] Error getting item ${key}:`, error);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`[StorageService] Error setting item ${key}:`, error);
      return false;
    }
  },

  getJSON: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`[StorageService] Error parsing item ${key}:`, error);
      return defaultValue;
    }
  },

  setJSON: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[StorageService] Error stringifying/setting item ${key}:`, error);
      return false;
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[StorageService] Error removing item ${key}:`, error);
      return false;
    }
  }
};
