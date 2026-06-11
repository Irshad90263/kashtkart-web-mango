// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { ShoppingCart, ArrowLeft, Star, Package, Truck, Shield } from 'lucide-react';
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';
// // import besanLaddu from '../../assets/images/besan-laddu.png';
// // import kesarLaddu from '../../assets/images/kesar-laddu.png';
// // import nariyalLaddu from '../../assets/images/nariyal-laddu.png';
// // import heroLaddus from '../../assets/images/hero-laddus.png';

// import { getProductApi } from '../../api/product';
// import { addToCartApi } from '../../api/cart';
// import Footer from '../../components/layout/Footer';
// import Loader from '../../components/common/Loader';

// const ProductDetail = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 const data = await getProductApi(id);
//                 // Map API response to component structure
//                 const p = data.product;
//                 setProduct({
//                     id: p._id,
//                     name: p.name,
//                     img: p.mainImage?.url || besanLaddu,
//                     price: p.price,
//                     finalPrice: p.finalPrice,
//                     discountPercent: p.discountPercent,
//                     priceStr: `₹${p.finalPrice} / kg`,
//                     description: p.description,
//                     category: p.category?.name || 'Special',
//                     ingredients: p.about?.ingredients || 'N/A',
//                     shelfLife: p.about?.shelfLife || 'N/A',
//                     netWeight: p.about?.netWeight || '1kg'
//                 });
//                 setLoading(false);
//             } catch (err) {
//                 console.error("Failed to fetch product:", err);
//                 setError(true);
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchProduct();
//         }
//     }, [id]);

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary)]">
//                 <Loader text="Loading delicious details..." />
//             </div>
//         );
//     }

