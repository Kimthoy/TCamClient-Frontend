// src/components/CertificationEventsList.jsx
import React, { useEffect, useState } from "react";
import { fetchPublicEvents } from "../api/event";
import { MapPin, CalendarDays } from "lucide-react";
import Banner from "../components/Banner";
import { fetchEventBanners } from "../api/event";

const CertificationEventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // for detail view
  function EventHero() {
    return (
      <Banner
        fetchData={fetchEventBanners}
        fallbackTitle="Event Banner"
      
      />
    );
  }

  useEffect(() => {
    fetchPublicEvents()
      .then((res) => {
        if (res?.data) setEvents(res.data);
        else setEvents([]);
      })
      .catch((err) => {
        setError("Failed to load events.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-8">Loading events...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;
  if (!events.length)
    return <p className="text-center mt-8">No events found.</p>;

  const recentEvents = events.slice(0, 5); // last 5 events

  // Events to display in main section
  const mainEvents = selectedEvent ? [selectedEvent] : events;

  return (
    <div>
      <EventHero
        banner={
          banner ?? {
            title: "Event",
            subtitle: "event",
          }
        }
        onViewPartners={() => {
          document
            .getElementById("partners-list")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <section className="my-20 text-center">
        <h2
          id="partners-list"
          className="text-2xl md:text-5xl font-black text-gray-900 mb-4"
        >
          Our Events
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore upcoming events and stay updated with the latest happenings.
        </p>
      </section>
      <div className="max-w-7xl mx-auto my-8 px-5 flex gap-8">
        {/* Main Events List / Detail */}
        <div className="max-w-7xl mx-auto my-12 px-5 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ================= MAIN CONTENT ================= */}
          <div className="lg:col-span-8 space-y-10">
            {mainEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                {/* Poster Image */}
                {event.poster_image_url && (
                  <img
                    src={event.poster_image_url}
                    alt={event.title}
                    className="w-full h-95 object-cover"
                  />
                )}

                {/* Content */}
                <div className="p-8 space-y-6">
                  {/* Title */}
                  <h2 className="text-3xl font-bold text-gray-800">
                    {event.title}
                  </h2>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-emerald-600">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(event.event_date).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Participants */}
                  {event.participants?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Participants
                      </h3>
                      <ul className="list-disc list-inside text-gray-600">
                        {event.participants.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Certifications */}
                  {event.certifications?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Certifications
                      </h3>
                      <ul className="list-disc list-inside text-gray-600">
                        {event.certifications.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Certificates */}
                  {event.certificates?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Certificates
                      </h3>
                      <ul className="list-disc list-inside text-gray-600">
                        {event.certificates.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Back Button */}
                {selectedEvent && (
                  <div className="border-t p-6 text-center">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      ← Back to all events
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ================= SIDEBAR ================= */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24 h-fit">
            <h3 className="text-xl font-bold text-gray-700">Recently Posted</h3>

            {recentEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="flex gap-4 bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition"
              >
                {event.poster_image_url && (
                  <img
                    src={event.poster_image_url}
                    alt={event.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}

                <div className="flex flex-col justify-between">
                  <h4 className="font-semibold text-emerald-700 line-clamp-1">
                    {event.title}
                  </h4>

                  <p className="text-sm text-gray-500 line-clamp-2">
                    {event.description}
                  </p>

                  <span className="text-xs text-gray-400">
                    {new Date(event.event_date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CertificationEventsList;
