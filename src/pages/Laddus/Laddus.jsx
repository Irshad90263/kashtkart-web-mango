import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Filter, Shield, Truck, Package } from 'lucide-react';
import LadduCard from '../../components/cards/LadduCard';
import Footer from '../../components/layout/Footer';
import besanLaddu from '../../assets/images/besan-laddu.png';

import { listCategoriesApi } from '../../api/categories';

import { listProductsApi, listProductsByCategoryApi } from '../../api/product';

const Laddus = () => {
    const [activeCategory, setActiveCategory] = useState({ name: 'All', id: 'all' });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [categories, setCategories] = useState([{ name: 'All', id: 'all' }]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const sectionRefs = useRef([]);
    const dropdownRef = useRef(null);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await listCategoriesApi();
                // Store full category objects, ensuring id is present
                setCategories([{ name: 'All', id: 'all' }, ...data.categories.map(c => ({ ...c, id: c._id || c.id }))]);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Fetch products when activeCategory changes
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let data;
                if (activeCategory.id === 'all') {
                    data = await listProductsApi();
                    // console.log('All products data:', data);
                    // Check if data has products array or if products are directly in data
                    if (data.products) {
                        setProducts(data.products);
                    } else if (Array.isArray(data)) {
                        setProducts(data);
                    } else {
                        setProducts([]);
                    }
                } else {
                    data = await listProductsByCategoryApi(activeCategory.id);
                    console.log('Category products data:', data);
                    // Check if data has products array or if products are directly in data
                    if (data.products) {
                        setProducts(data.products);
                    } else if (Array.isArray(data)) {
                        setProducts(data);
                    } else {
                        setProducts([]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeCategory]);

    // Local filtering for price
    const filteredLaddus = products.filter(laddu => {
        const price = laddu.finalPrice || laddu.price || 0; // Default to 0 if missing
        const min = minPrice === '' ? 0 : parseInt(minPrice);
        const max = maxPrice === '' ? 10000 : parseInt(maxPrice);
        const matchesPrice = price >= min && price <= max;
        return matchesPrice;
    });


    const addToRefs = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

    return (
        <div className="bg-[var(--color-primary)] text-[var(--color-text)] font-[var(--font-body)] min-h-screen overflow-x-hidden">
            {/* Header with Bubbles */}
            <section className="py-16 md:py-20 px-8 text-center bg-[linear-gradient(0deg,rgba(255,212,0,0.1)_0%,transparent_70%)] rounded-b-[40px] md:rounded-b-[50px] relative overflow-hidden mb-12">
                {/* Animated Background Bubbles */}
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
                            background: rgba(255, 212, 0, 0.1);
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

                <h1 className="text-3xl md:text-7xl font-bold mb-4 relative z-10 text-[var(--color-secondary)] font-[var(--font-heading)]">Our Mango Gallery</h1>
                <p className="text-base md:text-xl italic opacity-90 max-w-2xl mx-auto relative z-10 text-[var(--color-text-muted)]">
                    Explore our diverse collection of authentic KashtKart, handcrafted for every palate and occasion.
                </p>
            </section>

            {/* Filters Section - Static for stability */}
            <section className={`py-8 px-6 md:px-8 flex flex-col items-center gap-6 md:gap-10 relative ${isDropdownOpen ? 'z-50' : 'z-10'}`}>

                {/* Mobile View: Premium Custom Dropdown Filter */}
                <div
                    ref={dropdownRef}
                    className={`md:hidden w-full max-w-[280px] relative ${isDropdownOpen ? 'z-[60]' : 'z-20'}`}
                >
                    <div className="flex items-center gap-2 mb-3 text-[var(--color-secondary)] font-bold text-[10px] uppercase tracking-[0.2em] pl-2 opacity-80">
                        <Filter size={12} />
                        <span>Filter by Category</span>
                    </div>

                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full bg-[var(--color-surface)] flex items-center justify-between px-6 py-4 rounded-[22px] shadow-lg border border-[var(--color-secondary)]/20 transition-all active:scale-[0.98] ${isDropdownOpen ? 'ring-2 ring-[var(--color-secondary)]/30' : ''}`}
                    >
                        <span className="font-bold text-[var(--color-text)] text-base">{activeCategory.name}</span>
                        <ChevronDown className={`text-[var(--color-secondary)] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                    </button>

                    {/* Animated Dropdown Menu - Glassmorphism */}
                    <div className={`absolute top-full left-0 w-full mt-3 bg-[var(--color-muted)] backdrop-blur-xl rounded-[25px] shadow-2xl border border-[var(--color-secondary)]/20 overflow-hidden transition-all duration-300 origin-top ${isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                        <div className="p-2 py-3 flex flex-col">
                            {categories.map((cat, idx) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setActiveCategory(cat);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeCategory.id === cat.id ? 'bg-[var(--color-secondary)] text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)]'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Laptop View: Row-based Filter */}
                <div className="hidden md:flex flex-wrap justify-center gap-3">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 border-2 ${activeCategory.id === cat.id
                                ? 'bg-[var(--color-secondary)] text-[var(--color-primary)] border-[var(--color-secondary)] shadow-[0_0_15px_rgba(255,212,0,0.3)] scale-105'
                                : 'bg-transparent text-[var(--color-secondary)] border-[var(--color-secondary)]/30 hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>


            </section>

            {/* Laddu Grid */}
            <section ref={addToRefs} className="px-6 md:px-24 relative z-0 mb-20">
                <div className="text-center mb-6 text-[var(--color-text-muted)] text-sm">
                    Showing {filteredLaddus.length} delicious laddus
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-gray-200 rounded-xl animate-pulse">
                                <div className="w-full aspect-square bg-gray-300 rounded-t-xl"></div>
                                <div className="p-3">
                                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {filteredLaddus.map((laddu) => (
                            <LadduCard
                                key={laddu._id}
                                product={{
                                    id: laddu._id,
                                    name: laddu.name,
                                    img: laddu.mainImage?.url || besanLaddu,
                                    price: laddu.price,
                                    finalPrice: laddu.finalPrice,
                                    discountPercent: laddu.discountPercent,
                                    priceStr: `₹${laddu.finalPrice} / kg`,
                                    description: laddu.description,
                                    category: laddu.category?.name || 'Special'
                                }}
                            />
                        ))}
                    </div>
                )}

                {!loading && filteredLaddus.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl md:text-2xl text-gray-500 italic">No laddus found in this selection. Try adjusting your filters!</p>
                    </div>
                )}
            </section>

            {/* Quality Promise */}
            <section ref={addToRefs} className="mt-16 md:mt-24 mx-6 md:mx-24 p-8 md:p-12 bg-[var(--color-muted)] rounded-[40px] md:rounded-[50px] shadow-lg text-center relative overflow-hidden border border-[var(--color-secondary)]/10 ">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-[var(--color-secondary)] rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16 opacity-10"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] mb-8 md:mb-12 relative z-10 font-[var(--font-heading)]">The KashtKart Quality Promise</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
                    <div className="group text-center">
                        <div className="w-16 h-16 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform shadow-[0_4px_15px_rgba(255,212,0,0.3)]">
                            <Shield className="w-8 h-8 text-[var(--color-primary)]" />
                        </div>
                        <h4 className="font-bold mb-2 text-base md:text-lg text-[var(--color-text)]">Hygienically Packed</h4>
                        <p className="text-xs md:text-sm text-[var(--color-text-muted)] leading-relaxed italic">Double-sealed airtight containers to maintain freshness.</p>
                    </div>
                    <div className="group text-center">
                        <div className="w-16 h-16 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform shadow-[0_4px_15px_rgba(255,212,0,0.3)]">
                            <Truck className="w-8 h-8 text-[var(--color-primary)]" />
                        </div>
                        <h4 className="font-bold mb-2 text-base md:text-lg text-[var(--color-text)]">Pan-India Shipping</h4>
                        <p className="text-xs md:text-sm text-[var(--color-text-muted)] leading-relaxed italic">Fast delivery to any corner within 3-5 business days.</p>
                    </div>
                    <div className="group text-center">
                        <div className="w-16 h-16 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform shadow-[0_4px_15px_rgba(255,212,0,0.3)]">
                            <Package className="w-8 h-8 text-[var(--color-primary)]" />
                        </div>
                        <h4 className="font-bold mb-2 text-base md:text-lg text-[var(--color-text)]">Bulk Orders</h4>
                        <p className="text-xs md:text-sm text-[var(--color-text-muted)] leading-relaxed italic">Special customization for weddings and corporate events.</p>
                    </div>
                </div>
            </section>

            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
};

export default Laddus;
