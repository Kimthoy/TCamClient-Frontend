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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const [widget, setWidget] = useState(null);
  const [products, setProducts] = useState([]);
  const [productDropdown, setProductDropdown] = useState(false);
  const [activeProductId, setActiveProductId] = useState(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const productMenuRef = useRef(null);

  /* ---------------- FETCH WIDGET ---------------- */
  useEffect(() => {
    fetchWidgets().then((res) => {
      if (res?.data?.data?.length) setWidget(res.data.data[0]);
    });
  }, []);

  /* ---------------- FETCH PRODUCTS + SUB PRODUCTS ---------------- */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchPublicProducts();

        const productsData = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];

        const productsWithSubs = await Promise.all(
          productsData.map(async (p) => {
            try {
              const subRes = await fetchSubProductsByProduct(p.id);

              return {
                ...p,
                sub_products: Array.isArray(subRes.data?.data)
                  ? subRes.data.data
                  : Array.isArray(subRes.data)
                  ? subRes.data
                  : [],
              };
            } catch {
              return { ...p, sub_products: [] };
            }
          })
        );

        setProducts(productsWithSubs);
      } catch (err) {
        console.error("Product fetch error:", err);
      }
    };

    loadProducts();
  }, []);

  /* ---------------- SCROLL ---------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- THEME ---------------- */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isTransparentAtTop = location.pathname === "/" && !scrolled;
  const headerBg = isTransparentAtTop
    ? "bg-transparent"
    : "bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg shadow-md";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        productMenuRef.current &&
        !productMenuRef.current.contains(e.target)
      ) {
        setActiveProductId(null);
        setProductDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 ">
      <div className={headerBg}>
        <div className="max-w-7xl mx-auto px-6  flex justify-between items-center">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            {widget?.app_logo_url ? (
              <img
                src={widget.app_logo_url}
                alt="logo"
                className="h-16 w-16 rounded-full"
              />
            ) : (
              <div className="h-12 w-12 bg-emerald-600 rounded-full text-white flex items-center justify-center font-bold">
                TC
              </div>
            )}
            <div>
              <div className="font-bold text-lg uppercase">
                {widget?.app_name}
              </div>
              <div className="text-xs text-slate-500">
                {widget?.app_sort_desc}
              </div>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 ">
            {navItems
              .filter((i) => i.href !== "/contact")
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="
                    relative inline-block
                    text-md font-medium
                    text-slate-600

                    bg-gradient-to-r from-red-500 to-red-500
                    bg-[length:0%_100%]
                    bg-no-repeat bg-left
                    bg-clip-text

                    hover:text-transparent
                    transition-[background-size,color]
                    duration-600
                    hover:bg-[length:100%_100%]

                    after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-red-500
                    after:w-0 after:transition-[width] after:duration-600
                    hover:after:w-full
                  "
                >
                  {item.name}
                </Link>
              ))}

            {/* PRODUCTS DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setProductDropdown((v) => !v)}
                className="group relative inline-flex items-center gap-1 text-sm font-medium cursor-pointer"
              >
                {/* Base (slate) */}
                <span className="flex items-center gap-1 text-slate-600">
                  Products
                  <ChevronDown className="w-4 h-4 stroke-slate-600" />
                </span>

                {/* Overlay (red, initially zero width) */}
                <span
                  className="
                    absolute top-0 left-0 flex items-center gap-1
                    text-red-500 overflow-hidden
                    whitespace-nowrap
                    w-0
                    group-hover:w-full
                    transition-[width] duration-600 ease-out
                    pointer-events-none
                  "
                >
                  Products
                  <ChevronDown className="w-4 h-4 stroke-red-500" />
                </span>
              </button>

              <AnimatePresence>
                {productDropdown && (
                  <motion.div
                    ref={productMenuRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-10 right-0 w-72 bg-white dark:bg-slate-800 shadow-xl  p-2 z-50"
                  >
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="relative"
                        onMouseEnter={() => setActiveProductId(product.id)}
                        onMouseLeave={() => setActiveProductId(null)}
                      >
                        {/* PRODUCT ROW */}
                        <div
                          className="
                                flex items-center gap-3 px-4 py-3
                                text-sm cursor-pointer
                                text-slate-700 dark:text-slate-200
                                hover:bg-emerald-100 dark:hover:bg-emerald-600
                                transition-colors duration-300
                                select-none
                              "
                        >
                          {/* PRODUCT IMAGE */}
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.title || product.name}
                              className="w-10 h-10 object-cover shrink-0"
                              loading="lazy"
                              draggable={false}
                            />
                          ) : (
                            <div
                              className="
                                w- h-10  bg-emerald-100 dark:bg-emerald-700
                                flex items-center justify-center text-xs font-bold
                                select-none
                              "
                              aria-label={product.title || product.name}
                              role="img"
                            >
                              {(product.title || product.name)?.charAt(0)}
                            </div>
                          )}

                          {/* PRODUCT TITLE LINK */}
                          <Link
                            to={`/products/${product.id}/sub-products`}
                            className="flex-1 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 "
                          >
                            {product.title || product.name}
                          </Link>

                          {/* ARROW (Only if sub-products exist) */}
                          {product.sub_products?.length > 0 && (
                            <ChevronDown
                              className="w-3 h-3 ml-2 shrink-0 text-slate-700 dark:text-slate-200"
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        {/* SUB PRODUCTS DROPDOWN */}
                        {product.sub_products?.length > 0 &&
                          activeProductId === product.id && (
                            <div
                              className="
                                    absolute top-0 right-[17rem] w-80
                                    bg-white dark:bg-slate-800
                                    shadow-xl dark:border-slate-700
                                   
                                    z-50

                                    max-h-[calc(100vh-140px)]
                                    overflow-y-auto
                                    overscroll-contain
                                    scrollbar-thin
                                    scrollbar-thumb-emerald-500/60
                                    scrollbar-track-transparent     
                                  "
                              role="menu"
                              aria-label={`Sub-products of ${
                                product.title || product.name
                              }`}
                            >
                              {product.sub_products.map((sub) => {
                                // Determine sub product image URL
                                const image =
                                  sub.image_url ||
                                  sub.feature_image_url ||
                                  (sub.feature_image
                                    ? `${
                                        import.meta.env.VITE_API_URL
                                      }/storage/${sub.feature_image}`
                                    : null);

                                return (
                                  <Link
                                    key={sub.id}
                                    to={`/sub-products/${sub.id}`}
                                    className="
                                  relative overflow-hidden group
                                  flex items-center gap-3 px-4 py-3
                                  text-sm text-slate-700 dark:text-slate-200
                                  transition-colors duration-300
                                  focus:outline-none focus:ring-2 focus:ring-emerald-400 
                                "
                                    role="menuitem"
                                    tabIndex={0}
                                  >
                                    {/* Background sliding on hover */}
                                    <span
                                      className="
                                    absolute left-0 top-0 h-full w-0 bg-emerald-100 dark:bg-emerald-600
                                    transition-all duration-500
                                    group-hover:w-full
                                    z-0
                                   
                                  "
                                      aria-hidden="true"
                                    />

                                    {/* IMAGE OR FALLBACK LETTER */}
                                    {image ? (
                                      <img
                                        src={image}
                                        alt={sub.name}
                                        className="w-10 h-10  object-cover shrink-0 relative z-10"
                                        loading="lazy"
                                        draggable={false}
                                      />
                                    ) : (
                                      <div
                                        className="
                                          w-10 h-10  bg-emerald-100 dark:bg-emerald-700
                                          flex items-center justify-center text-xs font-bold
                                          relative z-10
                                          select-none
                                        "
                                        aria-label={sub.name}
                                        role="img"
                                      >
                                        {sub.name?.charAt(0)}
                                      </div>
                                    )}

                                    {/* NAME */}
                                    <span className="relative z-10">
                                      {sub.name}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CONTACT */}
            <Link
              to="/contact"
              className="
              relative overflow-hidden outline border border-white outline-emerald-600
              bg-transparent text-slate-600
              px-4 py-2 rounded-full
              flex items-center gap-1
              transition-colors duration-600

              before:absolute before:inset-0
              before:bg-emerald-600
              before:origin-left before:scale-x-0
              before:transition-transform before:duration-300
              hover:before:scale-x-100
              before:z-0

              hover:text-white
            "
            >
              <Contact2Icon className="w-6 h-6 relative z-10" />
              <span className="relative z-10 font-semibold">Contact</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
