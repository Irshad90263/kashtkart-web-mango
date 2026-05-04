import React, { memo } from 'react';
import { Play, Star } from 'lucide-react';

const VideoReviewCard = memo(({ videoUrl, name, thumbnailImg, title, color, initial, location, rating = 5 }) => {
    return (
        <div className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer">
            {/* Video Content Only */}
            <div className="relative aspect-video bg-black group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                {thumbnailImg ? (
                    <img src={thumbnailImg} alt="Video Review" className="w-full h-full object-cover opacity-80" loading="lazy" />
                ) : (
                    <div className="w-full h-full bg-[var(--color-maroon)] flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                    </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-125 group-hover:bg-[var(--color-secondary)]">
                        <Play size={28} fill="currentColor" className="text-[var(--color-maroon)] ml-1" />
                    </div>
                </div>
            </div>
        </div>
    );
});

VideoReviewCard.displayName = 'VideoReviewCard';

export default VideoReviewCard;
