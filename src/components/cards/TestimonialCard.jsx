import React, { useState, memo } from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = memo(({ quote, name, color, initial, location, rating = 5 }) => {
    return (
        <div className="bg-[var(--color-muted)] p-5 md:p-6 rounded-2xl shadow-md border border-[var(--color-secondary)]/10 hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
            <div className="text-3xl text-[var(--color-secondary)] mb-3 opacity-30 italic font-serif leading-none">"</div>

            {/* Rating System */}
            <div className="flex gap-1 mb-3 text-[var(--color-secondary)]">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        fill={i < rating ? "currentColor" : "none"}
                        className={i < rating ? "" : "text-gray-600"}
                    />
                ))}
            </div>

            <p className="text-sm md:text-base text-zinc-500 italic leading-relaxed mb-4 flex-grow -mt-2">
                {quote}
            </p>

            <div className="flex items-center gap-3 border-t border-[var(--color-secondary)]/10 pt-4 mt-auto">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-[var(--color-secondary)] overflow-hidden transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: color }}
                >
                    {initial}
                </div>
                <div>
                    <h4 className="font-bold text-[var(--color-secondary)] leading-none mb-1 text-sm">{name}</h4>
                    <p className="text-[10px] text-gray-400 font-sans tracking-wide uppercase">{location}</p>
                </div>
            </div>
        </div>
    );
});

TestimonialCard.displayName = 'TestimonialCard';

export default TestimonialCard;
