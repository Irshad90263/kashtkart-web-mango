import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Footer from "../../components/layout/Footer";
import { createBulkOrderInquiryApi } from "../../api/bulkOrder";
import { listVarietiesApi } from "../../api/categories";

const BulkOrder = () => {
  const [varieties, setVarieties] = useState([]);
  const [countries, setCountries] = useState([]);
  
  useEffect(() => {
    // Fetch varieties
    const fetchVarieties = async () => {
      try {
        const data = await listVarietiesApi();
        const vars = data.varieties || data.categories || [];
        setVarieties(vars);
      } catch (error) {
        console.error("Failed to fetch varieties", error);
      }
    };
    
    // Fetch countries
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
        const data = await response.json();
        const countryNames = data.map(c => c.name.common).sort();
        setCountries(countryNames);
      } catch (error) {
        console.error("Failed to fetch countries", error);
        // Fallback to basic list if API fails
        setCountries(["India", "UAE", "USA", "UK", "Canada", "Australia"]);
      }
    };

    fetchVarieties();
    fetchCountries();
  }, []);
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    mobileNumber: "+91",
    emailId: "",
    deliveryCityState: "",
    country: "",
    typeOfBuyer: "",
    preferredMangoVariety: [],
    requiredQuantity: "",
    customQuantity: "",
    packagingPreference: "",
    exactDeliveryAddress: "",
    expectedDeliveryDate: "",
    frequencyOfOrder: "",
    specialRequirements: "",
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "mobileNumber") {
      let val = value;
      if (!val.startsWith("+91")) {
        val = "+91" + val.replace(/^\+?9?1?/, "");
      }
      let numbersOnly = val.slice(3).replace(/[^0-9]/g, "");
      // Ensure the first digit after +91 starts with 6, 7, 8, or 9
      if (numbersOnly.length > 0 && !/^[6-9]/.test(numbersOnly)) {
        numbersOnly = numbersOnly.replace(/^[^6-9]+/, "");
      }
      const finalVal = "+91" + numbersOnly.slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: finalVal }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e, variety) => {
    const isChecked = e.target.checked;
    setFormData((prev) => {
      let newVarieties = [...prev.preferredMangoVariety];
      if (isChecked) {
        newVarieties.push(variety);
      } else {
        newVarieties = newVarieties.filter((v) => v !== variety);
      }
      return { ...prev, preferredMangoVariety: newVarieties };
    });
    if (errors.preferredMangoVariety) {
      setErrors((prev) => ({ ...prev, preferredMangoVariety: "" }));
    }
  };

  const validateForm = () => {
    const checks = [
      { field: "fullName", test: () => !formData.fullName.trim(), msg: "Full Name is required" },
      { field: "mobileNumber", test: () => !/^\+91[6-9]\d{9}$/.test(formData.mobileNumber), msg: "Enter a valid 10-digit Mobile Number starting with 6, 7, 8, or 9" },
      { field: "emailId", test: () => !formData.emailId.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId), msg: "Valid Email Address is required" },
      { field: "deliveryCityState", test: () => !formData.deliveryCityState.trim(), msg: "Delivery City & State is required" },
      { field: "country", test: () => !formData.country.trim(), msg: "Country is required" },
      { field: "typeOfBuyer", test: () => !formData.typeOfBuyer, msg: "Type of Buyer is required" },
      { field: "preferredMangoVariety", test: () => formData.preferredMangoVariety.length === 0, msg: "Please select at least one preferred mango variety" },
      { field: "requiredQuantity", test: () => !formData.requiredQuantity, msg: "Required Quantity is required" },
      { field: "customQuantity", test: () => formData.requiredQuantity === "custom" && !formData.customQuantity.trim(), msg: "Please specify your custom quantity" },
      { field: "packagingPreference", test: () => !formData.packagingPreference, msg: "Packaging Preference is required" },
      { field: "exactDeliveryAddress", test: () => !formData.exactDeliveryAddress.trim(), msg: "Exact Delivery Address is required" },
      { field: "expectedDeliveryDate", test: () => !formData.expectedDeliveryDate, msg: "Expected Delivery Date is required" },
      { field: "frequencyOfOrder", test: () => !formData.frequencyOfOrder, msg: "Frequency of Order is required" },
      { field: "consent", test: () => !formData.consent, msg: "Please agree to the communication consent" },
    ];

    const newErrors = {};
    let firstErrorField = null;

    for (const check of checks) {
      if (check.test()) {
        if (!newErrors[check.field]) {
          newErrors[check.field] = check.msg;
        }
        if (!firstErrorField) {
          firstErrorField = check.field;
        }
      }
    }

    setErrors(newErrors);

    if (firstErrorField) {
      toast.error(newErrors[firstErrorField]);
      // Attempt to find element with name and focus
      const el = document.getElementsByName(firstErrorField)[0];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => el.focus(), 350);
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        requiredQuantity: formData.requiredQuantity === "custom" ? formData.customQuantity : formData.requiredQuantity,
      };
      
      const response = await createBulkOrderInquiryApi(payload);
      if (response.success) {
        setBookingSuccess(true);
        toast.success("Bulk order inquiry submitted successfully!");
        window.scrollTo(0, 0);
      } else {
        toast.error(response.message || "Failed to submit inquiry.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="bg-[var(--color-primary)] text-[var(--color-text)] min-h-screen">
        <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 py-6 md:py-8">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-6">
            <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-[#F1F5F9] text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto text-2xl font-bold">✓</div>
            <h1 className="text-2xl font-bold text-gray-800">Inquiry Submitted Successfully!</h1>
            <p className="text-sm text-gray-600">
              Thank you for reaching out to us. Our commercial team has received your bulk order request and will get back to you with a custom quote within 24 hours.
            </p>
            <div className="pt-4 flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = "/"}
                className="px-8 py-3 bg-[#008222] hover:bg-green-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#FEF7E0] font-['Poppins','Inter',sans-serif] min-h-screen">
      {/* Main Container */}
      <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto px-4 md:px-12 py-6 md:py-8">
        
        

        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#AD7A2C] tracking-tight mb-4">
            Bulk Mango Order Inquiry
          </h1>
          <p className="text-lg md:text-xl font-medium text-[#B67A1A] max-w-3xl mx-auto border-b-2 border-[#F5D98F] inline-block pb-2">
            Looking to source premium mangoes for your business, event, export, or wholesale needs? Fill out this quick form, and our commercial team will get back to you with a custom quote within 24 hours.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-200 space-y-8 relative overflow-hidden">
          
          <div className="border-b border-gray-100 pb-4 mb-2 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Bulk Order Form</h2>
            <p className="text-sm text-gray-500 mt-1">Please provide accurate information to help us serve you better.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          {/* Section 1: Contact Information */}
          <div className="bg-white border border-[#F1F5F9] rounded p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <span className="bg-[#F9A620] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">1</span>
              <h2 className="text-[16px] font-bold text-slate-800">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm ${errors.fullName ? "border-red-500 bg-red-50" : "border-slate-200"}`} />
              </div>
              
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Company / Business Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Optional" className="w-full px-4 py-2 border rounded border-slate-200 focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm" />
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Mobile Number <span className="text-red-500">*</span></label>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="With country code (e.g. +91)" className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm ${errors.mobileNumber ? "border-red-500 bg-red-50" : "border-slate-200"}`} />
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Email Address <span className="text-red-500">*</span></label>
                <input type="email" name="emailId" value={formData.emailId} onChange={handleInputChange} placeholder="your@email.com" className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm ${errors.emailId ? "border-red-500 bg-red-50" : "border-slate-200"}`} />
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Delivery City & State <span className="text-red-500">*</span></label>
                <input type="text" name="deliveryCityState" value={formData.deliveryCityState} onChange={handleInputChange} placeholder="E.g., Mumbai, Maharashtra" className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm ${errors.deliveryCityState ? "border-red-500 bg-red-50" : "border-slate-200"}`} />
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Country <span className="text-red-500">*</span></label>
                <select name="country" value={formData.country} onChange={handleInputChange} className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm bg-white ${errors.country ? "border-red-500 bg-red-50" : "border-slate-200"}`}>
                  <option value="">Select Country</option>
                  {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Business Profile & Order Details */}
          <div className="bg-white border border-[#F1F5F9] rounded p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <span className="bg-[#F9A620] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">2</span>
              <h2 className="text-[16px] font-bold text-slate-800">Business Profile & Order Details</h2>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Type of Buyer <span className="text-red-500">*</span></label>
                <select name="typeOfBuyer" value={formData.typeOfBuyer} onChange={handleInputChange} className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm bg-white ${errors.typeOfBuyer ? "border-red-500 bg-red-50" : "border-slate-200"}`}>
                  <option value="">Select Buyer Type</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Retailer / Supermarket">Retailer / Supermarket</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Exporter">Exporter</option>
                  <option value="Corporate / Gifting">Corporate / Gifting</option>
                  <option value="Hotel / Restaurant / Catering (Horeca)">Hotel / Restaurant / Catering (Horeca)</option>
                  <option value="Event Organizer">Event Organizer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Preferred Mango Variety <span className="text-red-500">*</span></label>
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 p-3 border rounded-lg ${errors.preferredMangoVariety ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-gray-50/50'}`}>
                  {varieties.map((variety) => (
                    <label key={variety._id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.preferredMangoVariety.includes(variety._id)}
                        onChange={(e) => handleCheckboxChange(e, variety._id)}
                        className="w-4 h-4 text-[#F9A620] focus:ring-[#F9A620] rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{variety.name}</span>
                    </label>
                  ))}
                </div>
                {errors.preferredMangoVariety && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.preferredMangoVariety}</p>}
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Required Quantity <span className="text-red-500">*</span></label>
                <select name="requiredQuantity" value={formData.requiredQuantity} onChange={handleInputChange} className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm bg-white ${errors.requiredQuantity ? "border-red-500 bg-red-50" : "border-slate-200"}`}>
                  <option value="">Select Quantity</option>
                  <option value="50kg">50 kg</option>
                  <option value="100 kg">100 kg</option>
                  <option value="500 kg">500 kg</option>
                  <option value="1 Ton">1 Ton</option>
                  <option value="5 Tons">5 Tons</option>
                  <option value="5+ Tons">5+ Tons</option>
                  <option value="custom">Custom (Specify below)</option>
                </select>
                {formData.requiredQuantity === "custom" && (
                  <div className="mt-3">
                    <input 
                      type="text" 
                      name="customQuantity" 
                      value={formData.customQuantity} 
                      onChange={handleInputChange} 
                      placeholder="Enter custom quantity e.g. 200 boxes" 
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm ${errors.customQuantity ? "border-red-500 bg-red-50" : "border-slate-200"}`} 
                    />
                    {errors.customQuantity && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.customQuantity}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Logistics & Packaging */}
          <div className="bg-white border border-[#F1F5F9] rounded p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <span className="bg-[#F9A620] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">3</span>
              <h2 className="text-[16px] font-bold text-slate-800">Logistics & Packaging</h2>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Packaging Preference <span className="text-red-500">*</span></label>
                <select name="packagingPreference" value={formData.packagingPreference} onChange={handleInputChange} className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm bg-white ${errors.packagingPreference ? "border-red-500 bg-red-50" : "border-slate-200"}`}>
                  <option value="">Select Packaging</option>
                  <option value="Standard Commercial Box (Crates)">Standard Commercial Box (Crates)</option>
                  <option value="Premium Gift Packaging">Premium Gift Packaging</option>
                  <option value="Custom / Branded Packaging">Custom / Branded Packaging</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Exact Delivery Address / Port of Discharge <span className="text-red-500">*</span></label>
                <textarea name="exactDeliveryAddress" value={formData.exactDeliveryAddress} onChange={handleInputChange} rows="3" placeholder="Enter complete address..." className={`w-full px-4 py-3 border rounded focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm resize-none ${errors.exactDeliveryAddress ? "border-red-500 bg-red-50" : "border-slate-200"}`}></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Expected Delivery Date <span className="text-red-500">*</span></label>
                  <input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleInputChange} className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm bg-white ${errors.expectedDeliveryDate ? "border-red-500 bg-red-50" : "border-slate-200"}`} />
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Frequency of Order <span className="text-red-500">*</span></label>
                  <select name="frequencyOfOrder" value={formData.frequencyOfOrder} onChange={handleInputChange} className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm bg-white ${errors.frequencyOfOrder ? "border-red-500 bg-red-50" : "border-slate-200"}`}>
                    <option value="">Select Frequency</option>
                    <option value="One-Time Spot Order">One-Time Spot Order</option>
                    <option value="Weekly Supply">Weekly Supply</option>
                    <option value="Monthly Supply">Monthly Supply</option>
                    <option value="Seasonal Contract">Seasonal Contract</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Special Requests & Authorization */}
          <div className="bg-white border border-[#F1F5F9] rounded p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <span className="bg-[#F9A620] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">4</span>
              <h2 className="text-[16px] font-bold text-slate-800">Special Requests & Authorization</h2>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] tracking-wider text-slate-500 font-bold capitalize z-10">Special Requirements or Notes</label>
                <textarea name="specialRequirements" value={formData.specialRequirements} onChange={handleInputChange} rows="3" placeholder="Use this space to specify required ripeness levels, organic certifications, phytosanitary certificates for export, or specific sizing needs." className="w-full px-4 py-3 border rounded border-slate-200 focus:outline-none focus:border-[#008222] focus:ring-1 focus:ring-[#008222]/20 text-sm resize-none"></textarea>
              </div>

              <div className={`p-4 rounded-lg border ${errors.consent ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" name="consent" checked={formData.consent} onChange={handleInputChange} className="mt-1 w-5 h-5 rounded border-gray-300 text-[#008222] focus:ring-[#008222]" />
                  <span className="text-sm text-gray-700 leading-relaxed font-medium">
                    I agree to receive communications, quotes, and updates regarding this bulk order inquiry via the contact details provided above. <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 bg-orange-500 duration-150 cursor-pointer hover:bg-orange-600 text-white font-bold rounded-md text-lg shadow-lg transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : "Submit Bulk Inquiry"}
          </button>
        </form>
      </div>
      </div>
      <div className="mt-16"></div>
      <Footer />
    </div>
  );
};

export default BulkOrder;
