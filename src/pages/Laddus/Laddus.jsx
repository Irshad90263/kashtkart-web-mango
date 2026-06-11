import React, { useState, useEffect, useRef, useTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Shield,
  Truck,
  Package,
  Heart,
  Clock,
  Sparkles,
  Filter,
  X,
} from "lucide-react";
import LadduCard from "../../components/cards/LadduCard";
import Footer from "../../components/layout/Footer";

import { listCategoriesApi, listVarietiesApi } from "../../api/categories";
import { listProductsApi, listProductsByCategoryApi } from "../../api/product";

const Laddus = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize selectedCategory directly from navigation state to avoid race condition
  const initialCategoryId =
    location.state?.categoryId && location.state.categoryId !== "all"
      ? location.state.categoryId
      : null;

  const [selectedVarieties, setSelectedVarieties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [categoriesList, setCategoriesList] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [sortBy, setSortBy] = useState("");

  // location.state change hone par bhi category filter update ho
  // (same page par navbar dropdown se category click karne par bhi kaam kare)
  useEffect(() => {
    const catId = location.state?.categoryId;
    if (catId && catId !== "all") {
      setSelectedCategory(catId);
      setSelectedVarieties([]); // pehle wale variety filters clear karo
    } else if (catId === "all") {
      setSelectedCategory(null);
      setSelectedVarieties([]);
    }
    // State clear karo taaki back/forward navigation re-apply na kare
    if (location.state?.categoryId) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.categoryId]);

  // Mobile filter modal states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [mobileSelectedTab, setMobileSelectedTab] = useState("varieties");
  const [tempSelectedVarieties, setTempSelectedVarieties] = useState([]);
  const [tempSelectedCategory, setTempSelectedCategory] = useState(null);
  const [tempSortBy, setTempSortBy] = useState("");

  // Products section end detect
  const productsEndRef = useRef(null);
  const [isProductsEndReached, setIsProductsEndReached] = useState(false);

  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedVarieties([]);
    setSelectedCategory(null);
    setSortBy("");
  };

  // Fetch varieties and categories on mount
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [varData, catData] = await Promise.all([
          listVarietiesApi(),
          listCategoriesApi(),
        ]);
        setVarieties(
          (varData.varieties || varData.categories || []).map((v) => ({
            ...v,
            id: v._id || v.id,
          })),
        );
        setCategoriesList(
          (catData.categories || catData || []).map((c) => ({
            ...c,
            id: c._id || c.id,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch filters data:", error);
      }
    };
    fetchFiltersData();
  }, []);

  // Detect when products section end is reached
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsProductsEndReached(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" },
    );

    if (productsEndRef.current) {
      observer.observe(productsEndRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Filter varieties by selectedCategory / tempSelectedCategory
  const displayedVarieties = React.useMemo(() => {
    if (!selectedCategory) return varieties;
    return varieties.filter((v) => {
      if (Array.isArray(v.category)) {
        return v.category.some(
          (c) => (c?._id || c || "").toString() === selectedCategory.toString()
        );
      }
      return (v.category?._id || v.category || "").toString() === selectedCategory.toString();
    });
  }, [varieties, selectedCategory]);

  const tempDisplayedVarieties = React.useMemo(() => {
    if (!tempSelectedCategory) return varieties;
    return varieties.filter((v) => {
      if (Array.isArray(v.category)) {
        return v.category.some(
          (c) => (c?._id || c || "").toString() === tempSelectedCategory.toString()
        );
      }
      return (v.category?._id || v.category || "").toString() === tempSelectedCategory.toString();
    });
  }, [varieties, tempSelectedCategory]);

  // Handle variety checkbox change
  const handleVarietyToggle = (varietyId) => {
    setSelectedVarieties((prev) => {
      if (prev.includes(varietyId)) {
        return prev.filter((id) => id !== varietyId);
      } else {
        return [...prev, varietyId];
      }
    });
  };

  // Fetch products with filters - uses AbortController to cancel stale requests
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data;

        if (selectedVarieties.length > 0) {
          const varietyIds = selectedVarieties.join(",");
          data = await listProductsByCategoryApi(varietyIds, sortBy);
        } else if (selectedCategory) {
          data = await listProductsByCategoryApi(selectedCategory, sortBy);
        } else {
          data = await listProductsApi(sortBy);
        }

        if (!cancelled) {
          setProducts(data.products || (Array.isArray(data) ? data : []));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch products:", error);
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Cleanup: mark previous fetch as cancelled when filters change
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedCategory, selectedVarieties, sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Mobile filter handlers
  const openFilterModal = () => {
    setTempSelectedVarieties([...selectedVarieties]);
    setTempSelectedCategory(selectedCategory);
    setTempSortBy(sortBy);
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const applyFilters = () => {
    setSelectedVarieties(tempSelectedVarieties);
    setSelectedCategory(tempSelectedCategory);
    setSortBy(tempSortBy);
    setIsFilterModalOpen(false);
  };

  const handleTempVarietyToggle = (varietyId) => {
    setTempSelectedVarieties((prev) => {
      if (prev.includes(varietyId)) {
        return prev.filter((id) => id !== varietyId);
      } else {
        return [...prev, varietyId];
      }
    });
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
    setSelectedVarieties([]);
  };

  const handleClearTempCategory = () => {
    setTempSelectedCategory(null);
    setTempSelectedVarieties([]);
  };

  const activeCategoryName =
    categoriesList.find((c) => c.id === selectedCategory)?.name ||
    "Selected Category";
  
const activeCategorydesc = categoriesList.find((c) => c.id === selectedCategory)?.description || null;
// console.log(activeCategorydesc)

  return (
    <div className="bg-[var(--color-primary)] text-[var(--color-text)] font-[var(--font-body)] min-h-screen">
      {/* Header Section */}
      <section className="relative py-10 md:py-12 px-8 text-center rounded-b-[40px] md:rounded-b-[50px] overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 via-amber-400/10 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(158, 133, 8, 0.92)_0%,transparent_70%)]"></div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="laddus-bubble laddus-bubble-1"></div>
          <div className="laddus-bubble laddus-bubble-2"></div>
          <div className="laddus-bubble laddus-bubble-3"></div>
          <div className="laddus-bubble laddus-bubble-4"></div>
        </div>

        <style
          dangerouslySetInnerHTML={{
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
          `,
          }}
        />

        <h1 className="text-3xl md:text-7xl font-bold mb-4 relative z-10 text-[var(--color-secondary)] font-[var(--font-heading)]">
          {activeCategorydesc ? activeCategorydesc : "Our Mango Gallery"}
        </h1>
        <p className="text-base md:text-xl italic opacity-90 max-w-2xl mx-auto relative z-10 text-[var(--color-text-muted)]">
          Explore our diverse collection of authentic KaashtKart, handcrafted
          for every palate and occasion.
        </p>
      </section>

      {/* Main Section */}
      <section className="px-4 md:px-12 mb-4 pb-10">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Desktop only */}
          <div className="hidden md:block col-span-3">
            <div className="sticky top-[120px] self-start space-y-4 z-10">

              {/* ── Category Section ── */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-secondary)]/20 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-bold text-[var(--color-secondary)] uppercase">Category</h3>
                  {selectedCategory && (
                    <button onClick={handleClearCategory} className="text-xs text-red-500 hover:underline font-semibold">
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto">
                  {categoriesList.map((cat) => (
                    <label
                      key={cat.id || cat._id}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all ${
                        selectedCategory === (cat.id || cat._id)
                          ? "bg-[var(--color-secondary)]/15 font-semibold"
                          : "hover:bg-[var(--color-secondary)]/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === (cat.id || cat._id)}
                        onChange={() => {
                          setSelectedCategory(cat.id || cat._id);
                          setSelectedVarieties([]);
                        }}
                        className="w-4 h-4 text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]"
                      />
                      <span className="text-sm text-[var(--color-text-muted)]">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Varieties Section ── */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-secondary)]/20 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-[var(--color-secondary)] uppercase">
                    Varieties
                  </h3>
                  {(selectedVarieties.length > 0 || selectedCategory || sortBy) && (
                    <button onClick={clearAllFilters} className="text-xs text-red-500 hover:underline font-semibold">
                      Clear All
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto">
                  {displayedVarieties.map((v) => (
                    <label
                      key={v.id}
                      className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[var(--color-secondary)]/10 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedVarieties.includes(v.id)}
                        onChange={() => handleVarietyToggle(v.id)}
                        className="w-4 h-4 rounded border-[var(--color-secondary)] text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]"
                      />
                      <span className="text-sm text-[var(--color-text-muted)]">{v.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Price Sort - Desktop ── */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-secondary)]/20 rounded-xl p-4">
                <h3 className="text-sm font-bold text-[var(--color-secondary)] uppercase mb-3">Price</h3>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[var(--color-secondary)]/10">
                    <input type="radio" name="sort" value="price_asc" checked={sortBy === "price_asc"} onChange={handleSortChange} className="w-4 h-4 text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]" />
                    <span className="text-sm text-[var(--color-text-muted)]">Low to High</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[var(--color-secondary)]/10">
                    <input type="radio" name="sort" value="price_desc" checked={sortBy === "price_desc"} onChange={handleSortChange} className="w-4 h-4 text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]" />
                    <span className="text-sm text-[var(--color-text-muted)]">High to Low</span>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* Products */}
          <div className="col-span-12 md:col-span-9">
            {/* Mobile Filter Button - Only visible in products section */}
            {!isProductsEndReached && (
              <div className="md:hidden mb-4">
                <button
                  onClick={openFilterModal}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[var(--color-secondary)]/30 bg-[var(--color-surface)] text-[var(--color-secondary)] font-semibold"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  {(selectedVarieties.length > 0 ||
                    selectedCategory ||
                    sortBy) && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-full">
                      {selectedVarieties.length +
                        (selectedCategory ? 1 : 0) +
                        (sortBy ? 1 : 0)}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading || isPending ? (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-200 animate-pulse rounded-xl"
                    >
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                  {products.map((laddu) => (
                    <LadduCard
                      key={laddu._id}
                      product={{
                        id: laddu._id,
                        slug: laddu.slug,
                        name: laddu.name,
                        img: laddu.mainImage?.url || besanLaddu,
                        weightOptions: laddu.weightOptions,
                        discountPercent: laddu.discountPercent,
                        description: laddu.description,
                        category: laddu.category?.name || "Special",
                        about: laddu.about,
                        ratingsAverage: laddu.ratingsAverage,
                        ratingsQuantity: laddu.ratingsQuantity,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Products section end detector */}
            <div ref={productsEndRef} className="h-1"></div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/50 flex items-end justify-center">
          <div className="bg-[var(--color-primary)] w-full h-[90vh] rounded-t-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-[var(--color-secondary)]/20">
              <h3 className="text-lg font-bold text-[var(--color-secondary)]">
                Filters
              </h3>
              <div className="flex gap-3">
                {(tempSelectedVarieties.length > 0 ||
                  tempSelectedCategory ||
                  tempSortBy) && (
                  <button
                    onClick={() => {
                      setTempSelectedVarieties([]);
                      setTempSelectedCategory(null);
                      setTempSortBy("");
                    }}
                    className="text-sm text-red-500 font-semibold"
                  >
                    Clear All
                  </button>
                )}
                <button onClick={closeFilterModal} className="p-1">
                  <X className="w-6 h-6 text-[var(--color-text-muted)]" />
                </button>
              </div>
            </div>

            {/* Content Area - Split View */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Sidebar Tabs */}
              <div className="w-1/3 bg-[var(--color-surface)] border-r border-[var(--color-secondary)]/10">
                <button
                  onClick={() => setMobileSelectedTab("category")}
                  className={`w-full p-4 text-left font-medium transition-all text-sm ${
                    mobileSelectedTab === "category"
                      ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border-r-2 border-[var(--color-secondary)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  Category
                </button>
                <button
                  onClick={() => setMobileSelectedTab("varieties")}
                  className={`w-full p-4 text-left font-medium transition-all text-sm ${
                    mobileSelectedTab === "varieties"
                      ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border-r-2 border-[var(--color-secondary)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  Varieties
                </button>
                <button
                  onClick={() => setMobileSelectedTab("price")}
                  className={`w-full p-4 text-left font-medium transition-all text-sm ${
                    mobileSelectedTab === "price"
                      ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border-r-2 border-[var(--color-secondary)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  Price
                </button>
              </div>

              {/* Right Side Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Category Tab Content */}
                {mobileSelectedTab === "category" && (
                  <div>
                    <span className="text-sm text-[var(--color-text-muted)] block mb-4">Select Category</span>
                    <div className="space-y-3">
                      {categoriesList.map((cat) => (
                        <label
                          key={cat.id || cat._id}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="mobileCategory"
                            checked={tempSelectedCategory === (cat.id || cat._id)}
                            onChange={() => {
                              setTempSelectedCategory(cat.id || cat._id);
                              setTempSelectedVarieties([]);
                            }}
                            className="w-5 h-5 text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]"
                          />
                          <span className="text-sm text-[var(--color-text)]">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                    {tempSelectedCategory && (
                      <button
                        onClick={handleClearTempCategory}
                        className="mt-4 text-xs text-red-500 hover:underline font-semibold"
                      >
                        Clear Category
                      </button>
                    )}
                  </div>
                )}

                {/* Varieties Tab Content */}
                {mobileSelectedTab === "varieties" && (
                  <div>
                    <span className="text-sm text-[var(--color-text-muted)] block mb-4">Select Varieties</span>
                    <div className="space-y-3">
                      {tempDisplayedVarieties.map((v) => (
                        <label key={v.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tempSelectedVarieties.includes(v.id)}
                            onChange={() => handleTempVarietyToggle(v.id)}
                            className="w-5 h-5 rounded border-[var(--color-secondary)] text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]"
                          />
                          <span className="text-sm text-[var(--color-text)]">{v.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {mobileSelectedTab === "price" && (
                  <div>
                    <span className="text-sm text-[var(--color-text-muted)] block mb-4">
                      Sort by Price
                    </span>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="mobileSort"
                          value="price_asc"
                          checked={tempSortBy === "price_asc"}
                          onChange={(e) => setTempSortBy(e.target.value)}
                          className="w-5 h-5 text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]"
                        />
                        <span className="text-sm text-[var(--color-text)]">
                          Low to High
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="mobileSort"
                          value="price_desc"
                          checked={tempSortBy === "price_desc"}
                          onChange={(e) => setTempSortBy(e.target.value)}
                          className="w-5 h-5 text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]"
                        />
                        <span className="text-sm text-[var(--color-text)]">
                          High to Low
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Button */}
            <div className="p-4 border-t border-[var(--color-secondary)]/20">
              <button
                onClick={applyFilters}
                className="w-full py-3 rounded-xl bg-[var(--color-secondary)] text-[var(--color-primary)] font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quality Promise Section */}
      <section className="relative mx-6 md:mx-24 overflow-hidden bg-[var(--color-primary)]">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 rounded-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-secondary)]/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-secondary)]/5 rounded-full -ml-32 -mb-32"></div>

        <div className="relative z-10 p-8 md:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)] font-[var(--font-heading)]">
              The KaashtKart Quality Promise
            </h2>
            <p className="text-[var(--color-text-muted)] text-base mt-3 max-w-2xl mx-auto">
              We ensure that every mango you receive meets the highest standards
              of quality, freshness, and taste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-[var(--color-secondary)]/70 hover:border-[var(--color-secondary)] hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--color-secondary)] group-hover:scale-110 transition-all duration-300">
                <Shield className="w-8 h-8 text-[var(--color-secondary)] group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-bold text-lg text-[var(--color-text)] mb-2">
                Hygienically Packed
              </h4>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Double-sealed airtight containers to maintain freshness and
                purity.
              </p>
            </div>

            <div className="group text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-[var(--color-secondary)]/70 hover:border-[var(--color-secondary)] hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--color-secondary)] group-hover:scale-110 transition-all duration-300">
                <Truck className="w-8 h-8 text-[var(--color-secondary)] group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-bold text-lg text-[var(--color-text)] mb-2">
                Pan-India Shipping
              </h4>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Fast delivery to any corner of India within 3-5 business days.
              </p>
            </div>

            <div className="group text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-[var(--color-secondary)]/70 hover:border-[var(--color-secondary)] hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--color-secondary)] group-hover:scale-110 transition-all duration-300">
                <Heart className="w-8 h-8 text-[var(--color-secondary)] group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-bold text-lg text-[var(--color-text)] mb-2">
                Made with Love
              </h4>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Every mango is handpicked with care from our trusted orchards.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--color-secondary)]/10 text-center">
            <p className="text-[var(--color-text-muted)] text-sm flex items-center justify-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> Freshly Picked
              </span>
              <span className="w-1 h-1 bg-[var(--color-secondary)]/30 rounded-full"></span>
              <span className="inline-flex items-center gap-1">
                Naturally Ripened
              </span>
              <span className="w-1 h-1 bg-[var(--color-secondary)]/30 rounded-full"></span>
              <span className="inline-flex items-center gap-1">
                100% Chemical Free
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className="mt-16">
        <Footer />
      </div>

      <style
        dangerouslySetInnerHTML={{
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
        `,
        }}
      />
    </div>
  );
};

export default Laddus;
