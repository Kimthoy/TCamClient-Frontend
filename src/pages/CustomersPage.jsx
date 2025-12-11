// src/pages/CustomersPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { ArrowRight, Trophy, Sparkles, Zap } from "lucide-react";

import { fetchCustomerBanners, fetchPublicCustomers } from "../api/customer";

const GLOBAL_STYLES = `
  .hero-parallax { will-change: transform; transition: transform 0.1s linear; }
  .glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  .customer-card {
    transition: all 0.3s ease;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
  }
  .customer-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  .highlight-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .highlight-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }
  .hero-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3) 50%, transparent);
  }
  .hero-overlay--light {
    background: linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.2) 50%, transparent);
  }
  .hero-text-white {
    color: white;
  }
  .hero-sub-white {
    color: rgba(255, 255, 255, 0.9);
  }
  .title-shadow-strong {
    text-shadow: 0 6px 16px rgba(0, 0, 0, 0.9);
  }
`;

/** Best-effort brightness analyzer (non-blocking) */
function analyzeImageBrightness(imgElement) {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = Math.min(80, imgElement.naturalWidth || 80));
    const h = (canvas.height = Math.min(80, imgElement.naturalHeight || 80));
    ctx.drawImage(imgElement, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    }
    const avg = total / (data.length / 4);
    return avg < 150;
  } catch {
    return true;
  }
}

const fallbackBanner = {
  title: "Trusted by Industry Leaders",
  subtitle: "See how our solutions power success worldwide.",
  image_url:
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=2400&q=85",
};

function Hero({ banner }) {
  const [isDark, setIsDark] = useState(true);
  const imgRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!banner?.image_url) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setIsDark(analyzeImageBrightness(img));
    };
    img.onerror = () => setIsDark(true);
    img.src = banner.image_url;
    imgRef.current = img;
    // no cleanup needed for Image
  }, [banner]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || window.pageYOffset);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallax = `translateY(${Math.min(scrollY * 0.06, 60)}px) scale(${
    1 + Math.min(scrollY * 0.0007, 0.02)
  })`;
  const overlayClass =
    isDark === false ? "hero-overlay--light" : "hero-overlay";
  const titleClasses = [
    "font-extrabold",
    "leading-tight",
    "hero-text-white",
    "text-4xl md:text-6xl lg:text-7xl",
    "title-shadow-strong",
  ].join(" ");

  return (
    <header className="relative h-[72vh] min-h-[420px] flex items-center justify-center overflow-hidden">
      <style>{GLOBAL_STYLES}</style>

      <div
        className="absolute inset-0 hero-parallax"
        style={{ transform: parallax }}
      >
        <img
          src={banner?.image_url || fallbackBanner.image_url}
          alt={banner?.title || "Hero banner"}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = fallbackBanner.image_url;
          }}
        />
      </div>

      <div className={`absolute inset-0 ${overlayClass}`} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {banner?.title && <h1 className={titleClasses}>{banner.title}</h1>}
        {banner?.subtitle && (
          <p className="mt-4 text-lg md:text-2xl max-w-3xl mx-auto hero-sub-white">
            {banner.subtitle}
          </p>
        )}

        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="#customers-list"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("customers-list")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold shadow-lg transition bg-white text-emerald-700 hover:bg-gray-100"
          >
            View Success Stories
            <ArrowRight className="text-emerald-700 w-4 h-4" />
          </a>

          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold border border-white/30 text-white transition bg-white/10 hover:bg-white/20"
          >
            Request a Consultation
          </a>
        </div>
      </div>
    </header>
  );
}

