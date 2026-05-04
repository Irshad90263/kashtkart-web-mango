// Performance optimization utilities

// Debounce function for search and scroll events
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px 0px',
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Image lazy loading utility
export const lazyLoadImage = (img, src) => {
  const observer = createIntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = src;
        image.classList.remove('lazy');
        observer.unobserve(image);
      }
    });
  });

  observer.observe(img);
};

// Preload critical images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
};

// Memory cleanup utility
export const cleanup = (refs) => {
  if (Array.isArray(refs)) {
    refs.forEach(ref => {
      if (ref && ref.current) {
        ref.current = null;
      }
    });
  }
};

// Request Animation Frame throttle
export const rafThrottle = (func) => {
  let ticking = false;
  return function (...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

// Optimize video loading
export const optimizeVideo = (videoElement) => {
  if (!videoElement) return;

  videoElement.preload = 'auto';
  videoElement.muted = true;
  videoElement.playsInline = true;
};

// Batch DOM updates
export const batchDOMUpdates = (updates) => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};