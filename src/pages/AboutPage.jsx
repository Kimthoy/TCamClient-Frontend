// src/pages/AboutPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, Mail } from "lucide-react";
import { fetchAboutBanners, fetchSingleAboutPost } from "../api/about";

/* ========== Styles (hero + title stroke/shadow) ========== */
const GLOBAL_STYLES = `
.hero-parallax { will-change: transform; transition: transform 0.2s linear; }
.hero-overlay { background: linear-gradient(180deg, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.16) 40%, rgba(0,0,0,0) 100%); }
.hero-overlay--light { background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0) 100%); }

/* Title styles for stroke / shadow */
.title-stroke {
  -webkit-text-stroke-width: 1.6px;
  -webkit-text-stroke-color: rgba(0,0,0,0.75);
  text-shadow:
    1px 0 rgba(0,0,0,0.65),
    -1px 0 rgba(0,0,0,0.65),
    0 1px rgba(0,0,0,0.65),
    0 -1px rgba(0,0,0,0.65),
    1px 1px rgba(0,0,0,0.45),
    -1px -1px rgba(0,0,0,0.45);
}

.title-stroke--light {
  -webkit-text-stroke-color: rgba(255,255,255,0.9);
  text-shadow:
    1px 0 rgba(255,255,255,0.85),
    -1px 0 rgba(255,255,255,0.85),
    0 1px rgba(255,255,255,0.85),
    0 -1px rgba(255,255,255,0.85);
}

.title-shadow {
  text-shadow:
    0 6px 18px rgba(0,0,0,0.45),
    0 2px 6px rgba(0,0,0,0.28);
}

.title-shadow-strong {
  text-shadow:
    0 12px 30px rgba(0,0,0,0.55),
    0 4px 10px rgba(0,0,0,0.35);
}

.style-pill { display:inline-flex; gap:8px; padding:6px; border-radius:999px; background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.06); }
.style-pill button { padding:6px 10px; border-radius:999px; background:transparent; border:none; cursor:pointer; color:inherit; }
.style-pill button.active { background: rgba(255,255,255,0.12); box-shadow: 0 6px 18px rgba(2,6,23,0.12); }

/* Force white text color utility for hero text */
.hero-text-white { color: white !important; }
.hero-sub-white { color: rgba(255,255,255,0.90) !important; }
`;

/* fallback banner (image kept, but no title/subtitle so "sample" text removed) */
const fallbackBanner = {
  title: "Our Story", // Default title for About Page
  subtitle: "Building the future of enterprise technology.", // Default subtitle
  image_url:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2000&q=85",
};

