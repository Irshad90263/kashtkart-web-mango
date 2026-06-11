import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCartApi } from '../../api/cart';
import { ShoppingCart, Star, CheckCircle, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const LadduCard = memo(({ product, isBookingPage = false, onBookNow }) => {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const rating = product?.ratingsAverage ? parseFloat(product.ratingsAverage).toFixed(1) : 0;
  const reviewCount = product?.ratingsQuantity || 0;

  const name = product?.name;
  const img = product?.img;
  const id = product?.id || product?._id;
  const slug = product?.slug || id;  // slug prefer karo, fallback id
  const rawNetWeight = product?.about?.netWeight;
  const netWeightArray = Array.isArray(rawNetWeight) 
    ? rawNetWeight 
    : (rawNetWeight ? [rawNetWeight] : ["N/A"]);
    
  const [selectedWeight, setSelectedWeight] = useState(netWeightArray[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  let displayPrice = 0;
  let originalPrice = 0;
  const discount = product?.discountPercent || 0;

  if (product?.weightOptions && product.weightOptions.length > 0) {
    let opt = product.weightOptions.find(wo => wo.weight === selectedWeight);
    if (!opt) opt = product.weightOptions[0];
    if (opt) {
      originalPrice = opt.price;
      displayPrice = Math.round(opt.price * (1 - (discount || 0) / 100));
    }
  }


  const checkAuth = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      const result = await Swal.fire({
        title: 'Authentic Taste Awaits!',
        text: 'Please login to add these delicious Manfo to your cart.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#F2B705',
        cancelButtonColor: '#2E2E2E',
        confirmButtonText: 'Login Now',
        cancelButtonText: 'Later',
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

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const isAuth = await checkAuth();
    if (!isAuth) return;

    setAdding(true);
    try {
      await addToCartApi({ 
        productId: id, 
        quantity: 1, 
        selectedWeight: selectedWeight !== "N/A" ? selectedWeight : undefined 
      });
      window.dispatchEvent(new Event('cart-updated'));
      setAdded(true);
      toast.success(`${name} added to cart!`, { position: "top-right" });
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart. Please try again.", { position: "top-right" });
    } finally {
      setAdding(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${slug}`);
  };



  return (
    <div
      onClick={handleViewDetails}
      className={`bg-[var(--color-surface)] border border-[var(--color-secondary)]/70 
        flex flex-col transition-all duration-500 hover:scale-[1.02]
        group relative h-full cursor-pointer rounded-xl ${isDropdownOpen ? 'z-[100]' : 'z-10'}`}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10 bg-[#FF4D4D] text-white text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-md shadow-md transform group-hover:scale-110 transition-transform duration-300">
          {discount}% OFF
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="w-full aspect-square overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* CONTENT SECTION */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 bg-white/80 rounded-b-xl">

        {/* Category */}
        {product?.category && (
          <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {product.category}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-sm sm:text-base md:text-md font-semibold text-gray-800 line-clamp-2 mb-2">
          {name}
        </h3>

        {/* Rating Section */}
        {reviewCount > 0 ? (
          <div className="flex items-center mt-1 mb-2 gap-2">
            <div className="flex items-center gap-0.5 bg-green-100 text-green-700 px-1 py-0.5 rounded text-[10px] font-bold">
              {rating} <Star size={10} className="fill-green-700" />
            </div>
            <span className="text-gray-400 text-[10px] font-medium border-l border-gray-200 pl-2">
              {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        ) : (
          <div className="flex items-center mt-1 mb-2">
            <span className="text-[10px] text-gray-400 italic font-medium bg-gray-50 px-2 py-0.5 rounded border border-gray-100">No reviews yet</span>
          </div>
        )}

        {/* Net Weight Badge */}
        <div className="mb-3 relative">
          <div 
            onClick={(e) => {
              if (netWeightArray.length > 1) {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
            className={`flex w-full items-center justify-between px-3 py-2 bg-amber-50/50 border border-amber-200/40 rounded-lg text-[11px] sm:text-xs transition-colors ${netWeightArray.length > 1 ? 'cursor-pointer hover:bg-amber-100/50' : ''}`}
          >
            <span className="text-amber-700/80 font-medium">Net Weight</span>
            <div className="flex items-center gap-1">
              <span className="text-[var(--color-secondary)] font-black">
                {selectedWeight}
              </span>
              {netWeightArray.length > 1 && (
                <svg className={`w-3 h-3 text-[var(--color-secondary)] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          </div>

          {/* Custom Dropdown */}
          {isDropdownOpen && netWeightArray.length > 1 && (
            <>
              {/* Invisible overlay to catch clicks outside */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(false);
                }}
              />
              <div className="absolute bottom-full left-0 w-full mb-1 bg-white border border-amber-200/50 rounded-lg shadow-xl z-50 overflow-hidden">
                {netWeightArray.map((weight, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWeight(weight);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-3 py-2 text-xs sm:text-sm cursor-pointer transition-colors ${selectedWeight === weight ? 'bg-amber-100/80 text-[var(--color-secondary)] font-bold' : 'hover:bg-amber-50 text-gray-700 font-medium'}`}
                  >
                    {weight}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Price and Action Section */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-[#FF6B00] leading-tight">
              ₹{displayPrice}
            </span>
            {discount > 0 && (
              <span className="text-xs sm:text-sm text-gray-400 line-through leading-tight">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {isBookingPage ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onBookNow) onBookNow({
                  ...product, 
                  selectedWeight: selectedWeight !== "N/A" ? selectedWeight : undefined
                });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F2B705] hover:bg-[#e0a904] text-white font-bold text-xs sm:text-sm transition-colors active:scale-95 duration-200"
            >
              <span>Book Now</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={added || adding}
              className={`
                flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm border
                transition-all duration-300 active:scale-95
                ${added 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : 'bg-white border text-[#FF6B00] hover:bg-yellow-50'
                }
                ${adding ? 'cursor-not-allowed opacity-70' : ''}
                text-xs sm:text-sm font-bold
              `}
            >
              {adding ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-[#FF6B00] border-t-transparent rounded-full"></div>
                  <span>Adding...</span>
                </>
              ) : added ? (
                <>
                  <CheckCircle size={16} />
                  <span className="hidden sm:inline">Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

LadduCard.displayName = 'LadduCard';

export default LadduCard;