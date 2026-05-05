import React from 'react';
import { Download, Smartphone, Truck, Clock, BadgeCheck, Star } from 'lucide-react';

const AppSection = () => {
    const openPlayStore = () => {
        window.open('https://play.google.com', '_blank');
    };

    return (
        <section className="relative py-8 sm:py-10 md:py-12 lg:py-14 overflow-hidden">

            {/* Background Gradient Overlay - Bottom to Top */}
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/60 via-amber-400/30 to-transparent"></div>

            {/* Original Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-yellow-50/30"></div>

            {/* Decorative Elements */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 lg:top-5 lg:left-5 opacity-20 pointer-events-none z-10">
                <div className="text-3xl sm:text-4xl md:text-5xl rotate-[-15deg]">🥭</div>
            </div>
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 lg:bottom-5 lg:right-5 opacity-20 pointer-events-none z-10">
                <div className="text-3xl sm:text-4xl md:text-5xl rotate-[15deg]">🥭</div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 lg:gap-12">

                    {/* Left Side - Content */}
                    <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4 md:space-y-5">

                        {/* Heading */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--color-text)] font-[var(--font-heading)] leading-tight">
                            Download <span className="text-[var(--color-secondary)]">KashtKart</span> App
                        </h2>

                        {/* Description */}
                        <p className="text-[var(--color-text-muted)] text-xs sm:text-sm md:text-base leading-relaxed">
                            Order fresh mangoes directly from our orchards to your doorstep. Fast delivery, best quality.
                        </p>

                        {/* Play Store Button */}
                        <button
                            onClick={openPlayStore}
                            className="group flex items-center gap-1.5 sm:gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg transition-all duration-300 hover:scale-105 shadow-md w-fit"
                        >
                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <div className="text-left">
                                <p className="text-[10px] sm:text-xs md:text-sm font-bold -mt-0.5">Google Play</p>
                            </div>
                        </button>
                    </div>

                    {/* Right Side - Two Mobile Frames with Separate Rotation */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center mt-6 lg:mt-0">
                        <div className="relative flex justify-center items-center gap-8 sm:gap-10 md:gap-12">

                            {/* First Mobile Frame (Left - Rotate Left) */}
                            <div
                                className="relative w-[130px] sm:w-[150px] md:w-[170px] lg:w-[180px] z-0"
                                style={{
                                    transform: 'rotate(-5deg)',
                                    animation: 'floatLeft 3s ease-in-out infinite'
                                }}
                            >
                                <div className="relative bg-[#1a1a1a] rounded-[1.5rem] sm:rounded-[1.8rem] md:rounded-[2rem] p-1 sm:p-1.5 md:p-2 shadow-xl">
                                    <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-[1.2rem] sm:rounded-[1.3rem] md:rounded-[1.5rem] overflow-hidden">
                                        <div className="aspect-[9/19] flex items-center justify-center">
                                            {(() => {
                                                try {
                                                    const MobileApp = require('../../assets/images/mobileApp.png');
                                                    return (
                                                        <img
                                                            src={MobileApp}
                                                            alt="KashtKart App"
                                                            className="w-full h-full object-cover rounded-[1.2rem] sm:rounded-[1.3rem] md:rounded-[1.5rem]"
                                                        />
                                                    );
                                                } catch {
                                                    return (
                                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[var(--color-secondary)]/20 to-[var(--color-secondary)]/5">
                                                            <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--color-secondary)] mb-1" />
                                                            <p className="text-[var(--color-secondary)] font-semibold text-center text-[6px] sm:text-[8px] px-2">KashtKart App</p>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </div>
                                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 sm:w-12 md:w-14 h-2.5 sm:h-3 md:h-3.5 bg-black rounded-full"></div>
                                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-12 sm:w-14 md:w-16 h-0.5 bg-gray-400 rounded-full"></div>
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 sm:h-3.5 bg-black/15 blur-md rounded-full"></div>
                            </div>

                            {/* Second Mobile Frame (Right - Rotate Right) */}
                            <div
                                className="relative w-[140px] sm:w-[160px] md:w-[180px] lg:w-[190px] z-10"
                                style={{
                                    transform: 'rotate(5deg)',
                                    animation: 'floatRight 3s ease-in-out infinite 0.5s'
                                }}
                            >
                                <div className="relative bg-[#1a1a1a] rounded-[1.5rem] sm:rounded-[1.8rem] md:rounded-[2rem] p-1 sm:p-1.5 md:p-2 shadow-xl">
                                    <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-[1.2rem] sm:rounded-[1.3rem] md:rounded-[1.5rem] overflow-hidden">
                                        <div className="aspect-[9/19] flex items-center justify-center">
                                            {(() => {
                                                try {
                                                    const MobileApp = require('../../assets/images/mobileApp.png');
                                                    return (
                                                        <img
                                                            src={MobileApp}
                                                            alt="KashtKart App"
                                                            className="w-full h-full object-cover rounded-[1.2rem] sm:rounded-[1.3rem] md:rounded-[1.5rem]"
                                                        />
                                                    );
                                                } catch {
                                                    return (
                                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[var(--color-secondary)]/20 to-[var(--color-secondary)]/5">
                                                            <Smartphone className="w-7 h-7 sm:w-9 sm:h-9 text-[var(--color-secondary)] mb-1" />
                                                            <p className="text-[var(--color-secondary)] font-semibold text-center text-[7px] sm:text-[9px] px-2">KashtKart App</p>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </div>
                                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 sm:w-12 md:w-14 h-2.5 sm:h-3 md:h-3.5 bg-black rounded-full"></div>
                                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-12 sm:w-14 md:w-16 h-0.5 bg-gray-400 rounded-full"></div>
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 sm:h-3.5 bg-black/15 blur-md rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS for floating animations with rotation */}
            <style>{`
                @keyframes floatLeft {
                    0%, 100% { 
                        transform: translateY(0px) rotate(-5deg); 
                    }
                    50% { 
                        transform: translateY(-10px) rotate(-3deg); 
                    }
                }
                
                @keyframes floatRight {
                    0%, 100% { 
                        transform: translateY(0px) rotate(5deg); 
                    }
                    50% { 
                        transform: translateY(-12px) rotate(7deg); 
                    }
                }
            `}</style>
        </section>
    );
};

export default AppSection;