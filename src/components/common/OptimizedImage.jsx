import React, { useState, useRef, useEffect, memo } from 'react';
import { debounce } from '../../utils/performance';

const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = '', 
  fallback = '/src/assets/images/placeholder.png',
  loading = 'lazy',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      debounce(([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      }, 100),
      { threshold: 0.1, rootMargin: '50px 0px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {isInView ? (
        <>
          <img
            src={hasError ? fallback : src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={loading}
            {...props}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;