function CustomerHighlights() {
  const highlights = [
    {
      icon: Trophy,
      title: "Industry Recognition",
      description: "Our solutions help clients achieve top industry awards.",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: Sparkles,
      title: "Digital Transformation",
      description:
        "Driving successful large-scale digital modernization projects.",
      gradient: "from-emerald-600 to-teal-700",
    },
    {
      icon: Zap,
      title: "Performance Gains",
      description:
        "Proven record of delivering significant operational efficiency.",
      gradient: "from-purple-600 to-pink-600",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
            Why Partner With Us?
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Commitment to client success and measurable results.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="highlight-card bg-white rounded-3xl overflow-hidden shadow-xl text-center p-8"
              >
                <div
                  className={`p-6 w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${item.gradient} text-white mb-6 flex items-center justify-center`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CustomerCard({ customer }) {
  // support both { title } or { name }
  const title =
    customer.title || customer.name || customer.company || "Customer";
  const shortDesc =
    customer.short_description ||
    customer.summary ||
    customer.description ||
    "";

  // safe image fallback
  const placeholder = "/images/placeholder-logo.png"; // keep your own asset here
  const brokenPlaceholder = "/images/placeholder-logo.incompatible";

  return (
    <a
      href={`/customers/${customer.id}`}
      className="customer-card bg-white rounded-xl overflow-hidden shadow-lg group"
      aria-labelledby={`customer-${customer.id}-title`}
    >
      <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center p-8">
        <img
          src={customer.image_url || customer.logo_url || placeholder}
          alt={title}
          className="max-w-full max-h-full object-contain transition-transform duration-500"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            // fallback chain
            e.currentTarget.onerror = null;
            e.currentTarget.src = brokenPlaceholder;
          }}
        />
      </div>

      <div className="p-6 text-center flex flex-col items-center flex-grow">
        <h3
          id={`customer-${customer.id}-title`}
          className="text-xl font-bold text-gray-900 mb-2"
        >
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-6 line-clamp-2">
          {shortDesc ||
            "A successful partnership driving innovation and growth."}
        </p>

        <div className="mt-auto">
          <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-emerald-600 border border-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white transition-colors duration-300">
            View Case Study <ArrowRight className="w-4 h-4 ml-2" />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function CustomersPage() {
  const [banners, setBanners] = useState([]);
  const [customersPage, setCustomersPage] = useState(null);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [customersError, setCustomersError] = useState(null);

  useEffect(() => {
    document.title = "Customers & Success Stories • TCAM Solutions";
  }, []);

  // load banners
  useEffect(() => {
    let mounted = true;
    fetchCustomerBanners()
      .then((arr) => {
        if (!mounted) return;
        setBanners(Array.isArray(arr) ? arr : []);
      })
      .catch(() => {
        if (!mounted) return;
        setBanners([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // load customers page
  useEffect(() => {
    let mounted = true;
    setLoadingCustomers(true);
    setCustomersError(null);

    fetchPublicCustomers({ per_page: 9, page: pageNum })
      .then((data) => {
        if (!mounted) return;
        // If API returns wrapper { data: [...] }, keep it; else coerce
        if (Array.isArray(data?.data)) {
          // Normalize items to expected fields
          const normalized = data.data.map((c) => ({
            ...c,
            title: c.title || c.name || c.company,
            short_description:
              c.short_description || c.summary || c.description || "",
            image_url: c.image_url || c.logo_url || c.image || null,
            id: c.id,
          }));
          setCustomersPage({
            ...data,
            data: normalized,
            current_page: data.current_page || pageNum,
            last_page: data.last_page || 1,
          });
        } else if (Array.isArray(data)) {
          const normalized = data.map((c) => ({
            ...c,
            title: c.title || c.name || c.company,
            short_description:
              c.short_description || c.summary || c.description || "",
            image_url: c.image_url || c.logo_url || c.image || null,
            id: c.id,
          }));
          setCustomersPage({
            data: normalized,
            current_page: pageNum,
            last_page: 1,
          });
        } else {
          setCustomersPage(data);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("load customers error:", err);
        setCustomersPage(null);
        setCustomersError(err?.message || "Failed to load customers");
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingCustomers(false);
      });

    return () => {
      mounted = false;
    };
  }, [pageNum]);

  const hero = banners.length > 0 ? banners[0] : fallbackBanner;

  const handleRetry = () => {
    setPageNum(1);
    setCustomersError(null);
    setLoadingCustomers(true);
    // re-trigger effect by toggling pageNum (or call fetch directly)
    // simple direct reload:
    fetchPublicCustomers({ per_page: 9, page: 1 })
      .then((data) => {
        if (Array.isArray(data?.data)) {
          const normalized = data.data.map((c) => ({
            ...c,
            title: c.title || c.name || c.company,
            short_description:
              c.short_description || c.summary || c.description || "",
            image_url: c.image_url || c.logo_url || c.image || null,
            id: c.id,
          }));
          setCustomersPage({
            ...data,
            data: normalized,
            current_page: data.current_page || 1,
            last_page: data.last_page || 1,
          });
        } else if (Array.isArray(data)) {
          const normalized = data.map((c) => ({
            ...c,
            title: c.title || c.name || c.company,
            short_description:
              c.short_description || c.summary || c.description || "",
            image_url: c.image_url || c.logo_url || c.image || null,
            id: c.id,
          }));
          setCustomersPage({ data: normalized, current_page: 1, last_page: 1 });
        } else {
          setCustomersPage(data);
        }
      })
      .catch((err) => {
        console.error("retry customers error:", err);
        setCustomersPage(null);
        setCustomersError(err?.message || "Failed to load customers");
      })
      .finally(() => setLoadingCustomers(false));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero banner={hero} />

      <main id="customers-list" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900">
            Our Valued Clients
          </h2>

          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            We are proud to partner with leading organizations across various
            sectors to deliver success.
          </p>
        </div>

        {/* Content */}
        {loadingCustomers ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="bg-gray-200 h-48 rounded-lg mb-8" />
                <div className="h-6 bg-gray-200 rounded w-4/5 mb-2 mx-auto" />
                <div className="h-3 bg-gray-200 rounded w-full mb-6 mx-auto" />
                <div className="h-8 bg-gray-200 rounded-full w-32 mx-auto" />
              </div>
            ))}
          </div>
        ) : customersError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Error loading customers: {customersError}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleRetry}
                className="px-4 py-2 rounded bg-emerald-600 text-white"
              >
                Retry
              </button>
            </div>
          </div>
        ) : customersPage?.data?.length ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {customersPage.data.map((c) => (
              <CustomerCard key={c.id ?? c.name} customer={c} />
            ))}
          </div>
        ) : (
          <p className="text-center text-2xl text-gray-500 py-20">
            No customer stories available at the moment.
          </p>
        )}

        {/* Pagination */}
        {customersPage?.last_page > 1 && (
          <div className="mt-20 flex justify-center gap-6">
            <button
              onClick={() => setPageNum((p) => Math.max(1, p - 1))}
              disabled={pageNum === 1}
              aria-disabled={pageNum === 1}
              className="px-8 py-4 bg-white rounded-2xl border border-gray-200 disabled:opacity-50 font-medium hover:bg-gray-50 transition"
            >
              ← Previous
            </button>

            <span className="px-10 py-4 text-xl font-bold">
              Page {customersPage?.current_page ?? pageNum} /{" "}
              {customersPage?.last_page ?? 1}
            </span>

            <button
              onClick={() =>
                setPageNum((p) => Math.min(customersPage.last_page || 1, p + 1))
              }
              disabled={pageNum === (customersPage?.last_page || 1)}
              aria-disabled={pageNum === (customersPage?.last_page || 1)}
              className="px-8 py-4 bg-white rounded-2xl border border-gray-200 disabled:opacity-50 font-medium hover:bg-gray-50 transition"
            >
              Next →
            </button>
          </div>
        )}

        <CustomerHighlights />
      </main>
    </div>
  );
}
