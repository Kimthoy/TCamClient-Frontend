// src/pages/PartnersPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { fetchPublicPartners, fetchPartnerBanners } from "../api/partners";
import Banner from "../components/Banner";

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
function PartnerHero() {
  return (
    <Banner
      fetchData={fetchPartnerBanners}
      fallbackTitle="Event"
    />
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
      <PartnerHero
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
