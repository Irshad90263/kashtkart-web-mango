import React, { useEffect, useRef, useState, memo, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Droplets, Leaf, Heart as HeartIcon, Truck, Gift, Star, Leaf as LeafIcon, Sprout, Sun, HeartPulse, BadgeCheck } from 'lucide-react';
import { throttle } from '../../utils/performance';

const Footer = lazy(() => import('../../components/layout/Footer'));
const HeroSlider = lazy(() => import('../../components/Slider/HeroSlider'));
const LatestBlogs = lazy(() => import('../../components/sections/LatestBlogs'));
const FAQ = lazy(() => import('../../components/sections/FAQ'));
const CategoryProducts = lazy(() => import('../../components/sections/CategoryProducts'));
const OurCategories = lazy(() => import('../../components/sections/OurCategories'));
import Loader from '../../components/common/Loader';

import mangoTree from '../../assets/images/mango-tree-isolate-on-transparent-background-png.png';
import mangoAlphonso from '../../assets/images/pngtree-background-alphonso-mango-png-image_16550748.png';
import mangoFresh from '../../assets/images/urunler_meyveler_mango.png';

const SKSBrand = () => (
  <span className="font-[var(--font-accent)] text-[var(--color-secondary)] font-black tracking-tighter inline-flex items-center">
    KashtKart<span className="text-[10px] align-top ml-0.5 opacity-70">®</span>
  </span>
);

