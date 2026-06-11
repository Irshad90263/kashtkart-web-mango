import React from "react";
import Footer from "../../components/layout/Footer";
import {
  Shield,
  Truck,
  Package,
  Heart,
  Clock,
  Sparkles,
  Edit3,
  Gift,
  BarChart3,
  Star,
  Leaf,
  ShoppingBag,
  ArrowRight,
  Stamp,
  Ribbon,
  FileText,
  Boxes,
  Truck as TruckIcon,
  CalendarCheck,
  Recycle,
  Medal,
} from "lucide-react";

import { toast } from 'react-toastify';
import { createCorporateInquiryApi } from "../../api/corporateInquiry";
import { getUserData } from "../../utils/auth";

const CarporateGifting = () => {
  const [formData, setFormData] = React.useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    quantity: "",
    occasion: "",
    customBranding: false,
  });

  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "phone") {
      // Prevent typing more than 10 digits
      if (value.length > 10) return;
      // Only allow numbers
      if (value && !/^\d+$/.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields check
    if (!formData.companyName) newErrors.companyName = true;
    if (!formData.contactPerson) newErrors.contactPerson = true;
    if (!formData.quantity) newErrors.quantity = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = true;
    }

    // Phone validation (6-9 start and 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      // Get userId from userData in localStorage
      const userData = getUserData();
      const userId = userData ? userData.id : null;

      const payload = {
        ...formData,
        userId: userId
      };

      const response = await createCorporateInquiryApi(payload);

      if (response.success) {
        toast.success("Quote request submitted successfully!");
        // Reset form
        setFormData({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          quantity: "",
          occasion: "",
          customBranding: false,
        });
        setErrors({});
      } else {
        toast.error(response.message || "Failed to submit inquiry");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FEF7E0] font-['Poppins','Inter',sans-serif] min-h-screen">
      {/* Main Container */}
      <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <span className="text-[#B97F10] font-medium text-sm">Home</span>
          <span className="text-[#9C7A3E] mx-1">/</span>
          <span className="text-[#5A4A2A] font-medium text-sm">
            Corporate Gifting
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#AD7A2C] tracking-tight mb-2">
            Corporate Gifting
          </h1>
          <p className="text-lg md:text-xl font-medium text-[#B67A1A] border-b-2 border-[#F5D98F] inline-block pb-2">
            Premium mango gift packs for clients and teams
          </p>
        </div>

        {/* Features Grid - What Makes Our Corporate Gifts Special */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {[
            {
              icon: Edit3,
              title: "Custom Branding",
              desc: "Add your company logo & message",
              color: "#C97E1A",
            },
            {
              icon: Gift,
              title: "Premium Packaging",
              desc: "Luxury gift boxes with ribbon",
              color: "#C97E1A",
            },
            {
              icon: BarChart3,
              title: "Bulk Discounts",
              desc: "Special rates for large orders",
              color: "#C97E1A",
            },
            {
              icon: Heart,
              title: "Personal Touch",
              desc: "Greeting cards & gift tags",
              color: "#C97E1A",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-md p-6 text-center shadow-md hover:shadow-lg transition-all border border-[#FFEFC0]"
            >
              <div className="w-16 h-16 bg-[#FDEFC8] rounded-full flex items-center justify-center mx-auto mb-4 text-[#C97E1A]">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl md:text-xl font-bold text-[#855D1E] mb-2">
                {item.title}
              </h3>
              <p className="text-[#7A6233] font-medium text-sm md:text-base">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Premium Mango Showcase Banner */}
        <div className="bg-gradient-to-br from-[#FFFAEC] to-[#FFF2DA] rounded-md md:rounded-md p-6 md:p-8 mb-16 border border-[#F7E2B0] shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Leaf className="w-8 h-8 text-[#D9921E]" />
                <h2 className="text-2xl md:text-3xl font-bold text-[#A56F20]">
                  Farm-Fresh Mango
                </h2>
              </div>
              <p className="text-[#5E4A27] text-sm md:text-base leading-relaxed mb-4">
                Handpicked, sun-ripened premium mangoes. Each gift pack reflects
                warmth, gratitude, and excellence — perfect for clients and
                teams.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-[#EFCA7A] text-[#4A3716] text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                  <Star className="w-3 h-3" /> Bulk pricing from 20+ boxes
                </span>
                {/* <span className="bg-[#EFCA7A] text-[#4A3716] text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                  <TruckIcon className="w-3 h-3" /> Pan-India delivery
                </span> */}
              </div>
            </div>
            <div className="bg-[#FBE9C3] rounded-md md:rounded-md px-6 py-4 text-center min-w-[140px] flex flex-col items-center justify-center">
              <Star className="w-10 h-10 text-[#F9A620] mb-2" />
              <div className="text-2xl md:text-3xl font-extrabold text-[#B06818]">
                10% OFF
              </div>
              <div className="text-xs font-medium">
                on first corporate order
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Features Row */}
        <div className="bg-white/85 rounded-md p-6 md:p-12 mb-16 border border-[#FFE4A8] backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-0">
            <div className="text-center md:text-left md:border-r border-[#FFE4A8]/60 md:px-8">
              <Stamp className="w-8 h-8 text-[#D98F1F] mb-3 inline-block" />
              <h3 className="text-xl font-semibold text-[#7A521C] mb-2">
                Your Logo, Your Message
              </h3>
              <p className="text-[#6D5734] text-sm leading-relaxed">
                We custom-print your company logo on the gift boxes and include
                personalized greeting cards.
              </p>
            </div>
            <div className="text-center md:text-left md:border-r border-[#FFE4A8]/60 md:px-8">
              <Ribbon className="w-8 h-8 text-[#D98F1F] mb-3 inline-block" />
              <h3 className="text-xl font-semibold text-[#7A521C] mb-2">
                Luxury Ribbon Packaging
              </h3>
              <p className="text-[#6D5734] text-sm leading-relaxed">
                Elegant wooden crates & satin ribbons — makes every unboxing a
                celebration.
              </p>
            </div>
            <div className="text-center md:text-left md:px-8">
              <FileText className="w-8 h-8 text-[#D98F1F] mb-3 inline-block" />
              <h3 className="text-xl font-semibold text-[#7A521C] mb-2">
                Greeting Cards & Gift Tags
              </h3>
              <p className="text-[#6D5734] text-sm leading-relaxed">
                Write a custom note for each client; we'll handwrite or print
                your message.
              </p>
            </div>
          </div>
        </div>

        {/* Bulk Quote Form Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#FFEFC0] overflow-hidden mb-16">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-[#855D1E] text-center mb-10">
              Get Bulk Quote
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#5A4A2A]">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Your company name"
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${errors.companyName ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB]'} focus:ring-2 focus:ring-[#F9A620] focus:border-transparent outline-none transition-all placeholder:text-gray-400`}
                  />
                </div>

                {/* Contact Person */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#5A4A2A]">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${errors.contactPerson ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB]'} focus:ring-2 focus:ring-[#F9A620] focus:border-transparent outline-none transition-all placeholder:text-gray-400`}
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#5A4A2A]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@company.com"
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB]'} focus:ring-2 focus:ring-[#F9A620] focus:border-transparent outline-none transition-all placeholder:text-gray-400`}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#5A4A2A]">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile"
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB]'} focus:ring-2 focus:ring-[#F9A620] focus:border-transparent outline-none transition-all placeholder:text-gray-400`}
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#5A4A2A]">
                    Quantity (Units) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Minimum 10 units"
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${errors.quantity ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB]'} focus:ring-2 focus:ring-[#F9A620] focus:border-transparent outline-none transition-all placeholder:text-gray-400`}
                  />
                </div>

                {/* Occasion */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#5A4A2A]">
                    Occasion
                  </label>
                  <input
                    type="text"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleInputChange}
                    placeholder="e.g. Diwali gifting"
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-2 focus:ring-[#F9A620] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Custom Branding Checkbox */}
              <div className="bg-[#FFFBEB] rounded-xl p-6 border border-[#FEF3C7] mt-8">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="customBranding"
                    checked={formData.customBranding}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-[#F9A620] focus:ring-[#F9A620]"
                  />
                  <div>
                    <span className="block font-bold text-[#5A4A2A] text-lg">
                      I want custom branding
                    </span>
                    <span className="text-sm text-[#7A6233]">
                      Add your company logo, custom message, or branded gift
                      tags
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#F9A620] hover:bg-[#E89510] text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-[0.98] transition-all text-xl mt-8 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  "Get Bulk Quote"
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Our team will get back to you within 24 hours with a customized
                quote
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CarporateGifting;
