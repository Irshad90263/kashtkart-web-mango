import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import ScrollToTop from "../../utils/ScrollToTop";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom WhatsApp SVG Icon
const Whatsapp = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.758.459 3.475 1.332 4.988l-1.354 4.95 5.062-1.328c1.45.79 3.082 1.206 4.948 1.206 5.506 0 9.988-4.482 9.988-9.988S17.518 2 12.012 2zm4.72 13.513c-.26.732-1.282 1.334-1.764 1.393-.482.06-1.082.096-1.745-.119-.663-.214-2.825-1.082-4.787-2.815-1.962-1.733-2.868-3.902-3.082-4.565-.214-.663-.096-1.282.164-2.014.26-.732.732-1.18 1.082-1.18.35 0 .47.06.663.45.193.39.81 1.962.885 2.112.075.15.124.325.025.525-.099.2-.214.325-.375.5-.16.175-.34.39-.485.525-.164.15-.337.315-.15.638.188.324.837 1.378 1.794 2.228 1.23 1.096 2.27 1.436 2.595 1.597.325.16.513.136.7-.075.188-.212.81-.944 1.025-1.27.214-.324.43-.275.725-.164.295.11 1.868.88 2.187 1.037.319.16.533.238.613.375.08.136.08.79-.18 1.522z" />
  </svg>
);

const Layout = () => {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className={`min-h-screen bg-[var(--color-primary)] font-[var(--font-body)] ${isHome ? '' : 'pt-20'}`}>
            <ScrollToTop />
            <Navbar />
            <main>
                <Outlet />
            </main>
            
            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/918318899526"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-12 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-300 z-50 flex items-center justify-center animate-bounce-slow"
                aria-label="Chat on WhatsApp"
            >
                <Whatsapp size={32} />
            </a>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default Layout;
