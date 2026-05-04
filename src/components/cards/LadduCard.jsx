import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCartApi } from '../../api/cart';
import { ShoppingCart, Star, CheckCircle, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const LadduCard = memo(({ product }) => {
    const navigate = useNavigate();
    const [added, setAdded] = useState(false);

    // dummy ratings
    const rating = (Math.random() * (4.9 - 4.2) + 4.2).toFixed(1);

    const name = product?.name;
    const img = product?.img;
    // Fallback price string logic if needed, but we rely on numeric prices mostly
    const description = product?.description;
    const category = product?.category;
    const id = product?.id || product?._id;

    // Price display logic
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
            window.dispatchEvent(new Event('cart-updated')); // Notify Navbar
            setAdded(true);
            toast.success(`${name} added to cart!`, { position: "top-right" });
            setTimeout(() => setAdded(false), 2000);
        } catch (error) {
            console.error("Failed to add to cart:", error);
            // Optional: toast.error("Log in to add items!"); 
        }
    };

    const handleViewDetails = () => {
        navigate(`/product/${id}`);
    };

    return (
        <div
  onClick={handleViewDetails}
  className="bg-[var(--color-surface)] p-0 border border-[var(--color-secondary)]/70 
  flex flex-col transition-all duration-500 hover:scale-[1.02]
  group relative overflow-hidden h-full cursor-pointer"
>

  {/* ✅ IMAGE (NO GAP AT ALL) */}
  <div className="w-full aspect-square overflow-hidden">
    <img
      src={img}
      alt={name}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
    />
  </div>

  {/* ✅ CONTENT (WITH PADDING) */}
  <div className="p-3 md:p-4 flex flex-col">

    {/* NAME */}
    <h3 className="text-sm md:text-base font-semibold text-[var(--color-textMuted)] mb-1 text-left line-clamp-2">
      {name}
    </h3>

    {/* PRICE + BUTTON SECTION */}
    <div className="flex items-end justify-between w-full mt-auto gap-2">

      {/* LEFT: PRICE */}
      <div className="flex flex-col items-start">

        {/* ⭐ Rating */}
        <div className="flex items-center gap-1 mb-1">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold text-[var(--color-text)]">
            {rating}
          </span>
        </div>

        {/* PRICE */}
        <div className="text-base md:text-lg font-bold text-[var(--color-secondary)]">
          ₹{displayPrice}.00
        </div>

        {/* DISCOUNT */}
        {discount > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[12px] text-[var(--color-text-muted)] line-through">
              ₹{originalPrice}
            </span>
            <span className="text-[12px] text-green-600 font-bold">
              {discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* RIGHT: BUTTONS */}
      <div
        className="flex gap-1 w-[120px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleAddToCart}
          disabled={added}
          className={`
            flex-1 py-1 rounded-lg
            flex items-center justify-center gap-1
            text-[12px] font-semibold
            transition-all
            ${added
              ? 'bg-green-600 text-white'
              : 'bg-white text-[var(--color-secondary)] border border-[var(--color-secondary)]/30'
            }
          `}
        >
          {added ? (
            <>
              <CheckCircle size={12} />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingCart size={12} />
              <span>Cart</span>
            </>
          )}
        </button>

        <button
          onClick={async (e) => {
            e.stopPropagation();
            const isAuth = await checkAuth();
            if (!isAuth) return;
            try {
              await addToCartApi({ productId: id, quantity: 1 });
              window.dispatchEvent(new Event('cart-updated'));
              navigate('/shop');
            } catch (error) {
              console.error("Buy now failed:", error);
            }
          }}
          className="
            flex-1 py-1 rounded-lg
            bg-[var(--color-secondary)] text-[var(--color-primary)]
            flex items-center justify-center
            text-[12px] font-semibold
            transition-all
          "
        >
          Buy
        </button>
      </div>

    </div>
  </div>
</div>
    );
});

LadduCard.displayName = 'LadduCard';

export default LadduCard;

