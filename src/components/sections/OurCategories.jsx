import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { listCategoriesApi } from '../../api/categories';
import { listProductsApi } from '../../api/product';

const OurCategories = memo(({ addToRefs }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);
  const animFrameRef = useRef(null);
  const posRef = useRef(0);
  const isHoveredRef = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      const [catData, prodData] = await Promise.all([listCategoriesApi(), listProductsApi()]);
      const cats = catData.categories || (Array.isArray(catData) ? catData : []);
      const prods = prodData.products || (Array.isArray(prodData) ? prodData : []);

      const catsWithImage = cats
  .map(cat => ({
    ...cat,
    image: cat.image?.url || null  // Category ki image URL direct use
  }));

      setCategories(catsWithImage);
    } catch (err) {
      console.error('OurCategories fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Smooth RAF-based infinite autoscroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || categories.length === 0) return;

    const tick = () => {
      if (!isHoveredRef.current) {
        posRef.current += 0.6;
        const half = container.scrollWidth / 2;
        if (posRef.current >= half) posRef.current -= half;
        container.scrollLeft = posRef.current;
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    const onEnter = () => { isHoveredRef.current = true; };
    const onLeave = () => { isHoveredRef.current = false; };

    // sync posRef with current scrollLeft on start
    posRef.current = container.scrollLeft;
    animFrameRef.current = requestAnimationFrame(tick);
    container.addEventListener('mouseenter', onEnter, { passive: true });
    container.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [categories]);

  // Triple duplicate for seamless loop even on wide screens
  const allCats = [...categories, ...categories, ...categories];

  return (
    <section
      ref={addToRefs}
      className="scroll-section py-14 px-2 md:px-4 2xl:px-8 3xl:px-48 bg-[var(--color-secondary)]/20 overflow-hidden"
      id="our-categories"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-8 bg-[var(--color-secondary)] opacity-60"></div>
          <span className="text-[var(--color-secondary)] font-bold uppercase tracking-[0.4em] text-xs">Browse By Type</span>
          <div className="h-[1px] w-8 bg-[var(--color-secondary)] opacity-60"></div>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-secondary)] font-[var(--font-heading)]">Our Categories</h2>
      </div>

      {/* Skeleton */}
      {isLoading ? (
        <div className="flex gap-6 overflow-x-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-6 md:gap-10 overflow-x-auto pb-2 no-scrollbar"
        >
          {allCats.map((cat, index) => (
            <div
              key={`${cat._id}-${index}`}
              className="flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer group"
            >
              {/* Circle Image */}
              <div className="w-20 h-20 md:w-24 md:h-24 2xl:w-28 2xl:h-28 rounded-full overflow-hidden border-2 border-[var(--color-secondary)]/30 group-hover:border-[var(--color-secondary)] transition-all duration-300 bg-[var(--color-primary)] flex items-center justify-center shadow-md group-hover:shadow-[0_0_16px_rgba(242,183,5,0.35)]">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-1xl">KashtKart</span>
                )}
              </div>
              {/* Name */}
              <p className="text-xs md:text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-secondary)] transition-colors duration-300 text-center max-w-[80px] md:max-w-[96px] leading-tight">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
});

OurCategories.displayName = 'OurCategories';
export default OurCategories;
