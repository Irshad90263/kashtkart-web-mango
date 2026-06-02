import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Footer from "../../components/layout/Footer";

const Booking = ({ 
  preselectedVariety, 
  preselectedName, 
  preselectedWeight, 
  preselectedPrice,
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
    } else if (formData.mobileNumber.length !== 10) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }

    if (formData.alternateMobileNumber && formData.alternateMobileNumber.length !== 10) {
      newErrors.alternateMobileNumber = "Alternate mobile number must be 10 digits";
    }

    if (formData.emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = "Invalid email format";
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedNo = "KK-BK-" + Math.floor(100000 + Math.random() * 900000);
      setBookingNo(generatedNo);
      setBookingSuccess(true);
      toast.success("Booking request submitted successfully!");
      if (!isModalMode) {
        window.scrollTo(0, 0);
      }
    }, 1200);
  };

  // Pricing calculations
  const pricePerBox = preselectedPrice ? parseFloat(preselectedPrice) : 0;
  const boxes = parseInt(formData.numberOfBoxes) || 1;
  const totalProductPrice = pricePerBox * boxes;
  const bookingFee = 100;

  if (bookingSuccess) {
    return (
      <div className={isModalMode ? "bg-white text-[var(--color-text)] py-2" : "bg-[var(--color-primary)] text-[var(--color-text)] min-h-screen pt-28 pb-20 px-4"}>
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center space-y-6">
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
              className="flex-1 py-3 bg-[#008222] hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
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
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors"
            >
              {isModalMode ? "Close Panel" : "Back to Home"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isModalMode ? "bg-white text-[var(--color-text)] py-2 p-5" : "bg-[var(--color-primary)] text-[var(--color-text)] min-h-screen pt-28 pb-20 px-4"}>
      <div className={isModalMode ? "w-full mx-auto" : "max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200"}>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mango Advance Booking Form</h1>
          <p className="text-sm text-gray-500 mt-2">Please fill in your details below to place an advance booking request.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Customer Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Customer Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 text-sm ${
                    errors.fullName ? "border-red-500 bg-red-50/10" : "border-gray-300"
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 text-sm ${
                    errors.mobileNumber ? "border-red-500 bg-red-50/10" : "border-gray-300"
                  }`}
                />
                {errors.mobileNumber && <p className="text-red-500 text-xs">{errors.mobileNumber}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Alternate Mobile Number (Optional)</label>
                <input
                  type="tel"
                  name="alternateMobileNumber"
                  value={formData.alternateMobileNumber}
                  onChange={handleInputChange}
                  placeholder="Alternative mobile number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                />
                {errors.alternateMobileNumber && <p className="text-red-500 text-xs">{errors.alternateMobileNumber}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Email ID (Optional)</label>
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 text-sm ${
                    errors.emailId ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.emailId && <p className="text-red-500 text-xs">{errors.emailId}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Delivery Details</h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Complete Address *</label>
                <textarea
                  name="completeAddress"
                  value={formData.completeAddress}
                  onChange={handleInputChange}
                  placeholder="Enter complete delivery address"
                  rows="2"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 text-sm resize-none ${
                    errors.completeAddress ? "border-red-500 bg-red-50/10" : "border-gray-300"
                  }`}
                />
                {errors.completeAddress && <p className="text-red-500 text-xs">{errors.completeAddress}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 text-sm ${
                      errors.city ? "border-red-500 bg-red-50/10" : "border-gray-300"
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 text-sm ${
                      errors.state ? "border-red-500 bg-red-50/10" : "border-gray-300"
                    }`}
                  />
                  {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Pincode"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 text-sm ${
                      errors.pincode ? "border-red-500 bg-red-50/10" : "border-gray-300"
                    }`}
                  />
                  {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="Near landmark"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Order Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Order Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Mango Variety *</label>
                {isModalMode ? (
                  <input
                    type="text"
                    name="mangoVariety"
                    value={formData.mangoVariety}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm outline-none"
                  />
                ) : (
                  <select
                    name="mangoVariety"
                    value={formData.mangoVariety}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm bg-white"
                  >
                    <option value="Dussehri">Dussehri</option>
                    <option value="Langra">Langra</option>
                    <option value="Chausa">Chausa</option>
                    <option value="Amrapali">Amrapali</option>
                    <option value="Mixed Box">Mixed Box</option>
                  </select>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Mango Name *</label>
                <input
                  type="text"
                  name="mangoName"
                  value={formData.mangoName}
                  onChange={handleInputChange}
                  placeholder="Enter mango product name"
                  readOnly={isModalMode}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 text-sm ${
                    isModalMode ? "border-gray-200 bg-gray-50 text-gray-500 outline-none" : "border-gray-300"
                  }`}
                />
                {errors.mangoName && <p className="text-red-500 text-xs">{errors.mangoName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Box Size / Quantity *</label>
                <input
                  type="text"
                  name="boxSize"
                  value={formData.boxSize}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Number of Boxes *</label>
                <input
                  type="number"
                  name="numberOfBoxes"
                  min="1"
                  value={formData.numberOfBoxes}
                  onChange={handleInputChange}
                  placeholder="Enter number of boxes"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500 text-sm ${
                    errors.numberOfBoxes ? "border-red-500 bg-red-50/10" : "border-gray-300"
                  }`}
                />
                {errors.numberOfBoxes && <p className="text-red-500 text-xs">{errors.numberOfBoxes}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Preferred Delivery Week *</label>
                <select
                  name="preferredDeliveryWeek"
                  value={formData.preferredDeliveryWeek}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm bg-white"
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Any Special Instructions</label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                placeholder="Enter any special requests or delivery instructions"
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm resize-none"
              />
            </div>
          </div>

          {/* Section 4: Payment Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Payment Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Payment Mode</label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm bg-white"
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Booking Amount Paid (if applicable)</label>
                <input
                  type="text"
                  name="bookingAmountPaid"
                  value={formData.bookingAmountPaid}
                  onChange={handleInputChange}
                  placeholder="Enter amount paid"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                />
              </div>

            </div>
          </div>

          {/* Section 5: Additional Fields */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Additional Fields</h2>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">How did you hear about KaashtKart?</label>
              <select
                name="referralSource"
                value={formData.referralSource}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm bg-white"
              >
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Friend/Family">Friend/Family</option>
                <option value="Google Search">Google Search</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Section 6: Consent */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleInputChange}
                className="mt-1 accent-green-600 rounded"
              />
              <span className="text-xs text-gray-500 leading-normal">
                I understand that this is an advance booking request and delivery will be scheduled based on harvest availability. *
              </span>
            </label>
            {errors.consent && <p className="text-red-500 text-xs font-semibold">{errors.consent}</p>}
          </div>

          {/* Price & Booking Fee Summary */}
          {preselectedPrice && (
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/50 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Product Price ({formData.boxSize} x {boxes} Box{boxes > 1 ? "es" : ""}):</span>
                <span className="font-bold text-gray-800">₹{totalProductPrice}</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Advance Booking Fee:</span>
                <span className="font-bold">₹{bookingFee}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-extrabold text-gray-800">
                <span>Total Amount:</span>
                <span className="text-green-700">₹{totalProductPrice + bookingFee}</span>
              </div>
              <p className="text-[10px] text-gray-400 italic mt-1 leading-normal">
                * Note: You only need to pay the ₹{bookingFee} advance booking fee now to secure your queue. The remaining ₹{totalProductPrice} can be paid during dispatch/delivery.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#008222] hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting 
              ? (isModalMode ? "Processing Payment..." : "Submitting...") 
              : (isModalMode ? `Pay ₹${bookingFee} & Book Mango Box` : "Submit Booking Request")
            }
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
