import React, { useEffect, useRef, useState, memo, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Droplets, Leaf, Heart as HeartIcon, Truck, Gift, Star, Leaf as LeafIcon, Sprout, Sun, HeartPulse, BadgeCheck, Sparkles } from 'lucide-react';
import { throttle } from '../../utils/performance';

const Footer = lazy(() => import('../../components/layout/Footer'));
const HeroSlider = lazy(() => import('../../components/Slider/HeroSlider'));
const LatestBlogs = lazy(() => import('../../components/sections/LatestBlogs'));
const FAQ = lazy(() => import('../../components/sections/FAQ'));
const CategoryProducts = lazy(() => import('../../components/sections/CategoryProducts'));
const OurCategories = lazy(() => import('../../components/sections/OurCategories'));
const AboutSection = lazy(() => import('../../components/sections/AboutSection'));
const NewArrivals = lazy(() => import('../../components/sections/NewArrivals'));
const AppSection = lazy(() => import('../../components/sections/AppSection'));
const CustomerReviews = lazy(() => import('../../components/sections/CustomerReviews'));
import Loader from '../../components/common/Loader';

import mangoTree from '../../assets/images/mango-tree-isolate-on-transparent-background-png.png';
import WhyKashtKart from '../../components/common/WhyKashtKart';


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
        <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--color-secondary)]/15">
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
        </div>
      </section>

      {/* Special About Section */}
      <Suspense fallback={<div className="h-[50vh] bg-[var(--color-surface)] animate-pulse"></div>}>
        <AboutSection />
      </Suspense>


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

      {/* New Arrivals */}
      <Suspense fallback={<div className="h-64 bg-[var(--color-primary)] animate-pulse"></div>}>
        <NewArrivals addToRefs={addToRefs} />
      </Suspense>

      {/* Why Choose KashtKart Section */}
      <section ref={addToRefs} className="scroll-section relative py-16 px-8 md:px-24 2xl:px-32 3xl:px-48 overflow-hidden" id="why-kashtkart" style={{ background: 'linear-gradient(to top, #fef08a, #ffffff)' }}>

  <div className="absolute bottom-10 left-2 opacity-40 pointer-events-none">
    <div className="text-9xl">🥭</div>
  </div>
  <div className="absolute top-4 -right-10 opacity-40 pointer-events-none">
    <div className="text-9xl rotate-12">🥭</div>
  </div>
  <div className="absolute bottom-40 left-40 opacity-40 pointer-events-none">
    <div className="text-4xl rotate-[-15deg]">🥭</div>
  </div>
  <div className="absolute top-40 right-16 opacity-40 pointer-events-none">
    <div className="text-3xl rotate-[20deg]">🥭</div>
  </div>

  <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 w-full relative z-10">

    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-12">
      <div className="md:w-1/2">
        <div className="text-left">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-[var(--color-text)] font-[var(--font-heading)] leading-tight">
            Spot The
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-[var(--color-secondary)] font-[var(--font-heading)] leading-tight mt-0">
            Goodness
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-[var(--color-secondary)] font-[var(--font-heading)] leading-tight -mt-1 ml-1 md:ml-2">
            Inside
          </div>
        </div>
      </div>
      <div className="md:w-1/2 flex flex-col items-start justify-start md:mt-8 lg:mt-12">
        <p className="text-[var(--color-text-muted)] text-sm md:text-base mb-3">
          At KashtKart, every mango tells a story of purity, passion, and perfection.
          We bring you nature's finest, straight from the heart of trusted farms.
        </p>
        <p className="text-[var(--color-text-muted)] text-sm md:text-base mb-3">
          No chemicals, no shortcuts — just authentic, sun-kissed sweetness that
          captures the true essence of farm-fresh mangoes.
        </p>
      </div>
    </div>

    <div className="md:pl-12 lg:pl-70 xl:pl-70">
      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-6 mb-4">
        <div className="group flex flex-col items-start text-left gap-2 p-4 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-500/30 hover:border-yellow-500/60 hover:-translate-y-1 transition-all duration-300 shadow-sm">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-500/30 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
            <Leaf className="w-5 h-5" />
          </div>
          <h4 className="text-yellow-700 font-semibold text-sm">Farm Fresh</h4>
          <p className="text-gray-600 text-xs leading-relaxed">Picked & packed on the same day from the orchard</p>
        </div>

        <div className="group flex flex-col items-start text-left gap-2 p-4 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-500/30 hover:border-yellow-500/60 hover:-translate-y-1 transition-all duration-300 shadow-sm">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-500/30 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
            <Sprout className="w-5 h-5" />
          </div>
          <h4 className="text-yellow-700 font-semibold text-sm">100% Organic</h4>
          <p className="text-gray-600 text-xs leading-relaxed">Grown without pesticides or chemical fertilizers</p>
        </div>

        <div className="group flex flex-col items-start text-left gap-2 p-4 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-500/30 hover:border-yellow-500/60 hover:-translate-y-1 transition-all duration-300 shadow-sm">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-500/30 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
            <Sun className="w-5 h-5" />
          </div>
          <h4 className="text-yellow-700 font-semibold text-sm">Naturally Ripened</h4>
          <p className="text-gray-600 text-xs leading-relaxed">No calcium carbide — ripened the way nature intended</p>
        </div>
      </div>

      {/* Row 2 - shifted right */}
      <div className="grid grid-cols-3 gap-6 md:ml-12 lg:ml-24 xl:ml-32">
        <div className="group flex flex-col items-start text-left gap-2 p-4 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-500/30 hover:border-yellow-500/60 hover:-translate-y-1 transition-all duration-300 shadow-sm">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-500/30 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h4 className="text-yellow-700 font-semibold text-sm">Rich in Nutrients</h4>
          <p className="text-gray-600 text-xs leading-relaxed">High in Vitamin C, A, fibre & natural antioxidants</p>
        </div>

        <div className="group flex flex-col items-start text-left gap-2 p-4 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-500/30 hover:border-yellow-500/60 hover:-translate-y-1 transition-all duration-300 shadow-sm">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-500/30 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <h4 className="text-yellow-700 font-semibold text-sm">Quality Checked</h4>
          <p className="text-gray-600 text-xs leading-relaxed">Every batch inspected before dispatch, zero compromise</p>
        </div>

        <div className="group flex flex-col items-start text-left gap-2 p-4 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-500/30 hover:border-yellow-500/60 hover:-translate-y-1 transition-all duration-300 shadow-sm">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-500/30 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="text-yellow-700 font-semibold text-sm">Farm to Home</h4>
          <p className="text-gray-600 text-xs leading-relaxed">Quick delivery ensuring maximum freshness</p>
        </div>
      </div>
    </div>

  </div>
