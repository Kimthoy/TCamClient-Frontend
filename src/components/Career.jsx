import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { fetchJob } from "../api/job";
import { useNavigate } from "react-router-dom";

export default function CareersSection() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const handleViewDetails = (id) => {
    navigate(`/jobs/${id}`); // Navigate to the job detail page with the job ID
  };
  useEffect(() => {
    fetchJob().then((data) => setJobs(data));
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
            Current Openings
          </h2>
          <div className="w-14 h-1 bg-emerald-600 mx-auto mt-3 rounded-full" />
        </div>

        {/* Job Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              className="relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Job Header */}
              <div className="flex justify-between align-middle">
                <div>
                  <div className="flex items-center gap-3 mb-3 text-emerald-600">
                    <Briefcase className="w-5 h-5" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {job.job_title}
                    </h3>
                  </div>

                  {/* Job Details */}
                  <div className="flex flex-col gap-2 text-gray-700 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>
                        Closing:{" "}
                        {job.closing_date
                          ? new Date(job.closing_date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{job.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>Hiring: {job.hiring_number}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center items-center align-middle flex-col">
                  <span
                    className={`w-20 px-3 py-1 text-xs font-semibold rounded-full ${
                      job.status === "open"
                        ? "bg-green-100 text-green-800"
                        : job.status === "closed"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {job.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleViewDetails(job.id)}
                    className="mt-4 w-36 transition-all cursor-pointer flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-full text-sm font-medium hover:bg-emerald-700  group"
                  >
                    <span className="flex items-center gap-2">
                      View Details
                      <ArrowRight className="w-4 h-4 transform transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
