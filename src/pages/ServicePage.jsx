// src/pages/ServiceAndSupportPage.jsx

// --- CORRECTED IMPORTS: Added useRef to the React import ---
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Wrench,
  Package,
  Cpu,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

// --- GLOBAL STYLES (REQUIRED for the Hero component) ---

const GLOBAL_STYLES = `
  .hero-parallax { will-change: transform; transition: transform 0.1s linear; }
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
  .solution-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .solution-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
`;

// Helper for image analysis (You must include this or import it)
function analyzeImageBrightness(imgElement) {
  // Placeholder implementation (Use your actual logic)
  const luminance = Math.random() > 0.5 ? 100 : 200;
  return luminance < 128;
}

const fallbackBanner = {
  title: "Integrated Services & Solutions",
  subtitle: "We offer end-to-end expertise for your technology journey.",
  image_url:
    "https://images.unsplash.com/photo-1543286386-2e659306eb5c?q=85&w=2400",
};

// --- HERO COMPONENT (REUSED AND SLIGHTLY SIMPLIFIED) ---

function Hero({ banner }) {
  const [isDark, setIsDark] = useState(null);
  const imgRef = useRef(null); // NOW DEFINED
  const [scrollY, setScrollY] = useState(0);

  // Simplified version of your original Hero (removed style toggles)
  useEffect(() => {
    // Logic to analyze image brightness...
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

  const titleClasses = [
    "font-extrabold",
    "leading-tight",
    "hero-text-white",
    "text-4xl md:text-6xl lg:text-7xl",
    "title-shadow-strong",
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
        {banner?.title ? (
          <h1 className={titleClasses}>{banner.title}</h1>
        ) : null}

        {banner?.subtitle ? (
          <p
            className={`mt-4 text-lg md:text-2xl max-w-3xl mx-auto hero-sub-white`}
          >
            {banner.subtitle}
          </p>
        ) : null}

        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="#solutions-list"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("solutions-list")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold shadow-lg transition bg-white text-emerald-700 hover:bg-gray-100`}
          >
            View Our Solutions
            <ArrowRight className={`text-emerald-700 w-4 h-4`} />
          </a>
        </div>
      </div>
    </header>
  );
}

// --- SUPPORT DATA (Based on your image) ---

const supportTiers = [
  {
    name: "BRONZE",
    coverage: "8/5",
    color: "bg-amber-700/90",
    details: [
      "8x5 support coverage",
      "Exclude public holidays & weekend",
      "1 time/year preventive maintenance",
      "Unlimited case support",
    ],
    ctaColor: "bg-amber-700 hover:bg-amber-800",
  },
  {
    name: "SILVER",
    coverage: "8/7",
    color: "bg-gray-500/90",
    details: [
      "8x7 support coverage",
      "Include public holidays & weekend",
      "2 times/year preventive maintenance",
      "Unlimited case support",
    ],
    ctaColor: "bg-gray-600 hover:bg-gray-700",
  },
  {
    name: "GOLD",
    coverage: "24/7",
    color: "bg-amber-500/90",
    details: [
      "24x7 support coverage",
      "Include public holidays & weekend",
      "4 times/year preventive maintenance",
      "Unlimited case support",
    ],
    ctaColor: "bg-amber-600 hover:bg-amber-700",
  },
];

const serviceOptions = [
  { title: "Service Only", description: "Only support and fix issues." },
  {
    title: "Service & Part Backup",
    description:
      "Support and fix issues. If cannot be fixed, part to backup will be offered temporarily.",
  },
  {
    title: "Service & Part Replacement",
    description:
      "Support and fix issues. If cannot be fixed, parts to be replaced will be offered.",
  },
];

// --- MODERN SERVICE/SOLUTION DATA (Based on your image) ---

const solutions = [
  {
    id: 1,
    title: "Consultation Service",
    short_description:
      "Expert guidance to define your technology strategy and roadmap.",
    image_url: "/images/consultation.jpg",
    icon: Cpu,
  },
  {
    id: 2,
    title: "Solution Design",
    short_description:
      "Creating bespoke, scalable, and secure system architectures.",
    image_url: "/images/solution_design.jpg",
    icon: Wrench,
  },
  {
    id: 3,
    title: "Implementation Service",
    short_description:
      "Flawless deployment and integration of new hardware and software.",
    image_url: "/images/implementation.jpg",
    icon: Zap,
  },
  {
    id: 4,
    title: "After-Sales Support",
    short_description:
      "Dedicated resources for ongoing maintenance and operational assistance.",
    image_url: "/images/after_sales.jpg",
    icon: Shield,
  },
  {
    id: 5,
    title: "Managed Service",
    short_description:
      "Proactive monitoring and management of your entire IT infrastructure.",
    image_url: "/images/managed_service.jpg",
    icon: Clock,
  },
];

// --- SUPPORT TIER CARD COMPONENT ---

const SupportTierCard = ({ tier }) => (
  <div
    className={`flex flex-col rounded-xl shadow-xl overflow-hidden bg-white h-full transition duration-300 hover:shadow-2xl`}
  >
    {/* Header */}
    <div className={`p-6 text-white ${tier.color}`}>
      <h3 className="text-3xl font-extrabold mb-1">{tier.name}</h3>
      <p className="text-5xl font-extrabold leading-none">{tier.coverage}</p>
    </div>

    {/* Details */}
    <div className="flex-grow p-6 space-y-3 text-gray-700">
      {tier.details.map((detail, index) => (
        <div key={index} className="flex items-start text-base">
          <Check className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
          <span>{detail}</span>
        </div>
      ))}
    </div>

    {/* CTA Button */}
    <div className="p-6 pt-0">
      <a
        href={`/contact?tier=${tier.name}`}
        className={`w-full inline-block text-center px-6 py-3 rounded-lg font-bold text-white transition ${tier.ctaColor}`}
      >
        Contact Now
      </a>
    </div>
  </div>
);

const Check = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    ></path>
  </svg>
);

// --- SOLUTION CARD COMPONENT ---

const SolutionCard = ({ solution }) => {
  const Icon = solution.icon;
  return (
    <a
      href={`/solutions/${solution.id}`}
      className="solution-card block bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100"
    >
      {/* Image Section */}
      <div className="h-48 overflow-hidden">
        <img
          src={solution.image_url}
          alt={solution.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      {/* Content Section */}
      <div className="p-6 flex flex-col items-start">
        <Icon className="w-8 h-8 text-emerald-600 mb-3" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {solution.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">
          {solution.short_description}
        </p>
        <div className="mt-4 flex items-center text-emerald-600 font-semibold">
          Explore <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </a>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function ServiceAndSupportPage() {
  // Placeholder banner data
  const mainBannerProps = {
    title: "Integrated Services & Solutions",
    subtitle:
      "We partner with leading technology providers to deliver first-class, reliable solutions.",
    image_url:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=85&w=2400",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Hero Banner */}
      <Hero banner={mainBannerProps} />

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* 2. Solutions / Core Services Section (Modern look from your image) */}
        <section className="mb-24">
          <h2
            id="solutions-list"
            className="text-4xl font-extrabold text-gray-900 text-center mb-4"
          >
            Our Solutions
          </h2>
          <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-16">
            Proven expertise in the full lifecycle of technology adoption, from
            initial consultation to proactive managed support.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        </section>

        <hr className="my-16 border-gray-200" />

        {/* 3. Professional Ongoing Support (Modernized look from your image) */}
        <section>
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-4">
            Professional Ongoing Support
          </h2>
          <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Our after-sales services are provided via the International standard
            support which is certified to the **ISO 9001:2015**. We have three
            (3) support types of **Service Level Agreement (SLA)** to help your
            organization grow.
          </p>

          {/* Support Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {supportTiers.map((tier) => (
              <SupportTierCard key={tier.name} tier={tier} />
            ))}
          </div>

          {/* Service Options Details */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Support Agreement Options
            </h3>
            <p className="text-gray-600 mb-6">
              In each support agreement, there are three (3) options which you
              can choose based on your operation requirement:
            </p>
            <ul className="space-y-4">
              {serviceOptions.map((option, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 text-emerald-600 font-bold mr-3">
                    {index + 1}.
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {option.title}:
                    </p>
                    <p className="text-gray-600">{option.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
