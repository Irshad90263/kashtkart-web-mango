import { RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "../context/ThemeContext";
import { CartProvider } from "../context/CartContext";
import { router } from "./routes";
import { Suspense, useEffect } from "react";
import { isTokenValid, removeToken } from "../utils/auth";

// Loading component
const AppLoader = () => (
  <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-[var(--color-text)] font-medium">Loading SKS Laddu...</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    // Check token validity on app load
    if (!isTokenValid()) {
      removeToken();
    }
  }, []);

  return (
    <ThemeProvider>
      <CartProvider>
        <Suspense fallback={<AppLoader />}>
          <RouterProvider router={router} />
        </Suspense>
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={3}
          style={{ zIndex: 9999 }}
        />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;