import React from "react";
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom"; // Assuming you use React Router Link

const Footer = () => {
  return (
    // REMOVED mt-12 margin to ensure no gap above it
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* --- Main Grid Layout --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-gray-700 pb-10">
          {/* Column 1: Company Logo & Slogan (Spans 2 columns on large screen) */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              {/* Logo Box (Matches Header) */}
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-teal-600 to-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                TC
              </div>
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
                TCAM Solution
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs mt-4">
              Your partner in digital transformation, delivering innovative
              cloud, data, and security solutions for business excellence.
            </p>
          </div>

          {/* Column 2: Quick Links / Navigation */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-emerald-400 transition text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-emerald-400 transition text-sm"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-emerald-400 transition text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/partners"
                  className="text-gray-400 hover:text-emerald-400 transition text-sm"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-[2px]" />
                <a
                  href="mailto:contact@tcam.com"
                  className="text-gray-400 hover:text-emerald-400 transition"
                >
                  contact@tcam.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-[2px]" />
                <a
                  href="tel:+123456789"
                  className="text-gray-400 hover:text-emerald-400 transition"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-[2px]" />
                <span className="text-gray-400">
                  123 Tech Avenue, Suite 100
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Bottom Row: Copyright & Social Links --- */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8">
          {/* Copyright */}
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ClientApp (TCAM Solution). All
            rights reserved.
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-5">
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-emerald-400 transition"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="text-gray-400 hover:text-emerald-400 transition"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              className="text-gray-400 hover:text-emerald-400 transition"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>

          {/* Legal Links (Privacy, Terms) */}
          <div className="flex space-x-6 text-sm mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-emerald-400 transition duration-150"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-emerald-400 transition duration-150"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
