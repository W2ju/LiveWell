import { Medication } from '@/types/medication';

const STORAGE_KEY = 'prescription-tracker-medications';

export const localStorageUtil = {
  // Save medications to local storage
  save: (medications: Medication[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Load medications from local storage
  load: (): Medication[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  },

  // Clear all data
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};