/* tiny analyzer for brightness (used to pick text color) */
function analyzeImageBrightness(imageEl) {
  try {
    const w = 120;
    const h = Math.max(
      80,
      Math.round((imageEl.naturalHeight / imageEl.naturalWidth) * w)
    );
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(imageEl, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let total = 0;
    const step = 4 * 4;
    for (let i = 0; i < data.length; i += step) {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      total += lum;
    }
    const samples = data.length / step;
    const avg = total / Math.max(1, samples);
    return avg < 130; // dark if average luminance < 130
  } catch (err) {
    console.warn("Brightness analysis failed:", err);
    return false; // fallback: treat as light
  }
}

/* ---------- Hero component (product-style but forced white text) ---------- */
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
          <div className="style-pill inline-flex items-center p-1 text-white">
            {" "}
            {/* Added text-white for visibility */}
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

        {/* Render title, using fallback if not provided by fetched banner */}
        <h1 className={titleClasses}>
          {banner?.title || fallbackBanner.title}
        </h1>

        {/* Render subtitle, using fallback if not provided */}
        <p
          className={`mt-4 text-lg md:text-2xl max-w-3xl mx-auto ${subtitleColorClass}`}
        >
          {banner?.subtitle || fallbackBanner.subtitle}
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="#our-story" // Target the main content section
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("our-story")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold shadow-lg bg-white text-emerald-700 hover:bg-gray-100 transition`} // Added hover transition
          >
            Explore Our Journey
            <ArrowRight className={`text-emerald-700 w-4 h-4`} />
          </a>

          <a
            href="/contact"
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold border border-white/30 text-white bg-white/6 hover:bg-white/20 transition`} // Added hover transition
          >
            Get in Touch
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------- AboutPage main ---------- */
export default function AboutPage() {
  const [banners, setBanners] = useState(null);
  const [post, setPost] = useState(undefined);
  const [titleStyle, setTitleStyle] = useState("shadow"); // default: shadow
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "About • TCAM Solutions";
  }, []);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchAboutBanners(), fetchSingleAboutPost()])
      .then(([barr, p]) => {
        if (!mounted) return;
        setBanners(Array.isArray(barr) ? barr : []);
        setPost(p ?? null);
      })
      .catch((err) => {
        console.error("About load error:", err);
        if (!mounted) return;
        setError(err);
        setBanners([]);
        setPost(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const hero = banners && banners.length > 0 ? banners[0] : fallbackBanner;
  const contentHtml = post?.content || post?.excerpt || "";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <a
        href="#our-story"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:px-4 focus:py-2 focus:rounded shadow"
      >
        Skip to content
      </a>

      <Hero
        banner={hero}
        titleStyle={titleStyle}
        onToggleStyle={setTitleStyle}
      />

      <main className="max-w-6xl mx-auto px-6 -mt-12">
        <section className="bg-white rounded-3xl p-8 shadow-lg -translate-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">What Drives Us</h2>
            <p className="mt-2 text-gray-600">Excellence in everything we do</p>
          </div>

          {/* (rest of page unchanged) */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <h3 className="text-lg font-semibold mb-2">Innovation First</h3>
              <p className="text-gray-600">
                Cutting-edge solutions that push boundaries
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <h3 className="text-lg font-semibold mb-2">Security by Design</h3>
              <p className="text-gray-600">
                Your data and systems are always protected
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <h3 className="text-lg font-semibold mb-2">Global Scale</h3>
              <p className="text-gray-600">
                Deploy confidently anywhere in the world
              </p>
            </div>
          </div>
        </section>

        <section id="our-story" className="py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              {post === undefined ? (
                <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse" />
              ) : post ? (
                <img
                  src={post.feature_image_url || hero.image_url}
                  alt={post.title || "About image"}
                  className="w-full rounded-2xl object-cover shadow-lg"
                  style={{ minHeight: 320 }}
                  onError={(e) =>
                    (e.currentTarget.src =
                      hero.image_url || fallbackBanner.image_url)
                  }
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-2xl border-2 border-dashed flex items-center justify-center text-gray-500">
                  No image available
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {post?.title || "Building Tomorrow’s Infrastructure Today"}
              </h2>

              {post === undefined ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
                </div>
              ) : post ? (
                <div
                  className="prose prose-lg text-gray-700"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              ) : (
                <p className="text-gray-700">
                  At TCAM Solutions, we believe technology should empower
                  businesses, not complicate them. We partner with enterprises
                  to turn ambitious ideas into reality.
                </p>
              )}

              <blockquote className="mt-6 p-4 bg-white rounded-lg border-l-4 border-emerald-600 italic text-gray-700">
                “Great things in business are never done by one person. They're
                done by a team of people.” — Steve Jobs
              </blockquote>
            </div>
          </div>

          {error && (
            <div className="mt-6 text-sm text-red-600">
              Failed to load some content — check console for details.
            </div>
          )}
        </section>

        <section className="py-10 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold">Ready to get started?</h3>
              <p className="text-gray-600">
                Start your journey with TCAM Solutions — cloud, AI & security
                built to scale.
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="/contact"
                className="px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition" // Added hover transition
              >
                Start a Project
              </a>
              <a
                href="mailto:hello@tcamsolutions.com"
                className="px-6 py-3 rounded-full border border-gray-200 hover:bg-gray-100 transition" // Added hover transition
              >
                hello@tcamsolutions.com
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
