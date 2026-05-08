import React from 'react';
import bgImage from '../../assets/images/about-backgorund.webp';
import leftImage from '../../assets/images/about-left.png';

const AboutSection = () => {
  return (
    <section
      className="relative w-full py-12 md:py-16 overflow-hidden flex items-center bg-[#f9f8f4]"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%'
      }}
    >
      {/* Overlay for background image opacity */}
      <div className="absolute inset-0 bg-white/50"></div>

      <div className="relative z-10 w-full max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-10">

        {/* Left Side: Image - Perfect balance */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-center items-center">
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
              Why is kaashtkart
            </span>
            <span className="text-4xl md:text-5xl lg:text-6xl text-[var(--color-secondary)] mt-1 drop-shadow-sm">
              So Special
            </span>
          </h2>

          <div className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed font-medium space-y-3">
            <p>
              We bring you nature's finest, directly from heritage orchards. No chemicals, no artificial ripening—just pure, authentic sweetness harvested with love.
            </p>
            <p>
              Every bite of a kaashtkart mango is a premium experience, packed with rich nutrients, irresistible aroma, and a taste that transports you back to your roots.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;