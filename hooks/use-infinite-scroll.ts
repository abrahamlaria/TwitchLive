'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useThrottle } from './use-throttle';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  throttleMs?: number;
  disabled?: boolean;
}

export function useInfiniteScroll(
  onIntersect: () => Promise<void>,
  options: UseInfiniteScrollOptions = {}
): React.RefObject<HTMLDivElement> {
  const {
    threshold = 0.5,
    rootMargin = '100px',
    throttleMs = 2000,
    disabled = false,
  } = options;

  const targetRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const handleIntersect = useCallback(async () => {
    if (loadingRef.current || disabled) return;
    
    loadingRef.current = true;
    try {
      await onIntersect();
    } finally {
      loadingRef.current = false;
    }
  }, [onIntersect, disabled]);

  const throttledIntersect = useThrottle(handleIntersect, throttleMs);

  useEffect(() => {
    if (disabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          throttledIntersect();
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
      observer.disconnect();
    };
  }, [throttledIntersect, rootMargin, threshold, disabled]);

  return targetRef;
}