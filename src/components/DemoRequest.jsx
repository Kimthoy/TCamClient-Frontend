import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { submitRequestDemo } from "../api/request_demo";

const DemoRequest = ({ open, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    description: "",
    website: "", // honeypot
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
    setServerMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setServerMessage("");
    setSuccess(false);

    try {
      await submitRequestDemo({ ...form, status: "PENDING" });

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        company: "",
        description: "",
        website: "",
      });

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      if (err?.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else if (err?.response?.data?.message) {
        setServerMessage(err.response.data.message);
      } else {
        setServerMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 ">
      <div className="bg-white shadow-2xl w-full max-w-4xl h-[95vh] relative overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-5 right-5 z-10 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="hidden md:flex flex-col justify-between bg-emerald-700 text-white p-10">
            <div>
              <h2 className="text-3xl font-extrabold leading-tight mb-4">
                Experience Our Platform
              </h2>
              <p className="text-emerald-100 leading-relaxed space-y-2">
                <span className="block">
                  • Discover how our system streamlines operations.
                </span>
                <span className="block">
                  • Manage customers, products, and workflows.
                </span>
                <span className="block">
                  • Designed for banking and enterprise needs.
                </span>
                <span className="block">
                  • Secure, scalable, and easy to use.
                </span>
              </p>
            </div>

            {/* Image */}
            <img
              src="/uiux.png"
              alt="Demo Preview"
              className="mt-8 rounded-xl shadow-lg"
            />
          </div>

          {/* RIGHT SIDE – FORM */}
          <div className="p-8 md:p-10">
            <h3 className="text-2xl font-extrabold text-emerald-900 mb-2">
              Request a Demo
            </h3>
            <p className="text-emerald-700 mb-6 leading-relaxed">
              Tell us about your project or service needs. We’ll contact you
              shortly.
            </p>

            {/* Success */}
            {success && (
              <div className="mb-4 rounded-xl bg-emerald-100 text-emerald-800 px-4 py-3">
                ✅ Demo request submitted successfully!
              </div>
            )}

            {/* Server message */}
            {serverMessage && (
              <div className="mb-4 rounded-xl bg-red-100 text-red-800 px-4 py-3">
                ⚠ {serverMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="hidden"
                autoComplete="off"
              />

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name[0]}</p>
              )}

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email[0]}</p>
              )}

              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company / Organization"
                className="w-full px-4 py-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company[0]}</p>
              )}

              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your project or service"
                className="w-full px-4 py-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-400 outline-none resize-none"
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description[0]}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-emerald-600 cursor-pointer hover:bg-emerald-700 disabled:opacity-60
             text-white font-semibold py-3 rounded-xl
             flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoRequest;
