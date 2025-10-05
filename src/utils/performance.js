import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react'

// Memoization utilities
export const useMemoizedCallback = (callback, deps) => {
  return useCallback(callback, deps)
}

export const useMemoizedValue = (value, deps) => {
  return useMemo(() => value, deps)
}

// Debounce hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttle hook
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now())

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = Date.now()
    }
  }, [callback, delay])
}

// Image optimization utilities
export const optimizeImageUrl = (url, width, height, quality = 80) => {
  if (!url) return url
  
  // Add query parameters for image optimization
  const params = new URLSearchParams({
    w: width.toString(),
    h: height.toString(),
    q: quality.toString(),
    f: 'auto', // Auto format
  })
  
  return `${url}?${params.toString()}`
}

// Lazy loading hook
export const useLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

// Performance monitoring
export const performanceMonitor = {
  start: (label) => {
    if (__DEV__) {
      console.time(label)
    }
  },
  
  end: (label) => {
    if (__DEV__) {
      console.timeEnd(label)
    }
  },
  
  measure: async (label, fn) => {
    if (__DEV__) {
      const start = performance.now()
      const result = await fn()
      const end = performance.now()
      console.log(`${label} took ${end - start} milliseconds`)
      return result
    }
    return fn()
  }
}

// Memory optimization utilities
export const memoryOptimization = {
  // Clear large objects from memory
  clearLargeObjects: (objects) => {
    objects.forEach(obj => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          delete obj[key]
        })
      }
    })
  },
  
  // Deep clone with memory optimization
  deepClone: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => memoryOptimization.deepClone(item))
    if (typeof obj === 'object') {
      const clonedObj = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = memoryOptimization.deepClone(obj[key])
        }
      }
      return clonedObj
    }
  }
}

// Bundle size optimization
export const bundleOptimization = {
  // Dynamic imports for code splitting
  loadComponent: (importFn) => {
    return React.lazy(importFn)
  },
  
  // Preload components
  preloadComponent: (importFn) => {
    importFn()
  }
}

export default {
  useMemoizedCallback,
  useMemoizedValue,
  useDebounce,
  useThrottle,
  optimizeImageUrl,
  useLazyLoading,
  performanceMonitor,
  memoryOptimization,
  bundleOptimization,
}
