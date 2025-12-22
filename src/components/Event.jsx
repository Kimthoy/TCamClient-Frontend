import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import
import { fetchPublicEvents } from "../api/event";
import { CircleChevronRight } from "lucide-react";

const Event = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ hook to navigate

  useEffect(() => {
    fetchPublicEvents()
      .then((res) => setEvent(res?.data?.[0] || null))
      .catch((err) => {
        console.error(err);
        setError("Failed to load events.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-8">Loading event...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;
  if (!event) return <p className="text-center mt-8">No events found.</p>;

  return (
    <div className="flex justify-center mt-12">
      <div
        className="w-[90%] flex flex-col md:flex-row bg-white rounded-3xl shadow-lg overflow-hidden 
                  items-center transition-transform duration-300 hover:-translate-y-1"
      >
        {/* Poster Image */}
        {event.poster_image_url && (
          <div className="relative w-full md:w-96 flex-shrink-0">
            <img
              src={event.poster_image_url}
              alt={event.title}
              className="w-full h-64 md:h-full object-cover rounded-l-3xl"
            />
            {/* Optional overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-700/30 to-transparent"></div>
          </div>
        )}

        {/* Event Info */}
        <div className="p-6 flex flex-col justify-center w-full md:w-[calc(100%-24rem)] max-w-lg text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">
            {event.title}
          </h2>

          {event.subtitle && (
            <p className="text-emerald-700/80 text-sm mb-2 line-clamp-1">
              {event.subtitle}
            </p>
          )}

          <p className="text-emerald-800/70 text-sm mb-4 line-clamp-5">
            {event.description}
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate(`/events/${event.id}`)}
            className="flex w-48 gap-2 border-2 border-emerald-300 justify-between items-center
                   cursor-pointer bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl
                   font-medium hover:bg-emerald-600 hover:text-white transition-all duration-300"
          >
            Read More Detail
            <CircleChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Event;
