// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Contact2Icon, ChevronDown } from "lucide-react";
import { fetchWidgets } from "../api/widget";
import {
  fetchPublicProducts,
  fetchSubProductsByProduct,
} from "../api/products";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Service", href: "/services" },
  { name: "Solution", href: "/solution" },
  { name: "Career", href: "/jobs" },
  { name: "Customer", href: "/customers" },
  { name: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false); // mobile menu
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const [widget, setWidget] = useState(null);
  const [products, setProducts] = useState([]);
  const [productDropdown, setProductDropdown] = useState(false); // desktop dropdown
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  // Fetch widget
  useEffect(() => {
    const loadWidget = async () => {
      try {
        const res = await fetchWidgets();
        if (res.data?.data?.length > 0) setWidget(res.data.data[0]);
      } catch (err) {
        console.error("Failed to fetch widget:", err);
      }
    };
    loadWidget();
  }, []);

  // Fetch products & sub-products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchPublicProducts();
        let productsData = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];

        // fetch sub-products for each product
        const productsWithSubs = await Promise.all(
          productsData.map(async (p) => {
            try {
              const subRes = await fetchSubProductsByProduct(p.id);
              return { ...p, sub_products: subRes.data || [] };
            } catch (err) {
              console.error(
                "Failed to fetch sub-products for product",
                p.id,
                err
              );
              return { ...p, sub_products: [] };
            }
          })
        );

        setProducts(productsWithSubs);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    loadProducts();
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [location.pathname]);

  // Click outside / Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toggleRef.current?.contains(e.target)) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setProductDropdown(false);
      }
    };
    const handleKey = (e) => e.key === "Escape" && setProductDropdown(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isTransparentAtTop = location.pathname === "/" && !scrolled;
  const headerBg = isTransparentAtTop
    ? "bg-transparent shadow-none"
    : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md";

  const isActive = (href) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between h-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {widget?.app_logo_url ? (
                <img
                  src={widget.app_logo_url}
                  alt="Logo"
                  className="h-12 w-12 rounded-full shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center font-bold text-white text-lg shadow-sm">
                  TC
                </div>
              )}
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-extrabold gradient-text uppercase">
                  {widget?.app_name || "TCAM Solution"}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {widget?.app_sort_desc}
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 relative">
              {navItems
                .filter((item) => item.href !== "/contact")
                .map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative px-2 py-1 text-sm transition-colors duration-300 inline-block
                        ${
                          active
                            ? "text-emerald-600 font-semibold"
                            : "text-slate-700 dark:text-slate-200"
                        }
                        hover:text-emerald-500
                        after:absolute after:left-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-emerald-500
                        after:transition-all after:duration-300
                        ${
                          active
                            ? "after:w-full"
                            : "after:w-0 hover:after:w-full"
                        }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}

              {/* Product Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProductDropdown((prev) => !prev)}
                  className="ml-3 inline-flex text-slate-700 cursor-pointer dark:text-slate-200 items-center px-4 py-2 text-sm  transition"
                >
                  Products <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {/* Desktop Dropdown Menu */}
                <AnimatePresence>
                  {productDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="absolute top-14 right-0 w-72 bg-white dark:bg-slate-900 shadow-xl  dark:border-slate-700/40 z-50 overflow-hidden"
                    >
                      {products.length > 0 ? (
                        <div>
                          {products.map((product) => (
                            <div key={product.id} className="relative group">
                              {/* Product Link */}
                              <Link
                                to={`/products/${product.id}/sub-products`}
                                className=" px-4 py-3 transition-all  text-sm text-slate-600 dark:text-slate-200 hover:scale-105  hover:bg-emerald-100 dark:hover:bg-emerald-600 flex items-center justify-between"
                              >
                                {product.title || product.name}
                                {product.sub_products?.length > 0 && (
                                  <ChevronDown className="w-3 h-3 ml-1 transition-transform group-hover:rotate-180" />
                                )}
                              </Link>

                              {/* Nested Sub-products Dropdown */}
                              {product.sub_products?.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  whileHover={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-400 rounded-lg shadow-lg border border-white/20 dark:border-slate-700/40 z-50"
                                >
                                  {product.sub_products.map((sub) => (
                                    <Link
                                      key={sub.id}
                                      to={`/sub-product/${sub.id}`}
                                      className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-600 transition"
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-3 text-sm text-slate-400">
                          No products
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact CTA */}
              <Link
                to="/contact"
                className={`ml-3 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-md transition
                  ${
                    isActive("/contact")
                      ? "bg-emerald-700 text-white dark:bg-emerald-600"
                      : isTransparentAtTop
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                  }`}
                aria-current={isActive("/contact") ? "page" : undefined}
              >
                <Contact2Icon className="w-4 h-4 mr-1" /> Contact Us
              </Link>
            </nav>

            {/* Mobile Buttons */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="p-2 rounded-md focus:outline-none focus:ring-2 text-slate-700 dark:text-slate-200 focus:ring-emerald-300"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                ref={toggleRef}
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className="p-2 rounded-md focus:outline-none focus:ring-2 text-slate-700 dark:text-slate-200 focus:ring-emerald-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="2"
                    d={
                      open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          ref={menuRef}
          className={`md:hidden transition-[max-height,opacity] duration-300 overflow-hidden ${
            open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-4 my-3 rounded-xl border border-white/20 dark:border-slate-700/40 shadow-lg overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-md">
            <nav className="space-y-1 p-4">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block px-3 py-3 rounded-md transition-colors duration-150 ${
                      active
                        ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-600/10 font-semibold"
                        : "text-slate-800 dark:text-slate-100 hover:bg-white/30 dark:hover:bg-slate-700/40"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Products */}
              <div className="space-y-1">
                <button
                  onClick={() => setProductDropdown((prev) => !prev)}
                  className={`w-full flex items-center justify-between px-4 py-2 font-medium text-sm text-emerald-600`}
                >
                  Product <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                <AnimatePresence>
                  {productDropdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4 mt-1 space-y-1"
                    >
                      {products.length > 0 ? (
                        products.map((product) => (
                          <div key={product.id} className="space-y-1">
                            <Link
                              to={`/products/${product.id}/sub-products`} // ✅ must match your Route
                              className="block px-4 py-2 text-sm text-slate-800 dark:text-slate-200 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-600 transition"
                              onClick={() => setOpen(false)}
                            >
                              {product.title}{" "}
                              {/* use the name field from your DB */}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-slate-400">
                          No products
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
