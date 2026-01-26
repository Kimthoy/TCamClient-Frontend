import React, { useState, useEffect } from "react";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { fetchSupport } from "../api/support";
import { fetchServiceBanners } from "../api/services";
import Banner from "../components/Banner";
import { motion } from "framer-motion";

function ServiceHero() {
  return <Banner fetchData={fetchServiceBanners} fallbackTitle="Service" />;
}

// 🔥 Random color generator
const getRandomColor = () => {
  const colors = [
    "#2563EB",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#F97316",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

export default function ServicePage() {
  const [support, setSupport] = useState({ loading: true, data: null });

  useEffect(() => {
    let mounted = true;

    fetchSupport()
      .then((res) => mounted && setSupport({ loading: false, data: res }))
      .catch(() => mounted && setSupport({ loading: false, data: null }));

    return () => {
      mounted = false;
    };
  }, []);

  const plans = support.data?.plans || [];
  const options = support.data?.options || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <ServiceHero />

      <main className="max-w-7xl mx-auto px-4">
        {/* Section Info */}
        <section className="py-16 text-center">
          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {support.data?.section?.section_title || "Professional Support"}
          </motion.h2>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
          >
            {support.data?.section?.section_description ||
              "Reliable support solutions tailored for your business needs."}
          </motion.p>
        </section>

        {/* Plans */}
        {plans.length > 0 ? (
          <section className="py-12 grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id || plan.plan_name}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transform transition"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
              >
                {/* Plan Banner */}
                <div
                  className="py-6 text-center text-white font-bold text-xl"
                  style={{
                    backgroundColor: plan.badge_color
                      ? plan.badge_color
                      : getRandomColor(),
                  }}
                >
                  {plan.plan_name || "Plan"}
                </div>

                <div className="p-6 text-center">
                  <p className="text-gray-600 font-medium mb-4">
                    {plan.support_coverage || "Coverage info not available"}
                  </p>

                  <ul className="space-y-3 mb-6 text-left">
                    {plan.features?.length > 0 ? (
                      plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <HiOutlineCheckCircle className="text-blue-500" />
                          <span className="text-gray-700">
                            {feature.feature_text}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400">No features listed</li>
                    )}
                  </ul>

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=phlochtiger999@gmail.com&su=${encodeURIComponent(
                      `Inquiry about ${plan.plan_name || "Plan"}`,
                    )}&body=${encodeURIComponent(
                      `Hello,\n\nI am interested in the ${
                        plan.plan_name || "Plan"
                      }.\nPlease contact me.\n`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="w-full cursor-pointer py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">
                      {plan.cta_text || "Contact Now"}
                    </button>
                  </a>
                </div>
              </motion.div>
            ))}
          </section>
        ) : (
          <p className="text-center text-gray-500 py-12">
            No support plans available.
          </p>
        )}

        {/* Options */}
        {options.length > 0 && (
          <section className="py-16 bg-gray-100">
            <div className="max-w-4xl mx-auto space-y-4">
              {options.map((opt, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    delay: idx * 0.2,
                  }}
                >
                  <HiOutlineCheckCircle
                    className="text-green-500 mt-1"
                    size={24}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {opt.option_title || "Option"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {opt.option_description || "Description not available."}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
