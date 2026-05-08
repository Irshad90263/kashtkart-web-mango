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
} from "lucide-react";
import { Link } from "react-router-dom";
import ccswLogo from "../../assets/images/ccws.png";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-dark)] text-gray-300 pt-8 px-8 md:px-24 2xl:px-32 3xl:px-48 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 4-Column Grid: Logo Section | Quick Links | Legal | Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Logo + Address + Social Icons */}
          <div>
            <img
              src="/sks-logo.png"
              alt="kaashtkart Logo"
              className="w-32 h-16 rounded mb-4"
            />

            {/* Address */}
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

            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 hover:bg-[var(--color-secondary)] text-white hover:text-[var(--color-dark)] rounded-full flex items-center justify-center transition-all duration-300 border border-white/10"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://m.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 hover:bg-[var(--color-secondary)] text-white hover:text-[var(--color-dark)] rounded-full flex items-center justify-center transition-all duration-300 border border-white/10"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/916307736698"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 hover:bg-[var(--color-secondary)] text-white hover:text-[var(--color-dark)] rounded-full flex items-center justify-center transition-all duration-300 border border-white/10"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.598 6.011L0 24l6.135-1.609a11.782 11.782 0 005.91 1.595h.005c6.635 0 12.05-5.414 12.05-12.05a11.81 11.81 0 00-3.535-8.513" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{ color: "#F2B705" }}
              className="font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" /> Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Our Laddus", to: "/laddus" },
                { label: "Shop", to: "/shop" },
                { label: "Contact", to: "/contact" },
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

          {/* Column 3: Legal */}
          <div>
            <h4
              style={{ color: "#F2B705" }}
              className="font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" /> Legal
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Shipping Policy", to: "/shipping-policy" },
                { label: "Return Policy", to: "/return-policy" },
                { label: "Terms of Service", to: "/terms-of-service" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 opacity-60" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4
              style={{ color: "#F2B705" }}
              className="font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+918318899526"
                  className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm flex items-start gap-2"
                >
                  <Phone className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                  +91 83188 99526
                </a>
              </li>
              <li>
                <a
                  href="tel:+917860114786"
                  className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm flex items-start gap-2"
                >
                  <Phone className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                  +91 78601 14786
                </a>
              </li>
              <li>
                <a
                  href="mailto:KaashtKart@gmail.com"
                  className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm flex items-start gap-2"
                >
                  <Mail className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                  KaashtKart@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@KaashtKart.com"
                  className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm flex items-start gap-2"
                >
                  <Mail className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                  info@KaashtKart.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-6 pb-4 text-center">
          <p className="text-gray-500 text-sm flex flex-col md:flex-row items-center justify-center gap-2">
            <span>
              © 2026{" "}
              <span className="font-bold text-[var(--color-secondary)]">
                kaashtkart
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
