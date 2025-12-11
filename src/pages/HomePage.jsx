// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronRight, Settings } from "lucide-react";
import {
  fetchBanners,
  fetchAboutPost,
  fetchServices,
  fetchPartners,
  fetchCustomers,
} from "../api/home";

/* ===========================
   GLOBAL STYLES (Injected once)
   =========================== */
const GLOBAL_STYLES = `
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes marquee-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.marquee-slow { display:flex; gap:2rem; will-change: transform; animation: marquee-slow 35s linear infinite; width: max-content; }
.marquee-slow:hover, .animation-paused { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .marquee-slow { animation: none !important; } }

@keyframes pulse { 0% { opacity: 1 } 50% { opacity: 0.6 } 100% { opacity: 1 } }
.animate-pulse { animation: pulse 1.8s ease-in-out infinite; }

@keyframes fadeInUp { from { opacity: 0; transform: translate3d(0, 40px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes scrollHint { 0%,100%{ transform: translateY(0); opacity: .7 } 50%{ transform: translateY(12px); opacity: .3 } }
.animate-fadeInUp { animation: fadeInUp 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }
.animate-scroll { animation: scrollHint 2s infinite; }

.service-card { transition: transform 350ms cubic-bezier(0.16,1,0.3,1), box-shadow 350ms; will-change: transform; backface-visibility: hidden; }
.service-card:hover { transform: translateY(-10px) scale(1.01); z-index: 10; }
.service-card .media { transition: transform 550ms cubic-bezier(0.16,1,0.3,1); }
.service-card:hover .media { transform: scale(1.05); }

.customer-card { position: relative; overflow: visible; transition: all 350ms cubic-bezier(0.16,1,0.3,1); will-change: transform; }
.customer-card-inner { position: relative; height: 100%; width: 100%; border-radius: 1rem; overflow: hidden; background: white; transition: box-shadow 250ms, transform 250ms; }
.customer-card:hover .customer-card-inner { transform: translateY(-8px); box-shadow: 0 18px 40px rgba(2,6,23,0.12); z-index: 20; }

.customer-overlay {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 10px 14px; transform: translateY(100%); opacity: 0;
  transition: transform 300ms cubic-bezier(0.16,1,0.3,1), opacity 200ms;
  background: linear-gradient(0deg, rgba(2,6,23,0.85), rgba(2,6,23,0.4));
  color: white; display:flex; justify-content:space-between; align-items:center; gap:12px;
  backdrop-filter: blur(6px);
}
.customer-card.hovered .customer-overlay, .customer-card:focus-within .customer-overlay {
  transform: translateY(0%); opacity: 1;
}
.customer-card .logo-wrap { display:flex; align-items:center; justify-content:center; height:100%; padding:12px; }
.shadow-2xl { box-shadow: 0 20px 50px rgba(2, 6, 23, 0.25); }
`;

/* ===========================
   Fallback Banners
   =========================== */
const fallbackBanners = [
  {
    id: "fb-1",
    title: "Welcome to TCAM Solution",
    subtitle:
      "Your trusted partner in digital innovation and enterprise transformation.",
    image_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
  },
  {
    id: "fb-2",
    title: "Innovate Faster, Scale Smarter",
    subtitle:
      "Cloud-native solutions that drive efficiency, security, and growth.",
    image_url:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80",
  },
];

/* ===========================
   CenterCarousel – One card per item, no duplication
   =========================== */
