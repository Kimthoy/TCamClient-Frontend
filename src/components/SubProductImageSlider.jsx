import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BACKEND_URL = "http://localhost:8000";
const AUTO_SLIDE_INTERVAL = 3000;

export default function SubProductImageSlider({
  images = [],
  name,
  width = "w-full md:w-72",
  height = "h-40",
}) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    startAuto();
    return stopAuto;
  }, [images.length]);

  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, AUTO_SLIDE_INTERVAL);
  };

  const stopAuto = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const prev = (e) => {
    e.preventDefault();
    stopAuto();
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    startAuto();
  };

  const next = (e) => {
    e.preventDefault();
    stopAuto();
    setIndex((i) => (i + 1) % images.length);
    startAuto();
  };

  if (!images.length) {
    return (
      <img
        src="/images/placeholder-product.png"
        alt={name}
        className={`${width} ${height} object-cover rounded-xl`}
      />
    );
  }

  return (
    <div
      className={`relative ${width} ${height} overflow-hidden rounded-xl group`}
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      {/* SLIDE TRACK */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={`${BACKEND_URL}/storage/${img.image_path}`}
            alt={name}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {hasMultiple && (
        <>
          {/* LEFT */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2
                       bg-black/50 text-white p-1 rounded-full
                       opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft size={18} />
          </button>

          {/* RIGHT */}
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2
                       bg-black/50 text-white p-1 rounded-full
                       opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight size={18} />
          </button>

          {/* DOT INDICATORS */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  stopAuto();
                  setIndex(i);
                  startAuto();
                }}
                className={`w-2 h-2 rounded-full transition
                  ${i === index ? "bg-white scale-110" : "bg-white/50"}
                `}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
