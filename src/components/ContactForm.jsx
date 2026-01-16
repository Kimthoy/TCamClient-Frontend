// src/components/ContactForm.jsx
import React, { useState } from "react";
import { Send, CheckCircle, X } from "lucide-react";

const ContactForm = ({
  title = "Send Us a Message",
  description = "Have a question or feedback? Send us a message and we'll get back to you as soon as possible.",
  imageUrl = "/images/contact-photo.jpg",
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState(""); // "", "sending", "success", "error"
  const [errors, setErrors] = useState({});
  const [dismissSuccess, setDismissSuccess] = useState(false);

  // ===== Client-side Validation =====
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
        onSuccess?.();
        setTimeout(() => setStatus(""), 7000);
      } else {
        if (data?.errors && typeof data.errors === "object") {
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
    <div className="bg-white mt-20   p-10 md:p-12 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-40 h-40  blur-3xl pointer-events-none" />

      {/* ===== Two Columns: Left (Text+Photo) / Right (Form) ===== */}
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left Side */}
        <div className="space-y-6">
          {/* Header */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-900 leading-tight">
            {title}
          </h2>

          {/* Description Paragraph */}
          <p className="text-gray-600 text-lg">{description}</p>

          <div className="relative w-full md:h-[300px]  bg-transparent mt-4">
            <img
              src="/contact.jpg"
              alt="Contact"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div>
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
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
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
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
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
                <p className="mt-2 text-sm text-red-600">{errors.message}</p>
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
                  <Send className="w-4 h-4" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
