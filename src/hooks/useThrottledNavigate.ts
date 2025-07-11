import { useNavigate } from 'react-router-dom';
import { useCallback, useRef } from 'react';

interface NavigateOptions {
  replace?: boolean;
  state?: any;
}

export const useThrottledNavigate = (delay: number = 500) => {
  const navigate = useNavigate();
  const lastNavigationTime = useRef<number>(0);
  const pendingNavigation = useRef<NodeJS.Timeout | null>(null);

  const throttledNavigate = useCallback((to: string, options?: NavigateOptions) => {
    const now = Date.now();
    const timeSinceLastNavigation = now - lastNavigationTime.current;

    // Clear any pending navigation
    if (pendingNavigation.current) {
      clearTimeout(pendingNavigation.current);
      pendingNavigation.current = null;
    }

    if (timeSinceLastNavigation >= delay) {
      // Execute immediately if enough time has passed
      lastNavigationTime.current = now;
      navigate(to, options);
    } else {
      // Schedule for later if too soon
      const timeToWait = delay - timeSinceLastNavigation;
      pendingNavigation.current = setTimeout(() => {
        lastNavigationTime.current = Date.now();
        navigate(to, options);
        pendingNavigation.current = null;
      }, timeToWait);
    }
  }, [navigate, delay]);

  return throttledNavigate;
};