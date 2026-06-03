import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Footer from "../../components/layout/Footer";
import { 
  createBookingApi,
  createBookingPaymentOrderApi,
  verifyBookingPaymentApi
} from "../../api/booking";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Booking = ({ 
  preselectedVariety, 
  preselectedName, 
  preselectedWeight, 
  preselectedPrice,
  categoryId,
  productId,
  isModalMode = false, 
  onCloseModal 
}) => {

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    emailId: "",
    completeAddress: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    mangoVariety: preselectedVariety || "Dussehri",
    mangoName: preselectedName || "",
    boxSize: preselectedWeight ? (preselectedWeight.toString().toLowerCase().includes("kg") ? preselectedWeight : `${preselectedWeight} KG`) : "3 KG",
    numberOfBoxes: "1",
    preferredDeliveryWeek: "Any Week",
    specialInstructions: "",
    bookingAmountPaid: isModalMode ? "100" : "",
    paymentMode: "UPI",
    transactionId: "",
    referralSource: "Instagram",
    consent: false
  });

  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingNo, setBookingNo] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isModalMode) {
      window.scrollTo(0, 0);
    }
  }, [isModalMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "mobileNumber" || name === "alternateMobileNumber") {
      const filtered = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: filtered }));
    } else if (name === "pincode") {
      const filtered = value.replace(/[^0-9]/g, "").slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: filtered }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number starting with 6-9";
    }

    if (formData.alternateMobileNumber && !/^[6-9]\d{9}$/.test(formData.alternateMobileNumber)) {
      newErrors.alternateMobileNumber = "Please enter a valid 10-digit mobile number starting with 6-9";
    }

    if (formData.emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = "Please enter a valid email address (e.g. name@example.com)";
    }

    if (!formData.completeAddress.trim()) newErrors.completeAddress = "Complete address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    
    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (!formData.mangoName.trim()) {
      newErrors.mangoName = "Mango name is required";
    }

    if (!formData.numberOfBoxes || parseInt(formData.numberOfBoxes) <= 0) {
      newErrors.numberOfBoxes = "Number of boxes must be at least 1";
    }

    if (!formData.consent) {
      newErrors.consent = "You must accept the booking terms to proceed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Load Razorpay SDK
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        setIsSubmitting(false);
        return;
      }

      // 2. Create payment order on backend
      const orderData = await createBookingPaymentOrderApi({
        amount: bookingFee, // 100 INR
        currency: "INR",
        receipt: `booking_${Date.now()}`
      });

      if (!orderData || !orderData.success) {
        toast.error("Could not initialize payment. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // 3. Configure Razorpay options
      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "KaashtKart Mango Booking",
        description: `Advance Booking for ${formData.mangoName}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // 4. Verify payment and save booking on successful payment
            const verificationPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingDetails: {
                fullName: formData.fullName,
                mobileNumber: formData.mobileNumber,
                alternateMobileNumber: formData.alternateMobileNumber,
                emailId: formData.emailId,
                completeAddress: formData.completeAddress,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                landmark: formData.landmark,
                mangoVariety: categoryId, // Category ObjectId
                mangoName: productId, // Product ObjectId
                boxSize: formData.boxSize,
                numberOfBoxes: Number(formData.numberOfBoxes),
                preferredDeliveryWeek: formData.preferredDeliveryWeek,
                specialInstructions: formData.specialInstructions,
                bookingAmountPaid: bookingFee.toString(),
                productPrice: pricePerBox,
                totalAmount: totalProductPrice + bookingFee,
                paymentMode: formData.paymentMode,
                transactionId: response.razorpay_payment_id,
                referralSource: formData.referralSource,
                consent: formData.consent
              }
            };

            const verificationRes = await verifyBookingPaymentApi(verificationPayload);

            if (verificationRes.success) {
              setBookingNo(verificationRes.data.bookingNo);
              setBookingSuccess(true);
              toast.success("Payment Successful & Booking Confirmed!");
              if (!isModalMode) {
                window.scrollTo(0, 0);
              }
            } else {
              toast.error(verificationRes.message || "Payment verification failed.");
            }
          } catch (error) {
            console.error("Booking verification error:", error);
            toast.error("Failed to confirm booking after payment. Please contact support.");
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.mobileNumber,
          email: formData.emailId || ""
        },
        theme: { color: "#008222" },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            toast.info("Payment cancelled.");
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on("payment.failed", function (response) {
        toast.error(`Payment Failed: ${response.error.description}`);
        setIsSubmitting(false);
      });

      paymentObject.open();

    } catch (error) {
      console.error("Razorpay initiation error:", error);
      toast.error("Something went wrong during payment initialization.");
      setIsSubmitting(false);
    }
  };

  // Pricing calculations
  const pricePerBox = preselectedPrice ? parseFloat(preselectedPrice) : 0;
  const boxes = parseInt(formData.numberOfBoxes) || 1;
  const totalProductPrice = pricePerBox * boxes;
  const bookingFee = 100;

  if (bookingSuccess) {
    return (
      <div className={isModalMode ? "bg-[#F8FAFC] text-[var(--color-text)] flex flex-col overflow-hidden h-full max-h-[90vh]" : "bg-[var(--color-primary)] text-[var(--color-text)] min-h-screen pt-28 pb-20 px-4"}>
        
        {isModalMode && (
          <>
            <style dangerouslySetInnerHTML={{__html: `
              .custom-modal-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-modal-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-modal-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(0, 130, 34, 0.2);
                border-radius: 99px;
              }
              .custom-modal-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 130, 34, 0.4);
              }
            `}} />
            <div className="flex items-center justify-between bg-[#1A2F25] text-white px-6 py-4.5 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🥭</span>
                <span className="font-bold text-sm md:text-base tracking-wide font-sans">Advance Mango Booking</span>
              </div>
              <button 
                type="button"
                onClick={onCloseModal} 
                className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 transition-all p-1.5 rounded-full flex items-center justify-center cursor-pointer"
                title="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </>
        )}

        <div className={isModalMode ? "p-5 md:p-6 bg-gray-50/50 space-y-6 overflow-y-auto flex-1 custom-modal-scrollbar" : "max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-6"}>
          
          <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-[#F1F5F9] text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto text-2xl font-bold">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Booking Requested Successfully!</h1>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-2 text-left text-sm text-gray-600">
              <p className="font-bold text-gray-800">Booking Summary:</p>
              <p><strong>Booking ID:</strong> <span className="text-green-700 font-bold">{bookingNo}</span></p>
              <p><strong>Customer Name:</strong> {formData.fullName}</p>
              <p><strong>Mobile Number:</strong> {formData.mobileNumber}</p>
              <p><strong>Mango Variety (Category):</strong> {formData.mangoVariety}</p>
              <p><strong>Mango Name (Product):</strong> {formData.mangoName}</p>
              <p><strong>Quantity:</strong> {formData.numberOfBoxes} Box(es) ({formData.boxSize})</p>
              <p><strong>Preferred Week:</strong> {formData.preferredDeliveryWeek}</p>
              <p><strong>Payment Mode:</strong> {formData.paymentMode}</p>
              {formData.bookingAmountPaid && <p><strong>Amount Paid:</strong> ₹{formData.bookingAmountPaid}</p>}
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Your booking request has been queued. Our orchard representative will call or WhatsApp you soon to confirm dispatch and delivery details based on harvest readiness.
            </p>

            <div className="pt-4 flex gap-4">
              <button
                onClick={() => {
                  setBookingSuccess(false);
                  setFormData({
                    fullName: "",
                    mobileNumber: "",
                    alternateMobileNumber: "",
                    emailId: "",
                    completeAddress: "",
                    city: "",
                    state: "",
                    pincode: "",
                    landmark: "",
                    mangoVariety: preselectedVariety || "Dussehri",
                    mangoName: preselectedName || "",
                    boxSize: preselectedWeight ? (preselectedWeight.toString().toLowerCase().includes("kg") ? preselectedWeight : `${preselectedWeight} KG`) : "3 KG",
                    numberOfBoxes: "1",
                    preferredDeliveryWeek: "Any Week",
                    specialInstructions: "",
                    bookingAmountPaid: isModalMode ? "100" : "",
                    paymentMode: "UPI",
                    transactionId: "",
                    referralSource: "Instagram",
                    consent: false
                  });
                  setScreenshot(null);
                }}
                className="flex-1 py-3 bg-[#008222] hover:bg-green-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Book Another Box
              </button>
              <button
                onClick={() => {
                  if (isModalMode && onCloseModal) {
                    onCloseModal();
                  } else {
                    window.location.href = "/";
                  }
                }}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors cursor-pointer"
              >
                {isModalMode ? "Close Panel" : "Back to Home"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isModalMode ? "bg-[#F8FAFC] text-[var(--color-text)] flex flex-col overflow-hidden h-full max-h-[90vh]" : "bg-[var(--color-primary)] text-[var(--color-text)] min-h-screen pt-28 pb-20 px-4"}>
      
      {isModalMode && (
        <>
          <style dangerouslySetInnerHTML={{__html: `
            .custom-modal-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-modal-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-modal-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(0, 130, 34, 0.2);
              border-radius: 99px;
            }
            .custom-modal-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 130, 34, 0.4);
            }
          `}} />
          <div className="flex items-center justify-between bg-[#1A2F25] text-white px-6 py-4.5 rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🥭</span>
              <span className="font-bold text-sm md:text-base tracking-wide font-sans">Advance Mango Booking</span>
            </div>
            <button 
              type="button"
              onClick={onCloseModal} 
              className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 transition-all p-1.5 rounded-full flex items-center justify-center cursor-pointer"
              title="Close modal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </>
      )}

      <div className={isModalMode ? "p-5 md:p-6 bg-gray-50/50 space-y-6 overflow-y-auto flex-1 custom-modal-scrollbar" : "max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-6"}>
        
        {!isModalMode && (
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mango Advance Booking Form</h1>
            <p className="text-sm text-gray-500 mt-2">Please fill in your details below to place an advance booking request.</p>
          </div>
        )}

        {/* Limited Harvest Banner */}
        <div className="bg-[#FFF8EE] border border-[#FED7AA] rounded-xl p-4 flex gap-3 text-sm shadow-sm">
          <div className="mt-0.5 text-[#F97316] flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-[#C2410C] block mb-0.5 text-xs">Limited Harvest Available!</span>
            <span className="text-[11px] text-[#6B7280] leading-normal block">
              Reserve your farm-fresh, naturally ripened mangoes directly from our growers. Book early to secure your box.
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Customer Details */}
          <div className="bg-white border border-[#F1F5F9] rounded-2xl p-5 md:p-6 space-y-4.5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5">
              <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-[14px] md:text-[15px] font-bold text-slate-800 tracking-wide font-sans">Customer Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm placeholder:text-slate-400 ${
                    errors.fullName ? "border-red-500 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.fullName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="10 digit mobile number"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm placeholder:text-slate-400 ${
                    errors.mobileNumber ? "border-red-500 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                {errors.mobileNumber && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.mobileNumber}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Alternate Mobile
                </label>
                <input
                  type="tel"
                  name="alternateMobileNumber"
                  value={formData.alternateMobileNumber}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm placeholder:text-slate-400 ${
                    errors.alternateMobileNumber ? "border-red-500 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                {errors.alternateMobileNumber && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.alternateMobileNumber}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Email ID
                </label>
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm placeholder:text-slate-400 ${
                    errors.emailId ? "border-red-500 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                {errors.emailId && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.emailId}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Details */}
          <div className="bg-white border border-[#F1F5F9] rounded-2xl p-5 md:p-6 space-y-4.5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5">
              <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-[14px] md:text-[15px] font-bold text-slate-800 tracking-wide font-sans">Delivery Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 col-span-full">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Complete Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="completeAddress"
                  value={formData.completeAddress}
                  onChange={handleInputChange}
                  placeholder="House no., Street, Area"
                  rows="2"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm resize-none placeholder:text-slate-400 ${
                    errors.completeAddress ? "border-red-500 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                {errors.completeAddress && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.completeAddress}</p>}
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City name"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm placeholder:text-slate-400 ${
                    errors.city ? "border-red-500 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.city}</p>}
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State name"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm placeholder:text-slate-400 ${
                    errors.state ? "border-red-500 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                {errors.state && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.state}</p>}
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm placeholder:text-slate-400 ${
                    errors.pincode ? "border-red-500 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.pincode}</p>}
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="Near metro, etc."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Order Details */}
          <div className="bg-white border border-[#F1F5F9] rounded-2xl p-5 md:p-6 space-y-4.5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5">
              <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-[14px] md:text-[15px] font-bold text-slate-800 tracking-wide font-sans">Order Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Mango Variety <span className="text-red-500">*</span>
                </label>
                {isModalMode ? (
                  <input
                    type="text"
                    name="mangoVariety"
                    value={formData.mangoVariety}
                    readOnly
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-gray-50 text-slate-500 text-sm outline-none"
                  />
                ) : (
                  <select
                    name="mangoVariety"
                    value={formData.mangoVariety}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm bg-white cursor-pointer"
                  >
                    <option value="Dussehri">Dussehri</option>
                    <option value="Langra">Langra</option>
                    <option value="Chausa">Chausa</option>
                    <option value="Amrapali">Amrapali</option>
                    <option value="Mixed Box">Mixed Box</option>
                  </select>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Mango Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mangoName"
                  value={formData.mangoName}
                  onChange={handleInputChange}
                  placeholder="Enter mango product name"
                  readOnly={isModalMode}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm placeholder:text-slate-400 ${
                    isModalMode ? "border-slate-200 bg-gray-50 text-slate-500 outline-none" : "border-slate-200"
                  }`}
                />
                {errors.mangoName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.mangoName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Box Size / Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="boxSize"
                  value={formData.boxSize}
                  readOnly
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-gray-50 text-slate-500 text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Number of Boxes <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="numberOfBoxes"
                  min="1"
                  value={formData.numberOfBoxes}
                  onChange={handleInputChange}
                  placeholder="Enter number of boxes"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm placeholder:text-slate-400 ${
                    errors.numberOfBoxes ? "border-red-500 bg-red-50/10" : "border-slate-200"
                  }`}
                />
                {errors.numberOfBoxes && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.numberOfBoxes}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Preferred Delivery Week <span className="text-red-500">*</span>
                </label>
                <select
                  name="preferredDeliveryWeek"
                  value={formData.preferredDeliveryWeek}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm bg-white cursor-pointer"
                >
                  <option value="Any Week">Any Week</option>
                  <option value="1st Week of June">1st Week of June</option>
                  <option value="2nd Week of June">2nd Week of June</option>
                  <option value="3rd Week of June">3rd Week of June</option>
                  <option value="4th Week of June">4th Week of June</option>
                  <option value="1st Week of July">1st Week of July</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                Any Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                placeholder="Any special requests?"
                rows="2"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm resize-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Combined Card: Payment & Additional Info */}
          <div className="bg-white border border-[#F1F5F9] rounded-2xl p-5 md:p-6 space-y-4.5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5">
              <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h2 className="text-[14px] md:text-[15px] font-bold text-slate-800 tracking-wide font-sans">Payment & Additional Info</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Payment Mode
                </label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm bg-white cursor-pointer"
                >
                  <option value="UPI">UPI (Google Pay, PhonePe)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  How did you hear about us?
                </label>
                <select
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm bg-white cursor-pointer"
                >
                  <option value="">Select</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Friend/Family">Friend/Family</option>
                  <option value="Google Search">Google Search</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5 col-span-full">
                <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  Transaction ID (if already paid)
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  placeholder="Enter transaction reference"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm placeholder:text-slate-400"
                />
              </div>

              {!isModalMode && (
                <div className="space-y-1.5 col-span-full">
                  <label className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                    Booking Amount Paid (if applicable)
                  </label>
                  <input
                    type="text"
                    name="bookingAmountPaid"
                    value={formData.bookingAmountPaid}
                    onChange={handleInputChange}
                    placeholder="Enter amount paid"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm placeholder:text-slate-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Consent */}
          <div className="bg-[#ECFDF5] border border-emerald-100/50 p-4 rounded-xl shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer accent-emerald-600"
              />
              <span className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                I understand that this is an advance booking request and delivery will be scheduled based on harvest availability. <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.consent && <p className="text-red-500 text-xs font-semibold mt-1.5 ml-7">{errors.consent}</p>}
          </div>

          {/* Price & Booking Fee Summary */}
          {preselectedPrice && (
            <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl p-5 space-y-3.5 text-xs text-slate-500 shadow-sm">
              <div className="flex justify-between">
                <span>Total Product Price:</span>
                <span className="font-semibold text-slate-700">₹{totalProductPrice}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Booking Amount (Non-refundable):</span>
                <span className="font-semibold">₹{bookingFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Balance to be paid on delivery:</span>
                <span className="font-semibold text-slate-700">₹{Math.max(0, totalProductPrice - bookingFee)}</span>
              </div>
              <div className="border-t border-[#F1F5F9] pt-3.5 flex justify-between items-center text-sm font-bold text-slate-800">
                <span>Total Product Value:</span>
                <span className="text-emerald-600 text-base">₹{bookingFee}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#5EA343] hover:bg-[#508d37] active:scale-[0.98] text-white rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isModalMode ? "Processing Payment..." : "Submitting..."}
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                </svg>
                {isModalMode ? `Proceed to Pay ₹ ${bookingFee}` : "Submit Booking Request"}
              </>
            )}
          </button>

        </form>
      </div>

      {!isModalMode && (
        <>
          <div className="mt-8 text-center text-[10px] text-gray-400 max-w-xl mx-auto leading-relaxed">
            Disclaimer: KaashtKart delivers 100% naturally tree-ripened, carbide-free premium mangoes. Delivery slots depend heavily on seasonal harvests and natural growth readiness.
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Booking;
