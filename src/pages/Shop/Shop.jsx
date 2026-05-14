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
  Shield,
  Truck,
  Clock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
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

  // Dynamic shipping charge
  const HANDLING_FEE = 20;
  const selectedCourierObj = availableCouriers.find((c) => c.provider === selectedCourier);
  const dynamicShippingCharge = selectedCourierObj?.freightCharge
    ? Math.ceil(selectedCourierObj.freightCharge)
    : 0;

  const calculateTotalWeight = () => {
    return cartItems.reduce((total, item) => {
      const weightStr = (item.netWeight || "0.5").toLowerCase();
      let weightNum = parseFloat(weightStr.replace(/[^0-9.]/g, "")) || 0.5;
      if (weightStr.includes("gm") || weightStr.includes("g")) {
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
  const [loadingMethods, setLoadingMethods] = useState(false);

  // Fetch User Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileApi();
        if (data && data.user) {
          setUserId(data.user._id);
          const name = data.user.firstName && data.user.lastName
            ? `${data.user.firstName} ${data.user.lastName}`
            : "";
          const phone = data.user.phone || "";
          const email = data.user.email || "";
          setProfileData({ name, phone, email });
          setAddressForm((prev) => ({
            ...prev,
            name: name || prev.name,
            phone: phone || prev.phone,
            email: email || prev.email,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Fetch Cart
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoadingCart(true);
    try {
      const data = await getCartApi();
      if (data && data.items) {
        const mappedItems = data.items.map((item) => ({
          uniqueId: item.product._id,
          cartItemId: item._id,
          productId: item.product._id,
          name: item.product.name,
          img: item.product.mainImage?.url,
          price: item.product.finalPrice,
          originalPrice: item.product.price,
          discountPercent: item.product.discountPercent,
          ingredients: item.product.about?.ingredients,
          netWeight: item.product.about?.netWeight,
          quantity: item.quantity,
          description: item.product.description,
        }));
        setCartItems(mappedItems);
        if (data.totalAmount !== undefined && data.totalAmount !== null) {
          setCartTotal(data.totalAmount);
        } else {
          const total = mappedItems.reduce(
            (sum, item) => sum + (item.price || 0) * item.quantity,
            0
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
      window.dispatchEvent(new Event("cart-updated"));
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
      background: "#ffffff",
      color: "#000000",
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
      background: "#ffffff",
      color: "#000000",
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

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await getAddressesApi();
      if (data && data.addresses && data.addresses.length > 0) {
        setSavedAddresses(data.addresses);
        if (!selectedAddressId) {
          const defaultAddr = data.addresses.find((addr) => addr.isDefault) || data.addresses[0];
          setSelectedAddressId(defaultAddr._id);
        }
      } else {
        setSavedAddresses([]);
        setShowAddressForm(true);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const fetchPaymentMethods = async () => {
    setLoadingMethods(true);
    try {
      const data = await getPaymentMethodsApi();
      if (data && Array.isArray(data)) {
        setPaymentMethods(data);
        if (data.length > 0) {
          const defaultMethod = data.find((m) => m.name.toLowerCase().includes("cash")) || data[0];
          setPaymentMethod(defaultMethod.name.toLowerCase().includes("cash") ? "cod" : "upi");
        }
      } else if (data && data.methods && Array.isArray(data.methods)) {
         setPaymentMethods(data.methods);
         if (data.methods.length > 0) {
           const defaultMethod = data.methods.find((m) => m.name.toLowerCase().includes("cash")) || data.methods[0];
           setPaymentMethod(defaultMethod.name.toLowerCase().includes("cash") ? "cod" : "upi");
         }
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
    } finally {
      setLoadingMethods(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchPaymentMethods();
  }, []);

  const fetchPincodeDetails = async (pincode) => {
    if (pincode.length !== 6) return;
    setIsPincodeFetching(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
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

  const fetchCourierAvailability = async () => {
    if (!selectedAddressId || cartItems.length === 0) return;
    const selectedAddress = savedAddresses.find((addr) => addr._id === selectedAddressId);
    if (!selectedAddress || !selectedAddress.pincode) return;
    setCheckingCourier(true);
    setCourierError("");
    try {
      const totalWeight = totalOrderWeight;
      const response = await checkDeliveryApi(selectedAddress.pincode, totalWeight);
      if (response.success && response.availableCouriers?.length > 0) {
        setAvailableCouriers(response.availableCouriers);
        setSelectedCourier(response.availableCouriers[0].provider);
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
      email: addr.email || profileData.email || "",
      addressLine1: addr.addressLine1 || "",
      addressLine2: addr.addressLine2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      addressType: addr.addressType?.toLowerCase() === "work" || addr.addressType?.toLowerCase() === "office" ? "office" : addr.addressType?.toLowerCase() || "home",
    });
    setEditingAddressId(addr._id);
    setShowAddressForm(true);
    const section = document.getElementById("delivery-address-section");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSaveAddress = async () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.addressLine1 || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error("Please fill in all required fields.", { position: "top-right" });
      return;
    }
    if (addressForm.pincode.length !== 6) {
      toast.error("Pincode must be exactly 6 digits.", { position: "top-right" });
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
        email: profileData.email || "",
      });
      fetchAddresses();
      toast.success("Address saved successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error("Failed to save address. Please try again.", { position: "top-right" });
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
      email: profileData.email || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      addressType: "home",
    });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!", { position: "top-right" });
      return;
    }
    if (!selectedAddressId) {
      toast.error("Please select a delivery address!", { position: "top-right" });
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

    const finalAmount = cartTotal + dynamicShippingCharge + HANDLING_FEE;
    const result = await Swal.fire({
      title: "Confirm Order?",
      text: `Place order for ₹${finalAmount}? (Shipping: ₹${dynamicShippingCharge} + Handling: ₹${HANDLING_FEE})`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FBBF24",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, place it!",
      background: "#ffffff",
      color: "#000000",
    });
    if (!result.isConfirmed) return;

    const selectedAddress = savedAddresses.find((addr) => addr._id === selectedAddressId);
    setIsPlacingOrder(true);

    if (paymentMethod === "cod") {
      try {
        const orderData = {
          userId: userId,
          addressId: selectedAddressId,
          paymentMethod: "COD",
          notes: "Direct Order (COD)",
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: "Standard",
            color: "Default",
          })),
          shippingAddress: {
            name: selectedAddress.name,
            phone: selectedAddress.phone,
            email: profileData.email || "",
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
        if (response && (response.order || response.message === "Order placed successfully")) {
          toast.success(response.message || "Order placed successfully!", { position: "top-right" });
          await clearCartApi();
          setCartItems([]);
          setCartTotal(0);
          window.dispatchEvent(new Event("cart-updated"));
          navigate("/orders");
        } else {
          toast.error(response.message || "Failed to place order.", { position: "top-right" });
        }
      } catch (error) {
        console.error("COD placement error:", error);
        toast.error(error.response?.data?.message || "Failed to place order. Please try again.", { position: "top-right" });
      } finally {
        setIsPlacingOrder(false);
      }
      return;
    }

    if (paymentMethod === "upi") {
      const res = await loadRazorpay();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.", { position: "top-right" });
        setIsPlacingOrder(false);
        return;
      }
      try {
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
          toast.error("Could not create order. Please try again.", { position: "top-right" });
          setIsPlacingOrder(false);
          return;
        }
        const options = {
          key: orderData.key_id,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: "SKS Laddu",
          description: "Order for Delicious Laddus",
          order_id: orderData.order.id,
          handler: async function (response) {
            try {
              const orderPayload = {
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
                  email: profileData.email || "",
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
              const orderRes = await placeOrderApi(orderPayload);
              if (orderRes && (orderRes.order || orderRes.message === "Order placed successfully")) {
                toast.success("Payment Successful! Order Placed.", { position: "top-right" });
                await clearCartApi();
                setCartItems([]);
                setCartTotal(0);
                window.dispatchEvent(new Event("cart-updated"));
                navigate("/orders");
              } else {
                toast.error(orderRes.message || "Payment verification failed.", { position: "top-right" });
              }
            } catch (error) {
              console.error("Online placement error:", error);
              toast.error("Failed to sync order after payment.", { position: "top-right" });
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
          theme: { color: "#FBBF24" },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response) {
          handlePaymentFailureApi({ razorpay_order_id: orderData.order.id, error: response.error });
          toast.error(`Payment Failed: ${response.error.description}`, { position: "top-right" });
        });
        paymentObject.open();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong during payment initialization.", { position: "top-right" });
      } finally {
        setIsPlacingOrder(false);
      }
    }
  };

  const handleItemClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const finalGrandTotal = cartTotal + dynamicShippingCharge + HANDLING_FEE;

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen">
      {/* Header / Hero Section */}
      <div className="bg-gray-50 border-b border-gray-200 py-6 md:py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">Secure Checkout</h1>
              <p className="text-sm text-gray-500 mt-1">Review your order & complete payment</p>
            </div>
            <div className="bg-gray-100 px-5 py-3 rounded-xl border border-gray-200 flex items-center gap-3">
              <ShoppingBag size={20} className="text-yellow-500" />
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Total Items</span>
                <p className="text-xl font-bold text-gray-900">{cartItems.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
        {loadingCart ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500 font-medium">Loading your tray...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-gray-50 p-12 md:p-20 rounded-3xl text-center border border-gray-200 shadow-sm">
            <div className="text-5xl mb-5">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your tray is empty!</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any laddus yet. Explore our collection.</p>
            <a href="/laddus" className="inline-block px-8 py-3 bg-yellow-500 text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition shadow-md">
              Browse Laddus
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cart Items */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingBag size={18} className="text-yellow-500" /> Your Order
                  </h2>
                  {cartItems.length > 0 && (
                    <button onClick={handleClearCart} className="text-red-500 hover:text-red-700 text-xs font-semibold uppercase tracking-wide flex items-center gap-1">
                      <Trash2 size={14} /> Clear
                    </button>
                  )}
                </div>
                <div className="max-h-[460px] overflow-y-auto custom-scrollbar divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.uniqueId} className="p-4 flex gap-3 items-center">
                      <div onClick={() => handleItemClick(item.productId)} className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer border border-gray-200">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-800 cursor-pointer hover:text-yellow-600" onClick={() => handleItemClick(item.productId)}>{item.name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.ingredients || "Pure & Delicious"}</p>
                          </div>
                          <p className="font-bold text-gray-900">₹{(item.price || 0) * item.quantity}</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button onClick={() => handleQuantityChange(item.cartItemId, item.quantity, -1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-700 shadow-sm hover:bg-yellow-50 text-xs">−</button>
                            <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                            <button onClick={() => handleQuantityChange(item.cartItemId, item.quantity, 1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-700 shadow-sm hover:bg-yellow-50 text-xs">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.cartItemId)} className="text-red-400 hover:text-red-600 text-xs font-medium">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Section */}
              <div id="delivery-address-section" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-bold text-gray-800 flex items-center gap-2"><MapPin size={18} className="text-yellow-500" /> Delivery Address</h2>
                  {savedAddresses.length > 0 && !showAddressForm && (
                    <button onClick={() => { setEditingAddressId(null); setAddressForm({ ...addressForm, name: profileData.name, phone: profileData.phone, addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", addressType: "home", email: profileData.email }); setShowAddressForm(true); }} className="text-xs font-semibold bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-200 transition-colors">+ Add New</button>
                  )}
                </div>

                {loadingAddresses ? (
                   <div className="py-6 flex justify-center"><div className="animate-spin w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full"></div></div>
                ) : !showAddressForm && savedAddresses.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {savedAddresses.map((addr) => (
                      <div key={addr._id} onClick={() => setSelectedAddressId(addr._id)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${selectedAddressId === addr._id ? "border-yellow-400 bg-yellow-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}>
                        {selectedAddressId === addr._id && <CheckCircle2 size={18} className="absolute top-3 right-3 text-yellow-500" />}
                        <button onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }} className="absolute top-3 right-10 text-gray-400 hover:text-gray-700 transition-colors"><Pencil size={14} /></button>
                        <div className="flex items-center gap-1 mb-2">
                          {addr.addressType === "home" ? <Home size={14} className="text-gray-500" /> : <Briefcase size={14} className="text-gray-500" />}
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{addr.addressType === "office" || addr.addressType === "work" ? "Office" : "Home"}</span>
                        </div>
                        <p className="font-bold text-gray-800 text-sm">{addr.name}</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-xs font-semibold text-gray-600 mt-2">{addr.phone}</p>
                      </div>
                    ))}
                  </div>
                ) : (showAddressForm || savedAddresses.length === 0) && (
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-5 text-sm">{editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
                        <input type="text" placeholder="Full Name" value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value.replace(/[0-9]/g, "") })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Phone Number</label>
                        <input type="tel" placeholder="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/[^0-9]/g, "").slice(0,10) })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none" />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email Address</label>
                        <input type="email" placeholder="Email" value={addressForm.email} onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none" />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Address Line 1</label>
                        <input type="text" placeholder="House No, Street, Landmark" value={addressForm.addressLine1} onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none" />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Address Line 2 (Optional)</label>
                        <input type="text" placeholder="Apartment, Suite, etc." value={addressForm.addressLine2} onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Pincode</label>
                        <div className="relative">
                          <input type="text" placeholder="Pincode" value={addressForm.pincode} onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, "").slice(0,6); setAddressForm({ ...addressForm, pincode: val }); if(val.length === 6) fetchPincodeDetails(val); }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none" />
                          {isPincodeFetching && <div className="absolute right-3 top-1/2 -translate-y-1/2"><div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div></div>}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">City</label>
                        <input type="text" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">State</label>
                        <input type="text" placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none" />
                      </div>
                      <div className="sm:col-span-2 mt-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-2">Address Type</label>
                        <div className="flex gap-4">
                          {["home", "office", "other"].map(type => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer group">
                              <input type="radio" name="addressType" checked={addressForm.addressType === type} onChange={() => setAddressForm({ ...addressForm, addressType: type })} className="w-4 h-4 accent-yellow-500" />
                              <span className="text-xs capitalize text-gray-700 group-hover:text-yellow-600 transition-colors">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={handleSaveAddress} disabled={isAddressSaving} className="bg-yellow-500 text-gray-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all shadow-md flex items-center gap-2 disabled:opacity-60">{isAddressSaving ? <><div className="w-3 h-3 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div> Saving</> : editingAddressId ? "Update Address" : "Save Address"}</button>
                      {savedAddresses.length > 0 && <button onClick={handleCancelEdit} className="bg-white border border-gray-200 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all">Cancel</button>}
                    </div>
                  </div>
                )}
              </div>

              {/* Courier Selection */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5"><Truck size={18} className="text-yellow-500" /> Select Delivery Courier</h2>
                {checkingCourier ? (
                  <div className="py-10 text-center"><div className="animate-spin w-8 h-8 border-3 border-yellow-500 border-t-transparent rounded-full mx-auto mb-3"></div><p className="text-xs text-gray-500 font-medium">Finding best delivery partners for you...</p></div>
                ) : courierError ? (
                  <div className="bg-red-50 p-6 rounded-2xl text-center border border-red-100">
                    <AlertCircle className="text-red-500 w-6 h-6 mx-auto mb-2" />
                    <p className="text-xs text-red-600 font-medium">{courierError}</p>
                    <button onClick={fetchCourierAvailability} className="flex items-center gap-1 text-yellow-600 text-[10px] font-bold uppercase mx-auto mt-3 hover:text-yellow-700"><RefreshCw size={12} /> Retry Check</button>
                  </div>
                ) : availableCouriers.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {availableCouriers.map(courier => (
                      <div key={courier.provider} onClick={() => setSelectedCourier(courier.provider)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${selectedCourier === courier.provider ? "border-yellow-400 bg-yellow-50 shadow-sm" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}>
                        <div className="flex justify-between items-center mb-2">
                           <span className={`font-bold text-sm ${selectedCourier === courier.provider ? "text-yellow-700" : "text-gray-800"}`}>{courier.courierName}</span>
                           {selectedCourier === courier.provider && <CheckCircle2 size={16} className="text-yellow-500" />}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1">
                          <Clock size={12} />
                          <span>Est: {courier.etd || `${courier.estimatedDays} days`}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs font-bold text-gray-700">₹{courier.freightCharge || "Standard"}</span>
                          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                             <div className={`w-1.5 h-1.5 rounded-full ${courier.codAvailable ? "bg-green-500" : "bg-red-400"}`}></div>
                             <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{courier.codAvailable ? "COD OK" : "Prepaid Only"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 text-center">
                    <Truck size={24} className="text-gray-300 mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-gray-400 italic">Please select or add a delivery address to view available couriers</p>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5"><CreditCard size={18} className="text-yellow-500" /> Payment Method</h2>
                {loadingMethods ? (
                   <div className="py-6 flex justify-center"><div className="animate-spin w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full"></div></div>
                ) : paymentMethods.length === 0 ? (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-red-600 font-bold">No payment methods found</p>
                      <button onClick={fetchPaymentMethods} className="text-yellow-600 text-[10px] font-bold uppercase mt-1 flex items-center gap-1"><RefreshCw size={10} /> Reload</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paymentMethods.map(method => {
                      const isCOD = method.name.toLowerCase().includes("cash");
                      const key = isCOD ? "cod" : "upi";
                      return (
                        <div key={method._id} onClick={() => setPaymentMethod(key)} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === key ? "border-yellow-400 bg-yellow-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === key ? "bg-yellow-500 text-white" : "bg-white text-gray-400 border border-gray-200"}`}>{isCOD ? <Banknote size={20} /> : <Smartphone size={20} />}</div>
                          <div className="flex-1">
                            <span className={`font-bold text-sm block ${paymentMethod === key ? "text-yellow-700" : "text-gray-700"}`}>{method.name}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{isCOD ? "Pay when delivered" : "Secure Online Payment"}</span>
                          </div>
                          {paymentMethod === key && <CheckCircle2 size={18} className="text-yellow-500" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/5 rounded-full -mr-10 -mt-10"></div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6"><Tag size={20} className="text-yellow-500" /> Order Summary</h2>
                
                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium">Items Total</span>
                    <span className="font-bold text-gray-900">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium flex items-center gap-1">Shipping {selectedCourierObj && <span className="text-[10px] text-gray-400 font-normal italic">({selectedCourierObj.courierName})</span>}</span>
                    <span className={`font-bold ${dynamicShippingCharge === 0 ? "text-green-600" : "text-gray-900"}`}>{dynamicShippingCharge === 0 ? "Free" : `₹${dynamicShippingCharge}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium">Handling Fee</span>
                    <span className="font-bold text-gray-900">₹{HANDLING_FEE}</span>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">Grand Total</span>
                    <span className="text-3xl font-extrabold text-gray-900">₹{finalGrandTotal}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 text-right mt-1 italic">Price inclusive of all taxes</p>
                </div>

                <button 
                  onClick={handleConfirmOrder} 
                  disabled={isPlacingOrder || checkingCourier || !selectedCourier} 
                  className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-extrabold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isPlacingOrder ? (
                    <><div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div> <span>Confirming Order...</span></>
                  ) : checkingCourier ? (
                    <span>Validating Delivery...</span>
                  ) : (
                    <><span>Place Order</span> <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 mt-6 font-medium">
                  <Shield size={12} className="text-green-500" />
                  <span>Secure payment & encrypted checkout</span>
                </div>
                
                {/* <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200"></div>)}
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">Join 5,000+ happy customers <br/>enjoying our fresh laddus</p>
                </div> */}
              </div>
              
              {/* <div className="mt-6 flex items-center justify-between px-4">
                 <div className="flex flex-col items-center gap-1">
                   <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600"><Truck size={14} /></div>
                   <span className="text-[8px] font-bold text-gray-400 uppercase">Fast Delivery</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                   <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600"><CheckCircle2 size={14} /></div>
                   <span className="text-[8px] font-bold text-gray-400 uppercase">Hygienic</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                   <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Shield size={14} /></div>
                   <span className="text-[8px] font-bold text-gray-400 uppercase">Safe Pay</span>
                 </div>
              </div> */}
            </div>
          </div>
        )}
      </div>
      <Footer />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Shop;
