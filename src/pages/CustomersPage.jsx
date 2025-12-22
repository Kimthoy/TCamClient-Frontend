// src/pages/CustomersPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { ArrowRight, Trophy, Sparkles, Zap } from "lucide-react";

import { fetchCustomerBanners, fetchPublicCustomers } from "../api/customer";
import Banner from "../components/Banner";
import { motion } from "framer-motion";
function CustomerHero() {
  return <Banner fetchData={fetchCustomerBanners} fallbackTitle="Customers" />;
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
    <section className="py-24 bg-gradient-to-b from-emerald-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span
            className="inline-flex items-center px-4 py-1 rounded-full
                   bg-emerald-100 text-emerald-700 text-sm font-semibold"
          >
            Our Strengths
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-black text-emerald-900">
            Why Partner With Us
          </h2>

          <p className="mt-5 text-lg text-emerald-800/70 max-w-2xl mx-auto">
            We focus on long-term partnerships, measurable impact, and
            delivering real business value.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid gap-8 md:grid-cols-3">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                className="group rounded-3xl bg-white border border-emerald-100
                       p-10 text-center transition-all duration-300
                       hover:-translate-y-2 hover:shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                  delay: idx * 0.1,
                }}
              >
                {/* Icon */}
                <div
                  className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center
                          rounded-2xl bg-gradient-to-br ${item.gradient}
                          text-white shadow-lg group-hover:scale-105 transition`}
                >
                  <Icon className="w-8 h-8" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-emerald-900 mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-emerald-800/70 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
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
    <motion.div
      className="group w-full  rounded-3xl bg-white border border-emerald-100 overflow-hidden
             shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
             flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Image */}
      <div
        className="relative h-36 bg-gradient-to-br from-emerald-50 to-white
              flex items-center justify-center p-4 overflow-hidden"
      >
        <img
          src={customer.image_url || customer.logo_url || placeholder}
          alt={title}
          className="max-w-full max-h-full object-contain transition-transform duration-500 
             group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = brokenPlaceholder;
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 text-center">
        <h3
          id={`customer-${customer.id}-title`}
          className="text-lg font-semibold text-emerald-900 mb-2"
        >
          {title}
        </h3>

        <p className="text-sm text-emerald-800/70 line-clamp-2 mb-4">
          {shortDesc ||
            "A trusted partnership delivering growth and innovation."}
        </p>

        {/* CTA — always visible */}
        <div className="mt-auto">
          <button
            type="button"
            className="group inline-flex items-center justify-center gap-2 px-5 py-2
      rounded-full text-sm font-semibold
      text-emerald-700 border border-emerald-200
      hover:bg-emerald-600 hover:text-white hover:border-emerald-600
      transition-all duration-300"
          >
            Visit Website
            <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover:ml-2 group-hover:animate-pulse" />
          </button>
        </div>
      </div>
    </motion.div>
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

  const handleRetry = () => {
    setPageNum(1);
    setCustomersError(null);
    setLoadingCustomers(true);
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
      <CustomerHero />

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
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 md:grid-cols-3 ">
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center space-y-3 align-middle w-full">
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
