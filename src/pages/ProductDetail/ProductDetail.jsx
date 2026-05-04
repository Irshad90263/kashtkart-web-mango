import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Package, Truck, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import besanLaddu from '../../assets/images/besan-laddu.png';
import kesarLaddu from '../../assets/images/kesar-laddu.png';
import nariyalLaddu from '../../assets/images/nariyal-laddu.png';
import heroLaddus from '../../assets/images/hero-laddus.png';

import { getProductApi } from '../../api/product';
import { addToCartApi } from '../../api/cart';
import Footer from '../../components/layout/Footer';
import Loader from '../../components/common/Loader';


const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductApi(id);
                // Map API response to component structure
                const p = data.product;
                setProduct({
                    id: p._id,
                    name: p.name,
                    img: p.mainImage?.url || besanLaddu,
                    price: p.price,
                    finalPrice: p.finalPrice,
                    discountPercent: p.discountPercent,
                    priceStr: `₹${p.finalPrice} / kg`,
                    description: p.description,
                    category: p.category?.name || 'Special',
                    ingredients: p.about?.ingredients || 'N/A',
                    shelfLife: p.about?.shelfLife || 'N/A',
                    netWeight: p.about?.netWeight || '1kg'
                });
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError(true);
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary)]">
                <Loader text="Loading delicious details..." />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary)]">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-[var(--color-secondary)] mb-4">Product Not Found</h2>
                    <Link to="/laddus" className="text-white hover:text-[var(--color-secondary)] hover:underline transition-colors">
                        ← Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const checkAuth = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            const result = await Swal.fire({
                title: 'Ready for a Treat?',
                text: 'Please login to proceed with your purchase.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#F2B705',
                cancelButtonColor: '#2E2E2E',
                confirmButtonText: 'Login Now',
                cancelButtonText: 'Maybe Later',
                background: '#FFFFFF',
                color: '#2E2E2E',
                iconColor: '#F2B705'
            });

            if (result.isConfirmed) {
                navigate('/login');
            }
            return false;
        }
        return true;
    };

    const handleAddToCart = async () => {
        const isAuth = await checkAuth();
        if (!isAuth) return;

        try {
            await addToCartApi({ productId: product.id, quantity: 1 });
            window.dispatchEvent(new Event('cart-updated')); // Notify Navbar
            toast.success(`${product.name} added to cart!`, { position: "top-right" });
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    return (
        <div>
            <div className="bg-[var(--color-primary)] min-h-screen pb-8 pt-4 px-6 md:px-24 font-[var(--font-body)] relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    <div className="detail-bubble detail-bubble-1"></div>
                    <div className="detail-bubble detail-bubble-2"></div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .detail-bubble {
                        position: absolute;
                        background: var(--color-secondary);
                        border-radius: 50%;
                        opacity: 0.1;
                        animation: float-detail 20s infinite ease-in-out;
                    }
                    .detail-bubble-1 { width: 200px; height: 200px; left: -50px; top: 10%; }
                    .detail-bubble-2 { width: 300px; height: 300px; right: -80px; bottom: 10%; animation-delay: 4s; }
                    @keyframes float-detail {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        50% { transform: translate(30px, -40px) scale(1.05); }
                    }
                `
                }} />

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[var(--color-secondary)] hover:text-yellow-700 mb-8 font-semibold transition-colors relative z-10"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="max-w-6xl mx-auto bg-[var(--color-muted)] rounded-[40px] shadow-2xl overflow-hidden border border-[var(--color-secondary)]/10 relative z-10 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Product Image */}
                        <div className="p-8 md:p-16 flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/50 to-[var(--color-muted)] relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${heroLaddus})`, backgroundSize: 'cover', filter: 'blur(20px)' }}></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,183,5,0.15)_0%,transparent_70%)]"></div>
                            <img
                                src={product.img}
                                alt={product.name}
                                className="w-full max-w-sm rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-transform duration-500 relative z-10 border border-white/10"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <div className="inline-block px-4 py-1 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-full text-sm font-bold mb-4 w-fit">
                                {product.category}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4 font-[var(--font-heading)]">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-2 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} className="fill-[var(--color-secondary)] text-[var(--color-secondary)]" />
                                ))}
                                <span className="text-[var(--color-text-muted)] text-sm ml-2">(4.9/5 from 120 reviews)</span>
                            </div>

                            <p className="text-[var(--color-text)] text-lg leading-relaxed mb-6 opacity-80">
                                {product.description}
                            </p>

                            <div className="bg-[var(--color-primary)]/50 rounded-2xl p-6 mb-6 border border-[var(--color-secondary)]/10">
                                <h3 className="font-bold text-[var(--color-secondary)] mb-3 flex items-center gap-2">
                                    <Package size={20} />
                                    Product Details
                                </h3>
                                <div className="space-y-2 text-sm text-[var(--color-text-muted)]">
                                    <p><span className="font-semibold text-[var(--color-text)]">Ingredients:</span> {product.ingredients}</p>
                                    <p><span className="font-semibold text-[var(--color-text)]">Shelf Life:</span> {product.shelfLife}</p>
                                    <p><span className="font-semibold text-[var(--color-text)]">Net Weight:</span> {product.netWeight}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Price per kg</p>
                                    <div className="flex items-center gap-3">
                                        <p className="text-4xl font-bold text-[var(--color-secondary)]">₹{product.finalPrice}</p>
                                        {product.discountPercent > 0 && (
                                            <>
                                                <p className="text-xl text-gray-500 line-through">₹{product.price}</p>
                                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                                    {product.discountPercent}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mb-8">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-[var(--color-secondary)] text-[var(--color-primary)] py-2 md:py-4 rounded-xl font-bold text-sm md:text-lg hover:bg-[#ffe033] transition-all shadow-[0_4px_15px_rgba(255,212,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,212,0,0.4)] flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={18} className="md:w-[22px] md:h-[22px]" />
                                    <span className="text-xs md:text-base">Add to Cart</span>
                                </button>
                                <button
                                    onClick={async () => {
                                        const isAuth = await checkAuth();
                                        if (!isAuth) return;

                                        try {
                                            await addToCartApi({ productId: product.id, quantity: 1 });
                                            window.dispatchEvent(new Event('cart-updated'));
                                            navigate('/shop');
                                        } catch (error) {
                                            console.error("Buy now failed:", error);
                                        }
                                    }}
                                    className="px-4 md:px-8 py-2 md:py-4 border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-xl font-bold hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all flex items-center justify-center no-underline text-xs md:text-base cursor-pointer"
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Truck className="text-[var(--color-secondary)]" size={20} />
                                    <span className="text-zinc-600">Fast Delivery</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Shield className="text-[var(--color-secondary)]" size={20} />
                                    <span className="text-zinc-600">100% Authentic</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;
