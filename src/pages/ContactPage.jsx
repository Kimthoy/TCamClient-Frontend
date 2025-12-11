// src/pages/ContactPage.jsx
import React, { useState } from "react";
import { Send, MapPin, Phone, Mail, CheckCircle, X } from "lucide-react";

/**
 * Full Contact Page (drop-in)
 * - Animated banner (Ken Burns + gradient + text fade-up + wave)
 * - Accessible contact form with client validation + server error mapping
 * - Uses fetch to POST to /api/contact-messages (adjust endpoint if needed)
 * - CSRF token read from <meta name="csrf-token" /> if present
 * - Success toast and inline validation messages
 *
 * Usage: import ContactPage into your router
 */

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState(""); // "", "sending", "success", "error"
  const [errors, setErrors] = useState({});
  const [dismissSuccess, setDismissSuccess] = useState(false);

  const getCsrfToken = () =>
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") || "";

  const validateClient = (values) => {
    const e = {};
    if (!values.message || values.message.trim().length < 5) {
      e.message = "Please enter a message (at least 5 characters).";
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (values.phone && !/^[0-9+\s().-]{6,30}$/.test(values.phone)) {
      e.phone = "Please enter a valid phone number.";
    }
    if (values.name && values.name.length > 191) {
      e.name = "Name is too long.";
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    if (errors[name]) setErrors((s) => ({ ...s, [name]: null }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setStatus("sending");
    setErrors({});

    // client-side validation
    const clientErrors = validateClient(formData);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");
        setDismissSuccess(false);
        setFormData({ name: "", email: "", phone: "", message: "" });
        // auto-hide after a while
        setTimeout(() => setStatus(""), 7000);
      } else {
        // Laravel style validation: { errors: { field: [msgs] } }
        if (data?.errors && typeof data.errors === "object") {
          // map arrays to first message
          const mapped = Object.keys(data.errors).reduce((acc, k) => {
            acc[k] = Array.isArray(data.errors[k])
              ? data.errors[k][0]
              : data.errors[k];
            return acc;
          }, {});
          setErrors(mapped);
        } else if (data?.message) {
          setErrors({ _general: data.message });
        } else {
          setErrors({ _general: "Failed to send message. Try again later." });
        }
        setStatus("error");
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      setErrors({ _general: "Network error. Please try again later." });
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <style>{`
        /* Animations & helpers */
        @keyframes fadeUp { 0%{opacity:0; transform:translateY(28px)} 100%{opacity:1; transform:translateY(0)} }
        @keyframes kenburns { 0%{transform:scale(1.06)} 100%{transform:scale(1.18)} }
        @keyframes gradientFlow { 0%{opacity:.92} 50%{opacity:.72} 100%{opacity:.92} }
        @keyframes waveMotion { 0%{transform:translateY(0)} 100%{transform:translateY(4px)} }

        .animate-fadeUp { animation: fadeUp 1s ease-out both; }
        .animate-kenburns { animation: kenburns 24s ease-out both; transform-origin: center; }
        .animate-gradientFlow { animation: gradientFlow 7s ease-in-out infinite; }
        .animate-wave { animation: waveMotion 3.2s ease-in-out infinite alternate; }

        /* subtle focus ring */
        .focus-ring:focus { outline: none; box-shadow: 0 0 0 4px rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.9); }
      `}</style>

      {/* Animated Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=2400&q=85&auto=format&fit=crop"
            alt="Contact banner"
            className="w-full h-full object-cover animate-kenburns"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/85 to-teal-700/85 animate-gradientFlow" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center text-white px-6 animate-fadeUp">
          <h1 className="text-5xl md:text-7xl font-black mb-4 drop-shadow-2xl">
            Get in Touch
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mx-auto font-light">
            We're here to answer your questions and explore how we can help your
            business grow.
          </p>
        </div>

        <svg
          className="absolute bottom-0 w-full animate-wave"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            fill="#f9fafb"
            d="M0,100 C280,200 1160,0 1440,80 L1440,200 L0,200 Z"
          />
        </svg>
      </section>

      {/* Main content */}
      <section className="py-20 px-6 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              {status === "success" && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="font-semibold text-emerald-800">
                          Message sent
                        </p>
                        <p className="text-sm text-emerald-700">
                          We'll reply as soon as possible.
                        </p>
                      </div>
                      <button
                        aria-label="Dismiss"
                        onClick={() => setDismissSuccess(true)}
                        className="text-emerald-600 hover:text-emerald-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {errors._general && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                  {errors._general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-5 py-3 rounded-xl border border-gray-300 focus-ring`}
                    maxLength={191}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-2 text-sm text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 rounded-xl border border-gray-300 focus-ring`}
                      maxLength={191}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-2 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone (optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 rounded-xl border border-gray-300 focus-ring`}
                      maxLength={60}
                      aria-invalid={!!errors.phone}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                    />
                    {errors.phone && (
                      <p id="phone-error" className="mt-2 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-5 py-3 rounded-xl border border-gray-300 focus-ring resize-none`}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-2 text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-3 transform transition hover:scale-105"
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info & Map */}
            <aside className="space-y-8">
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold mb-4">Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Visit Us</h4>
                      <p className="text-sm text-gray-600">
                        123 Business Avenue, Suite 500
                        <br />
                        Tech District, Phnom Penh
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Call Us</h4>
                      <p className="text-sm text-gray-600">
                        <a
                          href="tel:+85512345678"
                          className="hover:text-emerald-600"
                        >
                          +855 12 345 678
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-sm text-gray-600">
                        <a
                          href="mailto:hello@yourcompany.com"
                          className="hover:text-emerald-600"
                        >
                          hello@yourcompany.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                {/* Replace the src with your real Google Maps embed link */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=...your-map-link..."
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our Location"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