const Home = memo(() => {
  const sectionRefs = useRef([]);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      throttle((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, 100),
      { threshold: 0.1, rootMargin: '50px 0px' }
    );
    sectionRefs.current.forEach((ref) => {
      if (ref) observerRef.current.observe(ref);
    });
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
      if (observerRef.current) observerRef.current.observe(el);
    }
  };

  return (
    <div className="bg-[var(--color-primary)] text-[var(--color-text)] font-[var(--font-body)] overflow-x-hidden mt-20 md:mt-24">

      {/* Hero Slider */}
      <Suspense fallback={
        <div className="h-[50vh] md:h-[80vh] bg-[var(--color-muted)] flex items-center justify-center">
          <Loader text="Preparing Sweetness..." />
        </div>
      }>
        <HeroSlider />
      </Suspense>

      {/* Features Strip */}
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-secondary)]/15">
        <div className="max-w-[1600px] 3xl:max-w-[1900px] mx-auto grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--color-secondary)]/15">
          {[
            { icon: <Truck className="w-6 h-6" />, title: 'Home Delivery', desc: 'Fresh mangoes delivered right to your doorstep, anywhere in India' },
            { icon: <Gift className="w-6 h-6" />, title: 'Free Shipping', desc: 'Enjoy free delivery on every order, no minimum required' },
            { icon: <Star className="w-6 h-6" />, title: 'Premium Quality', desc: 'Handpicked Alfonso & Kesar mangoes, fresh from the farm' },
            { icon: <LeafIcon className="w-6 h-6" />, title: '100% Organic', desc: 'Naturally grown, chemical-free mangoes for your family' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 px-6 py-5 md:px-8 md:py-8 2xl:px-12 2xl:py-10">
              <span className="text-[var(--color-secondary)] flex-shrink-0">{icon}</span>
              <div>
                <p className="text-[var(--color-text)] font-bold text-sm md:text-base mb-0.5">{title}</p>
                <p className="text-[var(--color-text-muted)] text-xs md:text-sm leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Mango Section */}
      <section className="bg-[var(--color-primary)] py-16 px-8 md:px-24 2xl:px-32 3xl:px-48">
        <div className="max-w-[1600px] 3xl:max-w-[1900px] mx-auto grid md:grid-cols-2 gap-12 items-stretch">
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
            <ul className="space-y-3">
              {[
                'Handpicked at peak ripeness from certified organic farms',
                'No artificial ripening agents or chemical sprays used',
                'Rich in Vitamin C, antioxidants & natural sugars',
                'Sourced from Alphonso, Kesar & Dasheri varieties',
                'Delivered fresh within 24–48 hours of harvest',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-[var(--color-text)] text-sm md:text-base">
                  <span className="mt-1 w-2 h-2 rounded-full bg-[var(--color-secondary)] flex-shrink-0"></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex items-stretch">
            <img src={mangoTree} alt="Fresh Mango Tree" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section ref={addToRefs} className="scroll-section bg-[var(--color-surface)] py-14 px-8 md:px-24 2xl:px-32 3xl:px-48 relative z-20 overflow-hidden mb-2" id="about">
        <div className="max-w-[1600px] 3xl:max-w-[1900px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-text)] font-[var(--font-heading)] leading-tight">
              Legacy of {SKSBrand()}
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
                "From the orchards of India to your home — KashtKart was born to bring the purest, freshest mangoes directly to your table."
              </p>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                KashtKart started with a simple belief — every family deserves farm-fresh mangoes without compromise. We work directly with farmers across Ratnagiri, Valsad, and Lucknow to source the finest Alphonso, Kesar, and Dasheri mangoes, cutting out middlemen and ensuring full freshness.
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
      </section>

      {/* Why Choose KashtKart Section */}
      <section ref={addToRefs} className="scroll-section bg-[var(--color-primary)] py-16 px-8 md:px-24 2xl:px-32 3xl:px-48 overflow-hidden relative" id="why-kashtkart">
        <span className="absolute -top-3 -left-3 text-8xl select-none rotate-[-15deg]">🥭</span>
        <span className="absolute top-8 left-24 text-6xl select-none rotate-[25deg]">🌿</span>
        <span className="absolute top-2 left-48 text-5xl select-none rotate-[-12deg]">🍃</span>
        <span className="absolute -bottom-3 -right-3 text-8xl select-none rotate-[15deg]">🥭</span>
        <span className="absolute bottom-8 right-24 text-6xl select-none rotate-[-25deg]">🌿</span>
        <span className="absolute bottom-2 right-48 text-5xl select-none rotate-[12deg]">🍃</span>
        <span className="absolute top-1/4 -left-2 text-5xl select-none rotate-[35deg]">🍃</span>
        <span className="absolute top-3/4 -left-2 text-5xl select-none rotate-[-25deg]">🌿</span>
        <span className="absolute top-1/4 -right-2 text-5xl select-none rotate-[-35deg]">🍃</span>
        <span className="absolute top-3/4 -right-2 text-5xl select-none rotate-[25deg]">🌿</span>

        <div className="max-w-[1600px] 3xl:max-w-[1900px] mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-[var(--color-secondary)] opacity-60"></div>
              <span className="text-[var(--color-secondary)] font-bold uppercase tracking-[0.4em] text-xs">Why Choose Us</span>
              <div className="h-[1px] w-8 bg-[var(--color-secondary)] opacity-60"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-text)] font-[var(--font-heading)] leading-tight">
              Why Choose <span className="text-[var(--color-secondary)]">{SKSBrand()}</span> Mango Online Store
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
            <div className="flex flex-col gap-5 px-4">
              <p className="text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed">
                KashtKart is not just a mango store — it's a true farm-to-home experience built on trust, quality, and authenticity. In a market where most mangoes are cold-stored for weeks or artificially ripened using harmful chemicals, we choose a path that stays true to nature.
              </p>
              <p className="text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed">
                Our mangoes are sourced directly from trusted farmers and orchards, ensuring complete transparency and freshness. By eliminating middlemen, we not only support farmers better but also deliver mangoes that retain their original taste, texture, and nutritional value.
              </p>
              <p className="text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed">
                Each fruit is handpicked at the right stage of maturity and allowed to ripen naturally, without the use of calcium carbide or any artificial agents. This careful process results in mangoes that are juicier, more flavorful, and rich in natural aroma — just like they are meant to be.
              </p>
              <p className="text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed">
                We also focus on quick and careful delivery, ensuring that your mangoes reach you in perfect condition, fresh from the farm. Every box is packed with attention to detail so that you experience the same quality at home as you would in an orchard. With KashtKart, you're not just buying mangoes — you're choosing purity, freshness, authenticity, and a connection to real farms in every bite.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {[
              { icon: <Leaf className="w-6 h-6" />, title: 'Farm Fresh', desc: 'Picked & packed on the same day from the orchard' },
              { icon: <Sprout className="w-6 h-6" />, title: '100% Organic', desc: 'Grown without pesticides or chemical fertilizers' },
              { icon: <Sun className="w-6 h-6" />, title: 'Naturally Ripened', desc: 'No calcium carbide — ripened the way nature intended' },
              { icon: <HeartPulse className="w-6 h-6" />, title: 'Rich in Nutrients', desc: 'High in Vitamin C, A, fibre & natural antioxidants' },
              { icon: <BadgeCheck className="w-6 h-6" />, title: 'Quality Checked', desc: 'Every batch inspected before dispatch, zero compromise' },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-[var(--color-secondary)]/20 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-md hover:from-[var(--color-secondary)]/10 hover:to-transparent hover:border-[var(--color-secondary)]/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] group-hover:bg-[var(--color-secondary)] group-hover:text-[var(--color-dark)] transition-all duration-300">
                  {icon}
                </div>
                <h4 className="text-[var(--color-secondary)] font-semibold text-sm tracking-wide">{title}</h4>
                <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Categories */}
      <Suspense fallback={
        <section className="py-14 px-8 md:px-24 2xl:px-32 3xl:px-48 bg-[var(--color-surface)]">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-10"></div>
          <div className="flex gap-8 overflow-x-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </section>
      }>
        <OurCategories addToRefs={addToRefs} />
      </Suspense>

      {/* Products by Category */}
      <Suspense fallback={
        <section className="py-12 px-8 md:px-24 2xl:px-32 bg-[var(--color-primary)]">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>)}
          </div>
        </section>
      }>
        <CategoryProducts addToRefs={addToRefs} />
      </Suspense>

      {/* Latest Blogs */}
      <Suspense fallback={<div className="h-64 bg-[var(--color-surface)] animate-pulse"></div>}>
        <LatestBlogs addToRefs={addToRefs} />
      </Suspense>

      {/* Cities We Serve */}
      <section ref={addToRefs} className="scroll-section relative bg-yellow-100 py-16 px-8 md:px-24 2xl:px-32 3xl:px-48 overflow-hidden" id="cities">
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

        <div className="max-w-3xl 2xl:max-w-5xl 3xl:max-w-6xl mx-auto relative z-10 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-[var(--color-secondary)] opacity-60"></div>
            <span className="text-[var(--color-secondary)] font-bold uppercase tracking-[0.4em] text-xs">Pan India Delivery</span>
            <div className="h-[1px] w-8 bg-[var(--color-secondary)] opacity-60"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[var(--color-text)] font-[var(--font-heading)] mb-2">
            100+ Cities We Serve
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm mb-8">All over India — fresh mangoes at your door, wherever you are.</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
            {[
              'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj',
              'Mathura', 'Bareilly', 'Gorakhpur', 'Meerut', 'Aligarh',
              'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune',
            ].map((city) => (
              <span key={city} className="px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-[var(--color-secondary)]/25 text-[var(--color-text)] text-xs md:text-sm font-medium bg-[var(--color-surface)] hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] transition-colors duration-200">
                {city}
              </span>
            ))}
          </div>
          <Link to="/laddus" className="inline-block mt-2 px-8 py-3 bg-[var(--color-secondary)] text-[var(--color-primary)] font-bold text-sm md:text-base rounded-full hover:brightness-110 transition-all duration-200 shadow-lg">
            Order Now
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <Suspense fallback={<div className="h-64 bg-[var(--color-surface)] animate-pulse"></div>}>
        <FAQ addToRefs={addToRefs} />
      </Suspense>

      {/* Our Priorities */}
      <section ref={addToRefs} className="scroll-section py-10 px-8 md:px-24 2xl:px-32 3xl:px-48 bg-[var(--color-accent)]/10 relative z-10 shadow-sm mb-2" id="priorities">
        <h2 className="text-4xl text-[var(--color-secondary)] mb-16 font-bold text-center">Our Priorities</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1600px] 3xl:max-w-[1900px] mx-auto">
          {[
            { color: 'bg-green-500', icon: <Shield className="w-8 h-8 text-white" />, title: 'Health First', desc: 'No artificial preservatives, colors, or flavors. Pure and natural ingredients only.' },
            { color: 'bg-blue-500', icon: <Droplets className="w-8 h-8 text-white" />, title: 'Hygiene Standards', desc: 'FSSAI certified kitchen with strict hygiene protocols and regular quality checks.' },
            { color: 'bg-yellow-500', icon: <Leaf className="w-8 h-8 text-white" />, title: 'Fresh Daily', desc: 'Made fresh every day and delivered within 3 to 7 days to ensure maximum freshness.' },
            { color: 'bg-purple-500', icon: <HeartIcon className="w-8 h-8 text-white" />, title: 'Made with Love', desc: "Every Mango is handcrafted with care, carrying forward our family's century-old tradition." },
          ].map(({ color, icon, title, desc }) => (
            <div key={title} className="text-center p-6 bg-[var(--color-muted)] rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4`}>{icon}</div>
              <h3 className="text-lg font-bold text-[var(--color-secondary)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--color-text)]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Suspense fallback={<div className="h-64 bg-[var(--color-surface)] animate-pulse border-t border-[var(--color-secondary)]/10"></div>}>
        <Footer />
      </Suspense>
    </div>
  );
});

Home.displayName = 'Home';
export default Home;
