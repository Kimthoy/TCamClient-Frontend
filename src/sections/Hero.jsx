import React from "react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-10">
        {/* Left content */}
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Beautiful client pages, <span className="text-emerald-600">fast</span> and responsive.
          </h1>
          <p className="mt-4 text-slate-600 max-w-xl">
            We design modern landing pages and web apps with accessibility and performance in mind.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#services"
              className="inline-flex items-center px-5 py-3 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
            >
              See Services
            </a>
            <a
              href="#contact"
              className="inline-flex items-center px-5 py-3 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
            >
              Contact Us
            </a>
          </div>

          <div className="mt-6 text-sm text-slate-500">
            <span className="font-medium">Trusted by:</span>{" "}
            <span>Local shops • Startups • Designers</span>
          </div>
        </div>

        {/* Right image / card */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="h-48 sm:h-56 lg:h-64 bg-gradient-to-tr from-emerald-100 to-emerald-50 rounded-md flex items-center justify-center text-emerald-700 font-semibold">
              Demo preview
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-md text-sm text-slate-600">Fast loading</div>
              <div className="p-3 border rounded-md text-sm text-slate-600">Responsive</div>
              <div className="p-3 border rounded-md text-sm text-slate-600">SEO friendly</div>
              <div className="p-3 border rounded-md text-sm text-slate-600">Accessible</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
