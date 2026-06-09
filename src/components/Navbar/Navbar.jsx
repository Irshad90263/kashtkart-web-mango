import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getCartApi } from "../../api/cart";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Package,
} from "lucide-react";
import { listCategoriesApi } from "../../api/categories";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  // Fetch categories for dropdown
  useEffect(() => {
    listCategoriesApi()
      .then((data) => {
        const cats = data.categories || (Array.isArray(data) ? data : []);
        setCategories([...cats].reverse());
      })
      .catch((err) =>
        console.error("Failed to fetch categories for navbar", err),
      );
  }, []);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const data = await getCartApi();
        if (data && data.items) {
          setCartCount(data.items.length);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Failed to fetch cart count", error);
        setCartCount(0);
      }
    };

    fetchCartCount();

    window.addEventListener("cart-updated", fetchCartCount);

    return () => {
      window.removeEventListener("cart-updated", fetchCartCount);
    };
  }, [location.pathname]);

  // Check auth status
  useEffect(() => {
    const checkAuth = () => {
      const tokenData = localStorage.getItem("userToken");
      if (tokenData) {
        try {
          const parsed = JSON.parse(tokenData);
          if (Date.now() < parsed.expiresAt) {
            setIsLoggedIn(true);
            return;
          }
        } catch (e) {
          console.error("Token parse error", e);
        }
      }
      setIsLoggedIn(false);
    };

    checkAuth();
    // Re-check on every navigation or custom event
    window.addEventListener("user-logged-in", checkAuth);
    return () => window.removeEventListener("user-logged-in", checkAuth);
  }, [location.pathname]);

  // Close menu and dropdown when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeLink =
    "no-underline text-[var(--color-secondary)] font-semibold text-base transition-all duration-300 border-b-2 border-[var(--color-secondary)] pb-1";
  const normalLink =
    "no-underline text-[var(--color-text)] font-semibold text-base transition-all duration-300 hover:text-[var(--color-secondary)] border-b-2 border-transparent hover:border-[var(--color-secondary)] pb-1";

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleCategoryClick = (categoryId) => {
    setIsDropdownOpen(false);
    navigate("/laddus", { state: { categoryId: categoryId } });
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "Our Legacy" },
    { to: "/laddus", label: "Order Now" },
    { to: "/CarporateGifting", label: "Corporate Gifting" },
    { to: "/blogs", label: "Blogs" },
    { to: "/contact", label: "Reach Out Us" },
  ];

  return (
    <nav className="bg-[var(--color-primary)]/80 font-[var(--font-body)] fixed top-0 left-0 right-0 w-full z-[1000] shadow-sm transition-all duration-300 border-b border-[var(--color-secondary)]/10 backdrop-blur-lg">
      <div className="max-w-[1440px] 3xl:max-w-[1900px] mx-auto flex justify-between items-center py-2 px-4 md:px-12 w-full">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="/sks-logo.png"
            alt="SKS Logo"
            className="w-24 h-16 transition-transform cursor-pointer md:w-32 md:h-20 hover:scale-105"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden gap-8 p-0 m-0 list-none lg:flex">
          {navLinks.map((link) => {
            if (link.to === "/laddus") {
              return (
                <li
                  key={link.to}
                  className="relative group"
                  ref={dropdownRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavLink
                    to={link.to}
                    state={{ categoryId: "all" }}
                    className={({ isActive }) =>
                      isActive
                        ? activeLink + " flex items-center gap-1"
                        : normalLink + " flex items-center gap-1"
                    }
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {link.label}{" "}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </NavLink>

                  {/* Dropdown */}
                  <div
                    className={`absolute left-0 mt-2 w-56 bg-[var(--color-surface)] border border-[var(--color-secondary)]/20 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-300 z-50 overflow-hidden ${isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
                  >
                    <div className="flex flex-col py-2">
                      <div
                        className="px-4 py-2.5 hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] text-sm cursor-pointer text-[var(--color-text)] transition-colors font-medium"
                        onClick={() => handleCategoryClick("all")}
                      >
                        All Products
                      </div>
                      {categories.map((cat) => (
                        <div
                          key={cat._id}
                          className="px-2 py-2.5 hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] text-sm cursor-pointer text-[var(--color-text)] transition-colors font-medium flex gap-2"
                          onClick={() => handleCategoryClick(cat._id)}
                        >
                          <img
                            className="w-6 h-6"
                            src={cat.image?.url || "KK"}
                          />
                          <div>{cat.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? activeLink : normalLink
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Actions & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Booking Button (Highlighted Green) */}
          <NavLink
            to="/booking"
            className={({ isActive }) =>
              `no-underline font-extrabold text-[10px] sm:text-xs px-2.5 py-1.5 sm:px-4 sm:py-2 rounded transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#FD9C03] text-white shadow-[#008222]/30"
                  : "bg-[#FD9C03] hover:bg-[#FD9C03] text-white shadow-[#008222]/20 hover:shadow-[#008222]/30"
              }`
            }
          >
            {/* <span className="w-2 h-2 bg-white rounded-full animate-ping"></span> */}
            {/* <span className="sm:inline">Advance</span> */}
            Booking
          </NavLink>

          {/* My Orders Icon — Only if logged in */}
          {isLoggedIn && (
            <div
              onClick={() => navigate("/orders")}
              className="flex items-center text-[var(--color-secondary)] cursor-pointer transition-transform duration-200 hover:scale-110 relative"
              title="My Orders"
            >
              <Package size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </div>
          )}

          {/* Cart Icon */}
          <div
            onClick={() => navigate("/shop")}
            className="flex items-center text-[var(--color-secondary)] cursor-pointer transition-transform duration-200 hover:scale-110 relative"
            title="View Order"
          >
            <ShoppingCart size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[var(--color-secondary)] text-[var(--color-primary)] text-[9px] sm:text-[10px] font-extrabold w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </div>

          <div
            onClick={() => navigate("/profile")}
            className="hidden sm:flex items-center text-[var(--color-secondary)] cursor-pointer transition-transform duration-200 hover:scale-110"
            title="Customer Profile"
          >
            <User size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex flex-col justify-center p-0 -ml-5 text-[var(--color-secondary)] focus:outline-none z-[1001] rounded sm:rounded-xl cursor-pointer transition-transform active:scale-95"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X size={20} className="sm:w-6 sm:h-6" />
            ) : (
              <Menu size={20} className="sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] transition-opacity duration-500 ease-in-out ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div
        className={`lg:hidden fixed top-24 right-4 h-[80vh] w-[80%] max-w-[300px] bg-[var(--color-surface)]/95 backdrop-blur-2xl z-[1000] shadow-2xl transition-all duration-500 ease-in-out rounded-[45px] border border-[var(--color-secondary)]/10 overflow-hidden ${isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"}`}
      >
        <div className="flex flex-col h-full gap-3 p-8 py-10">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)] opacity-50 mb-4 px-2">
            Navigation Menu
          </p>
          {navLinks.map((link, idx) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => {
                setIsMenuOpen(false);
                setIsDropdownOpen(false);
              }}
              className={({ isActive }) =>
                `text-base font-bold no-underline py-3 px-6 rounded-2xl transition-all duration-300 ${isActive ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] shadow-sm" : "text-[var(--color-text)] hover:bg-[var(--color-secondary)]/5"}`
              }
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              {link.label}
            </NavLink>
          ))}

          {isLoggedIn && (
            <NavLink
              to="/orders"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `text-base font-bold no-underline py-3 px-6 rounded-2xl transition-all duration-300 ${isActive ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] shadow-sm" : "text-[var(--color-text)] hover:bg-[var(--color-secondary)]/5"}`
              }
            >
              My Orders
            </NavLink>
          )}

          <div className="mt-auto pt-6 border-t border-[var(--color-secondary)]/10 flex items-center justify-between">
            <div
              onClick={() => {
                navigate("/profile");
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 text-[var(--color-secondary)] font-bold cursor-pointer hover:bg-[var(--color-secondary)]/10 p-2 rounded-xl transition-all duration-300"
            >
              <User size={18} />
              <span className="text-sm tracking-wider uppercase">Profile</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
