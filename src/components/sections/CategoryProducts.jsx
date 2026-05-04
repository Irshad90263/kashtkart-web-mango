import React, { useEffect, useState, useCallback, lazy, Suspense, memo } from 'react';
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
  <section className="py-12 px-8 md:px-24 2xl:px-32 3xl:px-48 bg-[var(--color-primary)]">
    <div className="max-w-[1600px] 3xl:max-w-[1900px] mx-auto">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-10"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  </section>
);

const CategoryProducts = memo(({ addToRefs }) => {
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

  return (
    <>
      {categories.map((cat, idx) => {
        const catProducts = products.filter(p => (p.category?._id || p.category) === cat._id);
        if (!catProducts.length) return null;
        return (
          <section
            key={cat._id}
            ref={addToRefs}
            className={`scroll-section py-12 px-8 md:px-24 2xl:px-32 3xl:px-48 ${idx % 2 === 0 ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface)]'}`}
          >
            <div className="max-w-[1600px] 3xl:max-w-[1900px] mx-auto">
              {/* Category Heading */}
              <div className="text-center mb-10">
                <h2 className="inline-block text-2xl md:text-4xl font-black text-[var(--color-dark)] font-[var(--font-heading)] pb-2 border-b-4 border-[var(--color-secondary)]">
                  {cat.name}
                </h2>
              </div>

              {/* Products */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {catProducts.map(item => (
                  <div key={item._id} className="sm:hover:-translate-y-2 transition-transform duration-300">
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
          </section>
        );
      })}
    </>
  );
});

CategoryProducts.displayName = 'CategoryProducts';
export default CategoryProducts;
