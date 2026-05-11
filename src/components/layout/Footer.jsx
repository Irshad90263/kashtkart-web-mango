import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Shield,
  FileText,
  Link as LinkIcon,
  Youtube,
  Instagram,
  MessageCircle,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ccswLogo from "../../assets/images/ccws.png";
import { listCategoriesApi } from "../../api/categories";



const Footer = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    listCategoriesApi()
      .then((data) => {
        const cats = data.categories || (Array.isArray(data) ? data : []);
        setCategories(cats);
      })

      .catch((err) =>
        console.error("Failed to fetch categories for footer", err),
      );
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate("/laddus", { state: { categoryId: categoryId } });
    window.scrollTo(0, 0);
  };

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const categoryChunks = chunkArray(categories, 5);


  return (
    <footer className="bg-[var(--color-dark)] text-gray-300 pt-8 px-8 md:px-24 2xl:px-32 3xl:px-48 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 4-Column Grid: Logo Section | Quick Links | Legal | Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-wrap lg:justify-between gap-8 mb-10">
          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{ color: "#F2B705" }}
              className="font-semibold text-[20px] mb-5 flex items-center gap-2"
            >
              {/* <LinkIcon className="w-4 h-4" />  */}
              Useful Links
            </h4>
            <ul className="space-y-1.5">
              {[
                // { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Blogs", to: "/blogs" },
                { label: "Orchard", to: "/orchard" },
                { label: "Support Center", to: "/support" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4
              style={{ color: "#F2B705" }}
              className="font-bold mt-5 text-sm uppercase tracking-widest mb-5 flex items-center gap-2"
            >
              {/* <LinkIcon className="w-4 h-4" />  */}
              {/* Useful Links */}
            </h4>
            <ul className="space-y-1.5">
              {[
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Term & Condition", to: "/terms-of-service" },

                { label: "Cancellation & Returns", to: "/cancellation-policy" },
                { label: "Shipping Policy", to: "/shipping-policy" },

                // { label: "Shiping", to: "/refund-policy" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li><a href="https://www.dtdc.com/track-your-shipment/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm">Track Order</a></li>
            </ul>
          </div>

          {/* Column(s): Varieties */}
          {categoryChunks.length > 0 ? (
            categoryChunks.map((chunk, idx) => (
              <div key={idx}>
                <h4
                  style={{ color: "#F2B705" }}
                  className="font-semibold text-[20px] mb-5 h-5 flex items-center gap-2"
                >
                  {idx === 0 ? "Our Varieties" : ""}
                </h4>
                <ul className="space-y-2.5">
                  {chunk.map((cat) => (
                    <li key={cat._id}>
                      <button
                        onClick={() => handleCategoryClick(cat._id)}
                        className="text-gray-400 cursor-pointer hover:text-[var(--color-secondary)] transition-colors text-sm flex items-center gap-2 text-left"
                      >
                        {/* <div className="w-1 h-1 rounded-full bg-[var(--color-secondary)] opacity-40"></div> */}
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div>
              <h4
                style={{ color: "#F2B705" }}
                className="font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2"
              >
                Our Varieties
              </h4>
              <p className="text-gray-500 text-xs italic">Loading varieties...</p>
            </div>
          )}



          {/* Column 4: Contact */}
          <div>
            <h4
              style={{ color: "#F2B705" }}
              className="font-semibold text-[20px] mb-5 flex items-center gap-2"
            >
              {/* <Phone className="w-4 h-4" />  */}
              Get in Touch
            </h4>
             <div className="mb-4">
              <a
                href="https://www.google.com/maps/place/Sector+9+Indira+Nagar+Lucknow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm flex items-start gap-2"
              >
                45A Dayal Enclave, Sec-9, Indira Nagar, Lucknow 226026
              </a>
            </div>
            <ul className="space-y-3">
              <li>
                <div className="text-gray-400 text-sm flex items-start gap-2">
                  <Phone className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-x-1">
                    <a
                      href="tel:+918318899526"
                      className="hover:text-[var(--color-secondary)] transition-colors"
                    >
                      +91 83188 99526
                    </a>
                    <span>,</span>
                    <a
                      href="tel:+917860114786"
                      className="hover:text-[var(--color-secondary)] transition-colors"
                    >
                      +91 78601 14786
                    </a>
                  </div>
                </div>
              </li>

              {/* <li>
                <a
                  href="tel:+917860114786"
                  className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm flex items-start gap-2"
                >
                  <Phone className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                  
                </a>
              </li> */}
              <li>
                <div className="text-gray-400 text-sm flex items-start gap-2">
                  <Mail className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-x-1">
                    <a
                      href="mailto:KaashtKart@gmail.com"
                      className="hover:text-[var(--color-secondary)] transition-colors"
                    >
                      KaashtKart@gmail.com
                    </a>
                    <span>,</span>
                    <a
                      href="mailto:info@KaashtKart.com"
                      className="hover:text-[var(--color-secondary)] transition-colors"
                    >
                      info@KaashtKart.com
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>


        {/* Social, Apps & Payments Section */}
        <div className="border-t border-white/5 pt-8 flex flex-col lg:flex-row justify-between items-center gap-8 px-4">
          {/* Follow Us */}
          <div className="flex items-center gap-4">
            <span className="text-[14px] text-[#F2B705]">Follow Us:</span>
            <div className="flex gap-4 items-center">
              {[
                { icon: Facebook, href: "https://www.facebook.com/Kaashtkart/" },
                { icon: Instagram, href: "https://www.instagram.com/#" },
                { icon: Youtube, href: "https://www.youtube.com/@KaashtKart " },
                { icon: MessageCircle, href: "https://api.whatsapp.com/send?phone=918318899526" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/KaashtKart-marketplace-pvt-ltd/" },
                { icon: Twitter, href: "https://x.com/KaashtKart" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[var(--color-secondary)] transition-all duration-300 hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Download App */}
          <div className="flex items-center gap-4">
            <span className="text-[14px] text-[#F2B705]">Download App:</span>
            <div className="flex gap-3 items-center">
              <a href="#" className="transition-transform hover:scale-105">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="App Store" 
                  className="h-8 w-auto"
                />
              </a>
              <a href="#" className="transition-transform hover:scale-105">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Google Play" 
                  className="h-8 w-auto"
                />
              </a>
            </div>
          </div>

          {/* Payment Accepts */}
          <div className="flex items-center gap-4">
            <span className="text-[14px] text-[#F2B705]">Payment Accepts:</span>
            <div className="flex gap-4 items-center grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <img 
                src="	https://kaashtkart.com/Content/assets/images/upi-icon.jpg" 
                alt="UPI" 
                className="h-4 sm:h-5 w-auto bg-white/10 p-0.5 rounded-sm"
              />
              <img 
                src="	https://img.icons8.com/color/36/rupay.png" 
                alt="RuPay" 
                className="h-4 sm:h-6 w-auto bg-white/10 p-0.5 rounded-sm"
              />
              <img 
                src="https://img.icons8.com/color/36/visa.png" 
                alt="Visa" 
                className="h-4 sm:h-7 w-auto bg-white/10 p-0.5 rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}

        <div className="border-white/5 pt-6 pb-6 text-center -mt-2">
          <p className="text-gray-500 text-sm flex flex-col md:flex-row items-center justify-center gap-2">
            <span>
              © 2026{" "}
              <span className="font-bold text-[var(--color-secondary)]">
                KaashtKart
              </span>{" "}
              Mango.
            </span>
            <span>
              Designed & Developed by{" "}
              <a
                href="https://www.codecrafter.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block align-middle ml-1"
              >
                <img
                  src={ccswLogo}
                  alt="CodeCrafter Web Solutions"
                  className="h-10 w-auto"
                />
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
