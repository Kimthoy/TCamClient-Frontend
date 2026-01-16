import React, { useEffect, useState } from "react";
import { fetchAboutUsList } from "../api/about";
import { Link } from "react-router-dom";
import { CircleArrowOutUpRight, CircleCheckBig } from "lucide-react";

export default function AboutPage() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
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
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              {/* Badge */}
              <span
                className="inline-flex items-center px-4 py-1 rounded-full
                         bg-emerald-100 text-emerald-700 text-sm font-semibold"
              >
                About Our Company
              </span>

              {/* Intro */}
              {about.founding_year && (
                <p className="text-emerald-900 text-lg leading-8">
                  Founded in <strong>{about.founding_year}</strong> by{" "}
                  <strong>{about.founders_info}</strong>,{" "}
                  <span className="font-semibold">{about.title}</span> is
                  Cambodia’s leading IT systems integration company, delivering{" "}
                  <strong>{about.project_count || 0}</strong> major projects
                  across{" "}
                  <strong>{about.operational_offices?.length || 0}</strong>{" "}
                  operational offices.
                </p>
              )}

              {/* Offices */}
              {/* {about.operational_offices && (
                <ul className="grid sm:grid-cols-2 gap-3">
                  {about.operational_offices
                    .join(";")
                    .split(";")
                    .map((office, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 text-emerald-600">
                          <CircleCheckBig className="w-5 h-5" />
                        </span>
                        <span className="text-emerald-800 font-medium">
                          {office.trim()}
                        </span>
                      </li>
                    ))}
                </ul>
              )} */}

              {/* Descriptions */}

              {/* {about.intro_text && (
                <p className="text-emerald-800/80 leading-7">
                  {about.intro_text}
                </p>
              )} */}

              {about.services_description && (
                <p className="text-emerald-800/80 leading-7">
                  {about.services_description}
                </p>
              )}

              {/* CTA */}
              <Link to="/about" className="inline-block pt-4">
                <button
                  className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl
                       bg-emerald-600 text-white font-semibold
                       hover:bg-emerald-700 hover:shadow-xl
                       hover:shadow-emerald-400/40
                       active:scale-95 transition-all"
                >
                  Learn More About Us
                  <CircleArrowOutUpRight
                    className="w-5 h-5 transition-transform
                         group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </button>
              </Link>
            </div>

            {/* Image */}
            <div className="relative">
              {about.company_image && (
                <img
                  src={about.company_image}
                  alt="Company"
                  className="rounded-3xl shadow-2xl w-full object-cover float"
                />
              )}

              {/* Decorative accent */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-3xl bg-emerald-200/40 -z-10" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
