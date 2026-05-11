import React, { useEffect, useRef } from 'react';
import { Heart, Users, Leaf, Truck, RotateCcw, FileText } from 'lucide-react';
import Footer from '../../components/layout/Footer';
import mangoTree from '../../assets/images/mango-tree-isolate-on-transparent-background-png.png';
import mangoFresh from '../../assets/images/pngtree-background-alphonso-mango-png-image_16550748.png';
import mangoAlphonso from '../../assets/images/urunler_meyveler_mango.png';
import whyChooseUs from '../../assets/images/whyChooseUs.png';

const About = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="bg-[var(--color-primary)] text-[var(--color-text)] font-[var(--font-body)] min-h-screen">

      {/* About Hero with Full Width Image */}
      <section className="w-full overflow-hidden">
        <img 
          src={whyChooseUs} 
          alt="Why Choose Us" 
          className="w-full h-auto block shadow-sm"
        />
        
        {/* Animated Background Bubbles - Commented out */}
        {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="about-bubble about-bubble-1"></div>
          <div className="about-bubble about-bubble-2"></div>
          <div className="about-bubble about-bubble-3"></div>
          <div className="about-bubble about-bubble-4"></div>
        </div> */}

        {/* Hero Text Content - Commented out */}
        {/* <h1 className="text-4xl md:text-6xl font-bold mb-6 relative z-10 text-[var(--color-secondary)]">Our Legacy of KaashtKart Mango</h1>
        <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto italic relative z-10 text-[var(--color-text-muted)]">
          Crafting perfection for over a century, KaashtKart mango brings the authentic taste of tradition to your modern lifestyle.
        </p> */}
      </section>

      {/* Legacy Section */}
      <section ref={addToRefs} className="scroll-section bg-[var(--color-surface)] py-10 px-8 md:px-24 2xl:px-32 3xl:px-48 relative z-20 overflow-hidden" id="about">

        {/* Floating Mango Bubbles - Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Left Mango */}
          <div className="absolute top-15 left-35 opacity-20 animate-float-bubble-1">
            <div className="text-7xl rotate-[-15deg]">🥭</div>
          </div>

          {/* Top Right Mango */}
          <div className="absolute top-10 right-40 opacity-30 animate-float-bubble-2">
            <div className="text-8xl rotate-[20deg]">🥭</div>
          </div>

          {/* Bottom Left Mango */}
          <div className="absolute bottom-10 left-5 opacity-30 animate-float-bubble-3">
            <div className="text-8xl rotate-[10deg]">🥭</div>
          </div>

          {/* Bottom Right Mango */}
          <div className="absolute bottom-20 right-5 opacity-15 animate-float-bubble-4">
            <div className="text-5xl rotate-[-20deg]">🥭</div>
          </div>

          {/* Middle Left Mango */}
          <div className="absolute top-1/3 left-8 opacity-10 animate-float-bubble-5">
            <div className="text-6xl rotate-[25deg]">🥭</div>
          </div>

          {/* Middle Right Mango */}
          <div className="absolute top-1/2 right-8 opacity-10 animate-float-bubble-6">
            <div className="text-7xl rotate-[-25deg]">🥭</div>
          </div>

          {/* Small decorative mangoes */}
          <div className="absolute top-1/4 left-1/4 opacity-8 animate-float-bubble-7">
            <div className="text-4xl rotate-[15deg]">🥭</div>
          </div>

          <div className="absolute bottom-1/3 right-1/3 opacity-8 animate-float-bubble-8">
            <div className="text-3xl rotate-[-10deg]">🥭</div>
          </div>
        </div>

        <div className="max-w-[1600px] 3xl:max-w-[1900px] mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-text)] font-[var(--font-heading)] leading-tight">
              Legacy of <span className='text-[var(--color-secondary)]'>KaashtKart</span>
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex items-center gap-0">
              <div className="flex-1 flex items-center justify-center p-4">
                <img src={mangoAlphonso} alt="Alphonso Mangoes" className="w-full max-h-80 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="w-px self-stretch bg-[var(--color-secondary)]/30"></div>
              <div className="flex-1 flex items-center justify-center p-4">
                <img src={mangoFresh} alt="Fresh Mangoes" className="w-full max-h-80 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-6">
              <p className="text-lg text-[var(--color-text)] leading-relaxed italic border-l-4 border-[var(--color-secondary)] pl-5 bg-[var(--color-secondary)]/5 py-3 rounded-r-xl">
                "From the orchards of India to your home — KaashtKart was born to bring the purest, freshest mangoes directly to your table."
              </p>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                KaashtKart started with a simple belief — every family deserves farm-fresh mangoes without compromise. We work directly with farmers across Ratnagiri, Valsad, and Lucknow to source the finest Alphonso, Kesar, and Dasheri mangoes, cutting out middlemen and ensuring full freshness.
              </p>
              <ul className="space-y-3">
                {[
                  'Farm-direct sourcing from certified mango orchards across India',
                  'Zero artificial ripening — purely natural harvest every season',
                  'Available only during peak season for maximum taste & nutrition',
                  'Fair pricing ensured for every farmer partner we work with',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[var(--color-text)] text-sm">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--color-secondary)] flex-shrink-0"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CSS for floating animations */}
        <style>{`
    @keyframes floatBubble1 {
      0%, 100% { transform: translate(0, 0) rotate(-15deg); }
      50% { transform: translate(15px, -20px) rotate(-5deg); }
    }
    
    @keyframes floatBubble2 {
      0%, 100% { transform: translate(0, 0) rotate(20deg); }
      50% { transform: translate(-12px, -18px) rotate(10deg); }
    }
    
    @keyframes floatBubble3 {
      0%, 100% { transform: translate(0, 0) rotate(10deg); }
      50% { transform: translate(10px, -25px) rotate(0deg); }
    }
    
    @keyframes floatBubble4 {
      0%, 100% { transform: translate(0, 0) rotate(-20deg); }
      50% { transform: translate(-15px, -15px) rotate(-10deg); }
    }
    
    @keyframes floatBubble5 {
      0%, 100% { transform: translate(0, 0) rotate(25deg); }
      50% { transform: translate(8px, -30px) rotate(15deg); }
    }
    
    @keyframes floatBubble6 {
      0%, 100% { transform: translate(0, 0) rotate(-25deg); }
      50% { transform: translate(-10px, -22px) rotate(-15deg); }
    }
    
    @keyframes floatBubble7 {
      0%, 100% { transform: translate(0, 0) rotate(15deg); }
      50% { transform: translate(20px, -10px) rotate(5deg); }
    }
    
    @keyframes floatBubble8 {
      0%, 100% { transform: translate(0, 0) rotate(-10deg); }
      50% { transform: translate(-18px, -12px) rotate(0deg); }
    }
    
    .animate-float-bubble-1 { animation: floatBubble1 8s ease-in-out infinite; }
    .animate-float-bubble-2 { animation: floatBubble2 10s ease-in-out infinite 1s; }
    .animate-float-bubble-3 { animation: floatBubble3 12s ease-in-out infinite 2s; }
    .animate-float-bubble-4 { animation: floatBubble4 9s ease-in-out infinite 0.5s; }
    .animate-float-bubble-5 { animation: floatBubble5 11s ease-in-out infinite 1.5s; }
    .animate-float-bubble-6 { animation: floatBubble6 7s ease-in-out infinite 2.5s; }
    .animate-float-bubble-7 { animation: floatBubble7 13s ease-in-out infinite 3s; }
    .animate-float-bubble-8 { animation: floatBubble8 8.5s ease-in-out infinite 0.8s; }
  `}</style>
      </section>

      {/*  nature finest section */}
      <section className="relative py-4 px-8 md:px-24 2xl:px-32 3xl:px-48 overflow-hidden">

        {/* Light Yellow Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-100/60 via-amber-50/30 to-transparent"></div>
        {/* Main Content */}
        <div className="relative z-10 max-w-[1600px] 3xl:max-w-[1900px] mx-auto grid md:grid-cols-2 gap-12 items-stretch">

          {/* Left Side - Content */}
          <div className="flex flex-col justify-center gap-6">
            <div className="inline-block px-4 py-1.5 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-full text-[10px] font-bold uppercase tracking-[0.3em] border border-[var(--color-secondary)]/20 w-fit">
              About Our Mangoes
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--color-secondary)] font-[var(--font-heading)] leading-tight">
              Nature's Finest,<br />Straight from the Orchard
            </h2>
            <p className="text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed">
              We source only the finest mangoes directly from trusted orchards across India. Every mango is handpicked at peak ripeness, ensuring you get the richest flavor, natural sweetness, and full nutritional goodness in every bite.
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="relative flex items-stretch">
            <img src={mangoTree} alt="Fresh Mango Tree" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section ref={addToRefs} className="scroll-section py-12 px-8 md:px-24 bg-[var(--color-primary)] relative z-20 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] mb-4 md:mb-6">A Journey Through Time</h2>
            <p className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed mb-4 md:mb-6">
              KaashtKart , a hidden gem in Uttar Pradesh, has always been synonymous with its world-famous Mango. At KaashtKart, we carry a legacy that dates back over 100 years. What started as a passion for preserving traditional flavors has now blossomed into a brand that stands for quality, authenticity, and love.
            </p>
            <p className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed">
              Every single Mango is handcrafted with precision, using recipes handed down through generations. From the selection of premium ingredients to the slow-roasting process, we ensure that every bite transports you back to the golden era of Nawabs and their grand feasts.
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3 md:gap-4 w-full">
            <img src={mangoTree} alt="KaashtKartMango" className="w-full h-48 md:h-auto object-contain rounded-2xl" />
            <div className="flex flex-col gap-3 md:gap-4 justify-center">
              <div className="bg-[var(--color-muted)] p-4 md:p-6 rounded-2xl shadow-md border-l-4 border-[var(--color-secondary)]">
                <h4 className="font-bold text-[var(--color-secondary)] text-xl md:text-2xl">100+</h4>
                <p className="text-xs md:text-sm text-gray-400">Years of Heritage</p>
              </div>
              <div className="bg-[var(--color-muted)] p-4 md:p-6 rounded-2xl shadow-md border-l-4 border-[var(--color-secondary)]">
                <h4 className="font-bold text-[var(--color-secondary)] text-xl md:text-2xl">100%</h4>
                <p className="text-xs md:text-sm text-gray-400">Natural Ingredients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section ref={addToRefs} className="scroll-section relative py-10 px-8 md:px-24 overflow-hidden" style={{ background: 'linear-gradient(to top, #fdf4ac, #ffffff)' }}>

        <div className="max-w-[1600px] 3xl:max-w-[1900px] mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center text-[var(--color-secondary)] mb-16">Why KaashtKartMango?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="group text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-[var(--color-secondary)]/20 hover:border-[var(--color-secondary)]/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--color-secondary)] group-hover:scale-110 transition-all duration-300">
                <Heart className="w-7 h-7 text-[var(--color-secondary)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-secondary)] mb-2">Farm Fresh Quality</h3>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                Handpicked ripe mangoes sourced directly from trusted farms, ensuring natural sweetness and authentic taste.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-[var(--color-secondary)]/20 hover:border-[var(--color-secondary)]/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--color-secondary)] group-hover:scale-110 transition-all duration-300">
                <Users className="w-7 h-7 text-[var(--color-secondary)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-secondary)] mb-2">Naturally Ripened</h3>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                No chemicals used. Our mangoes are ripened using traditional methods to preserve flavor and nutrition.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-[var(--color-secondary)]/20 hover:border-[var(--color-secondary)]/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--color-secondary)] group-hover:scale-110 transition-all duration-300">
                <Leaf className="w-7 h-7 text-[var(--color-secondary)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-secondary)] mb-2">Rich in Flavor</h3>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                Juicy, aromatic, and full of tropical goodness — every bite delivers a premium, satisfying experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Section - BALANCED FOCUS */}
      <section ref={addToRefs} className="scroll-section py-10 px-8 md:px-24 bg-[var(--color-primary)] shadow-2xl relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-secondary)] inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[var(--color-secondary)]">
              Our Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Shipping Policy', icon: Truck, link: '/shipping-policy', desc: 'Secure Pan-India delivery with real-time tracking.' },
              { title: 'Return Policy', icon: RotateCcw, link: '/return-policy', desc: 'Simple 24-hour claim window for damaged orders.' },
              { title: 'Terms of Service', icon: FileText, link: '/terms-of-service', desc: 'Defining our transparent rules of engagement.' }
            ].map((policy) => {
              const IconComponent = policy.icon;
              return (
                <a
                  key={policy.title}
                  href={policy.link}
                  className="group text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-[var(--color-secondary)]/20 hover:border-[var(--color-secondary)]/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center"
                >
                  <div className="w-14 h-14 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[var(--color-secondary)] group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="w-7 h-7 text-[var(--color-secondary)] group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="font-bold text-[var(--color-secondary)] text-lg mb-2">{policy.title}</h4>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{policy.desc}</p>
                  <span className="mt-3 text-[var(--color-secondary)] font-semibold text-[11px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Discover More →
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;