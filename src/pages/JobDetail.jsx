import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Info,
  ArrowRight,
  SquareCheckBig,
  CircleCheck,
} from "lucide-react";
import { getJobById, fetchJob } from "../api/job";

export default function JobDetail({ version = "2.0.4" }) {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    getJobById(id).then((res) => setJob(res.data));
    fetchJob().then((res) => setRecentJobs(res.slice(0, 3)));
  }, [id]);

  if (!job) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-4 gap-8">
        {/* ===== LEFT CONTENT ===== */}

        <div className="lg:col-span-3 bg-white rounded-3xl shadow-2xl shadow-amber-50/10 p-8">
          <h1 className="text-2xl font-bold mb-4">{job.job_title}</h1>

          <div className="flex flex-wrap gap-6 text-md text-gray-600 mb-6">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Closing Date: {job.closing_date}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Hiring: {job.hiring_number}
            </span>
          </div>

          {/* About */}
          <Section title="About The Role">
            <p className="ml-7">{job.job_summary}</p>
          </Section>

          {/* Responsibilities */}
          <Section title="Key Responsibilities">
            <ul className="list-disc list-inside space-y-2 ml-7">
              {job.responsibilities?.map((r) => (
                <li key={r.id} className="flex gap-2">
                  {" "}
                  <CircleCheck className="w-5 h-5" />
                  {r.responsibility_text}
                </li>
              ))}
            </ul>
          </Section>

          {/* Qualifications */}
          <Section title="Qualification & Experienc">
            <p className="ml-7">{job.qualification?.education_level}</p>
            <p className="ml-7">{job.qualification?.experience_required}</p>
          </Section>

          {/* Attributes */}
          <Section title="Personal Attributes">
            <ul className=" list-inside space-y-2 ml-7">
              {job.attributes?.map((a) => (
                <li key={a.id} className="flex gap-2">
                  <CircleCheck className="w-5 h-5" />
                  {a.attribute_text}
                </li>
              ))}
            </ul>
          </Section>

          {/* Benefits */}
          <Section title="Benefits & Perks">
            <ul className=" list-inside space-y-2 ml-7 ">
              {job.benefits?.map((b) => (
                <li key={b.id} className="flex gap-2 ">
                  <CircleCheck className="w-5 h-5" />{" "}
                  <strong>{b.benefit_title}</strong> – {b.benefit_description}
                </li>
              ))}
            </ul>
          </Section>
          <Section title="How to Apply">
            <p className="ml-7">
              Interested candidates are invited to submit the following
              documents:
            </p>

            <ol className="  space-y-2">
              <li className="ml-7">
                Updated resume (CV) with a brief cover letter and university
                transcript/GPA
              </li>
              <li className="ml-7">
                Links to your professional profiles (e.g., LinkedIn and/or
                Facebook)
              </li>
            </ol>

            <div className="mt-4">
              <ul className=" list-inside space-y-2 ml-7">
                {job.application_info?.email && (
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${job.application_info.email}`}
                      className="text-emerald-600 hover:underline"
                    >
                      {job.application_info.email}
                    </a>
                  </li>
                )}

                {job.application_info?.phone_number && (
                  <li>
                    <strong>Phone:</strong> {job.application_info.phone_number}
                  </li>
                )}

                {job.application_info?.telegram_link && (
                  <li>
                    <strong>Telegram:</strong>{" "}
                    <a
                      href={job.application_info.telegram_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline"
                    >
                      {job.application_info.telegram_link}
                    </a>
                  </li>
                )}
                <div className="flex items-center justify-between gap-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
                  {/* Left content */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                      <Info className="h-4 w-4 text-emerald-600" />
                    </div>
                    {job.application_info?.note && (
                      <li>Note: {job.application_info.note}</li>
                    )}
                  </div>
                </div>
              </ul>
            </div>
          </Section>

          <div className="text-center mt-10">
            <Link
              to={`/jobs/${job.id}/apply`}
              className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700"
            >
              Apply
            </Link>
          </div>
        </div>

        {/* ===== RIGHT SIDEBAR ===== */}
        <aside className="space-y-4">
          <h3 className="font-semibold text-lg">Recent Jobs</h3>
          {recentJobs.map((j) => (
            <Link
              key={j.id}
              to={`/jobs/${j.id}`}
              className="block bg-white p-4 rounded-2xl shadow hover:bg-gray-50"
            >
              <div className="font-medium text-emerald-700">{j.job_title}</div>
              <div className="font-medium text-gray-500">
                Hiring : {j.hiring_number}
              </div>
              <div className="text-xs text-gray-500">
                {j.created_at?.slice(0, 10)}
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
}

/* ===== Reusable Section ===== */
function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="font-semibold text-emerald-700 mb-2 gap-2 flex items-center align-middle">
        <SquareCheckBig className="w-5 h-5" />
        {title}
      </h2>
      <div className="text-sm text-gray-700 space-y-2">{children}</div>
    </div>
  );
}
