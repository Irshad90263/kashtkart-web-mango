import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { listCategoriesApi } from '../../api/categories';
import { listProductsApi } from '../../api/product';

const bgColors = [
  // '#FFE1E1', // Light Red/Pink
  // '#FFF1D8', // Light Peach/Orange
  // '#FFE3F3', // Light Magenta/Pink
  // '#E3F4E1', // Light Green
  // '#E2E6FF', // Light Indigo/Blue
  // '#F4E2FF', // Light Violet/Purple
  '#FFDA84',
  '#FFDA84',
  '#FFDA84',
  '#FFDA84',
  '#FFDA84',
  '#FFDA84',
];

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

      const catsWithImage = cats.map(cat => {
        const count = prods.filter(p => (p.category?._id || p.category) === cat._id).length;
        return {
          ...cat,
          image: cat.image?.url || null,
          productCount: count
        };
      });

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
      if (isHoveredRef.current) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }
      posRef.current += 0.8; // Constant speed
      const totalWidth = container.scrollWidth;
      const oneSetWidth = totalWidth / 5;

      // Reset to maintain seamless loop
      if (posRef.current >= oneSetWidth) {
        posRef.current -= oneSetWidth;
      }
      
      container.scrollLeft = posRef.current;
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [categories]);

  // Triple duplicate for seamless loop even on wide screens
  const allCats = [...categories];

  return (
    <section
      className="py-14 bg-[var(--color-secondary)]/5 overflow-hidden"
      id="our-categories"
    >
      <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 w-full">
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
          <div className="flex gap-4 md:gap-6 overflow-x-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2rem)/3)] md:w-[calc((100%-4.5rem)/4)] lg:w-[calc((100%-6rem)/5)] xl:w-[calc((100%-7.5rem)/6)] flex flex-col items-center pt-8 pb-6 px-4 rounded-2xl bg-gray-100 animate-pulse"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-gray-200 mb-5"></div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-2 no-scrollbar"
            onMouseEnter={() => { isHoveredRef.current = true; }}
            onMouseLeave={() => { isHoveredRef.current = false; }}
          >
            {allCats.map((cat, index) => {
              const originalIndex = index % categories.length;
              return (
                <div
                  key={`${cat._id}-${index}`}
                  className="flex-shrink-0 w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2rem)/3)] md:w-[calc((100%-4.5rem)/4)] lg:w-[calc((100%-6rem)/5)] xl:w-[calc((100%-7.5rem)/6)] flex flex-col items-center pt-6 pb-0 px-4 rounded-2xl cursor-pointer group transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                  style={{ backgroundColor: bgColors[originalIndex % bgColors.length] }}
                >
                  {/* Card Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center mb-5 overflow-hidden">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-500">Kashtkart</span>
                    )}
                  </div>
                  {/* Name */}
                  <h3 className="text-sm font-bold text-slate-800 text-center mb-1 group-hover:text-[var(--color-secondary)] transition-colors duration-300 w-full px-1 whitespace-normal break-words">
                    {cat.name}
                  </h3>
                  {/* Count */}
                  {/* <p className="text-xs md:text-sm font-semibold text-emerald-700 text-center">
                    {cat.productCount !== undefined ? `${cat.productCount} items` : '0 items'}
                  </p> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
});

OurCategories.displayName = 'OurCategories';
export default OurCategories;
