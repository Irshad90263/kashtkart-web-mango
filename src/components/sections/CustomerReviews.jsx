import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getAllVideosApi } from '../../api/video';

const CustomerReviews = ({ addToRefs }) => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const data = await getAllVideosApi();
                setVideos(data.videos || []);
            } catch (error) {
                console.error("Failed to fetch videos:", error);
            }
        };
        fetchVideos();
    }, []);

    useEffect(() => {
        const videoContainer = scrollRef.current;
        let videoInterval;
        let isVideoHovered = false;

        const startVideoScroll = () => {
            if (videoInterval || isVideoHovered) return;
            videoInterval = setInterval(() => {
                if (!videoContainer || isVideoHovered) return;
                if (videoContainer.scrollLeft >= videoContainer.scrollWidth / 3) {
                    videoContainer.scrollLeft = 0;
                } else {
                    videoContainer.scrollLeft += 1.5;
                }
            }, 20);
        };

        const stopVideoScroll = () => {
            if (videoInterval) {
                clearInterval(videoInterval);
                videoInterval = null;
            }
        };

        if (videoContainer) {
            setTimeout(startVideoScroll, 100);
            videoContainer.addEventListener('mouseenter', () => {
                isVideoHovered = true;
                stopVideoScroll();
            });
            videoContainer.addEventListener('mouseleave', () => {
                isVideoHovered = false;
                startVideoScroll();
            });
        }

        return () => {
            stopVideoScroll();
        };
    }, [videos]);

    return (
        <>
            {/* Video Reviews Section */}
            <section ref={addToRefs} className="scroll-section py-20 px-8 md:px-24 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-surface)] text-center relative z-10 shadow-sm overflow-hidden" id="testimonials">
                <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border border-[var(--color-secondary)]/20">
                        Real Stories
                    </div>
                    <h2 className="text-4xl md:text-7xl text-[var(--color-secondary)] mb-12 font-bold font-[var(--font-heading)] drop-shadow-sm">Loved by Customers</h2>

                    {videos.length > 0 ? (
                        <div className="relative group">
                            <div
                                ref={scrollRef}
                                className="flex gap-4 md:gap-10 overflow-x-auto pb-12 scroll-smooth no-scrollbar px-2"
                            >
                                {[...videos, ...videos, ...videos].map((video, index) => (
                                    <div
                                        key={`${video._id}-${index}`}
                                        className="flex-shrink-0 w-56 md:w-80 h-80 md:h-96 bg-[var(--color-muted)] rounded-[30px] shadow-2xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-all duration-500 border border-[var(--color-secondary)]/10 group relative"
                                        onClick={() => setSelectedVideo(video)}
                                    >
                                        <video
                                            src={video.url}
                                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                            muted
                                            loop
                                            autoPlay
                                            playsInline
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-[var(--color-text-muted)] font-medium">Loading customer stories...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4 pt-32">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[70vh] overflow-hidden relative">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute bottom-4 right-4 p-1 md:p-2 bg-black text-white rounded-full transition-colors z-10 hover:bg-gray-800"
                        >
                            <X className="w-4 h-4 md:w-6 md:h-6" />
                        </button>
                        <div className="p-6">
                            <video
                                src={selectedVideo.url}
                                className="w-full aspect-video rounded-lg"
                                controls
                                autoPlay
                                onLoadedData={(e) => {
                                    setTimeout(() => {
                                        e.target.pause();
                                    }, 5000);
                                }}
                            />
                            <div className="mt-4 text-center">
                                <p className="text-gray-600">Customer Review</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CustomerReviews;