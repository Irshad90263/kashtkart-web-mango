import React from 'react';
import { Star, Quote } from 'lucide-react';

const LovedByCustomers = () => {
    const reviews = [
        { id: 1, name: 'Priya Sharma', rating: 5, review: 'Best mangoes ever! Fresh, juicy and delicious. Highly recommend KashtKart!' },
        { id: 2, name: 'Rahul Verma', rating: 5, review: 'Outstanding quality. No chemicals, naturally ripened. Perfect delivery.' },
        { id: 3, name: 'Neha Gupta', rating: 4, review: 'Great taste and quick delivery. Customer support is very helpful.' },
    ];

    return (
        <section className="relative py-6 sm:py-8 md:py-10 lg:py-12 bg-gradient-to-t from-amber-50/30 to-white">

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">

                {/* Header - Responsive */}
                <div className="text-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                    <h2 className="text-[16px] sm:text-[4px] md:text-2xl lg:text-3xl font-black text-[var(--color-text)]">
                        Loved by <span className="text-[var(--color-secondary)] text-lg sm:text-xl md:text-2xl lg:text-3xl">Our Customers</span>
                    </h2>
                    <div className="flex items-center justify-center gap-1 mt-1 sm:mt-1.5 md:mt-2">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <span className="text-[10px] sm:text-xs md:text-sm font-semibold ml-1">4.8</span>
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400">(2,500+ reviews)</span>
                    </div>
                </div>

                {/* 3 Reviews Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-3 sm:p-4 md:p-5 rounded-lg bg-white/60 backdrop-blur-sm border border-[var(--color-secondary)]/10 hover:border-[var(--color-secondary)]/20 transition-all duration-300 hover:-translate-y-1 shadow-sm">
                            <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-secondary)]/30 mb-1 sm:mb-2" />
                            <p className="text-[var(--color-text-muted)] text-[10px] sm:text-xs md:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-3">
                                "{review.review}"
                            </p>
                            <div className="flex gap-0.5 mb-1 sm:mb-1.5 md:mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <p className="font-semibold text-[var(--color-text)] text-[10px] sm:text-xs md:text-sm">{review.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LovedByCustomers;