function CenterCarousel({ items = [], cardW = 280, cardH = 160 }) {
  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [hovered, setHovered] = useState(null);
  const gap = 28;
  const total = Math.max(items.length, 1);

  useEffect(() => {
    if (isHover || total <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 3200);
    return () => clearInterval(t);
  }, [isHover, total]);

  const translateX = containerRef.current
    ? -(index * (cardW + gap)) +
      containerRef.current.clientWidth / 2 -
      cardW / 2
    : 0;

  if (items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="overflow-hidden py-6"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => {
        setIsHover(false);
        setHovered(null);
      }}
    >
      <div
        className="flex transition-transform duration-700 ease-out items-center"
        style={{ transform: `translateX(${translateX}px)`, gap: `${gap}px` }}
      >
        {items.map((item, i) => {
          const distance = Math.abs(i - index);
          const scale = distance === 0 ? 1.06 : distance === 1 ? 0.98 : 0.92;
          const opacity = distance === 0 ? 1 : distance === 1 ? 0.95 : 0.86;
          const name = item?.name || "Company";
          const link = item?.link || "#";
          const logoSrc =
            item?.logo_url ||
            item?.logo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name
            )}&background=ecfdf5&color=065f46&size=200`;

          return (
            <div
              key={item?.id ?? `${name}-${i}`}
              className={`flex-shrink-0 customer-card ${
                hovered === i ? "hovered" : ""
              }`}
              style={{
                width: cardW,
                height: cardH,
                transform: `scale(${scale})`,
                opacity,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="customer-card-inner rounded-2xl overflow-hidden shadow-lg bg-white p-3 flex items-center justify-center">
                <div className="logo-wrap w-full">
                  <img
                    src={logoSrc}
                    alt={name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) =>
                      (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        name
                      )}&background=ecfdf5&color=065f46&size=200`)
                    }
                  />
                </div>

                <div className="customer-overlay">
                  <div className="text-left">
                    <div
                      className="text-sm font-semibold truncate"
                      title={name}
                    >
                      {name}
                    </div>
                  </div>
                  <div className="text-right">
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold underline"
                      onClick={(e) => !item?.link && e.preventDefault()}
                    >
                      Visit <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===========================
   HomeHero – Banner Slider
   =========================== */
