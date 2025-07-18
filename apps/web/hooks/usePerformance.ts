import React, { useCallback } from 'react';

// Debounce hook to prevent rapid re-renders
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [debounceTimer, setDebounceTimer] = React.useState<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        callback(...args);
      }, delay);

      setDebounceTimer(timer);
    },
    [callback, delay, debounceTimer]
  ) as T;

  return debouncedCallback;
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderCount = React.useRef(0);
  const lastRenderTime = React.useRef(Date.now());

  React.useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    if (renderCount.current > 10 && timeSinceLastRender < 100) {
      console.warn(`Performance warning: ${componentName} is re-rendering rapidly`, {
        renderCount: renderCount.current,
        timeSinceLastRender,
      });
    }
    
    lastRenderTime.current = now;
  });

  return renderCount.current;
}

// Safe event handler wrapper
export function useSafeCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[] = []
): T {
  return useCallback(
    (...args: Parameters<T>) => {
      try {
        return callback(...args);
      } catch (error) {
        console.error('Safe callback error:', error);
        // Don't throw, just log
      }
    },
    dependencies
  ) as T;
}
