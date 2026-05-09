import React from 'react';
import bgImage from '../../assets/images/about-backgorund.webp';
import leftImage from '../../assets/images/about-left.png';
import basketImage from '../../assets/images/basket.png';
import mangoBgPattern2 from '../../assets/images/mangoBgPattern2.png';

const AboutSection = () => {
  return (
    <section
      className="relative w-full py-12 md:py-16 overflow-hidden flex items-center bg-yellow-50"
    >
      {/* Mango Pattern Background Layer */}
      <div 
        className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply" 
        style={{
          backgroundImage: `url(${mangoBgPattern2})`,
          backgroundSize: '400px',
          backgroundRepeat: 'repeat',
        }}
      ></div>

      {/* Yellow Tint Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/40 via-transparent to-yellow-200/30"></div>

      <div className="relative z-10 w-full max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-10">

        {/* Left Side: Image - Perfect balance */}
        <div className="w-full bor md:w-1/2 flex justify-center md:justify-center items-center">
          <img
            src={leftImage}
            alt="kaashtkart Mango"
            className="w-[80%] md:w-[85%] max-w-[400px] object-contain mix-blend-multiply drop-shadow-2xl"
          />
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">

          <h2 className="flex flex-col font-black font-[var(--font-heading)] uppercase leading-[1.1] mb-4 tracking-wide">
            <span className="text-2xl md:text-3xl lg:text-4xl text-gray-800">
              Why is KaashtKart
            </span>
            <span className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-1 bg-gradient-to-b from-yellow-400 via-orange-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(255,170,0,0.35)]">
  So Special
</span> 
          </h2>

          <div className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed font-medium space-y-3">
            <p>
              We bring you nature's finest, directly from heritage orchards. No chemicals, no artificial ripening—just pure, authentic sweetness harvested with love.
            </p>
            <p>
              Every bite of a KaashtKart mango is a premium experience, packed with rich nutrients, irresistible aroma, and a taste that transports you back to your roots.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;