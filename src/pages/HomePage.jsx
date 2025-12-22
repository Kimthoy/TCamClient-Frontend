import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ExternalLink, CircleArrowOutUpRight } from "lucide-react";

import {
  fetchHomeBanners,
  fetchAboutPost,
  fetchServices,
  fetchPartners,
} from "../api/home";
import { fetchPublicEvents } from "../api/event";
import Banner from "../components/Banner";
import About from "../components/About";
import AboutPage from "../components/About";

// =========================
// GLOBAL STYLES (Injected once)
// =========================
const GLOBAL_STYLES = `
@keyframes marquee {0% { transform: translateX(0); } 100% { transform: translateX(-50%); }}
@keyframes marquee-slow {0% { transform: translateX(0); } 100% { transform: translateX(-50%); }}
.marquee-slow { display:flex; gap:2rem; will-change: transform; animation: marquee-slow 35s linear infinite; width: max-content; }
.marquee-slow:hover, .animation-paused { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .marquee-slow { animation: none !important; } }

@keyframes pulse {0% { opacity: 1 } 50% { opacity: 0.6 } 100% { opacity: 1 }}
.animate-pulse { animation: pulse 1.8s ease-in-out infinite; }

@keyframes fadeInUp { from { opacity: 0; transform: translate3d(0, 40px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
.animate-fadeInUp { animation: fadeInUp 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }

.service-card { transition: transform 350ms cubic-bezier(0.16,1,0.3,1), box-shadow 350ms; will-change: transform; backface-visibility: hidden; }
.service-card:hover { transform: translateY(-10px) scale(1.01); z-index: 10; }
.service-card .media { transition: transform 550ms cubic-bezier(0.16,1,0.3,1); }
.service-card:hover .media { transform: scale(1.05); }
`;

// =========================
// COMPONENTS
// =========================
function HomeHero() {
  return <Banner fetchData={fetchHomeBanners} fallbackTitle="Careers" />;
}

function PartnerCard({ p }) {
  return (
    <article className="partner-card bg-white rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition mb-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={p.logo_url || p.image || "https://via.placeholder.com/150"}
            alt={`${p.name} logo`}
            className="w-full h-full object-contain"
            loading="lazy"
            onError={(e) =>
              (e.currentTarget.src = "https://via.placeholder.com/150")
            }
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold truncate">{p.name}</h3>
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
      </div>
    </article>
  );
}

