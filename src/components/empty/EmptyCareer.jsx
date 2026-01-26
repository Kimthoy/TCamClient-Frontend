import React from "react";

export default function EmptyCareerPage() {
  return (
    <div className=" flex items-center justify-center ">
      <div className="flex flex-col md:flex-row items-center">
        {/* IMAGE */}
        <img
          src="/career_notfound.jpg"
          alt="No Career Positions"
          className="w-40 md:w-72 object-cover"
        />

        {/* TEXT */}
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-900">
            No Open Positions here !!!
          </h2>
          <p className="mt-3 text-emerald-800/70 text-sm md:text-base">
            We don’t have any career opportunities available at the moment.
            Please check back later — we’re always growing 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
