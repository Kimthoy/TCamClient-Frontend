// src/pages/PartnersPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { fetchPublicPartners, fetchPartnerBanners } from "../api/partners";

/* small local styles used for hero and card hover */
const GLOBAL_STYLES = `
  .hero-parallax { will-change: transform; transition: transform 0.1s linear; }
  .hero-overlay { background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3) 50%, transparent); }
  .partner-card { transition: transform 0.28s ease, box-shadow 0.28s ease; }
  .partner-card:hover { transform: translateY(-6px); box-shadow: 0 14px 30px -10px rgba(0,0,0,0.2); }
  .logo-hover { transition: filter 0.28s ease; }
  .partner-card:hover .logo-hover { filter: brightness(1.06); }
`;

/* ----------------- Hero ----------------- */
function Hero({ banner, onViewPartners }) {
  const [isDark, setIsDark] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!banner?.image_url) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // quick luminance calc (best-effort)
      try {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        const w = (c.width = Math.min(80, img.naturalWidth || 80));
        const h = (c.height = Math.min(80, img.naturalHeight || 80));
        ctx.drawImage(img, 0, 0, w, h);
        const d = ctx.getImageData(0, 0, w, h).data;
        let total = 0;
        for (let i = 0; i < d.length; i += 4) {
          total += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
        }
        const avg = total / (d.length / 4);
        setIsDark(avg < 150);
      } catch {
        setIsDark(true);
      }
    };
    img.onerror = () => setIsDark(true);
    img.src = banner.image_url;
    imgRef.current = img;
  }, [banner]);

  const overlayClass = isDark ? "hero-overlay" : "hero-overlay";

  return (
    <header className="relative h-[60vh] min-h-[360px] flex items-center justify-center overflow-hidden">
      <style>{GLOBAL_STYLES}</style>

      <div className="absolute inset-0 hero-parallax">
        <img
          src={banner?.image_url}
          alt={banner?.title || "Partners banner"}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=2400&q=85&fit=crop";
          }}
        />
      </div>

      <div className={`absolute inset-0 ${overlayClass}`} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
        {banner?.title && (
          <h1 className="font-extrabold text-3xl md:text-5xl lg:text-6xl leading-tight">
            {banner.title}
          </h1>
        )}
        {banner?.subtitle && (
          <p className="mt-4 text-lg md:text-2xl max-w-3xl mx-auto">
            {banner.subtitle}
          </p>
        )}

        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <button
            onClick={onViewPartners}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold shadow-lg transition bg-white text-emerald-700 hover:bg-gray-100"
          >
            View All Partners <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold border border-white/30 text-white transition bg-white/10 backdrop-blur hover:bg-white/20"
          >
            Become a Partner
          </a>
        </div>
      </div>
    </header>
  );
}

/* ----------------- Skeletons ----------------- */
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 animate-pulse">
      <div className="w-16 h-16 bg-gray-200 rounded mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

/* ----------------- PartnerCard ----------------- */
function PartnerCard({ p }) {
  return (
    <article className="partner-card bg-white rounded-2xl p-4 flex flex-col justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={p.logo_url || p.image || "https://via.placeholder.com/150"}
            alt={`${p.name} logo`}
            className="w-full h-full object-contain logo-hover"
            loading="lazy"
            decoding="async"
            onError={(e) =>
              (e.currentTarget.src = "https://via.placeholder.com/150")
            }
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold truncate">{p.name}</h3>
          {p.category_name && (
            <p className="text-sm text-gray-500 truncate">{p.category_name}</p>
          )}
        </div>
      </div>

      {p.short_description && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-3">
          {p.short_description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <a
          href={p.website || p.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-emerald-600 inline-flex items-center gap-2"
        >
          Visit site <ExternalLink className="w-4 h-4" />
        </a>
        <span className="text-xs text-gray-400">{p.type || ""}</span>
      </div>
    </article>
  );
}

/* ----------------- Page ----------------- */
export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [errorPartners, setErrorPartners] = useState(null);
  const [errorBanner, setErrorBanner] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // Fetch everything
  const loadAll = async () => {
    setLoadingPartners(true);
    setLoadingBanner(true);
    setErrorPartners(null);
    setErrorBanner(null);

    try {
      const [pResp, bResp] = await Promise.allSettled([
        fetchPublicPartners(),
        fetchPartnerBanners(),
      ]);

      if (pResp.status === "fulfilled") {
        setPartners(pResp.value || []);
      } else {
        setErrorPartners(pResp.reason?.message || "Failed to load partners");
        setPartners([]);
      }

      if (bResp.status === "fulfilled") {
        const banners = bResp.value || [];
        setBanner(banners.length ? banners[0] : null);
      } else {
        setErrorBanner(bResp.reason?.message || "Failed to load banners");
        setBanner(null);
      }
    } catch (err) {
      setErrorPartners(err?.message || "Unknown error");
      setErrorBanner(err?.message || "Unknown error");
      setPartners([]);
      setBanner(null);
    } finally {
      setLoadingPartners(false);
      setLoadingBanner(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derive categories from partners
  const categories = useMemo(() => {
    const map = new Map();
    partners.forEach((p) => {
      const id = p.category_id ?? "uncategorized";
      const name =
        p.category_name ??
        (p.category_id ? `Category ${p.category_id}` : "Uncategorized");
      map.set(String(id), { id: String(id), name });
    });
    const arr = [
      { id: "all", name: "All Partners" },
      ...Array.from(map.values()),
    ];
    return arr;
  }, [partners]);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return partners;
    return partners.filter(
      (p) => String(p.category_id) === String(activeCategory)
    );
  }, [partners, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <Hero
        banner={
          banner ?? {
            title: "Our Partners",
            subtitle: "Trusted technology partners.",
          }
        }
        onViewPartners={() => {
          document
            .getElementById("partners-list")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <section className="mb-12 text-center">
          <h2
            id="partners-list"
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
          >
            Our Technology Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We partner with the best to deliver world-class solutions.
          </p>
        </section>

        {/* Categories */}
        <div
          className="flex justify-center flex-wrap gap-3 mb-12"
          role="tablist"
          aria-label="Partner categories"
        >
          {loadingPartners
            ? // skeleton categories
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
                />
              ))
            : categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  aria-pressed={String(activeCategory) === String(cat.id)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-full transition ${
                    String(activeCategory) === String(cat.id)
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
        </div>

        {/* Content */}
        {loadingPartners ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : errorPartners ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Error loading partners: {errorPartners}
            </p>
            <button
              onClick={loadAll}
              className="px-4 py-2 rounded bg-emerald-600 text-white"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No partners found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((p) => (
              <PartnerCard key={p.id ?? p.name} p={p} />
            ))}
          </div>
        )}

        {/* Optional banner error message */}
        {errorBanner && (
          <div className="mt-12 text-center text-sm text-red-500">
            Banner load failed: {errorBanner}
          </div>
        )}
      </main>
    </div>
  );
}
