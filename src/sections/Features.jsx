import React from "react";

const features = [
  { title: "Responsive Design", desc: "Looks great on mobile, tablet and desktop." },
  { title: "Fast Performance", desc: "Optimized for fast loads and good Core Web Vitals." },
  { title: "Customizable", desc: "Easy to adapt to your brand and needs." },
  { title: "SEO Basics", desc: "Semantic HTML and metadata-ready." },
];

export default function Features() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((f) => (
        <div key={f.title} className="bg-white rounded-lg p-5 shadow-sm">
          <div className="font-semibold mb-2">{f.title}</div>
          <div className="text-sm text-slate-600">{f.desc}</div>
        </div>
      ))}
    </div>
  );
}
