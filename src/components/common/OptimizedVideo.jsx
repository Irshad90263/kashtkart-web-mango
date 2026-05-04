import React, { useState, useRef, useEffect, memo } from 'react';
import { debounce, optimizeVideo } from '../../utils/performance';

const OptimizedVideo = memo(({ 
  src, 
  className = '', 
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  poster,
  onLoad,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      debounce(([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      }, 150),
      { threshold: 0.2, rootMargin: '100px 0px' }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && videoRef.current) {
      optimizeVideo(videoRef.current);
    }
  }, [isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={videoRef} className={`relative overflow-hidden ${className}`}>
      {isInView && !hasError ? (
        <>
          <video
            src={src}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            muted={muted}
            loop={loop}
            playsInline
            controls={controls}
            autoPlay={autoPlay && isLoaded}
            poster={poster}
            onLoadedData={handleLoad}
            onError={handleError}
            preload="metadata"
            loading="lazy"
            {...props}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
      ) : hasError ? (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">Video unavailable</span>
        </div>
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      )}
    </div>
  );
});

OptimizedVideo.displayName = 'OptimizedVideo';

export default OptimizedVideo;