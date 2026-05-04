import React, { useEffect, useRef } from 'react';
import { Heart, Users, Leaf, Truck, RotateCcw, FileText } from 'lucide-react';
import Footer from '../../components/layout/Footer';
import mangoTree from '../../assets/images/mango-tree-isolate-on-transparent-background-png.png';
import ladduTypes from '../../assets/images/laddu-types.png';

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

      {/* About Hero with Bubbles */}
      <section className="py-20 px-8 md:px-24 bg-[linear-gradient(0deg,rgba(255,212,0,0.1)_0%,transparent_70%)] text-center relative overflow-hidden mb-12">
        {/* Animated Background Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="about-bubble about-bubble-1"></div>
          <div className="about-bubble about-bubble-2"></div>
          <div className="about-bubble about-bubble-3"></div>
          <div className="about-bubble about-bubble-4"></div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            .about-bubble {
              position: absolute;
              background: rgba(255, 212, 0, 0.15);
              border-radius: 50%;
              animation: float-about-bubble 22s infinite ease-in-out;
            }
            .about-bubble-1 {
              width: 120px;
              height: 120px;
              left: 10%;
              top: 20%;
              animation-delay: 0s;
            }
            .about-bubble-2 {
              width: 150px;
              height: 150px;
              right: 15%;
              top: 30%;
              animation-delay: 3s;
            }
            .about-bubble-3 {
              width: 100px;
              height: 100px;
              left: 70%;
              bottom: 20%;
              animation-delay: 6s;
            }
            .about-bubble-4 {
              width: 130px;
              height: 130px;
              right: 60%;
              bottom: 30%;
              animation-delay: 2s;
            }
            @keyframes float-about-bubble {
              0%, 100% {
                transform: translate(0, 0) scale(1);
                opacity: 0.4;
              }
              50% {
                transform: translate(30px, -40px) scale(1.1);
                opacity: 0.6;
              }
            }
          `
        }} />

        <h1 className="text-4xl md:text-6xl font-bold mb-6 relative z-10 text-[var(--color-secondary)]">Our Legacy of KashtKart Mango</h1>
        <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto italic relative z-10 text-[var(--color-text-muted)]">
          Crafting perfection for over a century, KashtKart mango brings the authentic taste of tradition to your modern lifestyle.
        </p>
      </section>

      {/* Our Journey */}
      <section ref={addToRefs} className="scroll-section py-16 px-8 md:px-24 bg-[var(--color-primary)] relative z-20 shadow-2xl mb-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] mb-4 md:mb-6">A Journey Through Time</h2>
            <p className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed mb-4 md:mb-6">
              KashtKart, a hidden gem in Uttar Pradesh, has always been synonymous with its world-famous Laddus. At KashtKart, we carry a legacy that dates back over 100 years. What started as a passion for preserving traditional flavors has now blossomed into a brand that stands for quality, authenticity, and love.
            </p>
            <p className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed">
              Every single Laddu is handcrafted with precision, using recipes handed down through generations. From the selection of premium ingredients to the slow-roasting process, we ensure that every bite transports you back to the golden era of Nawabs and their grand feasts.
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3 md:gap-4 w-full">
            <img src={mangoTree} alt="KashtKart Laddu Shop" className="w-full h-48 md:h-auto object-cover rounded-2xl shadow-lg border border-[var(--color-secondary)]/20" />
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
      <section ref={addToRefs} className="scroll-section py-20 px-8 md:px-24 bg-[var(--color-muted)]/50 shadow-xl mb-12">
        <h2 className="text-4xl font-bold text-center text-[var(--color-secondary)] mb-16">Why KashtKart Mango?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-8 rounded-3xl bg-[var(--color-muted)] border border-[var(--color-secondary)]/20 shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(255,212,0,0.4)]">
              <Heart className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[var(--color-secondary)]">Farm Fresh Quality</h3>
            <p className="text-[var(--color-text-muted)] italic">
Handpicked ripe mangoes sourced directly from trusted farms, ensuring natural sweetness and authentic taste.</p>
          </div>
          <div className="text-center p-8 rounded-3xl bg-[var(--color-muted)] border border-[var(--color-secondary)]/20 shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(255,212,0,0.4)]">
              <Users className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[var(--color-secondary)]">Naturally Ripened</h3>
            <p className="text-[var(--color-text-muted)] italic">
No chemicals used. Our mangoes are ripened using traditional methods to preserve flavor and nutrition.</p>
          </div>
          <div className="text-center p-8 rounded-3xl bg-[var(--color-muted)] border border-[var(--color-secondary)]/20 shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(255,212,0,0.4)]">
              <Leaf className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[var(--color-secondary)]">Rich in Flavor</h3>
            <p className="text-[var(--color-text-muted)] italic">
Juicy, aromatic, and full of tropical goodness — every bite delivers a premium, satisfying experience.</p>
          </div>
        </div>
      </section>

      {/* Policies Section - BALANCED FOCUS */}
      <section ref={addToRefs} className="scroll-section py-20 px-8 md:px-24 bg-[var(--color-primary)] shadow-2xl relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-secondary)] mb-4 inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[var(--color-secondary)]">
              Our Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  className="bg-[var(--color-muted)] p-8 rounded-[30px] shadow-lg hover:shadow-[0_0_20px_rgba(255,212,0,0.15)] transition-all duration-300 text-center group border border-[var(--color-secondary)]/10 hover:border-[var(--color-secondary)]/50 flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mb-6 shadow-inset group-hover:scale-110 transition-transform border border-[var(--color-secondary)]/20">
                    <IconComponent className="w-8 h-8 text-[var(--color-secondary)]" />
                  </div>
                  <h4 className="font-bold text-[var(--color-secondary)] text-lg mb-2">{policy.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed italic">{policy.desc}</p>
                  <span className="mt-4 text-[var(--color-secondary)] font-bold text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Discover More</span>
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