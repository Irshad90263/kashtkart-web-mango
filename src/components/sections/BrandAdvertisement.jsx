import React, { useState, useRef, useEffect, memo } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { throttle } from '../../utils/performance';

// Import videos
import add1 from '../../assets/images/add1.mp4';
import add2 from '../../assets/images/add2.mp4';

const SingleBrandVideo = memo(({ src, title, isSectionVisible }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isSectionVisible) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isSectionVisible]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative group flex-1">
      <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group-hover:border-[var(--color-secondary)]/50 transition-all duration-500 bg-gray-900">
        <video
          ref={videoRef}
          src={src}
          className={`w-full h-full object-cover transition-opacity duration-800 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={() => setIsLoaded(true)}
          onCanPlay={() => setIsLoaded(true)}
          onCanPlayThrough={() => setIsLoaded(true)}
          onPlay={() => setIsLoaded(true)}
          onPlaying={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)} // Failsafe to show something
        />

        {/* Loading Spinner - disappears if loaded OR if the video is actually playing */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
            <div className="w-10 h-10 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Play/Pause Center Overlay (only if paused and loaded) */}
        {isLoaded && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none">
            <div className="w-16 h-16 bg-[var(--color-secondary)]/90 rounded-full flex items-center justify-center shadow-2xl">
              <Play className="w-8 h-8 text-black ml-1" />
            </div>
          </div>
        )}

        {/* Hover Controls - always visible on mobile, hover on desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-[var(--color-secondary)] rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors shadow-lg active:scale-90"
            >
              {isPlaying ?
                <Pause className="w-5 h-5 text-black shrink-0" strokeWidth={2.5} /> :
                <Play className="w-5 h-5 text-black ml-0.5 shrink-0" strokeWidth={2.5} />
              }
            </button>

            <button
              onClick={toggleMute}
              className="w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/80 transition-colors border border-white/20 active:scale-90"
            >
              {isMuted ?
                <VolumeX className="w-4 h-4 text-white shrink-0" strokeWidth={2.5} /> :
                <Volume2 className="w-4 h-4 text-white shrink-0" strokeWidth={2.5} />
              }
            </button>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-lg">{title}</h3>
      </div>
    </div>
  );
});

const BrandAdvertisement = memo(({ addToRefs }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const videos = [
    { src: add1, title: "Authentic Sandila Experience" },
    { src: add2, title: "Traditional Craftsmanship" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '100px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={(el) => {
        sectionRef.current = el;
        addToRefs(el);
      }}
      className={`scroll-section ${isVisible ? 'visible' : ''} py-16 px-4 md:px-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden`}
      id="brand-story"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent opacity-60"></div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] rounded-full text-xs font-bold uppercase tracking-[0.4em] mb-6 border border-[var(--color-secondary)]/30 backdrop-blur-sm">
            Brand Story
          </div>
          <h2 className="text-4xl md:text-7xl font-bold font-[var(--font-heading)] tracking-tighter drop-shadow-2xl mb-4">
            <span className="text-zinc-500">Experience the</span> <span className="text-zinc-200 drop-shadow-[0_0_20px_rgba(242,183,5,0.5)]">Legacy</span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Witness the journey of authentic Sandila laddus through cinematic storytelling
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {videos.map((video, index) => (
            <SingleBrandVideo
              key={index}
              src={video.src}
              title={video.title}
              isSectionVisible={isVisible}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400 text-sm md:text-base mb-6 max-w-2xl mx-auto">
            Every frame tells the story of tradition, every moment captures the essence of authentic Sandila craftsmanship
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="px-6 py-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-full text-sm font-semibold border border-[var(--color-secondary)]/30">
              🎬 Cinematic Quality
            </div>
            <div className="px-6 py-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-full text-sm font-semibold border border-[var(--color-secondary)]/30">
              🏆 Award Winning Taste
            </div>
            <div className="px-6 py-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-full text-sm font-semibold border border-[var(--color-secondary)]/30">
              🎭 Heritage Stories
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

BrandAdvertisement.displayName = 'BrandAdvertisement';

export default BrandAdvertisement;