function HomeHero({ slides }) {
  const slidesSafe = slides?.length > 0 ? slides : fallbackBanners;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slidesSafe.length <= 1 || paused) return;
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % slidesSafe.length),
      5200
    );
    return () => clearInterval(t);
  }, [slidesSafe.length, paused]);

  return (
    <section
      className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slidesSafe.map((slide, i) => (
        <div
          key={slide.id || i}
          className={`absolute inset-0 transition-all duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image_url}
            alt={slide.title}
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
        <div className="animate-fadeInUp space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            {slidesSafe[current].title}
          </h1>
          {slidesSafe[current].subtitle && (
            <p className="text-lg md:text-2xl lg:text-3xl font-light max-w-4xl mx-auto">
              {slidesSafe[current].subtitle}
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="group inline-flex items-center gap-3 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-2xl transition-all hover:-translate-y-0.5"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </a>
          <button className="px-7 py-3 bg-white/10 backdrop-blur border border-white/30 text-white font-medium rounded-full hover:bg-white/20 transition">
            Contact Sales
          </button>
        </div>
      </div>

      {slidesSafe.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slidesSafe.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition ${
                i === current
                  ? "w-12 h-3 bg-white"
                  : "w-3 h-3 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="w-7 h-12 border-2 border-white/60 rounded-full flex justify-center">
          <div className="w-1.5 h-4 bg-white/80 rounded-full mt-3 animate-scroll" />
        </div>
      </div>
    </section>
  );
}

/* ===========================
   Main HomePage – Clean, No Static Skeletons
   =========================== */
export default function HomePage() {
  // Unified state: { loading: boolean, data: any }
  const [banners, setBanners] = useState({ loading: true, data: null });
  const [about, setAbout] = useState({ loading: true, data: null });
  const [services, setServices] = useState({ loading: true, data: [] });
  const [partners, setPartners] = useState({ loading: true, data: [] });
  const [customers, setCustomers] = useState({ loading: true, data: [] });

  // Inject global styles once
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = GLOBAL_STYLES;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  // Fetch all data
  useEffect(() => {
    let mounted = true;

    // Banners
    fetchBanners()
      .then((res) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || res?.data || [];
        if (mounted) setBanners({ loading: false, data });
      })
      .catch(() => mounted && setBanners({ loading: false, data: [] }));

    // About
    fetchAboutPost()
      .then((res) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || res?.data || [];
        if (mounted) setAbout({ loading: false, data: items[0] || null });
      })
      .catch(() => mounted && setAbout({ loading: false, data: null }));

    // Services
    fetchServices()
      .then((res) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || res?.data || [];
        if (mounted) setServices({ loading: false, data });
      })
      .catch(() => mounted && setServices({ loading: false, data: [] }));

    // Partners
    fetchPartners()
      .then((res) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || res?.data || [];
        if (mounted) setPartners({ loading: false, data });
      })
      .catch(() => mounted && setPartners({ loading: false, data: [] }));

    // Customers
    fetchCustomers()
      .then((res) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || res?.data || [];
        if (mounted) setCustomers({ loading: false, data });
      })
      .catch(() => mounted && setCustomers({ loading: false, data: [] }));

    return () => (mounted = false);
  }, []);

  // Show full-page loader only while banners are loading
  if (banners.loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <HomeHero slides={banners.data} />

      {/* ABOUT */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {about.loading ? (
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
                </div>
              </div>
            ) : about.data ? (
              <>
                <h2 className="text-3xl md:text-4xl font-bold">
                  {about.data.title}
                </h2>
                <div
                  className="mt-4 text-gray-700 prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: about.data.content }}
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-bold">About Us</h2>
                <p className="mt-4 text-lg text-gray-600">
                  We deliver innovative cloud, AI, and security solutions that
                  empower modern enterprises.
                </p>
              </>
            )}
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={
                about.data?.feature_image_url ||
                "https://images.unsplash.com/photo-1581093588401-6a0e1a6f9a8e?w=1200&q=80"
              }
              alt={about.data?.title || "Our Team"}
              className="w-full h-full object-cover"
              style={{ minHeight: 320 }}
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Our Core Solutions</h2>
          <p className="mt-3 text-gray-600">
            End-to-end services designed for performance and security.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="p-6 bg-gray-50 rounded-2xl shadow-sm animate-pulse"
                >
                  <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-6 bg-gray-200 rounded mb-3 w-4/5" />
                  <div className="h-4 bg-gray-200 rounded w-3/5" />
                </div>
              ))
            ) : services.data.length > 0 ? (
              services.data.map((s) => {
                const image =
                  s.image_url ||
                  s.feature_image_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    s.title || "Service"
                  )}&background=ecfdf5&color=065f46&size=400`;

                return (
                  <article
                    key={s.id}
                    className="service-card group overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm"
                  >
                    <div className="relative overflow-hidden rounded-t-3xl">
                      <img
                        src={image}
                        alt={s.title}
                        loading="lazy"
                        className="media w-full h-48 object-cover"
                      />
                      {s.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 text-sm bg-emerald-50 text-emerald-700 rounded-full font-semibold">
                          {s.category}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-gray-600 line-clamp-3">
                        {s.description ||
                          s.short_description ||
                          "Transform your business with cutting-edge solutions."}
                      </p>

                      <div className="mt-6 flex items-center justify-between">
                        <a
                          href={s.cta_url || "#"}
                          className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:underline"
                        >
                          Learn more <ArrowRight className="w-4 h-4" />
                        </a>
                        <Settings className="w-6 h-6 text-emerald-600 opacity-60" />
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center text-gray-500">
                <p className="text-lg">No services available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold">
            Technology Partners
          </h3>
          <p className="mt-3 text-gray-600">Built on trusted platforms</p>

          <div className="mt-12">
            {partners.loading ? (
              <div className="h-40 flex items-center justify-center text-gray-500">
                Loading partners...
              </div>
            ) : partners.data.length > 0 ? (
              <CenterCarousel
                items={partners.data.map((p) => ({
                  id: p.id,
                  name: p.name || "Partner",
                  logo_url: p.logo_url || p.logo,
                  link: p.link,
                }))}
                cardW={220}
                cardH={110}
              />
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-500">
                No partners to display.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CUSTOMERS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold">
            Trusted by Industry Leaders
          </h3>
          <p className="mt-3 text-gray-600">
            Customers who rely on our solutions
          </p>

          <div className="mt-12">
            {customers.loading ? (
              <div className="h-40 flex items-center justify-center text-gray-500">
                Loading customers...
              </div>
            ) : customers.data.length > 0 ? (
              <CenterCarousel
                items={customers.data.map((c) => ({
                  id: c.id,
                  name: c.name || "Customer",
                  logo_url: c.logo_url || c.logo,
                  link: c.link,
                }))}
                cardW={200}
                cardH={100}
              />
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-500">
                No customers to display.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-emerald-700 to-teal-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Business?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Let's build the future together.
          </p>
          <div className="mt-10">
            <button className="px-10 py-4 bg-white text-emerald-700 font-bold text-lg rounded-full hover:shadow-2xl transition hover:scale-105">
              Start Your Journey
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