</section>

      {/* <WhyKashtKart addToRefs={addToRefs} /> */}


      {/* Products by Category */}
      <Suspense fallback={<div className="h-40 bg-gray-100/50 rounded-xl animate-pulse mx-auto max-w-[1440px]"></div>}>
        <CategoryProducts addToRefs={addToRefs} />
      </Suspense>

      {/* app section */}
      <Suspense fallback={<div className="h-40 bg-gray-50 animate-pulse"></div>}>
        <AppSection />
      </Suspense>

      {/* customer reviews  */}
      <Suspense fallback={
        <section className="py-12 px-8 md:px-24 2xl:px-32 bg-[var(--color-primary)]">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>)}
          </div>
        </section>
      }>
        <CustomerReviews addToRefs={addToRefs} />
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

        <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 w-full relative z-10 text-center">
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

      {/* Latest Blogs */}
      <Suspense fallback={<div className="h-64 bg-[var(--color-surface)] animate-pulse"></div>}>
        <LatestBlogs addToRefs={addToRefs} />
      </Suspense>
      
      {/* Our Priorities */}
      <section className="relative py-16 px-8 md:px-24 2xl:px-32 3xl:px-48 overflow-hidden" id="priorities" style={{ background: 'linear-gradient(to bottom, #ffffff, #fef08a)' }}>

        {/* Decorative Mango Elements - Same as Why Choose Us */}
        <div className="absolute bottom-10 right-2 opacity-30 pointer-events-none">
          <div className="text-8xl rotate-12">🥭</div>
        </div>
        <div className="absolute top-4 -left-10 opacity-30 pointer-events-none">
          <div className="text-8xl -rotate-12">🥭</div>
        </div>
        <div className="absolute bottom-40 right-40 opacity-30 pointer-events-none">
          <div className="text-4xl rotate-[15deg]">🥭</div>
        </div>
        <div className="absolute top-40 left-16 opacity-30 pointer-events-none">
          <div className="text-3xl -rotate-[20deg]">🥭</div>
        </div>

        <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 w-full relative z-10">

          {/* Header Section - Matching Why Choose Us style */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[var(--color-secondary)] font-semibold uppercase tracking-wide text-sm">What We Believe</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--color-text)] font-[var(--font-heading)] leading-tight text-center">
              Our <span className="text-[var(--color-secondary)] inline-block">Priorities</span>
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 text-center max-w-2xl">
              We believe in delivering nothing but the best. Here's what matters most to us.
            </p>
          </div>

          {/* Cards Section - Fixed to 4 columns on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
            {[
              { icon: <Shield className="w-5 h-5" />, title: 'Health First', desc: 'No artificial preservatives, colors, or flavors. Pure and natural ingredients only.' },
              { icon: <Droplets className="w-5 h-5" />, title: 'Hygiene Standards', desc: 'FSSAI certified kitchen with strict hygiene protocols and regular quality checks.' },
              { icon: <Leaf className="w-5 h-5" />, title: 'Fresh Daily', desc: 'Made fresh every day and delivered within 3 to 7 days to ensure maximum freshness.' },
              { icon: <HeartIcon className="w-5 h-5" />, title: 'Made with Love', desc: "Every Mango is handcrafted with care, carrying forward our family's century-old tradition." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="group flex flex-col items-start text-left gap-2 p-4 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-500/30 hover:border-yellow-500/60 hover:-translate-y-1 transition-all duration-300 shadow-sm w-full max-w-[320px] h-full">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-500/30 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                  {icon}
                </div>
                <h4 className="text-yellow-700 font-semibold text-sm">{title}</h4>
                <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
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
