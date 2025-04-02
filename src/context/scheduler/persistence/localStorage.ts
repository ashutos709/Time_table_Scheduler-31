
/**
 * Local storage utility functions
 */

export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return null;
  }
};
