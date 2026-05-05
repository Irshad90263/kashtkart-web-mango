import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCartApi } from '../../api/cart';
import { ShoppingCart, Star, CheckCircle, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const LadduCard = memo(({ product }) => {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  // Random rating between 4.2 and 4.9
  const rating = (Math.random() * (4.9 - 4.2) + 4.2).toFixed(1);

  // Random review count between 1200 and 1500
  const reviewCount = Math.floor(Math.random() * (1500 - 1200 + 1) + 1200);

  // Random star rating display (4 or 5 stars)
  const fullStars = Math.floor(Math.random() * 1) + 4; // 4 or 5 stars
  const hasHalfStar = Math.random() > 0.7; // 30% chance of half star

  const name = product?.name;
  const img = product?.img;
  const id = product?.id || product?._id;
  const displayPrice = product?.finalPrice || product?.price;
  const originalPrice = product?.price;
  const discount = product?.discountPercent;

  const checkAuth = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      const result = await Swal.fire({
        title: 'Authentic Taste Awaits!',
        text: 'Please login to add these delicious laddus to your cart.',
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

    try {
      await addToCartApi({ productId: id, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated'));
      setAdded(true);
      toast.success(`${name} added to cart!`, { position: "top-right" });
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  // Function to render stars based on rating
  const renderStars = (ratingValue) => {
    const stars = [];
    const fullStarsCount = Math.floor(ratingValue);
    const hasHalf = ratingValue % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStarsCount) {
        stars.push(<Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStarsCount + 1 && hasHalf) {
        stars.push(
          <div key={i} className="relative">
            <Star size={14} className="text-gray-300 fill-gray-300" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={14} className="text-gray-300 fill-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div
      onClick={handleViewDetails}
      className="bg-[var(--color-surface)] border border-[var(--color-secondary)]/70 
        flex flex-col transition-all duration-500 hover:scale-[1.02]
        group relative overflow-hidden h-full cursor-pointer rounded-xl"
    >
      {/* IMAGE SECTION */}
      <div className="w-full aspect-square overflow-hidden bg-gray-100">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* CONTENT SECTION */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 bg-white/80">

        {/* Product Name */}
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 line-clamp-2 min-h-[48px] sm:min-h-[56px]">
          {name}
        </h3>

        {/* Rating Section */}
        <div className="flex items-center gap-1 mt-1 mb-2">
          <div className="flex items-center gap-0.5">
            {renderStars(parseFloat(rating))}
          </div>
          <span className="text-xs font-semibold text-gray-700 ml-1">{rating}</span>
          <span className="text-[10px] text-gray-400 ml-1">({reviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-secondary)]">
              ₹{displayPrice}
            </span>
            {discount > 0 && (
              <>
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  ₹{originalPrice}
                </span>
                <span className="text-[11px] sm:text-xs text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded-md">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="mt-3 sm:mt-4">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`
                w-full rounded-lg py-2.5 sm:py-3
                flex items-center justify-center gap-2
                text-sm sm:text-base font-semibold
                transition-all duration-300
                ${added
                  ? 'bg-green-600 text-white cursor-default'
                  : 'bg-[var(--color-secondary)] text-[var(--color-primary)] hover:bg-yellow-600 hover:scale-[1.02] active:scale-95 shadow-md'
                }
              `}
            >
              {added ? (
                <>
                  <CheckCircle size={18} />
                  <span>Added to Cart ✓</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

LadduCard.displayName = 'LadduCard';

export default LadduCard;