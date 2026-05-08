import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import ScrollToTop from "../../utils/ScrollToTop";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
