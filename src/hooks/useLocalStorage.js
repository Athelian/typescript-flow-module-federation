// @flow
import { useState, useCallback } from 'react';
import logger from 'utils/logger';

// base on https://usehooks.com/useLocalStorage/
export default function useLocalStorage(key: string, initialValue: mixed) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: mixed) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        logger.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
