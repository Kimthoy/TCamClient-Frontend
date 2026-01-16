import React, { useEffect, useState, useRef } from "react";

export default function Banner({
  fetchData,
  fallbackTitle = "Banner",
  slideDuration = 4,
}) {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(true);
  const [seconds, setSeconds] = useState(slideDuration);

  const intervalRef = useRef(null);

  // Fetch banners
  useEffect(() => {
    const getBanners = async () => {
      try {
        const data = await fetchData();
        setBanners(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      } finally {
        setLoading(false);
      }
    };
    getBanners();
  }, [fetchData]);

  const hasMultiple = banners.length > 1;
  const currentBanner = banners[currentIndex];

  // Auto-slide effect with random rotation
  useEffect(() => {
    if (!hasMultiple) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          // Trigger fade out
          setFade(false);

          setTimeout(() => {
            // Pick a random index different from currentIndex
            let nextIndex;
            do {
              nextIndex = Math.floor(Math.random() * banners.length);
            } while (nextIndex === currentIndex && banners.length > 1);

            setCurrentIndex(nextIndex);
            setFade(true);
            setSeconds(slideDuration);
          }, 500); // Fade duration

          return slideDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [banners, currentIndex, slideDuration, hasMultiple]);

  if (loading) {
    return (
      <section className="relative h-[90vh] flex items-center justify-center bg-gray-200">
        <span className="text-gray-700">Loading...</span>
      </section>
    );
  }

  if (!banners.length) {
    return (
      <section className="relative h-[90vh] flex items-center justify-center bg-gray-300">
        <h1 className="text-white text-3xl font-bold">{fallbackTitle}</h1>
      </section>
    );
  }

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden ">
      {/* Banner Image */}
      <img
        src={currentBanner?.image_url}
        alt={currentBanner?.title || fallbackTitle}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          !fade ? "opacity-0" : "opacity-100"
        }`}
        onError={(e) =>
          (e.currentTarget.src =
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=2000&q=85")
        }
      />

      <div className="absolute inset-0 bg-black/45" />

      {/* Text */}
      <div
        className={`text-center transition-all duration-500 ${
          !fade ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <h1 className="text-white text-4xl md:text-5xl font-bold">
          {currentBanner?.title || fallbackTitle}
        </h1>
        <p className="text-white mt-2">
          {currentBanner?.subtitle || fallbackTitle}
        </p>
      </div>

      {/* Navigation Dots + Countdown */}
      {hasMultiple && (
        <div className="absolute bottom-5 flex space-x-4 items-center">
          {banners.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div key={idx} className="relative flex items-center">
                <span
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-3 rounded-full cursor-pointer transition-all duration-500 ${
                    isActive ? "bg-white w-6 scale-110" : "bg-white/50 w-3"
                  }`}
                />
              </div>
            );
          })}

          <div className="text-white text-sm font-semibold ml-2 bg-black/30 px-2 py-1 rounded">
            {seconds}s
          </div>
        </div>
      )}
    </section>
  );
}
