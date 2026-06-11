import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { listProductsApi } from '../../api/product';
import { listCategoriesApi } from '../../api/categories';

import LadduCard from '../cards/LadduCard';

const SkeletonCard = () => (
  <div className="bg-gray-200 rounded-xl animate-pulse">
    <div className="w-full aspect-square bg-gray-300 rounded-t-xl"></div>
    <div className="p-3">
      <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

const SkeletonSection = () => (
  <section className="py-12 bg-[var(--color-primary)]">
    <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 w-full">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-10"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  </section>
);

const CategoryProducts = ({ addToRefs }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [catData, prodData] = await Promise.all([listCategoriesApi(), listProductsApi()]);
      const cats = catData.categories || (Array.isArray(catData) ? catData : []);
      const prods = prodData.products || (Array.isArray(prodData) ? prodData : []);
      
      // Only keep categories that actually have products
      const catsWithProducts = cats.filter(cat =>
        prods.some(p => (p.category?._id || p.category) === cat._id)
      );
      
      // setCategories(catsWithProducts);
      setCategories(catsWithProducts.reverse());
      setProducts(prods);
    } catch (err) {
      console.error('CategoryProducts fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const sections = React.useMemo(() => {
    return categories.map((cat, idx) => {
      const catProducts = products.filter(p => (p.category?._id || p.category) === cat._id);
      return { cat, catProducts, idx };
    });
  }, [categories, products]);

  if (isLoading) return (
    <div className="bg-gray-100/50 py-12">
      <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 w-full flex flex-col gap-10">
        <div className="bg-amber-50/40 border border-amber-200/60 rounded-xl p-6 md:p-10 shadow-sm animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="flex gap-6 overflow-hidden">
            <div className="w-[300px] h-80 bg-gray-200 rounded-xl flex-shrink-0"></div>
            <div className="w-[300px] h-80 bg-gray-200 rounded-xl flex-shrink-0"></div>
            <div className="w-[300px] h-80 bg-gray-200 rounded-xl flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const getBgClass = (idx) => {
    if (idx % 2 === 1) return 'bg-[var(--color-secondary)]/5'; 
    return 'bg-[var(--color-primary)]';
  };

  return (
    <div className="bg-gray-100/50 py-12">
      <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 w-full flex flex-col gap-10">
        {sections.map(({ cat, catProducts, idx }) => {
          if (!catProducts.length) return null;
          
          return (
            <section
              key={cat._id}
              ref={addToRefs}
            className={`relative overflow-hidden py-14 transition-all duration-500 rounded-xl p-6 md:p-10 shadow-sm hover:shadow-md ${
              idx % 2 !== 0 
                ? 'bg-amber-100/70 border border-amber-300/50' 
                : 'bg-amber-50/40 border border-amber-200/60'
            }`}
            >
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                <span className="absolute top-4 -left-2 text-6xl select-none rotate-12">🥭</span>
                <span className="absolute bottom-10 -right-2 text-5xl select-none -rotate-12">🍃</span>
                <span className="absolute top-1/2 left-1/4 text-3xl select-none rotate-45 opacity-40">🌿</span>
                <span className="absolute top-1/4 right-1/4 text-4xl select-none -rotate-45 opacity-30">🥭</span>
              </div>
              {/* Category Heading */}
              <div className="mb-10 flex flex-col items-center text-center">
                {/* <div className="flex items-center gap-3 mb-3 justify-center">
                  <div className="h-[2px] w-8 bg-[var(--color-secondary)]"></div>
                  <span className="text-[var(--color-secondary)] font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                    Fresh Collection
                  </span>
                  <div className="h-[2px] w-8 bg-[var(--color-secondary)]"></div>
                </div> */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--color-text)] font-[var(--font-heading)] leading-tight">
                  {cat.name} <span className="bg-gradient-to-b from-yellow-300 via-orange-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(255,170,0,0.35)]">Special</span>
                </h2>
              </div>

              {/* Products Container */}
              <div className="relative">
                <div className="overflow-x-auto overflow-y-hidden no-scrollbar pb-2">
                  <div className="flex gap-4 md:gap-6 min-w-max">
                    {catProducts.map(item => (
                      <div
                        key={item._id}
                        className="w-[260px] sm:w-[280px] md:w-[300px] flex-shrink-0"
                      >
                        <LadduCard
                          product={{
                            id: item._id,
                            name: item.name,
                            img: item.mainImage?.url || '/src/assets/images/besan-laddu.png',
                            weightOptions: item.weightOptions,
                            discountPercent: item.discountPercent,
                            description: item.description,
                            category: item.category?.name || cat.name,
                            about: item.about,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                {catProducts.length > 4 && (
                  <div className="hidden md:flex absolute top-[-65px] right-0 gap-2">
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-white border border-amber-200/50 rounded-full shadow-sm hover:bg-[var(--color-secondary)] hover:text-white transition-all"
                      onClick={(e) => {
                        const container = e.currentTarget.closest('section').querySelector('.overflow-x-auto');
                        container.scrollBy({ left: -320, behavior: 'smooth' });
                      }}
                    >
                      ←
                    </button>
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-white border border-amber-200/50 rounded-full shadow-sm hover:bg-[var(--color-secondary)] hover:text-white transition-all"
                      onClick={(e) => {
                        const container = e.currentTarget.closest('section').querySelector('.overflow-x-auto');
                        container.scrollBy({ left: 320, behavior: 'smooth' });
                      }}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(CategoryProducts);