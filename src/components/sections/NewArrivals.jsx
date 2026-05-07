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
      <div className="h-8 bg-gray-300 rounded mt-2 w-full"></div>
    </div>
  </div>
);

const NewArrivals = ({ addToRefs }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [catData, prodData] = await Promise.all([listCategoriesApi(), listProductsApi()]);
      const ObjectCats = catData.categories || (Array.isArray(catData) ? catData : []);
      const ObjectProds = prodData.products || (Array.isArray(prodData) ? prodData : []);

      const selectedProducts = [];

      // Select the first product from each available category
      ObjectCats.forEach(cat => {
        const productForCat = ObjectProds.find(p => (p.category?._id || p.category) === cat._id);
        if (productForCat) {
          selectedProducts.push(productForCat);
        }
      });

      setProducts(selectedProducts);
    } catch (err) {
      console.error("Error fetching new arrivals:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <section className="py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 bg-[var(--color-primary)]">
      <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 w-full relative z-10">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-10"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section
      ref={addToRefs}
      className="scroll-section py-12 sm:py-14 md:py-8 bg-[var(--color-primary)] relative overflow-hidden"
      id="new-arrivals"
    >
      <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 w-full relative z-10">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="h-[1px] w-8 sm:w-10 md:w-12 bg-[var(--color-secondary)] opacity-60"></div>
            <span className="text-[var(--color-secondary)] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs">
              Fresh Picks
            </span>
            <div className="h-[1px] w-8 sm:w-10 md:w-12 bg-[var(--color-secondary)] opacity-60"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[var(--color-text)] font-[var(--font-heading)]">
            New Arrivals
          </h2>
        </div>

        {/* Products Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4 md:gap-5 lg:gap-6 px-6 sm:px-0 max-w-[320px] sm:max-w-none mx-auto">
          {products.map((product) => (
            <Suspense key={product._id} fallback={<SkeletonCard />}>
              <LadduCard
                product={{
                  id: product._id,
                  name: product.name,
                  img: product.mainImage?.url || '/src/assets/images/besan-laddu.png',
                  price: product.price,
                  finalPrice: product.finalPrice,
                  discountPercent: product.discountPercent,
                  priceStr: `₹${product.finalPrice} / kg`,
                  description: product.description,
                  category: product.category?.name,
                }}
              />
            </Suspense>
          ))}
        </div>

      </div>
    </section>
  );
};

export default NewArrivals;