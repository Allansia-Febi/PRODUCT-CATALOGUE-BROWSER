import { useState, useEffect } from 'react';

/**
 * Reusable useDebounce custom hook
 * Delays updating the debounced value until after delay ms have passed without new changes.
 * 
 * @param {*} value The value to debounce
 * @param {number} delay Delay in milliseconds (default 400ms)
 * @returns {*} The debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
