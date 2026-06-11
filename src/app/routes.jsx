import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import CarporateGifting from "../pages/CarporateGifting/CarporateGifting";

// Lazy load all components for better performance
const Layout = lazy(() => import("../components/layout/Layout"));
const Home = lazy(() => import("../pages/Home/Home"));
const About = lazy(() => import("../pages/About/About"));
const Laddus = lazy(() => import("../pages/Laddus/Laddus"));
const Testimonials = lazy(() => import("../pages/Testimonials/Testimonials"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const FaqPage = lazy(() => import("../pages/Faq/FaqPage"));
const ProductDetail = lazy(
  () => import("../pages/ProductDetail/ProductDetail"),
);
const Login = lazy(() => import("../pages/auth/Login"));
const Profile = lazy(() => import("../pages/auth/Profile"));
const Shop = lazy(() => import("../pages/Shop/Shop"));
const Orders = lazy(() => import("../pages/Orders/Orders"));
const ReturnPolicy = lazy(() => import("../pages/Policies/ReturnPolicy"));
const PrivacyPolicy = lazy(() => import("../pages/Policies/PrivacyPolicy"));
const ShippingPolicy = lazy(() => import("../pages/Policies/ShippingPolicy"));

const TermsOfService = lazy(() => import("../pages/Policies/TermsOfService"));
const CancellationPolicy = lazy(() => import("../pages/Policies/CancellationPolicy"));
const Blogs = lazy(() => import("../pages/Blogs"));

const BlogDetail = lazy(() => import("../pages/BlogDetail"));
const Orchard = lazy(() => import("../pages/Orchard/Orchard"));
const SupportCenter = lazy(() => import("../pages/SupportCenter/SupportCenter"));
const BookingProducts = lazy(() => import("../pages/Booking/BookingProducts"));
const ErrorPage = lazy(() => import("../components/common/ErrorPage"));



export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "orders", element: <Orders /> },
      { path: "about", element: <About /> },
      { path: "mangos", element: <Laddus /> },
      { path: "faqs", element: <FaqPage /> },
      { path: "blogs", element: <Blogs /> },
      { path: "blog/:slug", element: <BlogDetail /> },
      { path: "product/:slug", element: <ProductDetail /> },
      { path: "testimonials", element: <Testimonials /> },
      { path: "contact", element: <Contact /> },
      { path: "booking", element: <BookingProducts /> },
      { path: "profile", element: <Profile /> },
      { path: "return-policy", element: <ReturnPolicy /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "shipping-policy", element: <ShippingPolicy /> },

      { path: "terms-of-service", element: <TermsOfService /> },
      { path: "cancellation-policy", element: <CancellationPolicy /> },
      { path: "carporate-gifting", element: <CarporateGifting /> },

      { path: "orchard", element: <Orchard /> },
      { path: "support", element: <SupportCenter /> },
      { path: "*", element: <NotFound /> },


    ],
  },
]);
