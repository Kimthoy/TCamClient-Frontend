import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BACKEND_URL = "http://localhost:8000";
const AUTO_SLIDE_INTERVAL = 4000;

export default function SubProductDetailSlider({ images = [], name }) {
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

  const prev = () => {
    stopAuto();
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    startAuto();
  };

  const next = () => {
    stopAuto();
    setIndex((i) => (i + 1) % images.length);
    startAuto();
  };

  if (!images.length) {
    return (
      <img
        src="/images/placeholder-product.png"
        alt={name}
        className="w-full h-[420px] object-cover rounded-3xl shadow-lg"
      />
    );
  }

  return (
    <div
      className="relative w-full h-[420px] rounded-3xl overflow-hidden group shadow-lg"
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
            className="absolute left-4 top-1/2 -translate-y-1/2
                       bg-black/50 text-white p-2 rounded-full
                       opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft size={22} />
          </button>

          {/* RIGHT */}
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2
                       bg-black/50 text-white p-2 rounded-full
                       opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight size={22} />
          </button>

          {/* DOTS */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  stopAuto();
                  setIndex(i);
                  startAuto();
                }}
                className={`w-2.5 h-2.5 rounded-full transition
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