//     if (error || !product) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary)]">
//                 <div className="text-center">
//                     <h2 className="text-3xl font-bold text-[var(--color-secondary)] mb-4">Product Not Found</h2>
//                     <Link to="/laddus" className="text-white hover:text-[var(--color-secondary)] hover:underline transition-colors">
//                         ← Back to Products
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     const checkAuth = async () => {
//         const token = localStorage.getItem('userToken');
//         if (!token) {
//             const result = await Swal.fire({
//                 title: 'Ready for a Treat?',
//                 text: 'Please login to proceed with your purchase.',
//                 icon: 'info',
//                 showCancelButton: true,
//                 confirmButtonColor: '#F2B705',
//                 cancelButtonColor: '#2E2E2E',
//                 confirmButtonText: 'Login Now',
//                 cancelButtonText: 'Maybe Later',
//                 background: '#FFFFFF',
//                 color: '#2E2E2E',
//                 iconColor: '#F2B705'
//             });

//             if (result.isConfirmed) {
//                 navigate('/login');
//             }
//             return false;
//         }
//         return true;
//     };

//     const handleAddToCart = async () => {
//         const isAuth = await checkAuth();
//         if (!isAuth) return;

//         try {
//             await addToCartApi({ productId: product.id, quantity: 1 });
//             window.dispatchEvent(new Event('cart-updated')); // Notify Navbar
//             toast.success(`${product.name} added to cart!`, { position: "top-right" });
//         } catch (error) {
//             console.error("Failed to add to cart:", error);
//         }
//     };

//     return (
//         <div>
//             <div className="bg-[var(--color-primary)] min-h-screen pb-8 pt-4 px-6 md:px-24 font-[var(--font-body)] relative overflow-hidden">
//                 {/* Background Decorative Elements */}
//                 <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
//                     <div className="detail-bubble detail-bubble-1"></div>
//                     <div className="detail-bubble detail-bubble-2"></div>
//                 </div>

//                 <style dangerouslySetInnerHTML={{
//                     __html: `
//                     .detail-bubble {
//                         position: absolute;
//                         background: var(--color-secondary);
//                         border-radius: 50%;
//                         opacity: 0.1;
//                         animation: float-detail 20s infinite ease-in-out;
//                     }
//                     .detail-bubble-1 { width: 200px; height: 200px; left: -50px; top: 10%; }
//                     .detail-bubble-2 { width: 300px; height: 300px; right: -80px; bottom: 10%; animation-delay: 4s; }
//                     @keyframes float-detail {
//                         0%, 100% { transform: translate(0, 0) scale(1); }
//                         50% { transform: translate(30px, -40px) scale(1.05); }
//                     }
//                 `
//                 }} />

//                 {/* Back Button */}
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="flex items-center gap-2 text-[var(--color-secondary)] hover:text-yellow-700 mb-8 font-semibold transition-colors relative z-10"
//                 >
//                     <ArrowLeft size={20} />
//                     Back
//                 </button>

//                 <div className="max-w-6xl mx-auto bg-[var(--color-muted)] rounded-[40px] shadow-2xl overflow-hidden border border-[var(--color-secondary)]/10 relative z-10 backdrop-blur-sm">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
//                         {/* Product Image */}
//                         <div className="p-8 md:p-16 flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/50 to-[var(--color-muted)] relative overflow-hidden">
//                             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(https://masterpiecer-images.s3.yandex.net/99bb81bc67ec11eeb0c21e5d9776cfa6:upscaled)`, backgroundSize: 'cover', filter: 'blur(20px)' }}></div>
//                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,183,5,0.15)_0%,transparent_70%)]"></div>
//                             <img
//                                 src={product.img}
//                                 alt={product.name}
//                                 className="w-full max-w-sm rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-transform duration-500 relative z-10 border border-white/10"
//                             />
//                         </div>

//                         {/* Product Details */}
//                         <div className="p-8 md:p-12 flex flex-col justify-center">
//                             <div className="inline-block px-4 py-1 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-full text-sm font-bold mb-4 w-fit">
//                                 {product.category}
//                             </div>

//                             <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4 font-[var(--font-heading)]">
//                                 {product.name}
//                             </h1>

//                             <div className="flex items-center gap-2 mb-6">
//                                 {[...Array(5)].map((_, i) => (
//                                     <Star key={i} size={20} className="fill-[var(--color-secondary)] text-[var(--color-secondary)]" />
//                                 ))}
//                                 <span className="text-[var(--color-text-muted)] text-sm ml-2">(4.9/5 from 120 reviews)</span>
//                             </div>

//                             <p className="text-[var(--color-text)] text-lg leading-relaxed mb-6 opacity-80">
//                                 {product.description}
//                             </p>

//                             <div className="bg-[var(--color-primary)]/50 rounded-2xl p-6 mb-6 border border-[var(--color-secondary)]/10">
//                                 <h3 className="font-bold text-[var(--color-secondary)] mb-3 flex items-center gap-2">
//                                     <Package size={20} />
//                                     Product Details
//                                 </h3>
//                                 <div className="space-y-2 text-sm text-[var(--color-text-muted)]">
//                                     <p><span className="font-semibold text-[var(--color-text)]">Ingredients:</span> {product.ingredients}</p>
//                                     <p><span className="font-semibold text-[var(--color-text)]">Shelf Life:</span> {product.shelfLife}</p>
//                                     <p><span className="font-semibold text-[var(--color-text)]">Net Weight:</span> {product.netWeight}</p>
//                                 </div>
//                             </div>

//                             <div className="flex items-center justify-between mb-8">
//                                 <div>
//                                     <p className="text-sm text-gray-400 mb-1">Price per kg</p>
//                                     <div className="flex items-center gap-3">
//                                         <p className="text-4xl font-bold text-[var(--color-secondary)]">₹{product.finalPrice}</p>
//                                         {product.discountPercent > 0 && (
//                                             <>
//                                                 <p className="text-xl text-gray-500 line-through">₹{product.price}</p>
//                                                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
//                                                     {product.discountPercent}% OFF
//                                                 </span>
//                                             </>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="flex gap-4 mb-8">
//                                 <button
//                                     onClick={handleAddToCart}
//                                     className="flex-1 bg-[var(--color-secondary)] text-[var(--color-primary)] py-2 md:py-4 rounded-xl font-bold text-sm md:text-lg hover:bg-[#ffe033] transition-all shadow-[0_4px_15px_rgba(255,212,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,212,0,0.4)] flex items-center justify-center gap-2"
//                                 >
//                                     <ShoppingCart size={18} className="md:w-[22px] md:h-[22px]" />
//                                     <span className="text-xs md:text-base">Add to Cart</span>
//                                 </button>
//                                 <button
//                                     onClick={async () => {
//                                         const isAuth = await checkAuth();
//                                         if (!isAuth) return;

//                                         try {
//                                             await addToCartApi({ productId: product.id, quantity: 1 });
//                                             window.dispatchEvent(new Event('cart-updated'));
//                                             navigate('/shop');
//                                         } catch (error) {
//                                             console.error("Buy now failed:", error);
//                                         }
//                                     }}
//                                     className="px-4 md:px-8 py-2 md:py-4 border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-xl font-bold hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-all flex items-center justify-center no-underline text-xs md:text-base cursor-pointer"
//                                 >
//                                     Buy Now
//                                 </button>
//                             </div>

//                             {/* Features */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="flex items-center gap-3 text-sm text-gray-400">
//                                     <Truck className="text-[var(--color-secondary)]" size={20} />
//                                     <span className="text-zinc-600">Fast Delivery</span>
//                                 </div>
//                                 <div className="flex items-center gap-3 text-sm text-gray-400">
//                                     <Shield className="text-[var(--color-secondary)]" size={20} />
//                                     <span className="text-zinc-600">100% Authentic</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default ProductDetail;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  Package,
  Truck,
  Shield,
  ChevronRight,
  Minus,
  Plus,
  Heart,
  Smile,
  MapPin,
} from "lucide-react";
import { checkDeliveryApi } from "../../api/delivery";