// =========================
// MAIN HomePage
// =========================
export default function HomePage() {
  const navigate = useNavigate();

  const [banners, setBanners] = useState({ loading: true, data: [] });
  const [about, setAbout] = useState({ loading: true, data: null });
  const [services, setServices] = useState({ loading: true, data: [] });
  const [partners, setPartners] = useState({ loading: true, data: [] });
  const [events, setEvents] = useState({ loading: true, data: [] });

  // Inject global styles
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = GLOBAL_STYLES;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  // Fetch all data
  useEffect(() => {
    let mounted = true;

    fetchHomeBanners()
      .then((res) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];
        if (mounted) setBanners({ loading: false, data });
      })
      .catch(() => mounted && setBanners({ loading: false, data: [] }));

    fetchAboutPost()
      .then((res) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];
        if (mounted) setAbout({ loading: false, data: items[0] || null });
      })
      .catch(() => mounted && setAbout({ loading: false, data: null }));

    fetchServices()
      .then((res) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];
        if (mounted) setServices({ loading: false, data });
      })
      .catch(() => mounted && setServices({ loading: false, data: [] }));

    fetchPartners()
      .then((res) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];
        if (mounted) setPartners({ loading: false, data });
      })
      .catch(() => mounted && setPartners({ loading: false, data: [] }));

    fetchPublicEvents()
      .then((res) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];
        if (mounted) setEvents({ loading: false, data });
      })
      .catch(() => mounted && setEvents({ loading: false, data: [] }));

    return () => (mounted = false);
  }, []);

  if (banners.loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HERO */}
      <HomeHero />
      <AboutPage />
      {/* ABOUT */}
      <section className="py-20 bg-emerald-50/10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-xl group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="absolute " />
            <img
              src={
                about.data?.feature_image_url ||
                "https://images.unsplash.com/photo-1581093588401-6a0e1a6f9a8e?w=1200&q=80"
              }
              alt={about.data?.title || "About Image"}
              className="w-full h-full object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105"
              style={{ minHeight: 320 }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {about.loading ? (
              <div className="space-y-4">
                <div className="h-10 bg-emerald-200 rounded w-3/4 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 bg-emerald-200 rounded animate-pulse" />
                  <div className="h-4 bg-emerald-200 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-emerald-200 rounded w-4/6 animate-pulse" />
                </div>
              </div>
            ) : about.data ? (
              <>
                <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900">
                  {about.data.title}
                </h2>
                <div
                  className="mt-4 text-gray-700 prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: about.data.content }}
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900">
                  About Us
                </h2>
                <p className="mt-4 text-lg text-gray-700">
                  We deliver innovative cloud, AI, and security solutions that
                  empower modern enterprises.
                </p>
              </>
            )}
          </motion.div>

          {/* Image */}
        </div>
      </section>
      {/* SERVICES - Modern UI */}
      <section className="py-20 bg-emerald-50/20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <h2 className="text-3xl md:text-4xl text-center font-black text-emerald-900">
            Our Solutions
          </h2>
          <p className="mt-3 text-emerald-800/70 text-center max-w-2xl mx-auto">
            End-to-end services designed for performance, security, and
            innovation.
          </p>

          {/* Services Grid */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.loading ? (
              // Skeleton Loader
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="p-6 bg-emerald-100 rounded-3xl shadow animate-pulse transition-all"
                >
                  <div className="h-48 bg-emerald-200 rounded-xl mb-4" />
                  <div className="h-6 bg-emerald-200 rounded mb-2 w-3/4 mx-auto" />
                  <div className="h-4 bg-emerald-200 rounded w-5/6 mx-auto" />
                </div>
              ))
            ) : services.data?.length > 0 ? (
              services.data.map((s, index) => {
                const image =
                  s.image_url ||
                  s.feature_image_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    s.title || "Service"
                  )}&background=ecfdf5&color=065f46&size=400`;

                return (
                  <motion.div
                    key={s.id}
                    className="service-card group relative bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                      delay: index * 0.1,
                    }}
                  >
                    {/* Service Image */}
                    <div className="overflow-hidden rounded-t-3xl">
                      <img
                        src={image}
                        alt={s.title}
                        className="w-full h-56 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                      />
                    </div>

                    {/* Service Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {s.category && (
                        <span className="inline-block mb-2 px-3 py-1 text-sm bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-full font-semibold">
                          {s.category}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-emerald-900">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-emerald-800/70 line-clamp-3">
                        {s.description ||
                          s.short_description ||
                          "Transform your business with cutting-edge solutions."}
                      </p>

                      {/* Learn More button */}
                      <a
                        href={`/solution`}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-100 text-emerald-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out self-start hover:bg-emerald-200"
                      >
                        Learn More
                        <CircleArrowOutUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center text-emerald-700/50">
                No services available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>
      {/* PARTNERS - Modern UI */}
      <section className="py-20 bg-emerald-50/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Header */}
          <motion.h2
            className="text-3xl md:text-4xl font-black mb-2 text-emerald-900"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            Our Partners
          </motion.h2>

          <motion.p
            className="mb-12 text-emerald-800/70"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
          >
            We partner with the best to deliver world-class solutions.
          </motion.p>

          {partners.data.length === 0 ? (
            <motion.p
              className="text-emerald-700/50"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              No partners available.
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {partners.data.map((p, index) => (
                <motion.div
                  key={p.id ?? p.name}
                  className="group relative flex flex-col items-center bg-white rounded-3xl p-6
                       shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 hover:scale-105 duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    delay: index * 0.1,
                  }}
                >
                  {/* Logo */}
                  <div
                    className="w-24 h-24 mb-4 rounded-full overflow-hidden border border-emerald-100
                         bg-emerald-50 flex items-center justify-center transition-transform duration-300
                         group-hover:scale-110"
                  >
                    <img
                      src={
                        p.logo_url ||
                        p.image ||
                        "https://via.placeholder.com/150"
                      }
                      alt={p.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/150")
                      }
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2 truncate">
                    {p.name}
                  </h3>

                  {/* Short description */}
                  {p.short_description && (
                    <p className="text-sm text-emerald-800/70 line-clamp-3 mb-4">
                      {p.short_description}
                    </p>
                  )}

                  {/* Visit Site CTA */}
                  <a
                    href={p.website || p.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-full
                         bg-emerald-50 text-emerald-700 font-medium text-sm
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300
                         shadow-sm hover:shadow-md"
                  >
                    Visit Site <ExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* UPCOMING EVENTS */}
      <section className="py-20 bg-emerald-50/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Header */}
          <motion.h2
            className="text-3xl md:text-4xl font-black text-emerald-900"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            Upcoming Events
          </motion.h2>

          <motion.p
            className="mt-3 text-emerald-800/70 text-base md:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Explore our latest events, workshops, and conferences designed to
            inspire, educate, and connect you with industry leaders.
          </motion.p>

          {/* Events Grid */}
          <div className="mt-12 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl shadow-lg p-6 animate-pulse"
                >
                  <div className="h-48 bg-emerald-100 rounded mb-4" />
                  <div className="h-6 bg-emerald-100 rounded mb-2 w-3/4 mx-auto" />
                  <div className="h-4 bg-emerald-100 rounded w-5/6 mx-auto" />
                </div>
              ))
            ) : events.data.length > 0 ? (
              events.data.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="bg-white rounded-3xl shadow hover:shadow-2xl transition cursor-pointer overflow-hidden flex flex-col"
                  onClick={() => navigate(`/events`)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    delay: index * 0.1,
                  }}
                >
                  {event.poster_image_url && (
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src={event.poster_image_url}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-emerald-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-emerald-800/70 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-xs text-emerald-700/70">
                      <span>
                        {new Date(event.event_date).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <span>{event.location || "TBA"}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p
                className="col-span-full text-center text-emerald-700/50"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                No upcoming events.
              </motion.p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
