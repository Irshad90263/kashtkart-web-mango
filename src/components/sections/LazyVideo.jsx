import React, { useState, useRef, useEffect, memo } from 'react';
import { Play } from 'lucide-react';

const LazyVideo = memo(({ video, onClick, isHomePage = false }) => {
    const [isInView, setIsInView] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.1, rootMargin: '100px 0px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isHomePage) return;

        // Auto-play video on home page when in view
        if (isInView && isLoaded && videoRef.current) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Autoplay prevented
                });
            }
        }
    }, [isInView, isLoaded, isHomePage]);

    const handleVideoLoad = () => {
        setIsLoaded(true);
        if (videoRef.current && isHomePage) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current && isLoaded && !isHomePage) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current && !isHomePage) {
            videoRef.current.pause();
        }
    };

    return (
        <div
            ref={containerRef}
            className="flex-shrink-0 w-56 md:w-80 h-80 md:h-96 bg-[var(--color-muted)] rounded-[30px] shadow-2xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-all duration-500 border border-[var(--color-secondary)]/10 group relative"
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isInView ? (
                <>
                    <video
                        ref={videoRef}
                        src={video.url?.replace('http://', 'https://')}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-90 group-hover:opacity-100' : 'opacity-0'}`}
                        muted
                        loop
                        playsInline
                        onLoadedData={handleVideoLoad}
                        onLoadedMetadata={handleVideoLoad}
                        onCanPlay={() => setIsLoaded(true)}
                        preload="auto"
                    />
                    {!isLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
                            <div className="w-10 h-10 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Thumbnail Play button overlay */}
                    {!isHomePage && (
                        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                <Play className="w-8 h-8 text-[var(--color-secondary)] ml-1" />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
        </div>
    );
});

LazyVideo.displayName = 'LazyVideo';

export default LazyVideo;