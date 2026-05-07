import React from 'react';
import { Download, Smartphone, Truck, Clock, BadgeCheck, Star, Shield, Zap } from 'lucide-react';

const AppSection = () => {
    const openPlayStore = () => {
        window.open('https://play.google.com', '_blank');
    };

    const features = [
        { icon: Truck, text: 'Free Delivery', color: 'from-orange-500 to-amber-500' },
        { icon: Clock, text: '30 Mins Delivery', color: 'from-blue-500 to-cyan-500' },
        { icon: BadgeCheck, text: 'Quality Guarantee', color: 'from-green-500 to-emerald-500' },
        { icon: Star, text: '4.8 Rating', color: 'from-yellow-500 to-orange-500' },
    ];

    return (
        <section className="relative py-16 overflow-hidden bg-gradient-to-br from-amber-50/40 via-white to-yellow-50/40">
            
            {/* Animated Background Elements with Yellow Tone */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200/15 rounded-full blur-3xl"></div>
                
                {/* Additional Yellow Glow */}
                <div className="absolute top-20 left-1/4 w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl animate-pulse delay-700"></div>
                <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-1500"></div>
            </div>

            {/* Soft Yellow Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-100/20 via-transparent to-amber-100/20"></div>

            {/* Floating Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
                <span className="absolute -top-2 -left-2 text-7xl select-none rotate-[-15deg]">🥭</span>
                <span className="absolute top-6 left-20 text-4xl select-none rotate-[20deg]">🌿</span>
                <span className="absolute top-0 left-36 text-3xl select-none rotate-[-10deg]">🍃</span>
                <span className="absolute -bottom-2 -right-2 text-7xl select-none rotate-[15deg]">🥭</span>
                <span className="absolute bottom-6 right-20 text-4xl select-none rotate-[-20deg]">🌿</span>
                <span className="absolute bottom-0 right-36 text-3xl select-none rotate-[10deg]">🍃</span>
                <span className="absolute top-1/3 -left-1 text-4xl select-none rotate-[30deg]">🍃</span>
                <span className="absolute top-2/3 -left-1 text-3xl select-none rotate-[-20deg]">🌿</span>
                <span className="absolute top-1/3 -right-1 text-4xl select-none rotate-[-30deg]">🍃</span>
                <span className="absolute top-2/3 -right-1 text-3xl select-none rotate-[20deg]">🌿</span>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(251,191,36,0.08)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
                }}></div>
            </div>

            <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 w-full relative z-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

                    {/* Left Side - Content */}
                    <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">

                        {/* Heading */}
                        <div className="space-y-3">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                                Download{' '}
                                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                    KashtKart
                                </span>{' '}
                                App
                            </h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg">
                            Order fresh mangoes directly from our orchards to your doorstep. 
                            Experience the finest quality with lightning-fast delivery.
                        </p>

                        {/* Download Links Section */}
                        <div className="pt-6 flex flex-wrap items-center gap-6">
                            <span className="text-xl sm:text-2xl font-medium text-[#4A5D6E] whitespace-nowrap">
                                Download App:
                            </span>
                            <div className="flex flex-wrap items-center gap-4">
                                {/* App Store Button */}
                                <a 
                                    href="#" 
                                    className="transition-transform hover:scale-105 duration-300"
                                >
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                                        alt="Download on the App Store" 
                                        className="h-10 sm:h-12 w-auto"
                                    />
                                </a>
                                {/* Google Play Button */}
                                <a 
                                    href="#" 
                                    className="transition-transform hover:scale-105 duration-300"
                                >
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                                        alt="Get it on Google Play" 
                                        className="h-10 sm:h-12 w-auto"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Premium Phone Mockups */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center">
                        <div className="relative flex justify-center items-center gap-6 sm:gap-8">
                            
                            {/* Background Glow - Yellow Tone */}
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl"></div>
                            
                            {/* First Mobile Frame */}
                            <div
                                className="relative z-0 transform -rotate-6 hover:rotate-0 transition-transform duration-500"
                                style={{
                                    animation: 'floatLeft 4s ease-in-out infinite'
                                }}
                            >
                                <div className="relative">
                                    {/* Phone Shadow */}
                                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2rem] p-1.5 shadow-2xl">
                                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-[1.7rem] overflow-hidden">
                                            <div className="aspect-[9/19] flex items-center justify-center relative">
                                                {(() => {
                                                    try {
                                                        const MobileApp = require('../../assets/images/mobileApp.png');
                                                        return (
                                                            <img
                                                                src={MobileApp}
                                                                alt="KashtKart App"
                                                                className="w-full h-full object-cover rounded-[1.7rem]"
                                                            />
                                                        );
                                                    } catch {
                                                        return (
                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-400/30 to-orange-400/30">
                                                                <Smartphone className="w-10 h-10 text-amber-600 mb-2" />
                                                                <p className="text-amber-700 font-bold text-center text-xs px-4">KashtKart App</p>
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                                
                                                {/* Screen Glare */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-[1.7rem] pointer-events-none"></div>
                                            </div>
                                        </div>
                                        {/* Dynamic Island */}
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-[0.85rem] bg-black rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Second Mobile Frame */}
                            <div
                                className="relative z-10 transform rotate-6 hover:rotate-0 transition-transform duration-500"
                                style={{
                                    animation: 'floatRight 4s ease-in-out infinite 0.5s'
                                }}
                            >
                                <div className="relative">
                                    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2rem] p-1.5 shadow-2xl">
                                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-[1.7rem] overflow-hidden">
                                            <div className="aspect-[9/19] flex items-center justify-center relative">
                                                {(() => {
                                                    try {
                                                        const MobileApp = require('../../assets/images/mobileApp.png');
                                                        return (
                                                            <img
                                                                src={MobileApp}
                                                                alt="KashtKart App"
                                                                className="w-full h-full object-cover rounded-[1.7rem]"
                                                            />
                                                        );
                                                    } catch {
                                                        return (
                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-400/30 to-orange-400/30">
                                                                <Smartphone className="w-10 h-10 text-amber-600 mb-2" />
                                                                <p className="text-amber-700 font-bold text-center text-xs px-4">KashtKart App</p>
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                                
                                                {/* Screen Content Overlay */}
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                            <p className="text-[8px] font-bold text-gray-800">Order Now →</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-[0.85rem] bg-black rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements - Yellow Theme */}
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-400/40 rounded-full blur-2xl animate-pulse"></div>
                            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-yellow-400/30 rounded-full blur-2xl animate-pulse delay-700"></div>
                            <div className="absolute top-1/2 -right-12 w-12 h-12 bg-orange-300/30 rounded-full blur-xl animate-pulse delay-1200"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes floatLeft {
                    0%, 100% { 
                        transform: translateY(0px) rotate(-6deg); 
                    }
                    50% { 
                        transform: translateY(-15px) rotate(-4deg); 
                    }
                }
                
                @keyframes floatRight {
                    0%, 100% { 
                        transform: translateY(0px) rotate(6deg); 
                    }
                    50% { 
                        transform: translateY(-18px) rotate(8deg); 
                    }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }

                .animate-pulse {
                    animation: pulse 3s ease-in-out infinite;
                }

                .delay-1000 {
                    animation-delay: 1s;
                }

                .delay-700 {
                    animation-delay: 0.7s;
                }

                .delay-1500 {
                    animation-delay: 1.5s;
                }

                .delay-1200 {
                    animation-delay: 1.2s;
                }
            `}</style>
        </section>
    );
};

export default AppSection;