// Custom hook for managing localStorage operations
// Provides type-safe localStorage access with automatic JSON serialization

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue];
}

export function useLocalStorageWithEvent<T>(
  key: string,
  defaultValue: T,
  eventName?: string
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useLocalStorage(key, defaultValue);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}" on storage change:`, error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    if (eventName) {
      window.addEventListener(eventName, handleStorageChange);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (eventName) {
        window.removeEventListener(eventName, handleStorageChange);
      }
    };
  }, [key, eventName]);

  const setValueWithEvent = (newValue: T | ((prev: T) => T)) => {
    setStoredValue(newValue);
    if (eventName) {
      window.dispatchEvent(new CustomEvent(eventName));
    }
  };

  return [storedValue, setValueWithEvent];
}