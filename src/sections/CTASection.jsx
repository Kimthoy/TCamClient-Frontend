import React from "react";

export default function CTASection() {
  return (
    <section className="bg-emerald-600 text-white rounded-lg mt-8 p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Ready to start your project?</h3>
          <p className="text-sm text-emerald-100/90">Get a free consultation and quote.</p>
        </div>
        <div className="flex gap-3">
          <a href="#contact" className="px-4 py-2 bg-white text-emerald-600 rounded-md font-medium">Get Quote</a>
          <a href="#services" className="px-4 py-2 border border-white/30 rounded-md">Our Services</a>
        </div>
      </div>
    </section>
  );
}
