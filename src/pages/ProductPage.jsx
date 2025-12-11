import React, { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  Landmark,
  Building2,
  BarChart3,
  Globe,
  Store,
  Cpu,
} from "lucide-react";
import { fetchProductBanners, fetchPublicProducts } from "../api/products";

function analyzeImageBrightness(imgElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;
  ctx.drawImage(imgElement, 0, 0);

  const centerX = Math.floor(canvas.width / 2);
  const centerY = Math.floor(canvas.height / 2);
  const size = 20;

  try {
    const data = ctx.getImageData(
      centerX - size / 2,
      centerY - size / 2,
      size,
      size
    ).data;
    let colorSum = 0;
    const pixelCount = size * size;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      colorSum += luminance;
    }

    const averageLuminance = colorSum / pixelCount;
    return averageLuminance < 128;
  } catch (error) {
    console.warn("Could not analyze image brightness:", error);
    return true;
  }
}

const GLOBAL_STYLES = `
  .hero-parallax { will-change: transform; transition: transform 0.1s linear; }
  .glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  .product-card {
    transition: all 0.3s ease;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
  }
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  .industry-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .industry-card:hover {
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
  .title-shadow {
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  }
  .title-shadow-strong {
    text-shadow: 0 6px 16px rgba(0, 0, 0, 0.9);
  }
  .title-stroke--light {
    color: white;
    -webkit-text-stroke: 1.5px #10b981;
    text-stroke: 1.5px #10b981;
    text-shadow: 0 0 10px rgba(0,0,0,0.3);
  }
  .style-pill {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .style-pill button {
    padding: 0.5rem 1rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 9999px;
    transition: background-color 0.2s;
  }
  .style-pill button:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  .style-pill button.active {
    background: white;
    color: #059669;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const fallbackBanner = {
  title: "Our Products",
  subtitle: "Engineered for modern enterprises",
  image_url:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2400&q=85",
};

function Hero({ banner, titleStyle, onToggleStyle }) {
  const [isDark, setIsDark] = useState(null);
  const imgRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const dark = analyzeImageBrightness(img);
      setIsDark(dark);
    };
    img.onerror = () => setIsDark(false);
    img.src = banner?.image_url || fallbackBanner.image_url;
    imgRef.current = img;
  }, [banner]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || window.pageYOffset);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallax = `translateY(${Math.min(scrollY * 0.06, 60)}px) scale(${
    1 + Math.min(scrollY * 0.0007, 0.02)
  })`;

  const overlayClass = isDark ? "hero-overlay" : "hero-overlay--light";

  const titleColorClass = "hero-text-white";
  const subtitleColorClass = "hero-sub-white";

  const titleClasses = [
    "font-extrabold",
    "leading-tight",
    titleColorClass,
    "text-4xl md:text-6xl lg:text-7xl",
    titleStyle === "stroke" ? "title-stroke--light" : "",
    titleStyle === "shadow" ? "title-shadow" : "",
    titleStyle === "both" ? "title-stroke--light title-shadow-strong" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className="relative h-[72vh] min-h-[420px] flex items-center justify-center overflow-hidden">
      <style>{GLOBAL_STYLES}</style>

      <div
        className="absolute inset-0 hero-parallax"
        style={{ transform: parallax }}
      >
        <img
          src={banner?.image_url || fallbackBanner.image_url}
          alt={banner?.title || ""}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = fallbackBanner.image_url;
          }}
        />
      </div>

      <div className={`absolute inset-0 ${overlayClass}`} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="mb-6">
          <div className="style-pill inline-flex items-center p-1">
            {["none", "stroke", "shadow", "both"].map((s) => (
              <button
                key={s}
                onClick={() => onToggleStyle(s)}
                className={s === titleStyle ? "active" : ""}
                aria-pressed={s === titleStyle}
                title={`Use ${s} title style`}
              >
                {s === "none"
                  ? "None"
                  : s === "stroke"
                  ? "Stroke"
                  : s === "shadow"
                  ? "Shadow"
                  : "Both"}
              </button>
            ))}
          </div>
        </div>

        {banner?.title ? (
          <h1 className={titleClasses}>{banner.title}</h1>
        ) : null}

        {banner?.subtitle ? (
          <p
            className={`mt-4 text-lg md:text-2xl max-w-3xl mx-auto ${subtitleColorClass}`}
          >
            {banner.subtitle}
          </p>
        ) : null}

        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="#products-list"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("products-list")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold shadow-lg transition bg-white text-emerald-700 hover:bg-gray-100`}
          >
            Explore Products
            <ArrowRight className={`text-emerald-700 w-4 h-4`} />
          </a>

          <a
            href="/contact"
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold border border-white/30 text-white transition bg-white/10 hover:bg-white/20`}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </header>
  );
}

function ProductsByIndustry() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const industries = [
    {
      icon: Landmark,
      title: "Banking & Finance",
      gradient: "from-amber-500 to-orange-600",
      products: [
        "Core Banking",
        "Digital Banking",
        "ATM/CDM",
        "Loan Origination",
        "AML System",
      ],
    },
    {
      icon: Building2,
      title: "Government",
      gradient: "from-emerald-600 to-teal-700",
      products: [
        "e-Government",
        "National ID",
        "Land Registry",
        "Tax System",
        "Civil Registry",
      ],
    },
    {
      icon: BarChart3,
      title: "Enterprise",
      gradient: "from-purple-600 to-pink-600",
      products: ["ERP", "CRM", "Business Intelligence", "Supply Chain", "HRIS"],
    },
    {
      icon: Globe,
      title: "Telecom",
      gradient: "from-cyan-500 to-blue-600",
      products: [
        "Billing",
        "OSS/BSS",
        "Customer Portal",
        "5G Core",
        "Network Management",
      ],
    },
    {
      icon: Store,
      title: "Retail & Hospitality",
      gradient: "from-rose-500 to-pink-600",
      products: ["POS", "Hotel PMS", "Loyalty", "Inventory", "Omnichannel"],
    },
    {
      icon: Cpu,
      title: "IT Infrastructure",
      gradient: "from-slate-700 to-gray-900",
      products: [
        "Data Center",
        "Cloud",
        "Cybersecurity",
        "SD-WAN",
        "Backup & DR",
      ],
    },
  ];
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
            Products by Industry
          </h2>

          <p className="mt-4 text-xl text-gray-600">
            Tailored solutions for every sector
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={ind.title}
                className="industry-card bg-white rounded-3xl overflow-hidden shadow-lg"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`h-32 bg-gradient-to-r ${ind.gradient} flex items-center px-8`}
                >
                  <div className="flex items-center gap-5 text-white">
                    <div className="p-4 bg-white/20 backdrop-blur rounded-2xl">
                      <Icon className="w-10 h-10" />
                    </div>

                    <h3 className="text-2xl font-bold">{ind.title}</h3>
                  </div>
                </div>

                <div className="p-8">
                  <ul className="space-y-4">
                    {ind.products.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-4 text-gray-700 font-medium"
                        style={{
                          transform: isHovered
                            ? "translateX(0)"
                            : "translateX(-16px)",
                          opacity: isHovered ? 1 : 0.6,
                          transition: `all 0.5s ease ${i * 80}ms`,
                        }}
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <a
      href={`/products/${product.id}`}
      className="product-card bg-white rounded-xl overflow-hidden shadow-lg group"
    >
      <div className="h-56 bg-gray-100 relative overflow-hidden">
        <img
          src={product.feature_image_url || "/images/placeholder-product.png"}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) =>
            (e.currentTarget.src = "/images/placeholder-product.incompatible")
          }
        />
      </div>

      <div className="p-6 text-center flex flex-col items-center flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500 mb-6 line-clamp-2">
          {product.short_description ||
            "Advanced enterprise platform with industry-leading performance."}
        </p>
        <div className="mt-auto">
          <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-emerald-600 border border-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white transition-colors duration-300">
            See More <ArrowRight className="w-4 h-4 ml-2" />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function ProductPage() {
  const [banners, setBanners] = useState([]);
  const [productsPage, setProductsPage] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [titleStyle, setTitleStyle] = useState("shadow");

  useEffect(() => {
    document.title = "Products • TCAM Solutions";
  }, []);

  useEffect(() => {
    fetchProductBanners()
      .then((arr) => setBanners(Array.isArray(arr) ? arr : []))
      .catch(() => setBanners([]));
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoadingProducts(true);
    fetchPublicProducts({ per_page: 9, page: pageNum })
      .then((data) => mounted && setProductsPage(data))
      .catch(() => mounted && setProductsPage(null))
      .finally(() => mounted && setLoadingProducts(false));
    return () => {
      mounted = false;
    };
  }, [pageNum]);

  const hero = banners.length > 0 ? banners[0] : fallbackBanner;

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{GLOBAL_STYLES}</style>
      <Hero
        banner={hero}
        titleStyle={titleStyle}
        onToggleStyle={setTitleStyle}
      />
      <main id="products-list" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900">
            Our Products
          </h2>

          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Enterprise-grade solutions trusted by industry leaders worldwide
          </p>
        </div>

        {loadingProducts ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="bg-gray-200 h-56 rounded-lg mb-4" />

                <div className="h-6 bg-gray-200 rounded w-3/5 mb-2 mx-auto" />

                <div className="h-3 bg-gray-200 rounded w-full mb-6 mx-auto" />
                <div className="h-8 bg-gray-200 rounded-full w-24 mx-auto" />
              </div>
            ))}
          </div>
        ) : productsPage?.data?.length ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {productsPage.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-2xl text-gray-500 py-20">
            No products available at the moment.
          </p>
        )}

        {productsPage?.last_page > 1 && (
          <div className="mt-20 flex justify-center gap-6">
            <button
              onClick={() => setPageNum((p) => Math.max(1, p - 1))}
              disabled={pageNum === 1}
              className="px-8 py-4 bg-white rounded-2xl border border-gray-200 disabled:opacity-50 font-medium hover:bg-gray-50 transition"
            >
              ← Previous
            </button>

            <span className="px-10 py-4 text-xl font-bold">
              Page {productsPage.current_page} /{productsPage.last_page}
            </span>

            <button
              onClick={() =>
                setPageNum((p) => Math.min(productsPage.last_page, p + 1))
              }
              disabled={pageNum === productsPage.last_page}
              className="px-8 py-4 bg-white rounded-2xl border border-gray-200 disabled:opacity-50 font-medium hover:bg-gray-50 transition"
            >
              Next →
            </button>
          </div>
        )}

        <ProductsByIndustry />
      </main>
    </div>
  );
}
