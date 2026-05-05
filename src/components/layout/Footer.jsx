import { Mail, Phone, MapPin, Shield, FileText, Link as LinkIcon, Youtube, Instagram, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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
              alt="KashtKart Logo"
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
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#F2B705' }} className="font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Us', to: '/about' },
                { label: 'Our Laddus', to: '/laddus' },
                { label: 'Shop', to: '/shop' },
                { label: 'Contact', to: '/contact' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 style={{ color: '#F2B705' }} className="font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Legal
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Shipping Policy', to: '/shipping-policy' },
                { label: 'Return Policy', to: '/return-policy' },
                { label: 'Terms of Service', to: '/terms-of-service' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 opacity-60" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 style={{ color: '#F2B705' }} className="font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+918318899526" className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm flex items-start gap-2">
                  <Phone className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                  +91 83188 99526
                </a>
              </li>
              <li>
                <a href="tel:+917860114786" className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm flex items-start gap-2">
                  <Phone className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                  +91 78601 14786
                </a>
              </li>
              <li>
                <a href="mailto:KaashtKart@gmail.com" className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm flex items-start gap-2">
                  <Mail className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                  KaashtKart@gmail.com
                </a>
              </li>
              <li>
                <a href="mailto:info@KaashtKart.com" className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm flex items-start gap-2">
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
            <span>© 2026 <span className="font-bold text-[var(--color-secondary)]">KashtKart</span> Mango.</span>
            <span>Designed & Developed by <a href="https://www.codecrafter.co.in/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-secondary)] hover:underline font-semibold">#CodeCrafter Web Solutions Pvt. Ltd.</a></span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;