import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getProductApi } from "../../api/product";
import { addToCartApi } from "../../api/cart";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import LadduCard from "../../components/cards/LadduCard";
import ReviewModal from "../../components/common/ReviewModal";
import { getProductReviews, checkReviewEligibility } from "../../api/reviews";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [activeImage, setActiveImage] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState(null); // 'checking', 'available', 'unavailable'
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [adding, setAdding] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [isWeightDropdownOpen, setIsWeightDropdownOpen] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [isEligibleToReview, setIsEligibleToReview] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const rawNetWeight = product?.netWeight;
  const netWeightArray = Array.isArray(rawNetWeight)
    ? rawNetWeight
    : rawNetWeight
      ? [rawNetWeight]
      : ["N/A"];

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - (top + window.scrollY)) / height) * 100;
    setZoomPos({ x, y });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductApi(slug);
        const p = data.product;
        setProduct({
          id: p._id,
          name: p.name,
          img: p.mainImage?.url,
          discountPercent: p.discountPercent,
          description: p.description,
          category: p.category?.name || "Special",
          ingredients: p.about?.ingredients || "N/A",
          shelfLife: p.about?.shelfLife || "N/A",
          netWeight: p.about?.netWeight,
          gallery: p.galleryImages || [],
          relatedProducts: p.relatedProducts || [],
          aboutHtml: p.about?.aboutHtml || "",
          weightOptions: p.weightOptions || [],
          ratingsAverage: p.ratingsAverage || 0,
          ratingsQuantity: p.ratingsQuantity || 0,
          vendor: p.vendor_id
            ? {
                name: p.vendor_id.name,
                designation: p.vendor_id.vendorDesignation || "",
                address: p.vendor_id.residentialAddress?.address || "",
                photo: p.vendor_id.photo?.url || "",
              }
            : null,
        });
        setActiveImage(p.mainImage?.url);

        const rawNet = p.about?.netWeight;
        const netArr = Array.isArray(rawNet)
          ? rawNet
          : rawNet
            ? [rawNet]
            : ["N/A"];
        setSelectedWeight(netArr[0] || "N/A");

        setLoading(false);

        // Fetch reviews
        try {
          const reviewsData = await getProductReviews(p._id);
          if (reviewsData.success) {
            setReviews(reviewsData.reviews);
          }

          // Check eligibility if user is logged in
          const token = localStorage.getItem("userToken");
          if (token) {
            const eligibility = await checkReviewEligibility(p._id);
            setIsEligibleToReview(eligibility.eligible);
          }
        } catch (err) {
          console.error("Failed to fetch reviews or eligibility", err);
        }

      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    if (slug) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  // Function to refresh reviews after adding a new one
  const handleReviewAdded = async () => {
    if (product?.id) {
      const reviewsData = await getProductReviews(product.id);
      if (reviewsData.success) {
        setReviews(reviewsData.reviews);
      }
      setIsEligibleToReview(false); // User can only review once
    }
  };

  useEffect(() => {
    if (pincode.length === 6) {
      handleCheckDelivery(pincode);
    }
  }, [selectedWeight]);

  const checkAuth = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      const result = await Swal.fire({
        title: "Sign In Required",
        text: "Please login to add items to your cart.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#F2B705",
        cancelButtonColor: "#000",
        confirmButtonText: "Login Now",
        customClass: {
          popup: "compact-swal-popup",
          title: "compact-swal-title",
          content: "compact-swal-content",
        },
      });
      if (result.isConfirmed) navigate("/login");
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    const isAuth = await checkAuth();
    if (!isAuth) return;
    setAdding(true);
    try {
      await addToCartApi({
        productId: product.id,
        quantity,
        selectedWeight: selectedWeight !== "N/A" ? selectedWeight : undefined,
      });
      window.dispatchEvent(new Event("cart-updated"));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    const isAuth = await checkAuth();
    if (!isAuth) return;
    setAdding(true);
    try {
      await addToCartApi({
        productId: product.id,
        quantity,
        selectedWeight: selectedWeight !== "N/A" ? selectedWeight : undefined,
      });
      window.dispatchEvent(new Event("cart-updated"));
      navigate("/shop");
    } catch (error) {
      console.error(error);
      toast.error("Failed to proceed to buy. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleCheckDelivery = async (val) => {
    if (val.length === 6) {
      setDeliveryStatus("checking");
      try {
        const weight = parseFloat(selectedWeight) || 1;
        const res = await checkDeliveryApi(val, weight);

        // New API returns { success, availableCouriers: [...] }
        const couriers = res?.availableCouriers || [];

        if (res?.success && couriers.length > 0) {
          // Pick fastest courier (first in list)
          const fastest = couriers.reduce((a, b) =>
            (a.estimatedDays || 99) <= (b.estimatedDays || 99) ? a : b,
          );

          setDeliveryStatus("available");

          let displayEtd = fastest.etd || `${fastest.estimatedDays} days`;
          // If ETD is a date string, format it nicely
          if (fastest.etd && fastest.etd.includes("-")) {
            try {
              const date = new Date(fastest.etd);
              displayEtd = date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
            } catch (_) {}
          }

          setDeliveryMsg(
            `✅ Delivery available via ${fastest.courierName} by ${fastest.etd}`,
          );
        } else {
          setDeliveryStatus("unavailable");
          setDeliveryMsg("Delivery not available for this pincode.");
        }
      } catch (err) {
        setDeliveryStatus("unavailable");
        setDeliveryMsg("Unable to check delivery status.");
      }
    } else {
      setDeliveryStatus(null);
      setDeliveryMsg("");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader text="Preparing your treat..." />
      </div>
    );
  if (error || !product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-800">
        <h2 className="text-xl font-bold mb-3">Product Not Found</h2>
        <Link to="/mangos" className="text-yellow-600 font-medium text-sm">
          ← Back to Shop
        </Link>
      </div>
    );

  const reviewSliderSettings = {
    dots: true,
    infinite: reviews.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="bg-white min-h-screen font-[var(--font-body)]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
                .compact-swal-popup { width: 22em !important; padding: 1rem !important; border-radius: 12px !important; }
                .compact-swal-title { font-size: 1.1rem !important; margin-bottom: 0.5rem !important; }
                .compact-swal-content { font-size: 0.85rem !important; }
                .swal2-actions { margin-top: 1rem !important; gap: 8px; }
                .swal2-styled { padding: 8px 20px !important; font-size: 0.85rem !important; border-radius: 6px !important; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #F2B705; border-radius: 10px; }
                .custom-product-about { word-break: break-word !important; overflow-wrap: break-word !important; max-width: 100% !important; }
                .custom-product-about * { word-break: break-word !important; overflow-wrap: break-word !important; max-width: 100% !important; }
                .custom-product-about h1 { font-size: 1.8rem !important; font-weight: bold !important; margin-top: 1.5rem !important; margin-bottom: 0.75rem !important; color: #111827 !important; }
                .custom-product-about h2 { font-size: 1.5rem !important; font-weight: bold !important; margin-top: 1.25rem !important; margin-bottom: 0.5rem !important; color: #1f2937 !important; }
                .custom-product-about h3 { font-size: 1.25rem !important; font-weight: bold !important; margin-top: 1rem !important; margin-bottom: 0.4rem !important; color: #374151 !important; }
                .custom-product-about ul { list-style-type: disc !important; padding-left: 1.75rem !important; margin-top: 0.75rem !important; margin-bottom: 0.75rem !important; }
                .custom-product-about ol { list-style-type: decimal !important; padding-left: 1.75rem !important; margin-top: 0.75rem !important; margin-bottom: 0.75rem !important; }
                .custom-product-about li { margin-bottom: 0.35rem !important; list-style: inherit !important; }
                .custom-product-about li p { margin: 0 !important; display: inline !important; }
                .custom-product-about p { margin-bottom: 0.75rem !important; line-height: 1.65 !important; color: #374151 !important; }
                .custom-product-about blockquote { border-left: 4px solid #F2B705 !important; padding: 0.75rem 1.25rem !important; font-style: italic !important; margin: 1.25rem 0 !important; color: #4b5563 !important; background-color: #fffbeb !important; border-radius: 8px !important; }
                .custom-product-about strong { font-weight: bold !important; color: inherit !important; }
                .custom-product-about mark { background-color: #fef08a !important; padding: 0.125rem 0.25rem !important; border-radius: 0.25rem !important; }
                .custom-product-about img { display: inline-block !important; max-width: 100% !important; height: auto !important; border-radius: 12px !important; margin: 1.5rem 0 !important; }
                .custom-product-about img[width="25%"] { width: 25% !important; }
                .custom-product-about img[width="50%"] { width: 50% !important; }
                .custom-product-about img[width="100%"] { width: 100% !important; }
                .custom-product-about [style*="text-align: center"] { text-align: center !important; display: block !important; margin-left: auto !important; margin-right: auto !important; }
                .custom-product-about [style*="text-align: right"] { text-align: right !important; display: block !important; margin-left: auto !important; margin-right: 0 !important; }
                .custom-product-about [style*="text-align: left"] { text-align: left !important; }
                .custom-product-about table { width: 100% !important; border-collapse: collapse !important; margin: 1rem 0 !important; overflow: hidden !important; }
                .custom-product-about table th, .custom-product-about table td { border: 1px solid #e5e7eb !important; padding: 0.5rem 0.75rem !important; text-align: left !important; vertical-align: top !important; }
                .custom-product-about table th { background-color: #f9fafb !important; font-weight: bold !important; color: #111827 !important; }
                .slick-track { margin-left: 0; }
            `,
        }}
      />

      <nav className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 py-3 mt-5 flex items-center gap-1.5 text-xs text-gray-500 border-b border-gray-100 mb-6">
        <Link to="/" className="hover:text-yellow-600 transition-colors">
          Home
        </Link>
        <ChevronRight size={12} className="text-gray-300" />
        <Link to="/shop" className="hover:text-yellow-600 transition-colors">
          Products
        </Link>
        <ChevronRight size={12} className="text-gray-300" />
        <span className="text-gray-900 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <main className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 pb-12">
        {/* items-start added to help with sticky alignment */}
        <div className="flex flex-col lg:flex-row lg:gap-8 gap-8 items-start">
          {/* Left: Image Section */}
          <div className="lg:w-[420px] flex-shrink-0 w-full">
            {/* Adjusted sticky top to match right content better */}
            <div className="sticky top-24 lg:pr-4">
              {/* max-w-[420px] - Image container height increased slightly */}
              <div
                className="max-w-[420px] mx-auto aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center relative group shadow-inner cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={activeImage || product.img}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply p-6 transition-transform duration-300"
                />

                {isZoomed && (
                  <div
                    className="absolute border border-yellow-500/50 bg-yellow-500/10 pointer-events-none"
                    style={{
                      width: "100px",
                      height: "100px",
                      left: `${zoomPos.x}%`,
                      top: `${zoomPos.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}

                {product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2 custom-scrollbar max-w-[420px] mx-auto">
                  <button
                    onClick={() => setActiveImage(product.img)}
                    className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${activeImage === product.img ? "border-yellow-500 shadow-md" : "border-gray-100 opacity-70 hover:opacity-100"}`}
                  >
                    <img
                      src={product.img}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {product.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img.url)}
                      className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${activeImage === img.url ? "border-yellow-500 shadow-md" : "border-gray-100 opacity-70 hover:opacity-100"}`}
                    >
                      <img
                        src={img.url}
                        alt={`gallery-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col pt-1 lg:pt-0 min-w-0 lg:max-w-[500px] lg:h-[420px] justify-between relative">
            {isZoomed && (
              <div className="absolute inset-0 z-50 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl pointer-events-none">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${activeImage || product.img})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "250%", // Magnification level
                    backgroundColor: "white",
                  }}
                />
              </div>
            )}

            {/* Top Content wrapper */}
            <div>
              <div className="border-b border-gray-100 pb-2">
                <p className="text-yellow-600 font-bold uppercase tracking-widest text-[9px] mb-1">
                  {product.category}
                </p>
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-green-100 text-green-700 px-1 py-0.5 rounded text-[10px] font-bold">
                    {product.ratingsAverage} <Star size={10} className="fill-green-700" />
                  </div>
                  <span className="text-gray-400 text-[10px] font-medium border-l border-gray-200 pl-2">
                    {product.ratingsQuantity} Reviews
                  </span>
                </div>
              </div>

              <div className="py-2 border-b border-gray-100">
                {/* <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-1">Description</h3> */}
                <div className="max-h-[60px] overflow-y-auto pr-2 custom-scrollbar">
                  <p className="text-gray-600 text-[12px] leading-snug italic">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Feature Cards Row */}
              <div className="flex items-center gap-3 py-3  border-b border-gray-100">
                {[
                  {
                    icon: <Smile className="text-[#FF8A00]" size={18} />,
                    text: "Farm Fresh",
                  },
                  {
                    icon: <Shield className="text-[#FF8A00]" size={18} />,
                    text: "Chemical Free",
                  },
                  {
                    icon: <Truck className="text-[#FF8A00]" size={18} />,
                    text: "Fast Delivery",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="w-20 h-16 flex flex-col items-center justify-center gap-1 bg-[#FFF9F3] border border-[#FFD9B2]/40 rounded-xl p-1"
                  >
                    <div className="">{item.icon}</div>
                    <span className="text-[8px] font-bold text-[#55606B] text-center leading-tight uppercase">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="py-2 border-b border-gray-100">
                {(() => {
                  let displayPrice = 0;
                  let displayFinalPrice = 0;
                  if (product.weightOptions && product.weightOptions.length > 0) {
                    let opt = product.weightOptions.find(wo => wo.weight === selectedWeight);
                    if (!opt) opt = product.weightOptions[0];
                    if (opt) {
                      displayPrice = opt.price;
                      displayFinalPrice = Math.round(opt.price * (1 - (product.discountPercent || 0) / 100));
                    }
                  }
                  
                  return (
                    <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                      <span className="text-3xl font-black text-gray-900">
                        ₹{displayFinalPrice}
                      </span>
                      {product.discountPercent > 0 && (
                        <>
                          <span className="text-lg text-gray-400 line-through">
                            ₹{displayPrice}
                          </span>
                          <span className="text-green-600 text-xs font-black bg-green-50 px-2 py-1 rounded">
                            {product.discountPercent}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  );
                })()}
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs font-medium italic">
                    Net Weight:
                  </span>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {netWeightArray.map((weight, idx) => {
                      let optionFinalPrice = null;
                      if (product.weightOptions && product.weightOptions.length > 0) {
                        const opt = product.weightOptions.find(wo => wo.weight === weight);
                        if (opt) {
                          optionFinalPrice = Math.round(opt.price * (1 - (product.discountPercent || 0) / 100));
                        }
                      }
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedWeight(weight)}
                          className={`group relative flex flex-col items-center justify-center min-w-[80px] px-3 py-1.5 rounded-xl border-2 transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
                            selectedWeight === weight
                              ? "bg-amber-50 border-amber-400 text-amber-800 shadow-md transform scale-105"
                              : "bg-white border-gray-100 text-gray-600 hover:border-amber-300 hover:bg-amber-50/50 hover:-translate-y-1 hover:shadow-lg"
                          }`}
                        >
                          {selectedWeight === weight && (
                            <div className="absolute top-0 right-0 w-8 h-8 bg-amber-400 rounded-bl-full -z-0 opacity-20"></div>
                          )}
                          <span className="text-[13px] font-bold z-10">{weight}</span>
                          {optionFinalPrice !== null && (
                            <span className={`text-[11px] font-black z-10 transition-colors duration-300 ${selectedWeight === weight ? "text-amber-600" : "text-gray-400 group-hover:text-amber-500"}`}>
                              ₹{optionFinalPrice}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-4 w-full">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-9 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 cursor-pointer hover:bg-gray-100 transition-colors text-gray-500"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-1 font-bold w-8 text-center text-sm text-gray-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 cursor-pointer hover:bg-gray-100 transition-colors text-gray-500"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`flex-1 h-9 bg-[#F2B705] text-black font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 text-xs shadow-sm ${adding ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-black hover:text-white"}`}
                >
                  {adding ? (
                    <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
                  ) : (
                    <ShoppingCart size={15} />
                  )}
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={adding}
                  className={`w-full sm:w-auto sm:flex-1 h-9 border border-black text-black font-bold rounded-lg transition-all duration-300 uppercase tracking-widest text-[10px] ${adding ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-black hover:text-white"}`}
                >
                  Buy It Now
                </button>
              </div>

              {/* New Delivery & Policy Section */}
              <div className="mt-6 space-y-4">
                {/* Check Delivery Availability */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                    <MapPin size={18} className="text-[#FF8A00]" />
                    <span>Check Delivery Availability</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      value={pincode}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        setPincode(val);
                        handleCheckDelivery(val);
                      }}
                      className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF8A00] transition-colors placeholder:text-gray-400"
                    />
                    {deliveryStatus === "checking" && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-[#FF8A00] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  {deliveryMsg && (
                    <p
                      className={`text-[10px] font-bold ${deliveryStatus === "available" ? "text-green-600" : "text-red-500"}`}
                    >
                      {deliveryMsg}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Content (Trust Badges) - pushed down by justify-between */}
            {/* <div className="border-t border-gray-100 pt-3 space-y-2 mt-0">
                                <div className="flex items-center gap-2">
                                <div className="bg-yellow-50 p-1 rounded-md text-yellow-700 flex-shrink-0">
                                    <Package size={15} />
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    <h4 className="text-[11px] font-bold text-gray-900">Ingredients:</h4>
                                    <p className="text-[10px] text-gray-500 truncate max-w-[200px]">{product.ingredients}</p>
                                </div>
                                </div>
                                <div className="flex gap-4 pl-1">
                                <div className="flex items-center gap-1 text-[10px] font-medium text-gray-600 hover:text-green-700 transition-colors cursor-default">
                                    <Truck size={14} className="text-green-600" /> Free Delivery
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-medium text-gray-600 hover:text-green-700 transition-colors cursor-default">
                                    <Shield size={14} className="text-green-600" /> Secure Pay
                                </div>
                                </div>
                        </div> */}
          </div>
        </div>
      </main>

      {/* ── Seller Details Section ── */}
      {product.vendor && (
        <section className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 mt-8 mb-4">
          <div className="bg-white rounded-2xl border border-[#F2B705]/30 shadow-[0_4px_24px_-8px_rgba(242,183,5,0.15)] overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3 border-b border-[#F2B705]/20 bg-gradient-to-r from-[#fffbeb] to-white">
              <p className="text-xs font-bold text-[#F2B705] uppercase tracking-widest flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 7H4C2.9 7 2 7.9 2 9v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-9 8H5v-2h6v2zm8-4H5v-2h14v2z"/>
                </svg>
                Seller Details
              </p>
            </div>
            {/* 3-card row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#F2B705]/15 px-2 py-2">
              {/* Card 1 — Seller Name */}
              <div className="flex items-center gap-3 px-4 py-3">
                {/* <div className="w-9 h-9 rounded-lg bg-[#FFF8E1] flex items-center justify-center flex-shrink-0">
                  {product.vendor.photo ? (
                    <img src={product.vendor.photo} alt={product.vendor.name} className="w-9 h-9 rounded-lg object-cover" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F2B705" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/>
                      <path d="M8 21h8M12 17v4"/>
                    </svg>
                  )}
                </div> */}
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Seller</p>
                  <p className="text-sm font-bold text-gray-800 leading-tight">{product.vendor.name}</p>
                  {product.vendor.designation && (
                    <p className="text-[10px] text-[#F2B705] font-medium">{product.vendor.designation}</p>
                  )}
                </div>
              </div>
              {/* Card 2 — Verified Seller */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-lg bg-[#FFF8E1] flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#F2B705">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Status</p>
                  <p className="text-sm font-bold text-gray-800 leading-tight">Verified Seller</p>
                  <p className="text-[10px] text-green-600 font-semibold">✓ Trusted by KaashtKart</p>
                </div>
              </div>
              {/* Card 3 — Address */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-lg bg-[#FFF8E1] flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F2B705" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Location</p>
                  <p className="text-sm font-bold text-gray-800 leading-tight line-clamp-2">
                    {product.vendor.address || "India"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About This Product Section */}
      <section className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 mt-10 mb-16">
        <div className="bg-white rounded-[32px] p-6 md:p-10 border border-gray-100 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden">
          {/* Top Accent Gradient Border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F2B705] via-[#FF8A00] to-[#F2B705]" />
          
          <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2 pb-4 border-b border-gray-50">
            <span className="w-1.5 h-6 bg-[#FF8A00] rounded-full"></span>
            Product Description
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side: Dynamic HTML description or Fallback */}
            <div className="lg:col-span-2 min-w-0">
              {product.aboutHtml ? (
                <div
                  className="prose prose-sm md:prose max-w-none text-gray-700 leading-relaxed custom-product-about"
                  dangerouslySetInnerHTML={{ __html: product.aboutHtml }}
                />
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-bold text-[#FF8A00] uppercase tracking-widest mb-6 italic">
                      Description
                    </h3>

                    <div className="space-y-8 text-gray-700">
                      {/* Point 1 */}
                      <div className="flex gap-4">
                        <span className="text-lg font-bold text-gray-900 pt-0.5">
                          1.
                        </span>
                        <div className="space-y-4">
                          <p className="text-lg font-bold text-gray-900">
                            We ship Raw Mangoes.
                          </p>
                          <ul className="space-y-4 text-sm md:text-base leading-relaxed text-gray-600 list-none pl-0">
                            <li className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></span>
                              As it prevents damage during transit
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></span>
                              Natural ripening is uneven thus mangoes doesn't ripe
                              altogether... providing convenience in consumption to
                              customer.
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></span>
                              Natural ripening renders the mango that distinctive
                              Alphonso aroma and sweetness unlike that of chemical
                              induced ripening.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Point 2 */}
                      <div className="flex gap-4 border-t border-gray-50 pt-8">
                        <span className="text-lg font-bold text-gray-900 pt-0.5">
                          2.
                        </span>
                        <p className="text-sm md:text-base font-medium leading-relaxed text-gray-800">
                          The weight of all mangoes mentioned on the website is
                          related to raw mango. Change in with weight may occur
                          during ripening process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Product Specifications sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#FFFDF9] border border-[#F2B705]/10 rounded-2xl p-5 md:p-6 shadow-sm sticky top-24">
                <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Package className="text-[#FF8A00] w-4.5 h-4.5" />
                  Product Specifications
                </h3>
                
                <div className="space-y-4">
                  {/* Category */}
                  <div className="flex justify-between items-start gap-4 text-sm">
                    <span className="text-gray-500 font-medium whitespace-nowrap">Category:</span>
                    <span className="text-gray-900 font-bold text-right">{product.category}</span>
                  </div>

                  {/* Net Weight */}
                  <div className="flex justify-between items-start gap-4 text-sm border-t border-gray-50 pt-3">
                    <span className="text-gray-500 font-medium whitespace-nowrap">Net Weight:</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {netWeightArray.map((w, idx) => (
                        <span key={idx} className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200/40">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ingredients */}
                  {product.ingredients && product.ingredients !== "N/A" && (
                    <div className="flex justify-between items-start gap-4 text-sm border-t border-gray-50 pt-3">
                      <span className="text-gray-500 font-medium whitespace-nowrap">Ingredients:</span>
                      <span className="text-gray-800 font-semibold text-right leading-snug">{product.ingredients}</span>
                    </div>
                  )}

                  {/* Shelf Life */}
                  {product.shelfLife && product.shelfLife !== "N/A" && (
                    <div className="flex justify-between items-start gap-4 text-sm border-t border-gray-50 pt-3">
                      <span className="text-gray-500 font-medium whitespace-nowrap">Shelf Life:</span>
                      <span className="text-gray-900 font-bold text-right">{product.shelfLife}</span>
                    </div>
                  )}

                  {/* Quality Promise */}
                  <div className="flex justify-between items-start gap-4 text-sm border-t border-gray-50 pt-3">
                    <span className="text-gray-500 font-medium whitespace-nowrap">Quality Promise:</span>
                    <span className="text-green-700 font-bold text-right flex items-center gap-1">
                      <Smile size={14} className="text-green-600" /> Farm Fresh
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 p-2 bg-green-50/40 rounded-xl border border-green-100/30">
                    <Shield size={14} className="text-green-600 flex-shrink-0" />
                    <span className="text-[10px] font-bold text-gray-700">100% Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-green-50/40 rounded-xl border border-green-100/30">
                    <Truck size={14} className="text-green-600 flex-shrink-0" />
                    <span className="text-[10px] font-bold text-gray-700">Safe Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 mb-0">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-xl md:text-2xl font-black text-gray-900">
            Customer Reviews
          </h2>
          {isEligibleToReview && (
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-[#C97E1A] hover:bg-[#9A5E10] text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
            >
              Write a Review
            </button>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="mx-4 mb-10">
            <Slider {...reviewSliderSettings}>
              {reviews.map((review) => (
                <div key={review._id} className="px-2 mb-5">
                  <div
                    className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FEF5E8] flex items-center justify-center text-[#C97E1A] font-bold">
                          {review.user?.firstName?.charAt(0) || review.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">{review.user?.firstName ? `${review.user.firstName} ${review.user.lastName}` : (review.user?.name || "Anonymous User")}</p>
                          <p className="text-[10px] text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      "{review.remark}"
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}


      </section>

      {/* Related Products Section */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 mb-16">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {product.relatedProducts.map((rp) => {
              const mappedProduct = {
                _id: rp._id || rp.id,
                name: rp.name,
                img: rp.mainImage?.url,
                weightOptions: rp.weightOptions,
                discountPercent: rp.discountPercent,
                about: {
                  netWeight: rp.about?.netWeight || [],
                },
                ratingsAverage: rp.ratingsAverage,
                ratingsQuantity: rp.ratingsQuantity,
              };
              return (
                <div key={mappedProduct._id} className="h-full">
                  <LadduCard product={mappedProduct} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      <Footer />

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        productId={product.id} 
        onReviewAdded={handleReviewAdded} 
      />
    </div>
  );
};

export default ProductDetail;
