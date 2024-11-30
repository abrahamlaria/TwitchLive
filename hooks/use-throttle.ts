'use client';

import { useCallback, useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRun = useRef<number>(0);
  const timeout = useRef<NodeJS.Timeout>();

  return useCallback((...args) => {
    const now = Date.now();

    if (lastRun.current && now - lastRun.current <= delay) {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(() => {
        lastRun.current = now;
        callback(...args);
      }, delay);

      return;
    }

    lastRun.current = now;
    callback(...args);
  }, [callback, delay]);
}