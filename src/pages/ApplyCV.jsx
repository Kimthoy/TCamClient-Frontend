import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitApplyCV } from "../api/applycv";
import { getJobById, fetchPartnerBanners } from "../api/job";
import { User } from "lucide-react";
import Swal from "sweetalert2";
import Banner from "../components/Banner";
/* Hero Component */
function JobHero() {
  return (
    <Banner
      fetchData={fetchPartnerBanners}
      fallbackTitle="Careers"

    />
  );
}

/* Apply CV Page */
export default function ApplyCV() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    position_apply: "",
    email: "",
    phone_number: "",
    hear_about_job: "",
    referral_name: "",
    status: "Pending",
    cv: null,
    consent: false,
  });

  // Fetch job detail and auto-fill position
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const res = await getJobById(id);
        setJob(res.data || null);
        setForm((prev) => ({
          ...prev,
          position_apply: res?.data?.job_title || "Job",
        }));
      } catch (err) {
        console.error("Failed to fetch job detail:", err);
      }
    };
    fetchJobDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    setForm((prev) => ({ ...prev, cv: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.cv) {
      return Swal.fire({
        icon: "warning",
        title: "CV Required",
        text: "Please upload your CV before submitting.",
        confirmButtonColor: "#2563eb",
      });
    }

    if (!form.consent) {
      return Swal.fire({
        icon: "warning",
        title: "Consent Required",
        text: "You must agree to the consent before submitting.",
        confirmButtonColor: "#2563eb",
      });
    }

    const formData = new FormData();
    formData.append("job_id", id);

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      setLoading(true);

      await submitApplyCV(id, formData);

      await Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Your application has been sent successfully.",
        confirmButtonColor: "#2563eb",
      });

      navigate("/jobs");
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <JobHero />
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl p-6 mx-auto bg-white  rounded-3xl shadow-2xl my-12  "
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Apply Now</h2>
        {job && (
          <h2 className="text-xl font-bold mb-4">
            Applying for: {job.job_title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="first_name"
            type="text"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="border-2  border-slate-300  focus:outline-emerald-200/80 focus:border-2  focus:outline-4 focus:border-emerald-800  px-4 py-2 rounded-full"
            required
          />
          <input
            name="last_name"
            type="text"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="border-2  border-slate-300  focus:outline-emerald-200/80 focus:border-2  focus:outline-4 focus:border-emerald-800  px-4 py-2 rounded-full"
            required
          />
          <input
            name="gender"
            type="text"
            placeholder="Gender"
            value={form.gender}
            onChange={handleChange}
            className="border-2  border-slate-300  focus:outline-emerald-200/80 focus:border-2  focus:outline-4 focus:border-emerald-800  px-4 py-2 rounded-full"
            required
          />
          <input
            name="position_apply"
            type="text"
            placeholder="Position Apply"
            value={form.position_apply}
            readOnly
            className="border-2  border-slate-300  focus:outline-emerald-200/80 focus:border-2  focus:outline-4 focus:border-emerald-800  px-4 py-2 rounded-full"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="border-2  border-slate-300  focus:outline-emerald-200/80 focus:border-2  focus:outline-4 focus:border-emerald-800  px-4 py-2 rounded-full"
            required
          />
          <input
            name="phone_number"
            placeholder="Contact Number"
            value={form.phone_number}
            onChange={handleChange}
            className="border-2  border-slate-300  focus:outline-emerald-200/80 focus:border-2  focus:outline-4 focus:border-emerald-800  px-4 py-2 rounded-full"
            required
          />
          <input
            name="hear_about_job"
            placeholder="How did you hear about this job?"
            value={form.hear_about_job}
            onChange={handleChange}
            className="border-2  border-slate-300  focus:outline-emerald-200/80 focus:border-2  focus:outline-4 focus:border-emerald-800  px-4 py-2 rounded-full"
          />
          <input
            name="referral_name"
            placeholder="Referral Name"
            value={form.referral_name}
            onChange={handleChange}
            className="border-2  border-slate-300  focus:outline-emerald-200/80 focus:border-2  focus:outline-4 focus:border-emerald-800  px-4 py-2 rounded-full"
          />
          <input
            name="status"
            type="hidden"
            value={form.status}
            onChange={handleChange}
          />
        </div>

        <div className="border-dashed border-2 p-6 text-center my-6 rounded">
          <input type="file" accept="application/pdf" onChange={handleFile} />
          <p className="text-sm text-gray-500 mt-2">Upload CV (PDF, max 2MB)</p>
        </div>

        <label className="flex items-start gap-3 text-sm mb-6 cursor-pointer select-none">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={handleChange}
              required
              className="peer sr-only"
            />

            {/* Custom checkbox */}
            <div
              className="h-5 w-5 text-white rounded-md  border border-gray-300 bg-white 
            peer-checked:bg-emerald-600 peer-checked:border-emerald-600 
            transition-all duration-200 flex items-center justify-center"
            >
              <svg
                className="hidden peer-checked:block w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <span className="text-gray-600 leading-relaxed">
            By submitting this form, I agree and give consent to{" "}
            <span className="font-medium text-gray-800">
              TCam Solution Co., Ltd.
            </span>{" "}
            to process my personal data according to company policy.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="block mx-auto px-8 py-3 bg-emerald-700 text-white rounded-full disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
}
