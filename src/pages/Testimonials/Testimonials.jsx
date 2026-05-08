import React, { useState, useEffect, useRef, lazy, Suspense, memo, useCallback } from 'react';
import { Play, X } from 'lucide-react';
import { getAllVideosApi } from '../../api/video';
import { throttle, debounce } from '../../utils/performance';

// Lazy load components
const TestimonialCard = lazy(() => import('../../components/cards/TestimonialCard'));
const Footer = lazy(() => import('../../components/layout/Footer'));

const Testimonials = memo(() => {
    const [activeTab, setActiveTab] = useState('text');
    const sectionRefs = useRef([]);
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videosLoaded, setVideosLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            throttle((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, 100),
            { threshold: 0.1, rootMargin: '50px 0px' }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);


    useEffect(() => {
        let isMounted = true;

        const fetchVideos = async () => {
            if (!isMounted) return;
            setIsLoading(true);
            try {
                const data = await getAllVideosApi();
                if (isMounted) {
                    const videoData = data.videos || (Array.isArray(data) ? data : []);
                    setVideos(videoData.slice(0, 6));
                    setVideosLoaded(true);
                }
            } catch (error) {
                console.error("Failed to fetch videos:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (activeTab === 'video' && !videosLoaded && !isLoading) {
            fetchVideos();
        }

        return () => { isMounted = false; };
    }, [activeTab, videosLoaded]);

    const addToRefs = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

    const textReviews = [
        { quote: "Absolutely delicious! Brings back childhood memories of my visits to kaashtkart. The texture is just perfect.", name: "Anjali S.", color: 'var(--color-secondary)', initial: 'AS', location: 'Lucknow', rating: 5 },
        { quote: "The best Mango I've ever tasted. The kesar flavor is so authentic and the richness of ghee is unmatched.", name: "Rajesh K.", color: 'var(--color-maroon)', initial: 'RK', location: 'Delhi', rating: 5 },
        { quote: "Pure and authentic! You can tell it's made with real desi ghee. My parents were very impressed with the quality.", name: "Meera T.", color: 'var(--color-secondary)', initial: 'MT', location: 'Mumbai', rating: 4 },
        { quote: "Ordered these for my sister's wedding. Everyone loved them! The guest couldn't stop asking where they're from.", name: "Vikram P.", color: 'var(--color-maroon)', initial: 'VP', location: 'Bangalore', rating: 5 },
        { quote: "Quick delivery and fresh taste. High quality ingredients used for sure. Highly recommended for mango lovers.", name: "Suman L.", color: 'var(--color-secondary)', initial: 'SL', location: 'Hyderabad', rating: 5 },
        { quote: "The packaging was beautiful and protected the mango perfectly. Great attention to detail in everything.", name: "Neha G.", color: 'var(--color-maroon)', initial: 'NG', location: 'Pune', rating: 5 },
    ];



    return (
        <div className="bg-[var(--color-primary)] text-[var(--color-text)] font-[var(--font-body)] min-h-screen overflow-x-hidden">
            {/* Testimonials Hero with Bubbles */}
            <section className="py-16 md:py-20 px-8 text-center bg-[linear-gradient(0deg,rgba(255,212,0,0.1)_0%,transparent_70%)] rounded-b-[40px] md:rounded-b-[50px] shadow-2xl relative overflow-hidden">
                {/* Animated Background Bubbles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="testimonial-bubble testimonial-bubble-1"></div>
                    <div className="testimonial-bubble testimonial-bubble-2"></div>
                    <div className="testimonial-bubble testimonial-bubble-3"></div>
                    <div className="testimonial-bubble testimonial-bubble-4"></div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                        .testimonial-bubble {
                            position: absolute;
                            background: rgba(255, 212, 0, 0.1);
                            border-radius: 50%;
                            animation: float-testimonial-bubble 23s infinite ease-in-out;
                        }
                        .testimonial-bubble-1 { width: 118px; height: 118px; left: 14%; top: 24%; animation-delay: 0s; }
                        .testimonial-bubble-2 { width: 148px; height: 148px; right: 16%; top: 18%; animation-delay: 4.5s; }
                        .testimonial-bubble-3 { width: 102px; height: 102px; left: 68%; bottom: 24%; animation-delay: 2.5s; }
                        .testimonial-bubble-4 { width: 128px; height: 128px; right: 58%; bottom: 26%; animation-delay: 6.5s; }
                        @keyframes float-testimonial-bubble {
                            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
                            50% { transform: translate(32px, -42px) scale(1.1); opacity: 0.6; }
                        }
                    `
                }} />

                <h1 className="text-3xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight relative z-10 text-[var(--color-secondary)] font-[var(--font-heading)]">Voices of Joy</h1>
                <p className="text-base md:text-2xl italic opacity-90 max-w-3xl mx-auto leading-relaxed px-4 relative z-10 text-gray-300">
                    Over 10,000+ families across India trust us for their sweetest moments. Hear their stories.
                </p>
            </section>

            {/* Stats Counter Section */}
            <section ref={addToRefs} className="scroll-section flex justify-center -mt-8 md:-mt-10 mb-12 md:mb-16 relative z-10 px-6">
                <div className="bg-[var(--color-muted)] px-6 md:px-16 py-6 md:py-8 rounded-[30px] md:rounded-[35px] shadow-2xl flex flex-wrap justify-around md:justify-between gap-6 md:gap-12 border border-[var(--color-secondary)]/10 backdrop-blur-md bg-[var(--color-muted)]/95 w-full max-w-4xl">
                    <div className="text-center">
                        <h4 className="text-2xl md:text-4xl font-bold" style={{ color: 'var(--color-secondary)' }}>4.9/5</h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Avg Rating</p>
                    </div>
                    <div className="w-[1px] bg-[var(--color-accent)] opacity-20 hidden md:block"></div>
                    <div className="text-center">
                        <h4 className="text-2xl md:text-4xl font-bold" style={{ color: 'var(--color-secondary)' }}>15k+</h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Orders Served</p>
                    </div>
                    <div className="w-[1px] bg-[var(--color-accent)] opacity-20 hidden md:block"></div>
                    <div className="text-center">
                        <h4 className="text-2xl md:text-4xl font-bold" style={{ color: 'var(--color-secondary)' }}>98%</h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Loyal Users</p>
                    </div>
                </div>
            </section>

            {/* Tab Switcher */}
            <section className="flex justify-center mb-10 md:mb-12 px-8">
                <div className="bg-[var(--color-muted)] p-1.5 md:p-2 rounded-full backdrop-blur-sm border border-[var(--color-text)] flex gap-1 md:gap-2">
                    <button
                        onClick={() => setActiveTab('text')}
                        className={`px-6 md:px-10 py-3 md:py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${activeTab === 'text' ? 'bg-[var(--color-secondary)] text-[var(--color-primary)] shadow-xl' : 'text-[var(--color-text)] hover:bg-[var(--color-muted)]'}`}
                    >
                        Read Reviews
                    </button>
                    <button
                        onClick={() => setActiveTab('video')}
                        className={`px-6 md:px-10 py-3 md:py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${activeTab === 'video' ? 'bg-[var(--color-secondary)] text-[var(--color-primary)] shadow-xl' : 'text-[var(--color-text)] hover:bg-[var(--color-muted)]'}`}
                    >
                        Watch Videos
                    </button>
                </div>
            </section>

            {/* Review Content */}
            <section className="px-6 md:px-24 min-h-[400px]">
                {activeTab === 'text' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {textReviews.map((item, i) => (
                            <Suspense key={i} fallback={<div className="h-48 bg-gray-200 animate-pulse rounded-xl"></div>}>
                                <TestimonialCard {...item} />
                            </Suspense>
                        ))}
                    </div>
                ) : (
                    <div>
                        {videosLoaded ? (
                            videos.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                                    {videos.map((video) => (
                                        <div
                                            key={video._id}
                                            className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                                            onClick={() => setSelectedVideo(video)}
                                        >
                                            <div className="relative aspect-video bg-black group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                                <video
                                                    src={video.url}
                                                    className="w-full h-full object-cover opacity-80"
                                                    muted
                                                    loop
                                                    playsInline
                                                    preload="metadata"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <Play className="w-16 h-16 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-400 text-lg">No video reviews available</p>
                                </div>
                            )
                        ) : isLoading ? (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-400 text-lg">Loading video reviews...</p>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg">Click to load video reviews</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden relative">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-semibold text-gray-800">Customer Video Review</h3>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>
                        <div className="p-6">
                            <video
                                src={selectedVideo.url?.replace('http://', 'https://')}
                                className="w-full aspect-video rounded-lg"
                                controls
                                autoPlay
                            />
                        </div>
                    </div>
                </div>
            )}



            <div className="mt-16">
                <Suspense fallback={<div className="h-96 bg-gray-200 animate-pulse"></div>}>
                    <Footer />
                </Suspense>
            </div>
        </div>
    );
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;
