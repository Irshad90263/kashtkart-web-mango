import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  MapPin,
  CreditCard,
  CheckCircle2,
  Plus,
  Minus,
  Banknote,
  Smartphone,
  X,
  Home,
  Briefcase,
  User,
  Pencil,
  Tag,
  ChevronRight,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Footer from "../../components/layout/Footer";
import {
  getAddressesApi,
  addAddressApi,
  updateAddressApi,
} from "../../api/address";
import {
  getCartApi,
  updateCartItemApi,
  removeFromCartApi,
  clearCartApi,
} from "../../api/cart";
import {
  createPaymentOrderApi,
  verifyPaymentApi,
  handlePaymentFailureApi,
  placeOrderApi,
} from "../../api/payment";
import { getProfileApi } from "../../api/user";
import { getPaymentMethodsApi } from "../../api/method";
import { checkDeliveryApi } from "../../api/delivery";

const Shop = () => {
  const navigate = useNavigate();
  const sectionRefs = useRef([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Cart Data State
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loadingCart, setLoadingCart] = useState(true);

  // Address Management State
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [isPincodeFetching, setIsPincodeFetching] = useState(false);

  // Multi-Courier State
  const [availableCouriers, setAvailableCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState("");
  const [checkingCourier, setCheckingCourier] = useState(false);
  const [courierError, setCourierError] = useState("");

  // Dynamic shipping charge — selected courier ka actual freightCharge
  const HANDLING_FEE = 20; // Fixed
  const selectedCourierObj = availableCouriers.find((c) => c.provider === selectedCourier);
  const dynamicShippingCharge = selectedCourierObj?.freightCharge
    ? Math.ceil(selectedCourierObj.freightCharge) // Round up to nearest rupee
    : 0; // Fallback if no courier selected yet

  // Helper to calculate total weight from cart items
  const calculateTotalWeight = () => {
    return cartItems.reduce((total, item) => {
      const weightStr = (item.netWeight || "0.5").toLowerCase();
      let weightNum = parseFloat(weightStr.replace(/[^0-9.]/g, "")) || 0.5;
      
      if (weightStr.includes("kg")) {
        // Already in kg
      } else if (weightStr.includes("gm") || weightStr.includes("g")) {
        // Convert grams to kg
        weightNum = weightNum / 1000;
      }
      
      return total + (weightNum * (item.quantity || 1));
    }, 0);
  };

  const totalOrderWeight = calculateTotalWeight();

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "home",
  });

  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState({ name: "", phone: "", email: "" });
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Fetch User Profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileApi();
        if (data && data.user) {
          setUserId(data.user._id);
          const name =
            data.user.firstName && data.user.lastName
              ? `${data.user.firstName} ${data.user.lastName}`
              : "";
          const phone = data.user.phone || "";
          const email = data.user.email || "";
          setProfileData({ name, phone, email });
          // Autofill address form with profile data
          setAddressForm((prev) => ({
            ...prev,
            name: name || prev.name,
            phone: phone || prev.phone,
            email: email || prev.email,  // Auto-fill registered email
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Fetch Cart Data
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoadingCart(true);
    try {
      const data = await getCartApi();
      if (data && data.items) {
        // Map backend items to UI structure
        const mappedItems = data.items.map((item) => ({
          uniqueId: item.product._id, // Using product ID as unique ID
          cartItemId: item._id, // Store the cart item ID for updates and removal
          productId: item.product._id,
          name: item.product.name,
          img: item.product.mainImage?.url,
          price: item.product.finalPrice, // Use finalPrice as the effective price
          originalPrice: item.product.price, // Original price for display
          discountPercent: item.product.discountPercent, // Discount info
          ingredients: item.product.about?.ingredients, // Extract ingredients
          netWeight: item.product.about?.netWeight, // Net weight from about
          quantity: item.quantity,
          description: item.product.description,
        }));
        setCartItems(mappedItems);

        // Use backend totalAmount directly as requested
        if (data.totalAmount !== undefined && data.totalAmount !== null) {
          setCartTotal(data.totalAmount);
        } else {
          const total = mappedItems.reduce(
            (sum, item) => sum + (item.price || 0) * item.quantity,
            0,
          );
          setCartTotal(total);
        }
      } else {
        setCartItems([]);
        setCartTotal(0);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  };

  const handleQuantityChange = async (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      await updateCartItemApi(itemId, newQuantity);
      fetchCart();
      window.dispatchEvent(new Event("cart-updated")); // Notify Navbar
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    const result = await Swal.fire({
      title: "Remove Item?",
      text: "Are you sure you want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#ffffff",
      customClass: {
        popup: "swal-dark-popup",
        title: "swal-dark-title",
        content: "swal-dark-content",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await removeFromCartApi(itemId);
      fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
      toast.success("Item removed from cart!", { position: "top-right" });
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item. Please try again.", {
        position: "top-right",
      });
    }
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "Clear Cart?",
      text: "Are you sure you want to remove all items from your tray?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#ffffff",
      customClass: {
        popup: "swal-dark-popup",
        title: "swal-dark-title",
        content: "swal-dark-content",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await clearCartApi();
      fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
      toast.success("Cart cleared!", { position: "top-right" });
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart. Please try again.", {
        position: "top-right",
      });
    }
  };

  // Fetch addresses on mount
  useEffect(() => {
    fetchAddresses();
    fetchPaymentMethods();
  }, []);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await getAddressesApi();
      if (data && data.addresses && data.addresses.length > 0) {
        setSavedAddresses(data.addresses);
        if (!selectedAddressId) {
          const defaultAddr =
            data.addresses.find((addr) => addr.isDefault) || data.addresses[0];
          setSelectedAddressId(defaultAddr._id);
        }
      } else {
        setShowAddressForm(true);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const data = await getPaymentMethodsApi();
      if (data && Array.isArray(data)) {
        setPaymentMethods(data);
        if (data.length > 0) {
          const defaultMethod =
            data.find((m) => m.name.toLowerCase().includes("cash")) || data[0];
          setPaymentMethod(
            defaultMethod.name.toLowerCase().includes("cash") ? "cod" : "upi",
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const fetchPincodeDetails = async (pincode) => {
    if (pincode.length !== 6) return;
    setIsPincodeFetching(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await response.json();
      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setAddressForm((prev) => ({
          ...prev,
          city: postOffice.District || prev.city,
          state: postOffice.State || prev.state,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch pincode details:", error);
    } finally {
      setIsPincodeFetching(false);
    }
  };

  // Multi-Courier Fetch Logic
  const fetchCourierAvailability = async () => {
    if (!selectedAddressId || cartItems.length === 0) return;

    const selectedAddress = savedAddresses.find(
      (addr) => addr._id === selectedAddressId
    );
    if (!selectedAddress || !selectedAddress.pincode) return;

    setCheckingCourier(true);
    setCourierError("");
    try {
      const totalWeight = totalOrderWeight;
      console.log(`🔍 Checking delivery for ${selectedAddress.pincode}, weight: ${totalWeight}`);
      
      const response = await checkDeliveryApi(selectedAddress.pincode, totalWeight);
      console.log("Available Couriers:", response);
      
      if (response.success && response.availableCouriers?.length > 0) {
        setAvailableCouriers(response.availableCouriers);
        setSelectedCourier(response.availableCouriers[0].provider);
        console.log("Selected Courier:", response.availableCouriers[0].provider);
      } else {
        setAvailableCouriers([]);
        setSelectedCourier("");
        setCourierError("No delivery service available for this pincode.");
      }
    } catch (error) {
      console.error("Courier check failed:", error);
      setCourierError("Failed to check delivery availability. Please try again.");
      setAvailableCouriers([]);
      setSelectedCourier("");
    } finally {
      setCheckingCourier(false);
    }
  };

  useEffect(() => {
    if (selectedAddressId && savedAddresses.length > 0) {
      fetchCourierAvailability();
    }
  }, [selectedAddressId, savedAddresses, cartItems.length]);

  const handleEditAddress = (addr) => {
    setAddressForm({
      name: addr.name || "",
      phone: addr.phone || "",
      email: addr.email || profileData.email || "",  // from saved address or profile
      addressLine1: addr.addressLine1 || "",
      addressLine2: addr.addressLine2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      addressType:
        addr.addressType?.toLowerCase() === "work" ||
        addr.addressType?.toLowerCase() === "office"
          ? "office"
          : addr.addressType?.toLowerCase() || "home",
    });
    setEditingAddressId(addr._id);
    setShowAddressForm(true);
    // Scroll to form location
    const section = document.getElementById("delivery-address-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSaveAddress = async () => {
    if (
      !addressForm.name ||
      !addressForm.phone ||
      !addressForm.addressLine1 ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.pincode
    ) {
      toast.error("Please fill in all required fields.", {
        position: "top-right",
      });
      return;
    }

    if (addressForm.pincode.length !== 6) {
      toast.error("Pincode must be exactly 6 digits.", {
        position: "top-right",
      });
      return;
    }

    setIsAddressSaving(true);
    try {
      if (editingAddressId) {
        await updateAddressApi(editingAddressId, addressForm);
      } else {
        await addAddressApi(addressForm);
      }

      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm({
        name: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        addressType: "home",
      });
      fetchAddresses();
      toast.success("Address saved successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error("Failed to save address. Please try again.", {
        position: "top-right",
      });
    } finally {
      setIsAddressSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm({
      name: "",
      phone: "",
      email: profileData.email || "",  // restore from profile
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      addressType: "home",
    });
  };

  // Helper to load Razorpay script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!", { position: "top-right" });
      return;
    }
    if (!selectedAddressId) {
      toast.error("Please select a delivery address!", {
        position: "top-right",
      });
      // Scroll to address section
      const addressSection = document.getElementById("delivery-address-section");
      if (addressSection) addressSection.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!selectedCourier && availableCouriers.length > 0) {
      toast.error("Please select a delivery courier!");
      return;
    }

    if (courierError || (availableCouriers.length === 0 && !checkingCourier)) {
      toast.error("Delivery not available for this location.");
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Order?",
      text: `Place order for ₹${cartTotal + dynamicShippingCharge + HANDLING_FEE}? (Shipping: ₹${dynamicShippingCharge} + Handling: ₹${HANDLING_FEE})`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--color-secondary)",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, place it!",
      background: "#1f2937",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    // Get selected address object
    const selectedAddress = savedAddresses.find(
      (addr) => addr._id === selectedAddressId,
    );
    const finalAmount = cartTotal + dynamicShippingCharge + HANDLING_FEE; // Dynamic shipping + fixed handling

    setIsPlacingOrder(true);
    if (paymentMethod === "cod") {
      try {
        // Prepare address object from savedAddresses
        const selectedAddress = savedAddresses.find(
          (addr) => addr._id === selectedAddressId,
        );

        const orderData = {
          userId: userId, // Added userId to satisfy backend requirement
          addressId: selectedAddressId,
          paymentMethod: "COD",
          notes: "Direct Order (COD)",
          // Including items and full address as per user's "example" structure
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: "Standard", // Default values as per example structure
            color: "Default",
          })),
          shippingAddress: {
            name: selectedAddress.name,
            phone: selectedAddress.phone,
            email: profileData.email || "",  // User email for Shiprocket
            addressLine1: selectedAddress.addressLine1,
            addressLine2: selectedAddress.addressLine2 || "",
            city: selectedAddress.city,
            state: selectedAddress.state,
            pincode: selectedAddress.pincode,
            country: "India",
          },
          handlingFee: HANDLING_FEE,
          shippingCharges: dynamicShippingCharge,
          selectedCourier: selectedCourier,
          weight: totalOrderWeight,
        };

        const response = await placeOrderApi(orderData);

        if (
          response &&
          (response.order || response.message === "Order placed successfully")
        ) {
          toast.success(response.message || "Order placed successfully!", {
            position: "top-right",
          });
          try {
            await clearCartApi();
          } catch (e) {
            console.error("Manual clear failed", e);
          } // Force clear cart on backend
          setCartItems([]); // Explicitly clear cart state
          setCartTotal(0);
          window.dispatchEvent(new Event("cart-updated")); // Notify Navbar
          navigate("/orders"); // Navigate to orders page
        } else {
          toast.error(response.message || "Failed to place order.", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("COD placement error:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to place order. Please try again.";
        toast.error(errorMsg, { position: "top-right" });
      } finally {
        setIsPlacingOrder(false);
      }
      return;
    }

    if (paymentMethod === "upi") {
      const res = await loadRazorpay();
      if (!res) {
        toast.error(
          "Razorpay SDK failed to load. Please check your internet connection.",
          { position: "top-right" },
        );
        return;
      }

      try {
        // 1. Create Order
        const orderData = await createPaymentOrderApi({
          shippingCharges: dynamicShippingCharge,
          handlingFee: HANDLING_FEE,
          shippingCharge: dynamicShippingCharge,
          handling_fee: HANDLING_FEE,
          subtotal: Number(cartTotal),
          total: Number(finalAmount),
          amount: finalAmount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          userId: userId,
          addressId: selectedAddressId,
          paymentMethod: "Online",
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: "Standard",
            color: "Default",
          })),
          notes: {
            shippingCharges: dynamicShippingCharge,
            handlingFee: HANDLING_FEE,
            userId: userId,
            paymentMethod: "Online",
            selectedCourier: selectedCourier,
            weight: totalOrderWeight,
          },
        });

        if (!orderData || !orderData.success) {
          toast.error("Could not create order. Please try again.", {
            position: "top-right",
          });
          return;
        }

        // 2. Open Razorpay
        const options = {
          key: orderData.key_id,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: "SKS Laddu",
          description: "Order for Delicious Laddus",
          order_id: orderData.order.id,
          handler: async function (response) {
            try {
              const orderData = {
                userId: userId,
                addressId: selectedAddressId,
                paymentMethod: "Online",
                subtotal: Number(cartTotal),
                shippingCharges: dynamicShippingCharge,
                handlingFee: HANDLING_FEE,
                total: Number(finalAmount),
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                items: cartItems.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  size: "Standard",
                  color: "Default",
                })),
                shippingAddress: {
                  name: selectedAddress.name,
                  phone: selectedAddress.phone,
                  email: profileData.email || "",  // User email for Shiprocket
                  addressLine1: selectedAddress.addressLine1,
                  addressLine2: selectedAddress.addressLine2 || "",
                  city: selectedAddress.city,
                  state: selectedAddress.state,
                  pincode: selectedAddress.pincode,
                  country: "India",
                },
                notes: "Online Order",
                selectedCourier: selectedCourier,
                weight: totalOrderWeight,
              };

              const orderRes = await placeOrderApi(orderData);

              if (
                orderRes &&
                (orderRes.order ||
                  orderRes.message === "Order placed successfully")
              ) {
                toast.success("Payment Successful! Order Placed.", {
                  position: "top-right",
                });
                try {
                  await clearCartApi();
                } catch (e) {
                  console.error("Manual clear failed", e);
                }
                setCartItems([]);
                setCartTotal(0);
                window.dispatchEvent(new Event("cart-updated"));
                navigate("/orders");
              } else {
                toast.error(
                  orderRes.message || "Payment verification failed.",
                  { position: "top-right" },
                );
              }
            } catch (error) {
              console.error("Online placement error:", error);
              toast.error("Failed to sync order after payment.", {
                position: "top-right",
              });
            }
          },
          prefill: {
            name: selectedAddress.name,
            contact: selectedAddress.phone,
          },
          notes: {
            address: `${selectedAddress.addressLine1}, ${selectedAddress.city}`,
            shippingCharges: dynamicShippingCharge,
            handlingFee: HANDLING_FEE,
            totalAmount: finalAmount,
          },
          theme: {
            color: "#FFD700",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response) {
          handlePaymentFailureApi({
            razorpay_order_id: orderData.order.id,
            error: response.error,
          });
          toast.error(`Payment Failed: ${response.error.description}`, {
            position: "top-right",
          });
        });
        paymentObject.open();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong during payment initialization.", {
          position: "top-right",
        });
      } finally {
        setIsPlacingOrder(false);
      }
    }
  };

  const handleItemClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-[var(--color-primary)] text-[var(--color-text)] font-[var(--font-body)] min-h-screen relative overflow-hidden">
      <style>{`
                .shop-bubble {
                    position: absolute;
                    background: var(--color-secondary);
                    border-radius: 50%;
                    opacity: 0.05;
                    animation: float-shop 25s infinite ease-in-out;
                    z-index: 0;
                }
                .shop-bubble-1 { width: 150px; height: 150px; left: -50px; top: 15%; }
                .shop-bubble-2 { width: 250px; height: 250px; right: -100px; top: 45%; animation-delay: 5s; }
                .shop-bubble-3 { width: 100px; height: 100px; left: 30%; bottom: 10%; animation-delay: 2s; }
                @keyframes float-shop {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(40px, -50px) scale(1.1); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 215, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 215, 0, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 215, 0, 0.5);
                }
            `}</style>

      {/* Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="shop-bubble shop-bubble-1"></div>
        <div className="shop-bubble shop-bubble-2"></div>
        <div className="shop-bubble shop-bubble-3"></div>
      </div>

      {/* Title Section */}
      <div className="py-8 md:py-12 px-6 md:px-24 bg-[var(--color-surface)] border-b border-[var(--color-secondary)]/10 mb-6 md:mb-10 shadow-sm relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-[var(--color-secondary)]">
              Review Your Order
            </h1>
            <p className="text-xs md:text-base text-[var(--color-text-muted)] mt-1 md:mt-2">
              Check your items and provide delivery details.
            </p>
          </div>
          <div className="bg-[var(--color-primary)] px-4 py-2 md:px-6 md:py-3 rounded-2xl border border-[var(--color-secondary)]/20 flex items-center gap-3 w-fit">
            <ShoppingBag size={18} className="text-[var(--color-secondary)]" />
            <div>
              <span className="text-[9px] md:text-xs text-[var(--color-text-muted)] uppercase font-bold tracking-wider">
                Total Items:{" "}
              </span>
              <span className="text-base md:text-xl font-bold text-[var(--color-secondary)]">
                {cartItems.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {cartItems.length === 0 && !loadingCart ? (
          <div className="bg-[var(--color-surface)] p-12 md:p-20 rounded-3xl text-center border border-dashed border-[var(--color-secondary)]/20 shadow-sm">
            <div className="text-5xl md:text-6xl mb-6">🛒</div>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-secondary)] mb-4 font-[var(--font-heading)]">
              Your tray is empty!
            </h2>
            <p className="text-sm md:text-base text-[var(--color-text-muted)] mb-8 max-w-md mx-auto italic">
              It seems you haven't added any laddus to your order yet. Head over
              to our gallery to pick your favorites.
            </p>
            <a
              href="/laddus"
              className="inline-block px-8 md:px-10 py-3 md:py-4 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-xl font-bold hover:bg-[#ffe033] transition-all no-underline shadow-[0_4px_15px_rgba(255,212,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,212,0,0.4)] text-sm md:text-base"
            >
              Browse Our Laddus
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            <div className="lg:col-span-2 space-y-6 lg:space-y-10">
              {/* Selected Items List */}
              <div
                ref={addToRefs}
                className="scroll-section space-y-6 relative"
              >
                <div className="flex flex-row justify-between items-center mb-6 gap-2">
                  <h2 className="text-lg md:text-xl font-bold text-[var(--color-secondary)] flex items-center gap-2 font-[var(--font-heading)] whitespace-nowrap">
                    Selected Items
                  </h2>
                  {cartItems.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="text-red-400 hover:text-red-300 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-2 rounded-lg hover:bg-white/5 transition-all flex-shrink-0"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">Clear Cart</span>
                      <span className="sm:hidden">Clear</span>
                    </button>
                  )}
                </div>
                {/* Scroll wrap approx height of 3 items (3 * 130px + gaps) */}
                <div className="max-h-[420px] overflow-y-auto custom-scrollbar pr-2 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.uniqueId}
                      className="bg-[var(--color-surface)] p-2.5 md:p-4 rounded-2xl md:rounded-3xl border border-[var(--color-secondary)]/10 shadow-sm hover:border-[var(--color-secondary)]/30 transition-all overflow-hidden"
                    >
                      <div className="flex flex-row items-center gap-2.5 md:gap-4 text-left">
                        {/* Image - More compact on mobile */}
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 md:w-24 md:h-24 rounded-lg md:rounded-2xl overflow-hidden border border-[var(--color-secondary)]/20 flex-shrink-0 cursor-pointer"
                          onClick={() => handleItemClick(item.productId)}
                        >
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Content Component */}
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <h3
                                className="font-bold text-[11px] sm:text-[13px] md:text-base text-[var(--color-text)] cursor-pointer hover:text-[var(--color-secondary)] transition-colors line-clamp-1"
                                onClick={() => handleItemClick(item.productId)}
                              >
                                {item.name}
                              </h3>
                              <p className="text-[10px] md:text-xs text-[var(--color-text-muted)] font-medium line-clamp-1">
                                {item.ingredients || "Fresh Ingredients"}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-[11px] sm:text-[13px] md:text-lg text-[var(--color-secondary)]">
                                ₹{(item.price || 0) * (item.quantity || 1)}
                              </p>
                              <button
                                onClick={() => removeFromCart(item.cartItemId)}
                                className="mt-3 text-red-400/80 hover:text-red-300 font-bold text-xs uppercase hidden md:block"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="mt-2 md:mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 md:gap-3 bg-[var(--color-primary)]/50 rounded-lg p-0.5 md:p-1 border border-[var(--color-secondary)]/5">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.cartItemId,
                                    item.quantity,
                                    -1,
                                  )
                                }
                                className="w-5 h-5 md:w-8 md:h-8 flex items-center justify-center bg-[var(--color-muted)] text-[var(--color-text)] rounded hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors font-bold"
                              >
                                −
                              </button>
                              <span className="text-[11px] md:text-sm font-bold min-w-[1rem] text-center text-[var(--color-text)]">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.cartItemId,
                                    item.quantity,
                                    1,
                                  )
                                }
                                className="w-5 h-5 md:w-8 md:h-8 flex items-center justify-center bg-[var(--color-muted)] text-[var(--color-text)] rounded hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors font-bold"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="text-red-500 hover:text-red-600 font-semibold text-xs uppercase md:hidden ml-8"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {cartItems.length > 3 && (
                  <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-500 italic">
                      Scroll for more items ↓
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery Location Section */}
              <div
                ref={addToRefs}
                id="delivery-address-section"
                className="scroll-section space-y-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 px-1 gap-3">
                  <h2 className="text-sm md:text-xl font-bold text-[var(--color-secondary)] flex items-center gap-2 font-[var(--font-heading)] whitespace-nowrap">
                    <MapPin
                      size={18}
                      className="text-[var(--color-secondary)] md:w-5 md:h-5 flex-shrink-0"
                    />
                    Delivery Address
                  </h2>
                  {savedAddresses.length > 0 && !showAddressForm && (
                    <button
                      onClick={() => {
                        setEditingAddressId(null);
                        setAddressForm({
                          name: profileData.name,
                          phone: profileData.phone,
                          addressLine1: "",
                          addressLine2: "",
                          city: "",
                          state: "",
                          pincode: "",
                          addressType: "home",
                        });
                        setShowAddressForm(true);
                        const section = document.getElementById(
                          "delivery-address-section",
                        );
                        if (section) {
                          section.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 rounded-xl text-xs md:text-xs font-bold hover:bg-[var(--color-secondary)]/20 transition-all shadow-sm w-full md:w-auto"
                    >
                      <Plus size={16} className="md:w-3.5 md:h-3.5" />
                      Add New Address
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Saved Addresses List */}
                  {!showAddressForm && savedAddresses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => setSelectedAddressId(addr._id)}
                          className={`p-5 rounded-[25px] border cursor-pointer transition-all relative group ${
                            selectedAddressId === addr._id
                              ? "bg-[var(--color-secondary)]/10 border-[var(--color-secondary)]"
                              : "bg-[var(--color-surface)] border-[var(--color-secondary)]/10 hover:border-[var(--color-secondary)]/30 shadow-sm"
                          }`}
                        >
                          {selectedAddressId === addr._id && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle2
                                className="text-[var(--color-secondary)]"
                                size={20}
                              />
                            </div>
                          )}

                          {/* Edit Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(addr);
                            }}
                            className="absolute top-4 right-12 text-gray-400 hover:text-[var(--color-secondary)] p-1 rounded-full hover:bg-[var(--color-secondary)]/10 transition-colors z-10"
                            title="Edit Address"
                          >
                            <Pencil size={16} />
                          </button>

                          <div className="flex items-center gap-2 mb-2">
                            {(addr.addressType === "work" ||
                              addr.addressType === "office") && (
                              <Briefcase size={16} className="text-gray-400" />
                            )}
                            {addr.addressType === "home" && (
                              <Home size={16} className="text-gray-400" />
                            )}
                            <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                              {addr.addressType === "work"
                                ? "Office"
                                : addr.addressType || "Home"}
                            </span>
                          </div>
                          <h3 className="font-bold text-[var(--color-text)] mb-1">
                            {addr.name}
                          </h3>
                          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-2">
                            {addr.addressLine1},{" "}
                            {addr.addressLine2 && `${addr.addressLine2}, `}
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-sm font-medium text-[var(--color-secondary)]">
                            {addr.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add/Edit Address Form */}
                  {(showAddressForm || savedAddresses.length === 0) && (
                    <div className="bg-[var(--color-muted)] p-6 md:p-8 rounded-[35px] shadow-lg border border-[var(--color-secondary)]/10 space-y-5">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-white text-lg">
                          {editingAddressId
                            ? "Edit Address"
                            : "Add New Address"}
                        </h3>
                        {savedAddresses.length > 0 && (
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">
                            Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full px-5 py-3.5 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-secondary)]/10 rounded-2xl focus:border-[var(--color-secondary)] outline-none text-sm font-medium transition-colors placeholder-gray-400"
                            value={addressForm.name}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[0-9]/g,
                                "",
                              );
                              setAddressForm({ ...addressForm, name: value });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="Your Number"
                            className="w-full px-5 py-3.5 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-secondary)]/10 rounded-2xl focus:border-[var(--color-secondary)] outline-none text-sm font-medium transition-colors placeholder-gray-400"
                            value={addressForm.phone}
                            onChange={(e) => {
                              const value = e.target.value
                                .replace(/[^0-9]/g, "")
                                .slice(0, 10);
                              setAddressForm({ ...addressForm, phone: value });
                            }}
                          />
                        </div>
                      </div>

                      {/* Email Field — auto-fetched from registered account */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          className="w-full px-5 py-3.5 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-secondary)]/10 rounded-2xl focus:border-[var(--color-secondary)] outline-none text-sm font-medium transition-colors placeholder-gray-400"
                          value={addressForm.email}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, email: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          placeholder="House No, Building, Street"
                          className="w-full px-5 py-3.5 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-secondary)]/10 rounded-2xl focus:border-[var(--color-secondary)] outline-none text-sm font-medium transition-colors placeholder-gray-400"
                          value={addressForm.addressLine1}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              addressLine1: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Area, Landmark"
                          className="w-full px-5 py-3.5 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-secondary)]/10 rounded-2xl focus:border-[var(--color-secondary)] outline-none text-sm font-medium transition-colors placeholder-gray-400"
                          value={addressForm.addressLine2}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              addressLine2: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        <div className="col-span-2 md:col-span-1 space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">
                            Pincode
                          </label>
                          <input
                            type="text"
                            placeholder="Pin Code"
                            className="w-full px-5 py-3.5 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-secondary)]/10 rounded-2xl focus:border-[var(--color-secondary)] outline-none text-sm font-medium transition-colors placeholder-gray-400"
                            value={addressForm.pincode}
                            onChange={(e) => {
                              const value = e.target.value
                                .replace(/[^0-9]/g, "")
                                .slice(0, 6);
                              setAddressForm({
                                ...addressForm,
                                pincode: value,
                              });
                              if (value.length === 6) {
                                fetchPincodeDetails(value);
                              }
                            }}
                          />
                        </div>
                        <div className="col-span-1 space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">
                            City
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="City"
                              className="w-full px-5 py-3.5 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-secondary)]/10 rounded-2xl focus:border-[var(--color-secondary)] outline-none text-sm font-medium transition-colors placeholder-gray-400"
                              value={addressForm.city}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  city: e.target.value,
                                })
                              }
                            />
                            {isPincodeFetching && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-span-1 space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">
                            State
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="State"
                              className="w-full px-5 py-3.5 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-secondary)]/10 rounded-2xl focus:border-[var(--color-secondary)] outline-none text-sm font-medium transition-colors placeholder-gray-400"
                              value={addressForm.state}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  state: e.target.value,
                                })
                              }
                            />
                            {isPincodeFetching && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        <label className="text-xs font-bold text-gray-400 uppercase block">
                          Address Type
                        </label>
                        <div className="flex gap-4">
                          {["home", "office", "other"].map((type) => (
                            <label
                              key={type}
                              className="flex items-center cursor-pointer gap-2 group"
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${addressForm.addressType === type ? "border-[var(--color-secondary)]" : "border-gray-500 group-hover:border-[var(--color-secondary)]"}`}
                              >
                                {addressForm.addressType === type && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-secondary)]" />
                                )}
                              </div>
                              <span
                                className={`text-sm font-medium capitalize ${addressForm.addressType === type ? "text-white" : "text-gray-400 group-hover:text-white"}`}
                              >
                                {type}
                              </span>
                              <input
                                type="radio"
                                name="addressType"
                                value={type}
                                checked={addressForm.addressType === type}
                                onChange={() =>
                                  setAddressForm({
                                    ...addressForm,
                                    addressType: type,
                                  })
                                }
                                className="hidden"
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleSaveAddress}
                        disabled={isAddressSaving}
                        className="w-full py-3.5 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-2xl font-bold hover:bg-[#ffe033] transition-all shadow-[0_4px_15px_rgba(255,212,0,0.3)] mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isAddressSaving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving Address...</span>
                          </>
                        ) : editingAddressId ? (
                          "Update Address"
                        ) : (
                          "Save Address"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Courier Selection Section */}
              <div ref={addToRefs} className="scroll-section space-y-6">
                <h2 className="text-sm md:text-xl font-bold text-[var(--color-secondary)] flex items-center gap-2 font-[var(--font-heading)]">
                  <ShoppingBag size={18} className="text-[var(--color-secondary)]" />
                  Select Delivery Courier 
                </h2>

                {checkingCourier ? (
                  <div className="bg-[var(--color-surface)] p-8 rounded-[25px] border border-[var(--color-secondary)]/10 text-center">
                    <div className="w-8 h-8 border-3 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-gray-400">Checking delivery availability for your pincode...</p>
                  </div>
                ) : courierError ? (
                  <div className="bg-red-500/10 p-6 rounded-[25px] border border-red-500/20 text-center">
                    <p className="text-sm text-red-400 font-medium">{courierError}</p>
                    <button 
                      onClick={fetchCourierAvailability}
                      className="mt-3 text-xs font-bold text-[var(--color-secondary)] uppercase underline"
                    >
                      Retry Check
                    </button>
                  </div>
                ) : availableCouriers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableCouriers.map((courier) => (
                      <div
                        key={courier.provider}
                        onClick={() => setSelectedCourier(courier.provider)}
                        className={`p-5 rounded-[25px] border cursor-pointer transition-all relative ${
                          selectedCourier === courier.provider
                            ? "bg-[var(--color-secondary)]/10 border-[var(--color-secondary)] shadow-[0_0_15px_rgba(242,183,5,0.1)]"
                            : "bg-[var(--color-surface)] border-[var(--color-secondary)]/10 hover:border-[var(--color-secondary)]/30"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`font-bold ${selectedCourier === courier.provider ? "text-[var(--color-secondary)]" : "text-[var(--color-text)]"}`}>
                            {courier.courierName}
                          </h3>
                          {selectedCourier === courier.provider && (
                            <CheckCircle2 className="text-[var(--color-secondary)]" size={18} />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400">
                            Estimated Delivery: <span className="text-gray-400 font-medium">{courier.etd || `${courier.estimatedDays} Days`}</span>
                          </p>
                          <p className="text-xs text-gray-400">
                            Shipping: <span className="text-green-500 font-bold">{courier.freightCharge ? `₹${courier.freightCharge}` : "Standard"}</span>
                          </p>
                          <div className="mt-2 flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${courier.codAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                              {courier.codAvailable ? "COD Available" : "COD Not Available"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[var(--color-surface)] p-6 rounded-[25px] border border-[var(--color-secondary)]/10 text-center">
                    <p className="text-sm text-gray-400 italic">Please select or add a delivery address to see available couriers.</p>
                  </div>
                )}
              </div>

              {/* Payment Methods Section */}
              <div ref={addToRefs} className="scroll-section space-y-6">
                <h2 className="text-lg md:text-xl font-bold text-[var(--color-secondary)] mb-4 flex items-center gap-2 font-[var(--font-heading)]">
                  <CreditCard
                    size={20}
                    className="text-[var(--color-secondary)]"
                  />
                  Payment Method ({paymentMethods.length} methods available)
                </h2>
                {paymentMethods.length === 0 ? (
                  <p className="text-red-500">No payment methods available</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => {
                      const isCOD = method.name.toLowerCase().includes("cash");
                      const methodKey = isCOD ? "cod" : "upi";
                      return (
                        <div
                          key={method._id}
                          onClick={() => setPaymentMethod(methodKey)}
                          className={`p-3 md:p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${paymentMethod === methodKey ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 shadow-[0_0_15px_rgba(242,183,5,0.1)]" : "border-gray-200 bg-white hover:border-[var(--color-secondary)]/30"}`}
                        >
                          <div
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${paymentMethod === methodKey ? "bg-[var(--color-secondary)] text-white" : "bg-gray-100 text-gray-400"}`}
                          >
                            {isCOD ? (
                              <Banknote size={18} />
                            ) : (
                              <Smartphone size={18} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4
                              className={`font-bold text-[11px] md:text-sm whitespace-nowrap ${paymentMethod === methodKey ? "text-[var(--color-text)]" : "text-gray-500"}`}
                            >
                              {method.name}
                            </h4>
                          </div>
                          {paymentMethod === methodKey && (
                            <Check
                              size={14}
                              className="text-[var(--color-secondary)] ml-auto"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {paymentMethods.length > 0 && (
                  <button
                    onClick={handleConfirmOrder}
                    disabled={isPlacingOrder || checkingCourier || !selectedCourier}
                    className="w-full py-4 md:py-5 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-2xl font-bold text-base md:text-lg mt-8 md:mt-10 hover:bg-[#ffe033] transition-all shadow-[0_4px_15px_rgba(255,212,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,212,0,0.4)] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlacingOrder ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Placing Order...</span>
                      </>
                    ) : checkingCourier ? (
                      "Checking Delivery..."
                    ) : (
                      "Place Order"
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Order Summary Summary */}
            <div className="lg:col-span-1">
              <div
                ref={addToRefs}
                className="scroll-section lg:sticky lg:top-24"
              >
                <h2 className="text-lg md:text-xl font-bold text-[var(--color-secondary)] mb-6 flex items-center gap-3 font-[var(--font-heading)]">
                  Final Bill
                </h2>
                <div className="bg-[var(--color-muted)] p-4 lg:p-6 xl:p-8 rounded-[40px] border border-[var(--color-secondary)]/10 shadow-xl">
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-600 text-sm md:text-base">
                      <span>Items Total</span>
                      <span className="font-bold text-[var(--color-text)]">
                        ₹{cartTotal}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm md:text-base">
                      <span>
                        Shipping
                        {selectedCourierObj && (
                          <span className="ml-1 text-[10px] text-gray-400 italic">
                            ({selectedCourierObj.courierName})
                          </span>
                        )}
                      </span>
                      <span className="font-bold text-green-600">₹{dynamicShippingCharge}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm md:text-base">
                      <span>Handling Fee</span>
                      <span className="font-bold text-[var(--color-text)]">₹{HANDLING_FEE}</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-gray-300 pt-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-base md:text-lg font-bold text-[var(--color-text)]">
                        Grand Total
                      </span>
                      <span className="text-2xl md:text-3xl font-extrabold text-[var(--color-secondary)]">
                        ₹{cartTotal + dynamicShippingCharge + HANDLING_FEE}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 text-right italic">
                      Inclusive of all taxes
                    </p>
                  </div>

                  {paymentMethods.length > 0 && (
                    <button
                      onClick={handleConfirmOrder}
                      disabled={isPlacingOrder}
                      className="w-full py-4 md:py-5 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-2xl font-bold text-base md:text-lg mt-8 md:mt-10 hover:bg-[#ffe033] transition-all shadow-[0_4px_15px_rgba(255,212,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,212,0,0.4)] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isPlacingOrder ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Placing Order...</span>
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  )}

                  <p className="text-center text-[9px] md:text-[10px] text-gray-500 mt-6 leading-relaxed px-2">
                    By clicking place order, you agree to our Terms of Service
                    and Privacy Policy. Our delivery partner will contact you
                    for location verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default Shop;
