// src/pages/ContactPage.jsx
import React, { useState, useEffect } from "react";
import { Send, MapPin, Phone, Mail, CheckCircle, X, Clock } from "lucide-react";
import { fetchWidgets } from "../api/widget";
import { fetchContactBanners } from "../api/contact";
import Banner from "../components/Banner";
import AdminLocationPage from "./LocationsOverview";
import LocationsOverview from "./LocationsOverview";

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
  const [widget, setWidget] = useState(null);
  const [banner, setBanner] = useState(null);
  useEffect(() => {
    const loadWidget = async () => {
      try {
        const res = await fetchWidgets();
        if (res.data?.data?.length > 0) {
          setWidget(res.data.data[0]); // assuming single widget
        }
      } catch (error) {
        console.error("Failed to fetch footer widget:", error);
      }
    };
    loadWidget();
  }, []);
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
  function ContactHero() {
    return <Banner fetchData={fetchContactBanners} fallbackTitle="Contact" />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
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
      <ContactHero
        banner={
          banner ?? {
            title: "Contact",
            subtitle: "Trusted technology partners.",
          }
        }
        onViewPartners={() => {
          document
            .getElementById("partners-list")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <h1 className="text-center text-3xl mt-6 font-bold">Contact Us</h1>
      <LocationsOverview />

      <section className="py-20 px-6 relative z-20 bg-emerald-50/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* ================= LEFT: FORM ================= */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-12 border border-emerald-200 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-4xl font-extrabold text-emerald-900 mb-6 relative z-10">
                Send Us a Message
              </h2>

              {status === "success" && !dismissSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex gap-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                  <div className="flex-1 flex justify-between">
                    <div>
                      <p className="font-semibold text-emerald-800">
                        Message Sent!
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
              )}

              {errors._general && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                  {errors._general}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-6 relative z-10"
                noValidate
              >
                <div>
                  <label className="block text-sm font-medium text-emerald-800 mb-2">
                    Your Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={191}
                    className="w-full px-5 py-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-emerald-800 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      maxLength={191}
                      className="w-full px-5 py-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-800 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={60}
                      className="w-full px-5 py-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-800 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-400 outline-none resize-none transition"
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-3 transition-transform hover:scale-105"
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* ================= RIGHT: DESCRIPTION ================= */}
            <aside className="space-y-8">
              {/* ===== DESCRIPTION CARD ===== */}
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-emerald-200 relative overflow-hidden">
                <div className="absolute -top-12 -left-12 w-36 h-36 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

                <h3 className="text-3xl font-extrabold text-emerald-900 mb-4">
                  Let’s Talk
                </h3>

                <p className="text-emerald-700 leading-relaxed mb-5">
                  Have a question, feedback, or business inquiry? We’re always
                  happy to help. Send us a message and we’ll get back to you as
                  soon as possible.
                </p>

                <p className="text-emerald-700 leading-relaxed mb-8">
                  Our team is available during working hours listed below.
                </p>

                <div className="border-t border-emerald-200 pt-6 space-y-4">
                  <div className="flex items-center gap-3 text-emerald-800">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">tcamsolution@gmail.com</span>
                  </div>

                  <div className="flex items-center gap-3 text-emerald-800">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">(+855) 76 988 1111</span>
                  </div>
                </div>
              </div>

              {/* ===== WORKING HOURS CARD ===== */}
              <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 border border-emerald-200 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />

                <p className="flex items-center gap-3 text-emerald-700 font-semibold text-lg mb-5">
                  <Clock className="w-6 h-6 text-emerald-600" />
                  Working Hours
                </p>

                <div className="space-y-3 text-emerald-800">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-medium">8:00 AM – 5:00 PM</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">8:00 AM – 12:00 PM</span>
                  </div>

                  <div className="flex justify-between text-emerald-500">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
