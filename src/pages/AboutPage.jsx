import React, { useEffect, useState } from "react";
import { fetchAboutUsList } from "../api/about";
import Banner from "../components/Banner";
import { fetchAboutBanners } from "../api/about";
import { motion } from "framer-motion";

export default function AboutPage() {
  const [about, setAbout] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  function AboutUSHero() {
    return (
      <Banner
        fetchData={fetchAboutBanners}
        fallbackTitle="About Us"

      />
    );
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAboutUsList({ per_page: 1 });
        setAbout(data[0] || null); // take first item
      } catch (err) {
        console.error("Failed to fetch About Us:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <div className="text-center py-10">Loading About Us...</div>;

  if (!about)
    return (
      <div className="text-center py-10 text-red-600">
        About Us content not found.
      </div>
    );

  return (
    <div>
      {/* Keep the existing banner */}
      <AboutUSHero
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

      {/* About Section */}
      <section className="container mx-auto px-4 py-20 space-y-16">
        {/* Intro Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Company Image */}
          {about.company_image && (
            <motion.div
              className="lg:w-1/3 shrink-0"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <img
                src={about.company_image}
                alt={about.title}
                className="rounded-2xl shadow-xl w-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          )}

          {/* Text Content */}
          <motion.div
            className="lg:w-2/3 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <h2 className="text-4xl font-extrabold text-gray-900">
              About <span className="text-blue-600">Us</span>
            </h2>
            {about.founding_year && (
              <p className="text-gray-700 text-lg leading-relaxed">
                Founded in{" "}
                <strong className="text-blue-600">{about.founding_year}</strong>{" "}
                by {about.founders_info}, {about.title} is Cambodia's leading IT
                systems integration company with{" "}
                <strong className="text-blue-600">
                  {about.project_count || 0}
                </strong>{" "}
                major projects and{" "}
                <strong className="text-blue-600">
                  {about.operational_offices?.length || 0}
                </strong>{" "}
                operational offices.
              </p>
            )}

            {about.operational_offices && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {about.operational_offices.map((office, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg shadow-sm"
                  >
                    <p className="text-gray-700">{office}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Description / Services */}
        <motion.div
          className="space-y-6 text-gray-700 text-base leading-relaxed"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {about.intro_text && <p>{about.intro_text}</p>}
          {about.services_description && <p>{about.services_description}</p>}
          {about.company_profile && <p>{about.company_profile}</p>}
        </motion.div>

        {/* Vision / Mission / Value Proposition */}
        <div className="grid md:grid-cols-3 gap-8">
          {about.vision && (
            <motion.div
              className="p-6 bg-linear-to-tr from-blue-500/20 to-white rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
            >
              <h3 className="text-2xl font-semibold mb-2 text-blue-700">
                Vision
              </h3>
              <p className="text-gray-800">{about.vision}</p>
            </motion.div>
          )}
          {about.mission && (
            <motion.div
              className="p-6 bg-linear-to-tr from-green-500/20 to-white rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold mb-2 text-green-700">
                Mission
              </h3>
              <p className="text-gray-800">{about.mission}</p>
            </motion.div>
          )}
          {about.value_proposition && (
            <motion.div
              className="p-6 bg-linear-to-tr from-red-500/20 to-white rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
            >
              <h3 className="text-2xl font-semibold mb-2 text-red-700">
                Value Proposition
              </h3>
              <p className="text-gray-800">{about.value_proposition}</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
