/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

function useFetch<TData>(url: string) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  // simple caching
  const storedUrl = useRef<string>(url);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetch(url);
      if (result) {
        const parsed = await result.json();
        setData(parsed);
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (url && storedUrl.current !== url) {
      storedUrl.current = url;
      loadData();
    }
  }, [url]);

  return { data, loading, error, refetch: loadData };
}

function useDebounce<TValue>(value: TValue, delay: number) {
  // value and delay in ms (1000ms = 1s)
  const [debouncedValue, setDebouncedValue] = useState<TValue | null>(value);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // clean up the timeout after value changes
    return () => {
      clearTimeout(t);
    };
  }, [value, delay]);
  return debouncedValue;
}

const useOutsideClick = (
  ref: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  func: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (Array.isArray(ref)) {
        const isContained = ref.find(
          innerRef => innerRef?.current && innerRef.current.contains(event.target)
        );

        return isContained ? null : func();
      }

      if (ref.current && !ref.current.contains(event.target)) {
        func();
      }

      return false;
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, func]);
};

export default useOutsideClick;

export { useDebounce, useFetch, useOutsideClick };
