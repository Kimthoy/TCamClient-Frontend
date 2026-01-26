import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Smile, Users } from "lucide-react";
import { fetchWhyJoinUs } from "../api/joinus";
import CareersSection from "../components/Career";
import { fetchJobBanners } from "../api/job";
import Banner from "../components/Banner";

/* =======================
   Why Join Us Section
======================= */
function JobHero() {
  return <Banner fetchData={fetchJobBanners} fallbackTitle="Careers" />;
}

export default function WhyJoinUs() {
  const [sections, setSections] = useState([]);
  const [banner, setBanner] = useState(null);
  // Map string icon names to lucide-react components
  const iconMap = {
    Award: Award,
    BookOpen: BookOpen,
    Smile: Smile,
    Users: Users,
  };

  useEffect(() => {
    fetchWhyJoinUs().then((data) => setSections(data));
  }, []);

  return (
    <div>
      <JobHero
        banner={
          banner ?? {
            title: "Career",
            subtitle: "Trusted technology partners.",
          }
        }
        onViewCareer={() => {
          document
            .getElementById("career-list")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
              Careers
            </span>

            <section>
              <CareersSection />
            </section>
            <h2 className="mt-6 text-3xl md:text-4xl font-black text-emerald-900">
              Why Join Us
            </h2>

            <div className="w-14 h-1 bg-emerald-600 mx-auto mt-4 rounded-full" />
          </div>

          {/* Items */}
          <div className="grid gap-10 md:grid-cols-3">
            {sections.map((section) =>
              section.items?.map((item, i) => {
                const IconComponent = iconMap[item.icon] || Award; // fallback icon
                return (
                  <motion.div
                    key={i}
                    className="group flex gap-5 p-6 rounded-2xl bg-white border border-emerald-100
                             transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                      delay: i * 0.1,
                    }}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="text-lg font-semibold text-emerald-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-emerald-800/70 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              }),
            )}
          </div>

          {/* Quote */}
          <motion.p
            className="mt-16 text-center text-emerald-800 italic max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.5 }}
          >
            At{" "}
            <span className="font-semibold text-emerald-900">
              TCam Solution
            </span>
            , we don’t just deliver technology — we empower people to innovate,
            lead, and shape Cambodia’s digital future.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
