// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Contact2Icon, ChevronDown, Menu, X } from "lucide-react";
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
  { name: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const [widget, setWidget] = useState(null);
  const [products, setProducts] = useState([]);
  const productDropDownRef = useRef(null);

  // dropdown states
  const [desktopDropdown, setDesktopDropdown] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);

  const [activeProductId, setActiveProductId] = useState(null);
  const [activeMobileProductId, setActiveMobileProductId] = useState(null);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  const productMenuRef = useRef(null);

  /* ---------------- FETCH WIDGET ---------------- */
  useEffect(() => {
    fetchWidgets().then((res) => {
      if (res?.data?.data?.length) setWidget(res.data.data[0]);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        productDropDownRef.current &&
        !productDropDownRef.current.contains(e.target)
      ) {
        setDesktopDropdown(false);
        setMobileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
          }),
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      <div className={headerBg}>
        <div className="max-w-7xl mx-auto px-2 flex justify-between items-center ">
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
          <nav className="hidden md:flex items-center gap-6">
            {navItems
              .filter((i) => i.href !== "/contact")
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative inline-block text-md font-medium text-slate-600
                    bg-gradient-to-r from-red-500 to-red-500
                    bg-[length:0%_100%] bg-no-repeat bg-left bg-clip-text
                    hover:text-transparent transition-[background-size,color] duration-600
                    hover:bg-[length:100%_100%]
                    after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-red-500
                    after:w-0 after:transition-[width] after:duration-600 hover:after:w-full"
                >
                  {item.name}
                </Link>
              ))}

            {/* PRODUCTS DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setDesktopDropdown((v) => !v)}
                className="group relative inline-flex items-center gap-1 text-sm font-medium cursor-pointer"
              >
                <span className="flex items-center gap-1 text-slate-600">
                  Products
                  <ChevronDown className="w-4 h-4 stroke-slate-600" />
                </span>
              </button>

              <AnimatePresence>
                {desktopDropdown && (
                  <motion.div
                    ref={productMenuRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-10 right-0 w-72 bg-white dark:bg-slate-800 shadow-xl p-2 z-50"
                  >
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="relative"
                        ref={productDropDownRef}
                        onMouseEnter={() => setActiveProductId(product.id)}
                        onMouseLeave={() => setActiveProductId(null)}
                      >
                        <div className="flex items-center gap-3 px-4 py-3 text-sm cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-600 transition-colors duration-300 select-none">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.title || product.name}
                              className="w-10 h-10 object-cover rounded"
                              loading="lazy"
                              draggable={false}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-700 flex items-center justify-center rounded text-xs font-bold">
                              {(product.title || product.name)?.charAt(0)}
                            </div>
                          )}
                          <Link
                            to={`/products/${product.id}/sub-products`}
                            className="flex-1"
                          >
                            {product.title || product.name}
                          </Link>

                          {product.sub_products?.length > 0 && (
                            <ChevronDown
                              className="w-3 h-3 ml-2 shrink-0 text-slate-700 dark:text-slate-200"
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        {/* SUBPRODUCTS (Desktop) */}
                        {product.sub_products?.length > 0 &&
                          activeProductId === product.id && (
                            <div
                              className="
                                absolute top-0 right-[17rem]
                                w-80 md:w-96
                                bg-white dark:bg-slate-800
                                shadow-xl z-50
                                h-72 overflow-y-auto
                                rounded-lg
                              "
                            >
                              {product.sub_products.map((sub) => {
                                const image =
                                  sub.image_url ||
                                  sub.feature_image_url ||
                                  (sub.feature_image
                                    ? `${import.meta.env.VITE_API_URL}/storage/${sub.feature_image}`
                                    : null);

                                return (
                                  <Link
                                    key={sub.id}
                                    to={`/sub-products/${sub.id}`}
                                    className="
                                      flex items-center gap-3 px-4 py-2 text-sm
                                      text-slate-700 dark:text-slate-200
                                      hover:bg-emerald-100 dark:hover:bg-emerald-600
                                      transition-colors duration-300
                                    "
                                  >
                                    {image ? (
                                      <img
                                        src={image}
                                        alt={sub.name}
                                        className="w-10 h-10 object-cover rounded"
                                        loading="lazy"
                                        draggable={false}
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-700 flex items-center justify-center rounded text-xs font-bold">
                                        {sub.name?.charAt(0)}
                                      </div>
                                    )}
                                    <span className="truncate">{sub.name}</span>
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
              className="relative overflow-hidden outline border border-white outline-emerald-600 bg-transparent text-slate-600 px-4 py-2 rounded-full flex items-center gap-1 transition-colors duration-600
                before:absolute before:inset-0 before:bg-emerald-600 before:origin-left before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100 before:z-0 hover:text-white"
            >
              <Contact2Icon className="w-6 h-6 relative z-10" />
              <span className="relative z-10 font-semibold">Contact</span>
            </Link>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white dark:bg-slate-900 shadow-inner max-h-[80vh] overflow-y-auto"
            >
              <div className="px-6 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="block text-slate-700 dark:text-slate-200 py-2"
                  >
                    {item.name}
                  </Link>
                ))}

                {/* MOBILE PRODUCTS */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setMobileDropdown((v) => !v)}
                    className="w-full flex items-center justify-between text-slate-700 dark:text-slate-200 py-2"
                  >
                    Products <ChevronDown className="w-4 h-4" />
                  </button>

                  {mobileDropdown && (
                    <div className="mt-2 space-y-1">
                      {products.map((product) => (
                        <div key={product.id} className="space-y-1">
                          <button
                            onClick={() =>
                              setActiveMobileProductId((prev) =>
                                prev === product.id ? null : product.id,
                              )
                            }
                            className="w-full flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200 py-1"
                          >
                            <span>{product.title || product.name}</span>

                            {product.sub_products?.length > 0 && (
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-300 ${
                                  activeMobileProductId === product.id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            )}
                          </button>

                          {activeMobileProductId === product.id &&
                            product.sub_products?.length > 0 && (
                              <div className="pl-4">
                                {product.sub_products.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    to={`/sub-products/${sub.id}`}
                                    onClick={() => setOpen(false)}
                                    className="block text-sm text-slate-500 dark:text-slate-300 py-1"
                                  >
                                    - {sub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CONTACT BUTTON */}
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="block text-slate-700 dark:text-slate-200 py-2"
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
