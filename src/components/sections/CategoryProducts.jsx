import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { listProductsApi } from '../../api/product';
import { listCategoriesApi } from '../../api/categories';

const LadduCard = lazy(() => import('../cards/LadduCard'));

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
  <section className="py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 bg-[var(--color-primary)]">
    <div className="max-w-[1600px] 3xl:max-w-[1900px] mx-auto">
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
      const catsWithProducts = cats.filter(cat =>
        prods.some(p => (p.category?._id || p.category) === cat._id)
      );
      setCategories(catsWithProducts);
      setProducts(prods);
    } catch (err) {
      console.error('CategoryProducts fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (isLoading) return (
    <>
      <SkeletonSection />
      <SkeletonSection />
    </>
  );

  // Function to get background class based on index
  const getBgClass = (idx) => {
    if (idx === 0) return 'bg-[var(--color-primary)]'; // First section - White
    if (idx % 2 === 1) return 'bg-[var(--color-secondary)]/15'; // Second, fourth, sixth - Light yellow (5% opacity)
    return 'bg-[var(--color-primary)]'; // Third, fifth, seventh - White
  };

  return (
    <>
      {categories.map((cat, idx) => {
        const catProducts = products.filter(p => (p.category?._id || p.category) === cat._id);
        if (!catProducts.length) return null;
        return (
          <section
            key={cat._id}
            ref={addToRefs}
            className={`scroll-section pt-4 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 transition-all duration-300 ${getBgClass(idx)}`}
          >
            <div className="max-w-[1600px] 3xl:max-w-[1900px] mx-auto">
              {/* Category Heading */}
              <div className="text-left mb-4">
                <h2 className="inline-block text-2xl md:text-4xl font-black text-[var(--color-dark)] font-[var(--font-heading)] pb-2 border-b-4 border-[var(--color-secondary)]">
                  {cat.name}
                </h2>
              </div>

              {/* Products - Horizontal Scrollable Container */}
              <div className="relative pl-8">
                <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pb-4">
                  <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 min-w-max">
                    {catProducts.map(item => (
                      <div
                        key={item._id}
                        className="w-[260px] sm:w-[280px] md:w[280px] lg:w-[300px] flex-shrink-0 sm:hover:-translate-y-2 transition-transform duration-300"
                      >
                        <Suspense fallback={<div className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>}>
                          <LadduCard
                            product={{
                              id: item._id,
                              name: item.name,
                              img: item.mainImage?.url || '/src/assets/images/besan-laddu.png',
                              price: item.price,
                              finalPrice: item.finalPrice,
                              discountPercent: item.discountPercent,
                              priceStr: `₹${item.finalPrice} / kg`,
                              description: item.description,
                              category: item.category?.name || cat.name,
                            }}
                          />
                        </Suspense>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scroll Buttons - Hide on mobile, show on desktop when needed */}
                {catProducts.length > 4 && (
                  <>
                    <button
                      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10 transition-all hover:scale-110"
                      onClick={(e) => {
                        const container = e.currentTarget.parentElement.querySelector('.overflow-x-auto');
                        container.scrollBy({ left: -280, behavior: 'smooth' });
                      }}
                    >
                      ←
                    </button>
                    <button
                      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10 transition-all hover:scale-110"
                      onClick={(e) => {
                        const container = e.currentTarget.parentElement.querySelector('.overflow-x-auto');
                        container.scrollBy({ left: 280, behavior: 'smooth' });
                      }}
                    >
                      →
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};

export default React.memo(CategoryProducts);