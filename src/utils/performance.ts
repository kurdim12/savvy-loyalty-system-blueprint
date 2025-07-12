/**
 * Performance monitoring utilities
 */

/**
 * Debounce function to limit execution frequency
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function to limit execution rate
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Performance monitor for tracking component render times
 */
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();

  static start(label: string): void {
    this.timers.set(label, performance.now());
  }

  static end(label: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`Performance timer "${label}" was not started`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.timers.delete(label);
    
    if (duration > 100) {
      console.warn(`Performance warning: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  static measure(label: string, fn: () => void): number {
    this.start(label);
    fn();
    return this.end(label);
  }
}

/**
 * Lazy loading utilities
 */
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return React.lazy(importFn);
};

/**
 * Memory optimization utilities
 */
export const cleanup = {
  intervals: [] as NodeJS.Timeout[],
  timeouts: [] as NodeJS.Timeout[],
  
  addInterval: (interval: NodeJS.Timeout) => {
    cleanup.intervals.push(interval);
  },
  
  addTimeout: (timeout: NodeJS.Timeout) => {
    cleanup.timeouts.push(timeout);
  },
  
  clearAll: () => {
    cleanup.intervals.forEach(clearInterval);
    cleanup.timeouts.forEach(clearTimeout);
    cleanup.intervals = [];
    cleanup.timeouts = [];
  }
};