import React from "react";
import { Presentation } from "lucide-react";

const DemoRequestButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      title="Request Demo"
      className="
        group fixed bottom-24 right-6 z-40
        h-12
        bg-emerald-600 hover:bg-emerald-700
        text-white
        rounded-full
        shadow-lg
        flex items-center justify-center
        transition-all duration-300 cursor-pointer
        p-4
      "
    >
      {/* Icon */}
      <Presentation className="w-5 h-5 shrink-0" />

      {/* Text */}
      <span
        className="
          ml-0
          max-w-0
          overflow-hidden
          whitespace-nowrap
          opacity-0
          group-hover:ml-2
          group-hover:max-w-xs
          group-hover:opacity-100
          transition-all duration-300
        "
      >
        Request Demo
      </span>
    </button>
  );
};

export default DemoRequestButton;
