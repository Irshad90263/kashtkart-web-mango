import React, { useState, useEffect, useRef, useTransition } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Truck, Package, Heart, Clock, Sparkles } from 'lucide-react';
import LadduCard from '../../components/cards/LadduCard';
import Footer from '../../components/layout/Footer';
import besanLaddu from '../../assets/images/besan-laddu.png';

import { listCategoriesApi } from '../../api/categories';
import { listProductsApi, listProductsByCategoryApi } from '../../api/product';

const Laddus = () => {
  const [activeCategory, setActiveCategory] = useState({ name: 'All', id: 'all' });
  const [categories, setCategories] = useState([{ name: 'All', id: 'all' }]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const location = useLocation();

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await listCategoriesApi();
        setCategories([{ name: 'All', id: 'all' }, ...data.categories.map(c => ({ ...c, id: c._id || c.id }))]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Listen to location state changes
  useEffect(() => {
    if (location.state?.categoryId && categories.length > 1) {
      const targetCat = categories.find(c => c.id === location.state.categoryId);
      if (targetCat && targetCat.id !== activeCategory.id) {
        setActiveCategory(targetCat);
      }
    }
  }, [location.state, categories]);

  // Fetch products when activeCategory changes - with smooth transition
  useEffect(() => {
    startTransition(async () => {
      setLoading(true);
      try {
        let data;
        if (activeCategory.id === 'all') {
          data = await listProductsApi();
          setProducts(data.products || (Array.isArray(data) ? data : []));
        } else {
          data = await listProductsByCategoryApi(activeCategory.id);
          setProducts(data.products || (Array.isArray(data) ? data : []));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    });
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    if (category.id === activeCategory.id) return;
    setActiveCategory(category);
  };

  return (
    <div className="bg-[var(--color-primary)] text-[var(--color-text)] font-[var(--font-body)] min-h-screen overflow-x-hidden -mt-4">
      {/* Header with Yellow Overlay */}
      <section className="relative py-10 md:py-12 px-8 text-center rounded-b-[40px] md:rounded-b-[50px] overflow-hidden mb-12">

        {/* Yellow Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 via-amber-400/10 to-transparent"></div>

        {/* Original Gradient Background */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(158, 133, 8, 0.92)_0%,transparent_70%)]"></div>

        {/* Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="laddus-bubble laddus-bubble-1"></div>
          <div className="laddus-bubble laddus-bubble-2"></div>
          <div className="laddus-bubble laddus-bubble-3"></div>
          <div className="laddus-bubble laddus-bubble-4"></div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            .laddus-bubble {
              position: absolute;
              background: rgba(255, 212, 0, 0.15);
              border-radius: 50%;
              animation: float-laddus-bubble 20s infinite ease-in-out;
            }
            .laddus-bubble-1 { width: 110px; height: 110px; left: 15%; top: 25%; animation-delay: 0s; }
            .laddus-bubble-2 { width: 140px; height: 140px; right: 20%; top: 15%; animation-delay: 4s; }
            .laddus-bubble-3 { width: 95px; height: 95px; left: 60%; bottom: 25%; animation-delay: 2s; }
            .laddus-bubble-4 { width: 120px; height: 120px; right: 50%; bottom: 20%; animation-delay: 6s; }
            @keyframes float-laddus-bubble {
              0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
              50% { transform: translate(25px, -35px) scale(1.08); opacity: 0.6; }
            }
          `
        }} />

        <h1 className="text-3xl md:text-7xl font-bold mb-4 relative z-10 text-[var(--color-secondary)] font-[var(--font-heading)]">
          Our Mango Gallery
        </h1>
        <p className="text-base md:text-xl italic opacity-90 max-w-2xl mx-auto relative z-10 text-[var(--color-text-muted)]">
          Explore our diverse collection of authentic KashtKart, handcrafted for every palate and occasion.
        </p>
      </section>

      {/* Main Section */}
      <section className="px-4 md:px-12 mb-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="hidden md:block col-span-2">
            <div className="bg-[var(--color-surface)] border border-[var(--color-secondary)]/20 rounded-xl p-4">
              <h3 className="text-base font-bold mb-4 text-[var(--color-secondary)] uppercase text-center">
                Categories
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${activeCategory.id === cat.id
                      ? 'bg-[var(--color-secondary)] text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-secondary)]/10'
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="col-span-12 md:col-span-10">
            {/* Mobile Dropdown */}
            <div className="md:hidden mb-4">
              <select
                value={activeCategory.id}
                onChange={(e) => handleCategoryChange(categories.find(c => c.id === e.target.value))}
                className="w-full p-3 border rounded-lg transition-all duration-200"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Loading Skeleton with fade animation */}
            {(loading || isPending) ? (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-gray-200 animate-pulse rounded-xl">
                      <div className="w-full aspect-square bg-gray-300 rounded-t-xl"></div>
                      <div className="p-3">
                        <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {products.map((laddu) => (
                    <LadduCard
                      key={laddu._id}
                      product={{
                        id: laddu._id,
                        name: laddu.name,
                        img: laddu.mainImage?.url || besanLaddu,
                        price: laddu.price,
                        finalPrice: laddu.finalPrice,
                        discountPercent: laddu.discountPercent,
                        description: laddu.description,
                        category: laddu.category?.name || 'Special'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="relative mx-6 md:mx-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-secondary)]/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-secondary)]/5 rounded-full -ml-32 -mb-32"></div>

        <div className="relative z-10 p-8 md:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] font-[var(--font-heading)]">
              The KashtKart Quality Promise
            </h2>
            <p className="text-[var(--color-text-muted)] text-base mt-3 max-w-2xl mx-auto">
              We ensure that every mango you receive meets the highest standards of quality, freshness, and taste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-[var(--color-secondary)]/70 hover:border-[var(--color-secondary)] hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--color-secondary)] group-hover:scale-110 transition-all duration-300">
                <Shield className="w-8 h-8 text-[var(--color-secondary)] group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-bold text-lg text-[var(--color-text)] mb-2">Hygienically Packed</h4>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Double-sealed airtight containers to maintain freshness and purity.
              </p>
            </div>

            <div className="group text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-[var(--color-secondary)]/70 hover:border-[var(--color-secondary)] hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--color-secondary)] group-hover:scale-110 transition-all duration-300">
                <Truck className="w-8 h-8 text-[var(--color-secondary)] group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-bold text-lg text-[var(--color-text)] mb-2">Pan-India Shipping</h4>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Fast delivery to any corner of India within 3-5 business days.
              </p>
            </div>

            <div className="group text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-[var(--color-secondary)]/70 hover:border-[var(--color-secondary)] hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--color-secondary)] group-hover:scale-110 transition-all duration-300">
                <Heart className="w-8 h-8 text-[var(--color-secondary)] group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-bold text-lg text-[var(--color-text)] mb-2">Made with Love</h4>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Every mango is handpicked with care from our trusted orchards.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--color-secondary)]/10 text-center">
            <p className="text-[var(--color-text-muted)] text-sm flex items-center justify-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Freshly Picked</span>
              <span className="w-1 h-1 bg-[var(--color-secondary)]/30 rounded-full"></span>
              <span className="inline-flex items-center gap-1">Naturally Ripened</span>
              <span className="w-1 h-1 bg-[var(--color-secondary)]/30 rounded-full"></span>
              <span className="inline-flex items-center gap-1">100% Chemical Free</span>
            </p>
          </div>
        </div>
      </section>

      <div className="mt-16">
        <Footer />
      </div>

      {/* Add fade-in animation CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `
      }} />
    </div>
  );
};

export default Laddus;