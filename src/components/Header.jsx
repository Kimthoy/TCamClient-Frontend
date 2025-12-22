import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Contact, Contact2Icon, Moon, Sun } from "lucide-react"; // Importing icons for clarity
import { fetchWidgets } from "../api/widget";
const navItems = [
  { name: "Home", href: "/" },
  { name: "Service", href: "/services" },
  { name: "About Us", href: "/about" },
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

  useEffect(() => {
    const loadWidget = async () => {
      try {
        const res = await fetchWidgets();
        if (res.data?.data?.length > 0) {
          setWidget(res.data.data[0]); // assuming single widget
        }
      } catch (error) {
        console.error("Failed to fetch footer widget:", error);
      }
    };
    loadWidget();
  }, []);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  });

  // --- Theme Toggle Logic ---
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);
  // --- End Theme Toggle Logic ---

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- Click Outside/Escape Logic ---
  useEffect(() => {
    function handleClickOutside(e) {
      if (toggleRef.current && toggleRef.current.contains(e.target)) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKey);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);
  // --- End Click Outside/Escape Logic ---

  const isTransparentAtTop = location.pathname === "/" && !scrolled;

  const headerBg = isTransparentAtTop
    ? "bg-transparent shadow-none"
    : "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-md";

  // Active logic
  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="h-1 w-full bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400" />

      <div className={`transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                {widget?.app_logo_url ? (
                  <img
                    src={widget.app_logo_url}
                    alt="Current Logo"
                    className="h-18 rounded-full"
                    style={{
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)", // lighter shadow
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-linear-to-br from-teal-600 to-emerald-500 text-slate-700 flex items-center justify-center font-bold text-sm">
                    TC
                  </div>
                )}

                <div>
                  <span className="text-xl font-extrabold gradient-text">
                    {widget?.app_name || "TCAM Solution"} <br />
                  </span>

                  {widget?.app_sort_desc}
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                // Skip the separate Contact button here as it's added below
                if (item.href === "/contact") return null;

                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`
                      relative px-2 py-1 text-sm transition-colors duration-200 inline-block
                      ${
                        isTransparentAtTop
                          ? "text-slate-600"
                          : "text-slate-700 dark:text-slate-200"
                      }
                      hover:text-emerald-600
                      
                      /* Custom underbar for active/hover */
                      after:absolute after:left-0 after:bottom-0 after:h-0.5
                      after:bg-emerald-500 after:rounded-full after:transition-all after:duration-300
                      
                      /* Hover effect: width expands to full */
                      after:w-0 hover:after:w-full

                      ${
                        active
                          ? "after:w-full text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "font-medium"
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Contact Button (CTA style) */}
              <Link
                to="/contact" // Path must match the route in App.jsx
                className={`ml-3 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm transition
                  ${
                    isActive("/contact") // Use isActive for correct styling
                      ? "bg-emerald-700 text-white dark:bg-emerald-600"
                      : isTransparentAtTop
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                  }
                `}
                aria-current={isActive("/contact") ? "page" : undefined}
              >
                <Contact2Icon /> Contact Us
              </Link>
            </nav>

            {/* Mobile Buttons */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Theme Toggle */}
              <button
                onClick={() =>
                  setTheme((t) => (t === "dark" ? "light" : "dark"))
                }
                aria-label="Toggle theme"
                className={`mr-1 p-2 rounded-md focus:outline-none focus:ring-2 ${
                  isTransparentAtTop
                    ? "text-slate-700 focus:ring-white/60"
                    : "text-slate-700 dark:text-slate-200 focus:ring-emerald-300"
                }`}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                ref={toggleRef}
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className={`p-2 rounded-md focus:outline-none focus:ring-2 ${
                  isTransparentAtTop
                    ? "text-slate-700 focus:ring-white"
                    : "text-slate-700 dark:text-slate-200 focus:ring-emerald-300"
                }`}
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
            open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0" // Adjusted max-height
          }`}
        >
          <div className="mx-4 my-3 rounded-xl border border-white/20 dark:border-slate-700/40 shadow-xl overflow-hidden">
            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`
                        block px-3 py-3 rounded-md transition-colors duration-150
                        ${
                          active
                            ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-600/10 font-semibold"
                            : "text-slate-800 dark:text-slate-100 hover:bg-white/30 dark:hover:bg-slate-700/40"
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Original Mobile Contact Button (Now redundant but kept for style) */}
              {/* <div className="mt-3 px-3">
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="block text-center px-4 py-2 rounded-md bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                  aria-current={
                    location.pathname === "/contact" ? "page" : undefined
                  }
                >
                  Contact
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
